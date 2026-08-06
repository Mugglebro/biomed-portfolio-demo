import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { basename, join } from "node:path";

const originalDir = join(process.cwd(), "out", "original");

if (!existsSync(originalDir)) {
  process.exit(0);
}

for (const entry of readdirSync(originalDir)) {
  const source = join(originalDir, entry);
  if (!entry.endsWith(".html") || !statSync(source).isFile()) continue;

  const slug = basename(entry, ".html");
  const targetDir = join(originalDir, slug);
  mkdirSync(targetDir, { recursive: true });
  copyFileSync(source, join(targetDir, "index.html"));
}
