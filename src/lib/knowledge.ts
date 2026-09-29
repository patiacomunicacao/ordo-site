import { sql } from "@/lib/neon";
import type { SiteConfig } from "@/lib/site-config";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface KbService {
  id: string;
  name: string;
  description: string;
  highlights: string;      // principais benefícios (texto livre)
}

export interface KbFaq {
  id: string;
  question: string;
  answer: string;
}

export interface WebhookConfig {
  id: string;
  name: string;     // ex: "ClickUp", "Make – Leads", "Zapier CRM"
  url: string;
  enabled: boolean;
}

export interface KnowledgeBase {
  company: {
    name: string;
    description: string;
    location: string;
    // E-mail e WhatsApp vêm de site_config (Configurações), fonte única do contato.
  };
  services: KbService[];
  faqs: KbFaq[];
  behavior: {
    tone: string;
    mainGoal: string;
    restrictions: string;
    customInstructions: string;
  };
  integrations: {
    webhooks: WebhookConfig[];
  };
}

// ─── Default knowledge base ───────────────────────────────────────────────────

const DEFAULT_KB: KnowledgeBase = {
  company: {
    name: "ORDO Consultoria",
    description:
      "empresa especializada em mapeamento de processos, automação e IA para PMEs",
    location: "Curitiba / São José dos Pinhais, PR",
  },
  services: [
    {
      id: "1",
      name: "Diagnóstico",
      description:
        "Mapeamos processos, desenhamos como funcionam hoje (AS IS) e como deveriam funcionar (TO BE), com plano de ação. Versões Simples (1 processo) e Completo (até 3 processos, com POPs e SOPs).",
      highlights: "Entender antes de investir, plano de ação claro, documentação para a equipe",
    },
    {
      id: "2",
      name: "Implementação e Automação",
      description:
        "Implantamos o novo processo com a equipe e automatizamos tarefas operacionais. Versões Implementação de Processos, Automação Starter (1 processo) e Automação PRO (até 5 processos).",
      highlights: "Integração com as ferramentas que a empresa já usa, menos retrabalho, horas liberadas",
    },
    {
      id: "3",
      name: "Inteligência Artificial",
      description:
        "Agentes de IA que atendem clientes e executam tarefas no WhatsApp e nos sistemas, e sistemas de IA sob medida para consultar dados e documentos.",
      highlights: "IA baseada no conhecimento da empresa, atendimento e tarefas automatizados",
    },
    {
      id: "4",
      name: "Consultoria recorrente",
      description:
        "A ORDO acompanha a operação mensalmente, com planos Essential, Advanced e Partner conforme a profundidade de atuação.",
      highlights: "Acompanhamento contínuo, melhoria de processos, direcionamento mensal",
    },
  ],
  faqs: [
    {
      id: "1",
      question: "Quanto tempo leva um projeto?",
      answer:
        "Depende do escopo. Mapeamentos simples levam de 2 a 4 semanas. Automações e projetos de IA costumam levar de 4 a 12 semanas. Na conversa inicial definimos um cronograma realista.",
    },
    {
      id: "2",
      question: "Vocês atendem empresas de qual tamanho?",
      answer:
        "Foco em PMEs — de 5 a 200 funcionários. Nossos serviços são dimensionados para esse perfil: sem burocracia excessiva, resultados rápidos e custo acessível.",
    },
    {
      id: "3",
      question: "Como funciona a primeira conversa?",
      answer:
        "É gratuita e dura cerca de 30 minutos. Entendemos sua operação, identificamos os principais desafios e apresentamos as opções mais adequadas para o seu momento.",
    },
  ],
  behavior: {
    tone: "cordial, direto e profissional",
    mainGoal:
      "Entender os desafios do visitante, identificar o serviço mais adequado e encorajar o agendamento de um diagnóstico com a equipe.",
    restrictions:
      "Nunca inventar dados, cases ou informações não fornecidas. Não fazer promessas de resultados específicos sem conhecer o contexto do cliente.",
    customInstructions: "",
  },
  integrations: {
    webhooks: [],
  },
};

// ─── Schema ───────────────────────────────────────────────────────────────────

let schemaReady = false;

