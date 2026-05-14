import { NextRequest, NextResponse } from "next/server";
import { getLeads, saveLead, deleteLead, sendLeadToWebhook } from "@/lib/leads";
import { getKnowledgeBase } from "@/lib/knowledge";

export const runtime = "nodejs";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  deleteLead(id);
  return NextResponse.json({ ok: true });
}

// POST /api/admin/leads/:id — reenviar ao webhook
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const leads = getLeads();
  const lead = leads.find((l) => l.id === id);

  if (!lead) {
    return NextResponse.json({ error: "Lead não encontrado" }, { status: 404 });
  }

  const kb = getKnowledgeBase();
  const webhookUrl = kb.integrations?.clickupWebhookUrl?.trim();

  if (!webhookUrl) {
    return NextResponse.json(
      { error: "Webhook não configurado" },
      { status: 400 }
    );
  }

  const sent = await sendLeadToWebhook(lead, webhookUrl);
  if (sent) {
    lead.webhookSent = true;
    lead.webhookSentAt = new Date().toISOString();
    saveLead(lead);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Falha ao enviar ao webhook" }, { status: 502 });
}
