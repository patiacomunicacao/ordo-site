const CheckIcon = () => (
  <svg viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="9" stroke="#C4A0F0" strokeOpacity="0.4" strokeWidth="1" />
    <path d="M6 10l3 3 5-5" stroke="#C4A0F0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function CaseClickUp() {
  return (
    <section className="ordo-case">
      <div className="ordo-case__inner">

        <span className="ordo-case__eyebrow">Case de resultado</span>

        <h2 className="ordo-case__heading">
          198 horas.<br />
          Feitas em <em>2 dias.</em>
        </h2>

        <p className="ordo-case__subtitle">
          Como estruturamos mais de 1.000 tarefas no ClickUp para uma empresa de engenharia
          ambiental usando Claude e Claude Code.
        </p>

        <div className="ordo-case__sector">
          <span className="ordo-case__sector-dot" />
          Engenharia Ambiental · Implementação ClickUp · IA + Automação
        </div>

        {/* Stats */}
        <div className="ordo-case__stats">
          {[
            { num: "68", label: <>serviços estruturados<br />no ClickUp</> },
            { num: "1.000+", label: <>tarefas criadas com<br />padrão uniforme</> },
            { num: "-99%", label: <>do tempo estimado<br />para execução manual</> },
          ].map((s) => (
            <div key={s.num} className="ordo-case__stat">
              <span className="ordo-case__stat-num">{s.num}</span>
              <span className="ordo-case__stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Body grid */}
        <div className="ordo-case__grid">
          {/* Phases */}
          <div className="ordo-case__phases">
            <div style={{ marginBottom: 8 }}>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(196,160,240,0.7)", marginBottom: 24 }}>
                Como foi feito
              </p>
            </div>
            {[
              {
                n: "01", title: "Análise estratégica com Claude",
                text: "A documentação de processos da empresa foi carregada direto no Claude. Ele leu, interpretou e sugeriu a arquitetura ideal no ClickUp — marcos, tarefas vinculadas e hierarquias escaláveis.",
              },
              {
                n: "02", title: "Criação em escala com Claude Code",
                text: "Scripts Python gerados pelo Claude criaram pastas, listas, checklists e relacionamentos via API do ClickUp. Cada ciclo era validado, ajustado e re-executado até a entrega estar perfeita.",
              },
              {
                n: "03", title: "Condução e validação humana",
                text: "A IA foi a ferramenta. A estratégia, as decisões e o controle de qualidade foram humanos — em cada etapa do processo.",
              },
            ].map((p) => (
              <div key={p.n} className="ordo-case__phase">
                <div className="ordo-case__phase-num">{p.n}</div>
                <div>
                  <p className="ordo-case__phase-title">{p.title}</p>
                  <p className="ordo-case__phase-text">{p.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Results */}
          <div className="ordo-case__results">
            <p className="ordo-case__results-title">Resultado para o cliente</p>
            {[
              <><strong>Operação estruturada</strong> e pronta para escalar</>,
              <><strong>Padrão uniforme</strong> em todos os 68 serviços</>,
              <><strong>Base preparada</strong> para automações futuras</>,
              <><strong>Scripts reutilizáveis</strong> para novos projetos</>,
              <><strong>Zero retrabalho</strong> na entrega final</>,
            ].map((text, i) => (
              <div key={i} className="ordo-case__result-item">
                <div className="ordo-case__result-icon"><CheckIcon /></div>
                <p className="ordo-case__result-text">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison */}
        <div className="ordo-case__compare">
          <p className="ordo-case__compare-label">Tempo de execução</p>
          <div className="ordo-case__compare-row">
            <span className="ordo-case__compare-tag">Manual</span>
            <div className="ordo-case__compare-bar-wrap">
              <div className="ordo-case__compare-bar ordo-case__compare-bar--before" />
            </div>
            <span className="ordo-case__compare-val ordo-case__compare-val--before">~198h</span>
          </div>
          <div className="ordo-case__compare-row">
            <span className="ordo-case__compare-tag">Com ORDO</span>
            <div className="ordo-case__compare-bar-wrap">
              <div className="ordo-case__compare-bar ordo-case__compare-bar--after" />
            </div>
            <span className="ordo-case__compare-val ordo-case__compare-val--after">2 dias</span>
          </div>
        </div>

        {/* CTA */}
        <div className="ordo-case__cta">
          <p className="ordo-case__cta-text">Seu próximo projeto pode ser assim.</p>
          <a href="/#contato" className="ordo-case__btn">
            Falar com a ORDO
            <ArrowIcon />
          </a>
        </div>

      </div>
    </section>
  );
}
