const configuredBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBasePath(path: string) {
  if (!path || !path.startsWith("/")) return path;
  if (path.startsWith("//")) return path;
  if (/^https?:\/\//.test(path)) return path;
  if (configuredBasePath && path.startsWith(configuredBasePath)) return path;
  return `${configuredBasePath}${path}`;
}

export function assetUrl(path: string) {
  return withBasePath(path);
}
