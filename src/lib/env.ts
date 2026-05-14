/**
 * Reads an environment variable, falling back to .env.local when the
 * system environment has the variable set to an empty string (which
 * prevents Next.js from overriding it with the .env.local value).
 */
import fs from "fs";
import path from "path";

let envLocalCache: Record<string, string> | null = null;

function parseEnvLocal(): Record<string, string> {
  if (envLocalCache) return envLocalCache;
  try {
    const filePath = path.join(process.cwd(), ".env.local");
    const content = fs.readFileSync(filePath, "utf-8");
    const result: Record<string, string> = {};
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx < 0) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      result[key] = val;
    }
    envLocalCache = result;
    return result;
  } catch {
    envLocalCache = {};
    return {};
  }
}

export function getEnv(key: string): string {
  const systemVal = process.env[key];
  if (systemVal) return systemVal; // non-empty system env wins
  // Fallback: read directly from .env.local
  return parseEnvLocal()[key] ?? "";
}
