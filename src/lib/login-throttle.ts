import { sql } from "@/lib/neon";

// Limite de tentativas de login por IP. Fica no banco (e não em memória)
// porque cada invocação serverless pode rodar numa instância diferente.
const MAX_FAILURES = 5;
const WINDOW_MINUTES = 15;

// ─── Schema ───────────────────────────────────────────────────────────────────

let schemaReady = false;

async function ensureSchema() {
  if (schemaReady) return;
  await sql`
    CREATE TABLE IF NOT EXISTS login_attempts (
      ip           TEXT NOT NULL,
      attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS login_attempts_ip_time
      ON login_attempts (ip, attempted_at)
  `;
  schemaReady = true;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** Segundos até liberar novas tentativas, ou 0 se o IP não está bloqueado. */
export async function getLockoutSeconds(ip: string): Promise<number> {
  await ensureSchema();
  const rows = await sql`
    SELECT COUNT(*)::int AS failures, MIN(attempted_at) AS oldest
    FROM (
      SELECT attempted_at FROM login_attempts
      WHERE ip = ${ip}
        AND attempted_at > NOW() - make_interval(mins => ${WINDOW_MINUTES})
      ORDER BY attempted_at DESC
      LIMIT ${MAX_FAILURES}
    ) recent
  `;
  const { failures, oldest } = rows[0] as { failures: number; oldest: string | null };
  if (failures < MAX_FAILURES || !oldest) return 0;
  const unlockAt = new Date(oldest).getTime() + WINDOW_MINUTES * 60 * 1000;
  return Math.max(1, Math.ceil((unlockAt - Date.now()) / 1000));
}

export async function recordFailure(ip: string): Promise<void> {
  await ensureSchema();
  await sql`INSERT INTO login_attempts (ip) VALUES (${ip})`;
  // Limpeza oportunista para a tabela não crescer indefinidamente.
  await sql`DELETE FROM login_attempts WHERE attempted_at < NOW() - INTERVAL '1 day'`;
}

export async function clearFailures(ip: string): Promise<void> {
  await ensureSchema();
  await sql`DELETE FROM login_attempts WHERE ip = ${ip}`;
}
