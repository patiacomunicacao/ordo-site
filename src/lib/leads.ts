import { sql } from "@/lib/neon";
import { getKnowledgeBase } from "@/lib/knowledge";

export type LeadTemperature = "hot" | "warm" | "cold";
export type LeadSource = "chat" | "form";

export const LEAD_STATUSES = [
  "new",
  "contacted",
  "meeting",
  "proposal",
  "won",
  "lost",
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export interface Lead {
  id: string;
  source: LeadSource;
  status: LeadStatus;
  notes: string;
  name: string;
  phone?: string;
  email?: string;
  company?: string;
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
  // Campos do funil (adicionados depois; ADD COLUMN IF NOT EXISTS preserva os leads antigos).
  await sql`
    ALTER TABLE leads
      ADD COLUMN IF NOT EXISTS source     TEXT NOT NULL DEFAULT 'chat',
      ADD COLUMN IF NOT EXISTS status     TEXT NOT NULL DEFAULT 'new',
      ADD COLUMN IF NOT EXISTS notes      TEXT NOT NULL DEFAULT '',
      ADD COLUMN IF NOT EXISTS company    TEXT,
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ
  `;
  schemaReady = true;
}

// ─── Row mapper ───────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToLead(r: any): Lead {
  return {
    id: r.id,
    source: r.source as LeadSource,
    status: r.status as LeadStatus,
    notes: r.notes,
    name: r.name,
    phone: r.phone ?? undefined,
    email: r.email ?? undefined,
    company: r.company ?? undefined,
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

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getLeadById(id: string): Promise<Lead | undefined> {
  if (!UUID_RE.test(id)) return undefined;
  await ensureSchema();
  const rows = await sql`SELECT * FROM leads WHERE id = ${id}`;
  return rows[0] ? rowToLead(rows[0]) : undefined;
}

// ─── Writes ───────────────────────────────────────────────────────────────────

export async function saveLead(lead: Lead): Promise<void> {
  await ensureSchema();
  await sql`
    INSERT INTO leads (
      id, source, status, notes, name, phone, email, company, summary, temperature,
      service_interest, messages, created_at, webhook_sent, webhook_sent_at
    ) VALUES (
      ${lead.id}, ${lead.source}, ${lead.status}, ${lead.notes},
      ${lead.name}, ${lead.phone ?? null}, ${lead.email ?? null}, ${lead.company ?? null},
      ${lead.summary}, ${lead.temperature}, ${lead.serviceInterest ?? null},
      ${JSON.stringify(lead.messages)}, ${lead.createdAt},
      ${lead.webhookSent}, ${lead.webhookSentAt ?? null}
    )
    -- status e notes são do admin: nunca sobrescritos aqui (ver updateLeadCrm).
    ON CONFLICT (id) DO UPDATE SET
      name             = EXCLUDED.name,
      phone            = EXCLUDED.phone,
      email            = EXCLUDED.email,
      company          = EXCLUDED.company,
      summary          = EXCLUDED.summary,
      temperature      = EXCLUDED.temperature,
      service_interest = EXCLUDED.service_interest,
      messages         = EXCLUDED.messages,
      webhook_sent     = EXCLUDED.webhook_sent,
      webhook_sent_at  = EXCLUDED.webhook_sent_at
  `;
}

/** Atualiza os campos de acompanhamento (funil e anotações) editados no admin. */
export async function updateLeadCrm(
  id: string,
  data: { status?: LeadStatus; notes?: string }
): Promise<Lead | undefined> {
  if (!UUID_RE.test(id)) return undefined;
  await ensureSchema();
  const rows = await sql`
    UPDATE leads SET
      status     = COALESCE(${data.status ?? null}, status),
      notes      = COALESCE(${data.notes ?? null}, notes),
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  return rows[0] ? rowToLead(rows[0]) : undefined;
}

export async function deleteLead(id: string): Promise<void> {
  if (!UUID_RE.test(id)) return;
  await ensureSchema();
  await sql`DELETE FROM leads WHERE id = ${id}`;
}

// ─── Webhook ──────────────────────────────────────────────────────────────────

function leadPayload(lead: Lead) {
  return {
    id: lead.id,
    name: lead.name,
    phone: lead.phone ?? "",
    email: lead.email ?? "",
    company: lead.company ?? "",
    summary: lead.summary,
    temperature: lead.temperature,
    serviceInterest: lead.serviceInterest ?? "",
    createdAt: lead.createdAt,
    source: lead.source === "form" ? "form_ordo_site" : "chat_ordo_site",
  };
}

export async function sendLeadToWebhook(
  lead: Lead,
  webhookUrl: string
): Promise<boolean> {
  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(leadPayload(lead)),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function sendLeadToAllWebhooks(
  lead: Lead,
  webhooks: Array<{ url: string; enabled: boolean }>
): Promise<boolean> {
  const active = webhooks.filter((w) => w.enabled && w.url.trim());
  if (active.length === 0) return false;
  const results = await Promise.allSettled(
    active.map((w) => sendLeadToWebhook(lead, w.url))
  );
  return results.some((r) => r.status === "fulfilled" && r.value);
}

/** Salva o lead e o envia aos webhooks ativos (Configurações da IA). */
export async function saveAndDispatchLead(lead: Lead): Promise<void> {
  await saveLead(lead);
  const kb = await getKnowledgeBase();
  const webhooks = kb.integrations?.webhooks ?? [];
  if (webhooks.length === 0) return;
  if (await sendLeadToAllWebhooks(lead, webhooks)) {
    lead.webhookSent = true;
    lead.webhookSentAt = new Date().toISOString();
    await saveLead(lead);
  }
}
