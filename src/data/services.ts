import type { Service } from "@/types";

export const SERVICES: Service[] = [
  {
    id: "mapeamento-processos",
    slug: "mapeamento-processos",
    icon: "Map",
    title: "Mapeamento de Processos",
    description:
      "Identificamos gargalos, redundâncias e oportunidades de melhoria na sua operação. Documentamos o estado atual e desenhamos o fluxo ideal.",
    priceFrom: 2500,
    bullets: [
      "Diagnóstico completo da operação",
      "Fluxogramas e documentação técnica",
      "Priorização de melhorias por impacto",
    ],
  },
  {
    id: "automacao",
    slug: "automacao",
    icon: "Zap",
    title: "Automação de Processos",
    description:
      "Eliminamos tarefas manuais com soluções que funcionam sem intervenção humana, liberando sua equipe para o que realmente importa.",
    priceFrom: 4000,
    bullets: [
      "Automação de aprovações e fluxos",
      "Integrações entre sistemas",
      "Relatórios e alertas automáticos",
    ],
  },
  {
    id: "implementacao-ia",
    slug: "implementacao-ia",
    icon: "Brain",
    title: "Implementação de IA",
    description:
      "Aplicamos inteligência artificial de forma prática: atendimento automatizado, análise de dados e assistentes internos adaptados ao seu negócio.",
    priceFrom: 6000,
    bullets: [
      "Chatbots e atendimento com IA",
      "Análise preditiva de dados",
      "Assistentes de produtividade interna",
    ],
  },
  {
    id: "gestao-projetos",
    slug: "gestao-projetos",
    icon: "FolderKanban",
    title: "Gestão de Projetos",
    description:
      "Estruturamos a gestão de projetos da sua empresa com metodologias ágeis, garantindo entregas no prazo e dentro do escopo definido.",
    priceFrom: 3000,
    bullets: [
      "Implantação de metodologia ágil",
      "Ferramentas de acompanhamento",
      "Treinamento da equipe",
    ],
  },
  {
    id: "treinamento",
    slug: "treinamento",
    icon: "GraduationCap",
    title: "Treinamento e Capacitação",
    description:
      "Capacitamos sua equipe para operar com eficiência as novas ferramentas, processos e metodologias implementados pela ORDO.",
    priceFrom: 1800,
    bullets: [
      "Workshops presenciais ou remotos",
      "Material didático personalizado",
      "Suporte pós-treinamento",
    ],
  },
  {
    id: "transformacao-digital",
    slug: "transformacao-digital",
    icon: "Rocket",
    title: "Transformação Digital",
    description:
      "Projeto completo de digitalização da operação: mapeamos, priorizamos e implementamos um roadmap de transformação sob medida para sua empresa.",
    priceFrom: 15000,
    bullets: [
      "Diagnóstico e roadmap estratégico",
      "Implementação em fases priorizadas",
      "Acompanhamento contínuo de resultados",
    ],
  },
];
