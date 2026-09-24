import type { HomeContent } from "./types";

export const pt: HomeContent = {
  hero: {
    eyebrow: "Processos · Automação · Inteligência Artificial",
    titleLead: "Sua operação organizada, automatizada e",
    titleHighlight: "pronta para crescer.",
    subtitle:
      "Mapeamos seus processos, automatizamos o que toma tempo da sua equipe e colocamos IA para trabalhar no seu negócio.",
    ctaPrimary: "Agendar diagnóstico",
    ctaSecondary: "Conhecer serviços",
    points: [
      "Diagnóstico antes de investir",
      "Implementação junto com a sua equipe",
      "IA aplicada à rotina do negócio",
    ],
    illustrationAlt:
      "Ilustração: um fluxo de processo conectado a ferramentas do dia a dia e a um painel de indicadores.",
  },

  services: {
    eyebrow: "Serviços",
    title: "Do diagnóstico à operação rodando sozinha",
    subtitle:
      "Cada empresa começa de um ponto diferente. Escolha por onde começar ou peça um diagnóstico para descobrir o melhor caminho.",
    indexLabel: "Famílias de serviços",

    diagnosis: {
      anchor: "servicos-diagnostico",
      number: "01",
      title: "Diagnóstico",
      tagline: "Entender antes de investir",
      items: [
        {
          id: "diagnostico-simples",
          title: "Diagnóstico Simples",
          description:
            "Mapeamos um processo, desenhamos como ele funciona hoje (AS IS) e como deveria funcionar (TO BE), com um plano de ação para sua equipe implementar.",
          cta: "Quero saber mais",
        },
        {
          id: "diagnostico-completo",
          title: "Diagnóstico Completo",
          description:
            "Mapeamento de até 3 processos, com desenho AS IS e TO BE e documentação completa (POPs e SOPs) para treinar a equipe e padronizar a operação.",
          cta: "Quero saber mais",
        },
      ],
    },

    implementation: {
      anchor: "servicos-automacao",
      number: "02",
      title: "Implementação e Automação",
      tagline: "Colocar para funcionar",
      items: [
        {
          id: "implementacao-processos",
          title: "Implementação de Processos",
          description:
            "Implantamos o novo processo junto com a sua equipe, até ele rodar no dia a dia.",
          cta: "Quero saber mais",
        },
        {
          id: "automacao-starter",
          title: "Automação Starter",
          description:
            "Automatizamos um processo operacional que hoje consome horas da equipe.",
          cta: "Quero saber mais",
        },
        {
          id: "automacao-pro",
          title: "Automação PRO",
          description:
            "Automação de até 5 processos, integrando as ferramentas que sua empresa já usa.",
          cta: "Quero saber mais",
        },
      ],
    },

    ai: {
      anchor: "servicos-ia",
      number: "03",
      title: "Inteligência Artificial",
      tagline: "IA aplicada ao seu negócio",
      items: [
        {
          id: "agentes-ia",
          title: "Agentes de IA",
          description:
            "Agentes que atendem clientes, organizam informações e executam tarefas no WhatsApp e nos seus sistemas, com base no conhecimento da sua empresa.",
          cta: "Quero saber mais",
        },
        {
          id: "sistemas-ia",
          title: "Sistemas de IA sob medida",
          description:
            "Consultas em linguagem natural aos seus dados, busca inteligente em documentos, classificação e extração automática de informações.",
          cta: "Quero saber mais",
        },
      ],
    },

    consulting: {
      anchor: "servicos-consultoria",
      number: "04",
      title: "Consultoria recorrente",
      tagline: "A ORDO ao lado da sua operação",
      depthLabel: "Profundidade de atuação",
      depthLevels: ["Pontual", "Contínua", "Estratégica", "Integrada à gestão"],
      plans: [
        {
          id: "consultoria-essential",
          name: "Essential",
          summary: "Para colocar a casa em ordem com acompanhamento mensal.",
          features: [
            "Identificação de gargalos e falhas operacionais",
            "Automações simples",
            "Direcionamento mensal",
          ],
          depth: 2,
          cta: "Falar com a ORDO",
        },
        {
          id: "consultoria-advanced",
          name: "Advanced",
          summary: "Para quem quer evoluir com plano e indicadores.",
          features: [
            "Tudo do Essential",
            "Roadmap trimestral",
            "Acompanhamento de indicadores",
            "Automações de média complexidade",
          ],
          depth: 3,
          cta: "Falar com a ORDO",
        },
        {
          id: "consultoria-partner",
          name: "Partner",
          summary: "Atuamos como o seu braço de operações.",
          features: [
            "Braço de operações da sua empresa",
            "Presença nas reuniões de gestão",
            "Atendimento prioritário",
            "Planejamento semestral",
          ],
          depth: 4,
          highlight: true,
          badge: "Atuação completa",
          cta: "Falar com a ORDO",
        },
      ],
    },

    embedded: {
      anchor: "servicos-embarcados",
      number: "05",
      eyebrow: "Diferencial ORDO",
      title: "Sistemas Embarcados",
      tagline: "Tecnologia dentro do seu equipamento",
      description:
        "Desenvolvemos o software de computadores de bordo para máquinas e equipamentos: da coleta de dados na operação até a plataforma online para acompanhar cada unidade em tempo real.",
      features: [
        {
          title: "Coleta de dados da operação",
          description: "O computador de bordo registra os dados de funcionamento de cada equipamento.",
        },
        {
          title: "Painel de controle",
          description: "Uma interface clara para operar e configurar o equipamento.",
        },
        {
          title: "Plataforma online",
          description: "Acompanhe cada unidade em tempo real, de onde estiver.",
        },
      ],
      cta: "Falar sobre meu equipamento",
      illustrationAlt:
        "Ilustração: equipamento com computador de bordo enviando dados para uma plataforma online.",
    },
  },

  howWeWork: {
    eyebrow: "Como trabalhamos",
    title: "Três passos para organizar a operação",
    subtitle: "Começamos entendendo o seu negócio. Depois colocamos para funcionar e seguimos melhorando.",
    stepLabel: "Passo",
    steps: [
      {
        title: "Diagnóstico",
        description:
          "Mapeamos como a operação funciona hoje, encontramos onde ela perde tempo e definimos as prioridades.",
      },
      {
        title: "Implementação",
        description:
          "Colocamos o novo processo e as automações para rodar, lado a lado com a sua equipe.",
      },
      {
        title: "Evolução contínua",
        description:
          "Acompanhamos os indicadores e ajustamos o que for preciso para a operação continuar melhorando.",
      },
    ],
  },

  forWhom: {
    eyebrow: "Para quem é",
    title: "Feito para quem precisa de tempo de volta",
    subtitle: "Atendemos negócios em que o dia a dia depende de muito trabalho manual.",
    audiences: [
      {
        title: "Pequenas e médias empresas",
        description:
          "Para o dono sobrecarregado, que resolve tudo e vê a equipe presa em processos manuais.",
        points: [
          "Decisões e aprovações que dependem só de você",
          "Planilhas, retrabalho e informação espalhada",
          "Equipe ocupada com tarefas repetitivas",
        ],
        cta: "Quero organizar minha empresa",
      },
      {
        title: "Escritórios de advocacia",
        description:
          "Para escritórios que querem automatizar o acompanhamento processual e a produção de peças.",
        points: [
          "Acompanhamento processual automatizado",
          "Produção de peças com apoio de IA",
          "Mais tempo para a estratégia de cada caso",
        ],
        cta: "Quero automatizar meu escritório",
      },
    ],
  },

  caseHighlight: {
    eyebrow: "Case real",
    title: "198 horas de trabalho, feitas em 2 dias",
    description:
      "Estruturamos mais de 1.000 tarefas no ClickUp para uma empresa de engenharia ambiental usando Claude e Claude Code.",
    sector: "Engenharia Ambiental · Implementação ClickUp · IA + Automação",
    stats: [
      { value: "68", label: "serviços estruturados no ClickUp" },
      { value: "1.000+", label: "tarefas criadas com padrão uniforme" },
      { value: "-99%", label: "do tempo estimado para execução manual" },
    ],
    cta: "Ver o case completo",
  },

  finalCta: {
    title: "Descubra onde sua operação está perdendo tempo",
    subtitle:
      "No diagnóstico, olhamos para os seus processos e mostramos o que dá para organizar, automatizar e melhorar primeiro.",
    cta: "Agendar diagnóstico",
    whatsapp: "Ou fale pelo WhatsApp",
  },

  contact: {
    instagramLabel: "Instagram",
    serviceOptions: [
      { value: "diagnostico", label: "Quero agendar um diagnóstico" },
      { value: "diagnostico-simples", label: "Diagnóstico Simples" },
      { value: "diagnostico-completo", label: "Diagnóstico Completo" },
      { value: "implementacao-processos", label: "Implementação de Processos" },
      { value: "automacao-starter", label: "Automação Starter" },
      { value: "automacao-pro", label: "Automação PRO" },
      { value: "agentes-ia", label: "Agentes de IA" },
      { value: "sistemas-ia", label: "Sistemas de IA sob medida" },
      { value: "consultoria-essential", label: "Consultoria Essential" },
      { value: "consultoria-advanced", label: "Consultoria Advanced" },
      { value: "consultoria-partner", label: "Consultoria Partner" },
      { value: "sistemas-embarcados", label: "Sistemas Embarcados" },
      { value: "outro", label: "Outro / Ainda não sei" },
    ],
  },
};
