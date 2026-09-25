import type { HomeContent } from "./types";

export const en: HomeContent = {
  hero: {
    eyebrow: "Processes · Automation · Artificial Intelligence",
    titleLead: "Your operation organized, automated and",
    titleHighlight: "ready to grow.",
    subtitle:
      "We map your processes, automate what takes up your team's time and put AI to work in your business.",
    ctaPrimary: "Book an assessment",
    ctaSecondary: "Explore services",
    points: [
      "Assessment before you invest",
      "Implementation alongside your team",
      "AI applied to your daily routine",
    ],
    illustrationAlt:
      "Illustration: a process flow connected to everyday tools and a metrics dashboard.",
  },

  services: {
    eyebrow: "Services",
    title: "From assessment to an operation that runs on its own",
    subtitle:
      "Every company starts from a different place. Choose where to begin, or book an assessment to find the best path.",
    indexLabel: "Service families",

    diagnosis: {
      anchor: "servicos-diagnostico",
      number: "01",
      title: "Assessment",
      tagline: "Understand before you invest",
      items: [
        {
          id: "diagnostico-simples",
          title: "Essential Assessment",
          description:
            "We map one process and design how it works today (AS IS) and how it should work (TO BE), with an action plan for your team to implement.",
          cta: "Learn more",
        },
        {
          id: "diagnostico-completo",
          title: "Complete Assessment",
          description:
            "Mapping of up to 3 processes, with AS IS and TO BE designs and full documentation (SOPs) to train your team and standardize the operation.",
          cta: "Learn more",
        },
      ],
    },

    implementation: {
      anchor: "servicos-automacao",
      number: "02",
      title: "Implementation and Automation",
      tagline: "Make it work",
      items: [
        {
          id: "implementacao-processos",
          title: "Process Implementation",
          description:
            "We roll out the new process together with your team, until it runs day to day.",
          cta: "Learn more",
        },
        {
          id: "automacao-starter",
          title: "Automation Starter",
          description:
            "We automate one operational process that currently eats up hours of your team's time.",
          cta: "Learn more",
        },
        {
          id: "automacao-pro",
          title: "Automation PRO",
          description:
            "Automation of up to 5 processes, integrating the tools your company already uses.",
          cta: "Learn more",
        },
      ],
    },

    ai: {
      anchor: "servicos-ia",
      number: "03",
      title: "Artificial Intelligence",
      tagline: "AI applied to your business",
      items: [
        {
          id: "agentes-ia",
          title: "AI Agents",
          description:
            "Agents that serve customers, organize information and carry out tasks on WhatsApp and in your systems, based on your company's knowledge.",
          cta: "Learn more",
        },
        {
          id: "sistemas-ia",
          title: "Custom AI Systems",
          description:
            "Natural-language queries over your data, smart document search, and automatic classification and extraction of information.",
          cta: "Learn more",
        },
      ],
    },

    consulting: {
      anchor: "servicos-consultoria",
      number: "04",
      title: "Ongoing consulting",
      tagline: "ORDO by your operation's side",
      depthLabel: "Depth of involvement",
      depthLevels: ["Occasional", "Ongoing", "Strategic", "Part of management"],
      plans: [
        {
          id: "consultoria-essential",
          name: "Essential",
          summary: "To get things in order with monthly guidance.",
          features: [
            "Identifying bottlenecks and operational failures",
            "Simple automations",
            "Monthly guidance",
          ],
          depth: 2,
          cta: "Talk to ORDO",
        },
        {
          id: "consultoria-advanced",
          name: "Advanced",
          summary: "For companies that want to evolve with a plan and metrics.",
          features: [
            "Everything in Essential",
            "Quarterly roadmap",
            "KPI tracking",
            "Medium-complexity automations",
          ],
          depth: 3,
          cta: "Talk to ORDO",
        },
        {
          id: "consultoria-partner",
          name: "Partner",
          summary: "We act as your operations arm.",
          features: [
            "Everything in Advanced",
            "Your company's operations arm",
            "Presence in management meetings",
            "Priority support",
            "Semiannual planning",
          ],
          depth: 4,
          highlight: true,
          badge: "Full involvement",
          cta: "Talk to ORDO",
        },
      ],
    },

    embedded: {
      anchor: "servicos-embarcados",
      number: "05",
      eyebrow: "ORDO differentiator",
      title: "Embedded Systems",
      tagline: "Technology inside your equipment",
      description:
        "We develop onboard computer software for machines and equipment: from collecting operational data to an online platform to follow every unit in real time.",
      features: [
        {
          title: "Operational data collection",
          description: "The onboard computer records the operating data of each unit.",
        },
        {
          title: "Control panel",
          description: "A clear interface to operate and configure the equipment.",
        },
        {
          title: "Online platform",
          description: "Follow every unit in real time, from anywhere.",
        },
      ],
      cta: "Talk about my equipment",
      illustrationAlt:
        "Illustration: equipment with an onboard computer sending data to an online platform.",
    },
  },

  howWeWork: {
    eyebrow: "How we work",
    title: "Three steps to organize your operation",
    subtitle: "We start by understanding your business. Then we put it to work and keep improving.",
    stepLabel: "Step",
    steps: [
      {
        title: "Assessment",
        description:
          "We map how the operation works today, find where it loses time and set the priorities.",
      },
      {
        title: "Implementation",
        description:
          "We get the new process and automations running, side by side with your team.",
      },
      {
        title: "Continuous improvement",
        description:
          "We track the metrics and adjust whatever is needed so the operation keeps getting better.",
      },
    ],
  },

  forWhom: {
    eyebrow: "Who it's for",
    title: "Built for those who need their time back",
    subtitle: "We work with businesses whose daily routine depends on a lot of manual work.",
    audiences: [
      {
        title: "Small and medium businesses",
        description:
          "For the overloaded owner who handles everything and sees the team stuck in manual processes.",
        points: [
          "Decisions and approvals that depend only on you",
          "Spreadsheets, rework and scattered information",
          "A team busy with repetitive tasks",
        ],
        cta: "I want to organize my company",
      },
      {
        title: "Law firms",
        description:
          "For firms that want to automate case tracking and the drafting of legal documents.",
        points: [
          "Automated case tracking",
          "AI-assisted document drafting",
          "More time for the strategy of each case",
        ],
        cta: "I want to automate my firm",
      },
    ],
  },

  caseHighlight: {
    eyebrow: "Real case",
    title: "198 hours of work, done in 2 days",
    description:
      "We structured more than 1,000 tasks in ClickUp for an environmental engineering company using Claude and Claude Code.",
    sector: "Environmental Engineering · ClickUp Implementation · AI + Automation",
    stats: [
      { value: "68", label: "services structured in ClickUp" },
      { value: "1,000+", label: "tasks created with a uniform standard" },
      { value: "-99%", label: "of the estimated time for manual execution" },
    ],
    cta: "See the full case",
  },

  finalCta: {
    title: "Find out where your operation is losing time",
    subtitle:
      "In the assessment, we look at your processes and show you what can be organized, automated and improved first.",
    cta: "Book an assessment",
    whatsapp: "Or message us on WhatsApp",
  },

  contact: {
    instagramLabel: "Instagram",
    serviceOptions: [
      { value: "diagnostico", label: "I want to book an assessment" },
      { value: "diagnostico-simples", label: "Essential Assessment" },
      { value: "diagnostico-completo", label: "Complete Assessment" },
      { value: "implementacao-processos", label: "Process Implementation" },
      { value: "automacao-starter", label: "Automation Starter" },
      { value: "automacao-pro", label: "Automation PRO" },
      { value: "agentes-ia", label: "AI Agents" },
      { value: "sistemas-ia", label: "Custom AI Systems" },
      { value: "consultoria-essential", label: "Consulting Essential" },
      { value: "consultoria-advanced", label: "Consulting Advanced" },
      { value: "consultoria-partner", label: "Consulting Partner" },
      { value: "sistemas-embarcados", label: "Embedded Systems" },
      { value: "outro", label: "Other / Not sure yet" },
    ],
  },
};
