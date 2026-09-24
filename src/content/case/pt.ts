import type { CaseContent } from "./types";

export const casePt: CaseContent = {
  eyebrow: "Case de resultado",
  titleLead: "198 horas.",
  titleHighlight: "Feitas em 2 dias.",
  subtitle:
    "Como estruturamos mais de 1.000 tarefas no ClickUp para uma empresa de engenharia ambiental usando Claude e Claude Code.",
  sector: "Engenharia Ambiental · Implementação ClickUp · IA + Automação",
  stats: [
    { value: "68", label: "serviços estruturados no ClickUp" },
    { value: "1.000+", label: "tarefas criadas com padrão uniforme" },
    { value: "-99%", label: "do tempo estimado para execução manual" },
  ],
  phasesTitle: "Como foi feito",
  phases: [
    {
      title: "Análise estratégica com Claude",
      text: "A documentação de processos da empresa foi carregada direto no Claude. Ele leu, interpretou e sugeriu a arquitetura ideal no ClickUp: marcos, tarefas vinculadas e hierarquias escaláveis.",
    },
    {
      title: "Criação em escala com Claude Code",
      text: "Scripts Python gerados pelo Claude criaram pastas, listas, checklists e relacionamentos via API do ClickUp. Cada ciclo era validado, ajustado e reexecutado até a entrega estar perfeita.",
    },
    {
      title: "Condução e validação humana",
      text: "A IA foi a ferramenta. A estratégia, as decisões e o controle de qualidade foram humanos, em cada etapa do processo.",
    },
  ],
  resultsTitle: "Resultado para o cliente",
  results: [
    { strong: "Operação estruturada", rest: "e pronta para escalar" },
    { strong: "Padrão uniforme", rest: "em todos os 68 serviços" },
    { strong: "Base preparada", rest: "para automações futuras" },
    { strong: "Scripts reutilizáveis", rest: "para novos projetos" },
    { strong: "Zero retrabalho", rest: "na entrega final" },
  ],
  compareTitle: "Tempo de execução",
  compare: [
    { label: "Manual", value: "~198h", percent: 100 },
    { label: "Com ORDO", value: "2 dias", percent: 2 },
  ],
  ctaText: "Seu próximo projeto pode ser assim.",
  cta: "Falar com a ORDO",
};
