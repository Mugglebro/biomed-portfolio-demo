from __future__ import annotations

import csv
import json
from datetime import datetime
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent
OUTPUT_DIR = BASE_DIR / "outputs"
FEEDBACK_DIR = BASE_DIR / "feedback"
HISTORY_PATH = FEEDBACK_DIR / "feedback_history.csv"


class FeedbackHandler(SimpleHTTPRequestHandler):
    """本地反馈服务：展示 outputs 下的反馈页，并接收批量反馈。"""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(OUTPUT_DIR), **kwargs)

    def log_message(self, format: str, *args) -> None:
        """pythonw 没有控制台输出，关闭默认 stderr 日志避免请求被中断。"""
        return

    def do_POST(self) -> None:
        if self.path != "/submit":
            self.send_error(404)
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
            rows = payload.get("feedback", [])
            FEEDBACK_DIR.mkdir(parents=True, exist_ok=True)
            file_exists = HISTORY_PATH.exists()
            with HISTORY_PATH.open("a", encoding="utf-8-sig", newline="") as f:
                writer = csv.writer(f)
                if not file_exists:
                    writer.writerow(["collected_date", "message_id", "feedback_id", "action", "preference", "title", "source", "category", "url", "note"])
                for item in rows:
                    action = str(item.get("action", "")).strip()
                    preference = "喜欢" if action == "喜欢" else "不喜欢"
                    writer.writerow([
                        datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                        f"local-{datetime.now().timestamp()}-{item.get('feedback_id', '')}",
                        item.get("feedback_id", ""),
                        action,
                        preference,
                        item.get("title", ""),
                        item.get("source", ""),
                        item.get("category", ""),
                        item.get("url", ""),
                        item.get("note", ""),
                    ])
            body = json.dumps({"ok": True, "saved": len(rows)}, ensure_ascii=False).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        except Exception as exc:
            body = json.dumps({"ok": False, "error": str(exc)}, ensure_ascii=False).encode("utf-8")
            self.send_response(500)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    server = ThreadingHTTPServer(("127.0.0.1", 8765), FeedbackHandler)
    print("ZettaLab feedback server: http://127.0.0.1:8765")
    server.serve_forever()


if __name__ == "__main__":
    main()
