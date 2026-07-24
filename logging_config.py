from __future__ import annotations

import logging
from datetime import date
from pathlib import Path


def setup_logging(log_dir: Path, run_date: date, verbose: bool = False) -> logging.Logger:
    """初始化日志：同时写入 logs 文件和控制台，方便运营人员排查问题。"""
    log_dir.mkdir(parents=True, exist_ok=True)
    logger = logging.getLogger("zettalab_radar")
    logger.setLevel(logging.DEBUG if verbose else logging.INFO)
    logger.handlers.clear()

    formatter = logging.Formatter("%(asctime)s [%(levelname)s] %(message)s")

    file_handler = logging.FileHandler(
        log_dir / f"digest_{run_date:%Y%m%d}.log",
        encoding="utf-8",
    )
    file_handler.setLevel(logging.DEBUG)
    file_handler.setFormatter(formatter)

    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.DEBUG if verbose else logging.INFO)
    console_handler.setFormatter(formatter)

    logger.addHandler(file_handler)
    logger.addHandler(console_handler)
    return logger
