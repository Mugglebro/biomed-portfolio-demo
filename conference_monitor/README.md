# WeChat Biomedical Conference Monitor

This local monitor searches public WeChat articles for biomedical conference notices, keeps learning useful accounts and topics, generates a daily Excel workbook, and emails it to the configured WeCom mailbox.

## What It Does

- Runs daily at 10:00.
- Runs once on user logon as a catch-up if the computer was off at 10:00.
- Sends an email even when there are no newly discovered future conferences.
- Records only conferences that are biomedical-related, not yet held, and not previously recorded.
- Learns useful WeChat accounts and themes over time.

## Key Files

- `config/keywords.json`: search terms and biomedical/topic vocabularies.
- `config/sources.json`: public search entry points.
- `config/mail.env`: SMTP settings.
- `scripts/daily_run.py`: main monitor.
- `scripts/install_scheduled_tasks.ps1`: Windows scheduled-task installer.
- `reports/`: daily Excel reports.
- `data/`: long-term state and learning databases.

## Manual Run

```powershell
python .\scripts\daily_run.py --force
```

Dry run without sending email:

```powershell
python .\scripts\daily_run.py --force --no-email
```

## Install Scheduled Tasks

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\install_scheduled_tasks.ps1
```
