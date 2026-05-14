import { sql } from "@/lib/neon";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface KbService {
  id: string;
  name: string;
  description: string;
  startingPrice: string;   // ex: "R$ 2.500"
  highlights: string;      // principais benefícios (texto livre)
}

export interface KbFaq {
  id: string;
  question: string;
  answer: string;
}

export interface KnowledgeBase {
  company: {
    name: string;
    description: string;    // o que a empresa faz
    location: string;
    whatsapp: string;
    email: string;
  };
  services: KbService[];
  faqs: KbFaq[];
  behavior: {
    tone: string;               // ex: "cordial, direto e profissional"
    mainGoal: string;           // objetivo principal do assistente
    restrictions: string;       // o que NÃO fazer
    customInstructions: string; // instruções livres adicionais
  };
  integrations: {
    clickupWebhookUrl: string;  // webhook para envio de leads ao ClickUp (ou Make/Zapier)
  };
}

// ─── Default knowledge base ───────────────────────────────────────────────────

const DEFAULT_KB: KnowledgeBase = {
  company: {
    name: "ORDO Consultoria",
    description:
      "empresa especializada em mapeamento de processos, automação e IA para PMEs",
    location: "Curitiba / São José dos Pinhais, PR",
    whatsapp: "(41) 99999-0000",
    email: "contato@ordoconsultoria.com.br",
  },
  services: [
    {
      id: "1",
      name: "Mapeamento de Processos",
      description:
        "Identificamos gargalos e oportunidades na operação atual da empresa.",
      startingPrice: "R$ 2.500",
      highlights: "Diagnóstico rápido, relatório executivo, priorização de melhorias",
    },
    {
      id: "2",
      name: "Automação de Processos",
      description:
        "Automatizamos tarefas repetitivas para liberar a equipe para o que importa.",
      startingPrice: "R$ 4.000",
      highlights:
        "Integrações entre sistemas, eliminação de retrabalho, ganho de produtividade",
    },
    {
      id: "3",
      name: "Implementação de IA",
      description:
        "Aplicamos inteligência artificial em pontos estratégicos do negócio.",
      startingPrice: "R$ 6.000",
      highlights: "Chatbots, análise de dados, predição, automação inteligente",
    },
    {
      id: "4",
      name: "Gestão de Projetos",
      description:
        "Acompanhamos projetos de ponta a ponta com metodologia ágil.",
      startingPrice: "R$ 3.000",
      highlights: "Cronograma realista, gestão de riscos, comunicação clara",
    },
    {
      id: "5",
      name: "Treinamento e Capacitação",
      description:
        "Capacitamos equipes para operar as novas soluções com autonomia.",
      startingPrice: "R$ 1.800",
      highlights: "Treinamentos práticos, material didático, suporte pós-treinamento",
    },
    {
      id: "6",
      name: "Transformação Digital",
      description:
        "Programa completo de modernização da operação da empresa.",
      startingPrice: "R$ 15.000",
      highlights:
        "Diagnóstico, roadmap, implementação e acompanhamento de resultados",
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
      "Entender os desafios do visitante, identificar o serviço mais adequado e encorajar o agendamento de uma conversa gratuita com a equipe.",
    restrictions:
      "Nunca inventar dados, cases ou informações não fornecidas. Não fazer promessas de resultados específicos sem conhecer o contexto do cliente.",
    customInstructions: "",
  },
  integrations: {
    clickupWebhookUrl: "",
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

export async function getKnowledgeBase(): Promise<KnowledgeBase> {
  await ensureSchema();
  const rows = await sql`SELECT data FROM knowledge_base WHERE id = 1`;
  return (rows[0]?.data as KnowledgeBase) ?? DEFAULT_KB;
}

export async function saveKnowledgeBase(kb: KnowledgeBase): Promise<void> {
  await ensureSchema();
  await sql`
    INSERT INTO knowledge_base (id, data) VALUES (1, ${JSON.stringify(kb)})
    ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
  `;
}

// ─── Prompt builder ───────────────────────────────────────────────────────────

export function buildSystemPrompt(kb: KnowledgeBase): string {
  const servicesBlock = kb.services
    .filter((s) => s.name.trim())
    .map((s) => {
      const price = s.startingPrice ? ` (a partir de ${s.startingPrice})` : "";
      const desc = s.description ? `\n  → ${s.description}` : "";
      const hl = s.highlights ? `\n  Destaques: ${s.highlights}` : "";
      return `• ${s.name}${price}${desc}${hl}`;
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
- Para contato humano: ${kb.company.email}${kb.company.whatsapp ? ` ou WhatsApp ${kb.company.whatsapp}` : ""}.${customBlock}

Coleta de contato (IMPORTANTE):
- Quando o visitante demonstrar interesse genuíno em algum serviço ou solução, peça de forma natural o nome e pelo menos um contato (telefone ou e-mail) para que a equipe possa entrar em contato.
- Não peça contato logo no início — espere haver um contexto de interesse.
- Quando tiver coletado o nome + telefone ou e-mail, use a ferramenta "capture_lead" imediatamente para registrar o contato.
- Após capturar, confirme ao visitante que um consultor vai entrar em contato em breve.`;
}
