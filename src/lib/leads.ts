import fs from "fs";
import path from "path";

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Persistence ──────────────────────────────────────────────────────────────

const DATA_DIR = path.join(process.cwd(), "data");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

export function getLeads(): Lead[] {
  ensureDir();
  if (!fs.existsSync(LEADS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(LEADS_FILE, "utf-8")) as Lead[];
  } catch {
    return [];
  }
}

export function saveLead(lead: Lead): void {
  ensureDir();
  const leads = getLeads();
  const idx = leads.findIndex((l) => l.id === lead.id);
  if (idx >= 0) leads[idx] = lead;
  else leads.unshift(lead);
  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), "utf-8");
}

export function deleteLead(id: string): void {
  const leads = getLeads().filter((l) => l.id !== id);
  ensureDir();
  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), "utf-8");
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
