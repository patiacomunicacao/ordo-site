import { sql } from "@/lib/neon";

export type LeadTemperature = "hot" | "warm" | "cold";

export interface Lead {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  summary: string;
  temperature: LeadTemperature;
  serviceInterest?: string;
  messages: Array<{ role: string; content: string }>;
  createdAt: string;
  webhookSent: boolean;
  webhookSentAt?: string;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

let schemaReady = false;

async function ensureSchema() {
  if (schemaReady) return;
  await sql`
    CREATE TABLE IF NOT EXISTS leads (
      id               UUID PRIMARY KEY,
      name             TEXT NOT NULL,
      phone            TEXT,
      email            TEXT,
      summary          TEXT NOT NULL DEFAULT '',
      temperature      TEXT NOT NULL DEFAULT 'warm',
      service_interest TEXT,
      messages         JSONB NOT NULL DEFAULT '[]',
      created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      webhook_sent     BOOLEAN NOT NULL DEFAULT FALSE,
      webhook_sent_at  TIMESTAMPTZ
    )
  `;
  schemaReady = true;
}

// ─── Row mapper ───────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToLead(r: any): Lead {
  return {
    id: r.id,
    name: r.name,
    phone: r.phone ?? undefined,
    email: r.email ?? undefined,
    summary: r.summary,
    temperature: r.temperature as LeadTemperature,
    serviceInterest: r.service_interest ?? undefined,
    messages: r.messages as Lead["messages"],
    createdAt: new Date(r.created_at).toISOString(),
    webhookSent: r.webhook_sent,
    webhookSentAt: r.webhook_sent_at
      ? new Date(r.webhook_sent_at).toISOString()
      : undefined,
  };
}

// ─── Reads ────────────────────────────────────────────────────────────────────

export async function getLeads(): Promise<Lead[]> {
  await ensureSchema();
  const rows = await sql`SELECT * FROM leads ORDER BY created_at DESC`;
  return rows.map(rowToLead);
}

// ─── Writes ───────────────────────────────────────────────────────────────────

export async function saveLead(lead: Lead): Promise<void> {
  await ensureSchema();
  await sql`
    INSERT INTO leads (
      id, name, phone, email, summary, temperature,
      service_interest, messages, created_at, webhook_sent, webhook_sent_at
    ) VALUES (
      ${lead.id}, ${lead.name}, ${lead.phone ?? null}, ${lead.email ?? null},
      ${lead.summary}, ${lead.temperature}, ${lead.serviceInterest ?? null},
      ${JSON.stringify(lead.messages)}, ${lead.createdAt},
      ${lead.webhookSent}, ${lead.webhookSentAt ?? null}
    )
    ON CONFLICT (id) DO UPDATE SET
      name             = EXCLUDED.name,
      phone            = EXCLUDED.phone,
      email            = EXCLUDED.email,
      summary          = EXCLUDED.summary,
      temperature      = EXCLUDED.temperature,
      service_interest = EXCLUDED.service_interest,
      messages         = EXCLUDED.messages,
      webhook_sent     = EXCLUDED.webhook_sent,
      webhook_sent_at  = EXCLUDED.webhook_sent_at
  `;
}

export async function deleteLead(id: string): Promise<void> {
  await ensureSchema();
  await sql`DELETE FROM leads WHERE id = ${id}`;
}

// ─── Webhook ──────────────────────────────────────────────────────────────────

export async function sendLeadToWebhook(
  lead: Lead,
  webhookUrl: string
): Promise<boolean> {
  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: lead.id,
        name: lead.name,
        phone: lead.phone ?? "",
        email: lead.email ?? "",
        summary: lead.summary,
        temperature: lead.temperature,
        serviceInterest: lead.serviceInterest ?? "",
        createdAt: lead.createdAt,
        source: "chat_ordo_site",
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
