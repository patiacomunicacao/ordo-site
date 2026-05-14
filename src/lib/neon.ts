import { neon } from "@neondatabase/serverless";
import { getEnv } from "@/lib/env";

// On Vercel, DATABASE_URL is set via env vars.
// Locally, getEnv() falls back to .env.local.
const url = process.env.DATABASE_URL || getEnv("DATABASE_URL");

if (!url) throw new Error("DATABASE_URL não configurada");

export const sql = neon(url);
