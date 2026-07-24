from __future__ import annotations

import os
import smtplib
import mimetypes
from dataclasses import dataclass
from email.message import EmailMessage
from pathlib import Path
from typing import Iterable

from dotenv import load_dotenv


@dataclass
class MailResult:
    sent: bool
    skipped: bool
    message: str


def _split_addresses(value: str | None) -> list[str]:
    """Split comma/semicolon separated email addresses."""
    if not value:
        return []
    return [item.strip() for item in value.replace(";", ",").split(",") if item.strip()]


def _env_bool(name: str, default: bool = False) -> bool:
    text = os.getenv(name)
    if text is None:
        return default
    return text.strip().lower() in {"true", "1", "yes", "y", "on"}


def send_mail(
    subject: str,
    plain_text: str,
    html_text: str,
    config: dict,
    dry_run: bool = False,
    attachments: list[Path] | None = None,
) -> MailResult:
    """Send email via SMTP. Missing SMTP config skips sending instead of crashing."""
    load_dotenv()
    mail_cfg = config.get("mail", {})
    if dry_run or mail_cfg.get("dry_run", False):
        return MailResult(sent=False, skipped=True, message="Dry-run mode: email sending skipped.")
    if not mail_cfg.get("enabled", True):
        return MailResult(sent=False, skipped=True, message="mail.enabled=false: email sending skipped.")

    host = os.getenv("SMTP_HOST", "").strip()
    port = int(os.getenv("SMTP_PORT", "465") or "465")
    user = os.getenv("SMTP_USER", "").strip()
    password = os.getenv("SMTP_PASSWORD", "").strip()
    mail_from = os.getenv("MAIL_FROM", user).strip()
    to_list = _split_addresses(os.getenv("MAIL_TO"))
    cc_list = _split_addresses(os.getenv("MAIL_CC"))
    bcc_list = _split_addresses(os.getenv("MAIL_BCC"))

    if not host or not user or not password or not mail_from or not to_list:
        return MailResult(sent=False, skipped=True, message="SMTP config is incomplete: email sending skipped.")

    msg = EmailMessage()
    # 清理换行，交给 EmailMessage 按标准自动编码中文主题。
    msg["Subject"] = str(subject).replace("\r", " ").replace("\n", " ")
    msg["From"] = mail_from
    msg["To"] = ", ".join(to_list)
    if cc_list:
        msg["Cc"] = ", ".join(cc_list)
    msg.set_content(plain_text)
    if mail_cfg.get("use_html", True):
        msg.add_alternative(html_text, subtype="html")

    for attachment in attachments or []:
        path = Path(attachment)
        if not path.exists():
            return MailResult(sent=False, skipped=False, message=f"Attachment not found: {path}")
        ctype, encoding = mimetypes.guess_type(path.name)
        if ctype is None or encoding is not None:
            ctype = "application/octet-stream"
        maintype, subtype = ctype.split("/", 1)
        msg.add_attachment(
            path.read_bytes(),
            maintype=maintype,
            subtype=subtype,
            filename=path.name,
        )

    recipients: Iterable[str] = to_list + cc_list + bcc_list
    use_ssl = _env_bool("MAIL_USE_SSL", True)
    use_tls = _env_bool("MAIL_USE_TLS", False)

    try:
        if use_ssl:
            with smtplib.SMTP_SSL(host, port, timeout=30) as server:
                server.login(user, password)
                server.send_message(msg, to_addrs=list(recipients))
        else:
            with smtplib.SMTP(host, port, timeout=30) as server:
                if use_tls:
                    server.starttls()
                server.login(user, password)
                server.send_message(msg, to_addrs=list(recipients))
    except smtplib.SMTPAuthenticationError as exc:
        return MailResult(sent=False, skipped=False, message=f"SMTP authentication failed: {exc}")
    except Exception as exc:
        return MailResult(sent=False, skipped=False, message=f"Email sending failed: {exc}")

    return MailResult(sent=True, skipped=False, message="Email sent successfully.")