async function ensureSchema() {
  if (schemaReady) return;
  await sql`
    CREATE TABLE IF NOT EXISTS knowledge_base (
      id   INTEGER PRIMARY KEY DEFAULT 1,
      data JSONB NOT NULL
    )
  `;
  // Seed default if empty
  await sql`
    INSERT INTO knowledge_base (id, data)
    VALUES (1, ${JSON.stringify(DEFAULT_KB)})
    ON CONFLICT (id) DO NOTHING
  `;
  schemaReady = true;
}

function migrateKb(raw: Record<string, unknown>): KnowledgeBase {
  const integrations = raw.integrations as Record<string, unknown> | undefined;
  if (integrations && "clickupWebhookUrl" in integrations && !("webhooks" in integrations)) {
    const oldUrl = (integrations.clickupWebhookUrl as string) ?? "";
    return {
      ...(raw as unknown as KnowledgeBase),
      integrations: {
        webhooks: oldUrl.trim()
          ? [{ id: crypto.randomUUID(), name: "Webhook", url: oldUrl.trim(), enabled: true }]
          : [],
      },
    };
  }
  return raw as unknown as KnowledgeBase;
}

export async function getKnowledgeBase(): Promise<KnowledgeBase> {
  await ensureSchema();
  const rows = await sql`SELECT data FROM knowledge_base WHERE id = 1`;
  const raw = rows[0]?.data ?? DEFAULT_KB;
  return migrateKb(raw as Record<string, unknown>);
}

export async function saveKnowledgeBase(kb: KnowledgeBase): Promise<void> {
  await ensureSchema();
  await sql`
    INSERT INTO knowledge_base (id, data) VALUES (1, ${JSON.stringify(kb)})
    ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
  `;
}

// ─── Prompt builder ───────────────────────────────────────────────────────────

type PromptInput = Pick<KnowledgeBase, "company" | "services" | "faqs" | "behavior">;
type PromptContact = Pick<SiteConfig, "email" | "phone" | "whatsapp">;

export function buildSystemPrompt(kb: PromptInput, contact: PromptContact): string {
  const servicesBlock = kb.services
    .filter((s) => s.name.trim())
    .map((s) => {
      const desc = s.description ? `\n  → ${s.description}` : "";
      const hl = s.highlights ? `\n  Destaques: ${s.highlights}` : "";
      return `• ${s.name}${desc}${hl}`;
    })
    .join("\n");

  const faqsBlock =
    kb.faqs.filter((f) => f.question.trim()).length > 0
      ? "\n\nPerguntas frequentes que o assistente deve saber responder:\n" +
        kb.faqs
          .filter((f) => f.question.trim())
          .map((f) => `P: ${f.question}\nR: ${f.answer}`)
          .join("\n\n")
      : "";

  const restrictionsLine = kb.behavior.restrictions
    ? `- ${kb.behavior.restrictions}`
    : "";

  const whatsappLine = contact.whatsapp
    ? ` ou WhatsApp ${contact.phone || contact.whatsapp} (https://wa.me/${contact.whatsapp})`
    : "";

  const customBlock = kb.behavior.customInstructions
    ? `\nInstruções adicionais:\n${kb.behavior.customInstructions}`
    : "";

  return `Você é o assistente virtual da ${kb.company.name}, ${kb.company.description}${kb.company.location ? `, com sede em ${kb.company.location}` : ""}.

Objetivo principal: ${kb.behavior.mainGoal}

Serviços disponíveis:
${servicesBlock}${faqsBlock}

Regras de comportamento:
- Seja ${kb.behavior.tone}.
- Use sempre português brasileiro.
- Respostas curtas — no máximo 3 parágrafos.
${restrictionsLine}
- Nunca informe preços, valores, faixas de investimento ou estimativas de custo. Se perguntarem, explique que o investimento depende do escopo e é definido depois do diagnóstico, e convide para agendar um.
- Para contato humano: ${contact.email}${whatsappLine}.${customBlock}

Coleta de contato (IMPORTANTE):
- Quando o visitante demonstrar interesse genuíno em algum serviço ou solução, peça de forma natural o nome e pelo menos um contato (telefone ou e-mail) para que a equipe possa entrar em contato.
- Não peça contato logo no início — espere haver um contexto de interesse.
- Quando tiver coletado o nome + telefone ou e-mail, use a ferramenta "capture_lead" imediatamente para registrar o contato.
- Após capturar, confirme ao visitante que um consultor vai entrar em contato em breve.`;
}
