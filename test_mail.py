from __future__ import annotations

from datetime import datetime
from pathlib import Path

from mailer import send_mail
from utils import load_config


BASE_DIR = Path(__file__).resolve().parent


def main() -> int:
    config = load_config(BASE_DIR / "config.yaml")
    effective_config = dict(config)
    effective_config["mail"] = dict(config.get("mail", {}))
    effective_config["mail"]["dry_run"] = False
    subject = f"ZettaLab Radar SMTP Test {datetime.now():%Y-%m-%d %H:%M:%S}"
    text = "This is a ZettaLab Biomed Radar SMTP test email. If you receive this email, SMTP is working."
    html = "<p>This is a <b>ZettaLab Biomed Radar</b> SMTP test email.</p><p>If you receive this email, SMTP is working.</p>"
    result = send_mail(subject, text, html, effective_config, dry_run=False)
    print(result.message)
    return 0 if result.sent else 1


if __name__ == "__main__":
    raise SystemExit(main())
