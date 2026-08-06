import { NextRequest, NextResponse } from "next/server";
import { getLeads, saveLead, deleteLead, sendLeadToAllWebhooks } from "@/lib/leads";
import { getKnowledgeBase } from "@/lib/knowledge";

export const runtime = "nodejs";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await deleteLead(id);
  return NextResponse.json({ ok: true });
}

// POST /api/admin/leads/:id — reenviar a todos os webhooks ativos
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const leads = await getLeads();
  const lead = leads.find((l) => l.id === id);

  if (!lead) {
    return NextResponse.json({ error: "Lead não encontrado" }, { status: 404 });
  }

  const kb = await getKnowledgeBase();
  const webhooks = kb.integrations?.webhooks ?? [];
  const active = webhooks.filter((w) => w.enabled && w.url.trim());

  if (active.length === 0) {
    return NextResponse.json(
      { error: "Nenhum webhook ativo configurado" },
      { status: 400 }
    );
  }

  const sent = await sendLeadToAllWebhooks(lead, webhooks);
  if (sent) {
    lead.webhookSent = true;
    lead.webhookSentAt = new Date().toISOString();
    await saveLead(lead);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Falha ao enviar aos webhooks" }, { status: 502 });
}
