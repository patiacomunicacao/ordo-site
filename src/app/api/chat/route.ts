import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { ChatSchema } from "@/lib/validations";
import { getKnowledgeBase, buildSystemPrompt } from "@/lib/knowledge";
import { saveLead, sendLeadToWebhook, type Lead } from "@/lib/leads";
import { getEnv } from "@/lib/env";

export const runtime = "nodejs";

// ─── Lead capture tool definition ─────────────────────────────────────────────

const CAPTURE_LEAD_TOOL: Anthropic.Tool = {
  name: "capture_lead",
  description:
    "Salva as informações de contato do visitante quando você tiver coletado o nome e pelo menos telefone ou e-mail. Chame esta ferramenta assim que tiver os dados mínimos.",
  input_schema: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Nome completo do visitante",
      },
      phone: {
        type: "string",
        description: "Telefone com DDD (ex: (41) 99999-0000)",
      },
      email: {
        type: "string",
        description: "Endereço de e-mail",
      },
    },
    required: ["name"],
  },
};

// ─── Conversation analysis ─────────────────────────────────────────────────────

async function analyzeConversation(
  anthropic: Anthropic,
  messages: Array<{ role: string; content: string }>
): Promise<{ summary: string; temperature: "hot" | "warm" | "cold"; serviceInterest: string }> {
  const conversationText = messages
    .map((m) => `${m.role === "user" ? "Visitante" : "Assistente"}: ${m.content}`)
    .join("\n");

  try {
    const res = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 300,
      system:
        'Você analisa conversas de pré-venda e retorna APENAS um objeto JSON válido, sem markdown, sem explicações.',
      messages: [
        {
          role: "user",
          content: `Analise a conversa abaixo e retorne um JSON com exatamente estas três chaves:
- "summary": string com 2-3 frases descrevendo o perfil do lead e o que ele busca
- "temperature": uma das opções "hot" (pronto para contratar), "warm" (interessado, precisa de nurturing) ou "cold" (apenas curioso)
- "serviceInterest": string curta com o serviço de maior interesse (ou "Geral" se não identificado)

Conversa:
${conversationText}`,
        },
      ],
    });

    const text = res.content[0]?.type === "text" ? res.content[0].text.trim() : "{}";
    // Remove possible markdown code fences
    const cleaned = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    return JSON.parse(cleaned) as {
      summary: string;
      temperature: "hot" | "warm" | "cold";
      serviceInterest: string;
    };
  } catch {
    return {
      summary: "Lead captado via chat do site.",
      temperature: "warm",
      serviceInterest: "Geral",
    };
  }
}

// ─── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  const result = ChatSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Dados inválidos", issues: result.error.flatten() },
      { status: 422 }
    );
  }

  const apiKey = getEnv("ANTHROPIC_API_KEY");
  if (!apiKey) {
    return NextResponse.json(
      { error: "Serviço de chat indisponível no momento." },
      { status: 503 }
    );
  }

  const kb = getKnowledgeBase();
  const systemPrompt = buildSystemPrompt(kb);
  const anthropic = new Anthropic({ apiKey });

  // Strip leading assistant messages (API requires user first)
  const rawMessages = result.data.messages;
  const firstUserIdx = rawMessages.findIndex((m) => m.role === "user");
  const messages = firstUserIdx >= 0 ? rawMessages.slice(firstUserIdx) : rawMessages;

  if (messages.length === 0) {
    return NextResponse.json({ content: "" });
  }

  // ── First call — may include a tool_use block ─────────────────────────────
  let firstResponse: Anthropic.Message;
  try {
    firstResponse = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 700,
      system: systemPrompt,
      tools: [CAPTURE_LEAD_TOOL],
      messages,
    });
  } catch (err) {
    console.error("[chat] Anthropic API error:", err);
    return NextResponse.json(
      { error: "Serviço de IA indisponível no momento. Tente novamente em breve." },
      { status: 502 }
    );
  }

  // ── Tool use: capture_lead called ─────────────────────────────────────────
  const toolUseBlock = firstResponse.content.find(
    (b): b is Anthropic.ToolUseBlock => b.type === "tool_use" && b.name === "capture_lead"
  );

  if (toolUseBlock) {
    const input = toolUseBlock.input as {
      name: string;
      phone?: string;
      email?: string;
    };

    // Analyze conversation and save lead
    const analysis = await analyzeConversation(anthropic, messages);
    const lead: Lead = {
      id: crypto.randomUUID(),
      name: input.name,
      phone: input.phone,
      email: input.email,
      summary: analysis.summary,
      temperature: analysis.temperature,
      serviceInterest: analysis.serviceInterest,
      messages: messages.map((m) => ({ role: m.role, content: String(m.content) })),
      createdAt: new Date().toISOString(),
      webhookSent: false,
    };
    saveLead(lead);

    // Send to webhook if configured
    const webhookUrl = kb.integrations?.clickupWebhookUrl?.trim();
    if (webhookUrl) {
      const sent = await sendLeadToWebhook(lead, webhookUrl);
      if (sent) {
        lead.webhookSent = true;
        lead.webhookSentAt = new Date().toISOString();
        saveLead(lead);
      }
    }

    // Continue conversation with tool result
    let finalResponse: Anthropic.Message;
    try {
      finalResponse = await anthropic.messages.create({
        model: "claude-haiku-4-5",
        max_tokens: 400,
        system: systemPrompt,
        tools: [CAPTURE_LEAD_TOOL],
        messages: [
          ...messages,
          { role: "assistant", content: firstResponse.content },
          {
            role: "user",
            content: [
              {
                type: "tool_result",
                tool_use_id: toolUseBlock.id,
                content: "Lead salvo com sucesso.",
              },
            ],
          },
        ],
      });
    } catch (err) {
      console.error("[chat] Anthropic final call error:", err);
      return NextResponse.json({ content: "Ótimo! Nossa equipe vai entrar em contato em breve.", leadCaptured: true });
    }

    const textBlock = finalResponse.content.find(
      (b): b is Anthropic.TextBlock => b.type === "text"
    );
    return NextResponse.json({
      content: textBlock?.text ?? "Ótimo! Nossa equipe vai entrar em contato em breve.",
      leadCaptured: true,
    });
  }

  // ── Normal text response ──────────────────────────────────────────────────
  const textBlock = firstResponse.content.find(
    (b): b is Anthropic.TextBlock => b.type === "text"
  );
  return NextResponse.json({ content: textBlock?.text ?? "" });
}
