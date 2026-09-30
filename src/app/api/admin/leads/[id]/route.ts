import { NextRequest, NextResponse } from "next/server";
import {
  getLeadById,
  saveLead,
  deleteLead,
  updateLeadCrm,
  sendLeadToAllWebhooks,
} from "@/lib/leads";
import { getKnowledgeBase } from "@/lib/knowledge";
import { parseBody } from "@/lib/admin-api";
import { LeadUpdateSchema } from "@/lib/validations";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  await deleteLead(id);
  return NextResponse.json({ ok: true });
}

// PATCH /api/admin/leads/:id — atualiza status do funil e/ou anotações
export async function PATCH(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const { data, error } = await parseBody(req, LeadUpdateSchema);
  if (error) return error;

  const lead = await updateLeadCrm(id, data);
  if (!lead) {
    return NextResponse.json({ error: "Lead não encontrado" }, { status: 404 });
  }
  return NextResponse.json(lead);
}

// POST /api/admin/leads/:id — reenviar a todos os webhooks ativos
export async function POST(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const lead = await getLeadById(id);

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
