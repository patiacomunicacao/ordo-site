import type { Metadata } from "next";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  return {
    title: isEn ? "Privacy Policy" : "Política de Privacidade",
    description: isEn
      ? "Learn how ORDO Consultoria collects, uses, and protects your personal data."
      : "Saiba como a ORDO Consultoria coleta, usa e protege seus dados pessoais.",
    robots: { index: false, follow: false },
  };
}

export default async function PrivacyPolicyPage({ params }: Props) {
  const { locale } = await params;
  const isEn = locale === "en";

  return (
    <main className="min-h-screen bg-white pt-28 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {isEn ? <PolicyEn /> : <PolicyPt />}
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2
        className="text-xl font-bold text-gray-900 mb-3"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {title}
      </h2>
      <div className="text-gray-600 text-sm leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

function PolicyPt() {
  return (
    <>
      <header className="mb-12">
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#4F3DB5" }}>
          Transparência e Privacidade
        </p>
        <h1
          className="text-4xl font-extrabold text-gray-900 mb-4"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Política de Privacidade
        </h1>
        <p className="text-gray-500 text-sm">Última atualização: agosto de 2025</p>
      </header>

      <Section title="1. Quem somos">
        <p>
          A <strong>ORDO Consultoria</strong> (CNPJ a confirmar), com sede em Curitiba / São José dos Pinhais – PR,
          é a controladora dos dados pessoais coletados por meio deste site (ordoautomacao.com.br).
        </p>
        <p>
          Para dúvidas sobre esta política ou para exercer seus direitos, entre em contato pelo e-mail{" "}
          <a href="mailto:contato@ordoautomacao.com.br" className="underline" style={{ color: "#4F3DB5" }}>
            contato@ordoautomacao.com.br
          </a>.
        </p>
      </Section>

      <Section title="2. Dados que coletamos">
        <p>Coletamos os seguintes dados pessoais:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Nome</strong> — fornecido voluntariamente via chat ou formulário de contato.</li>
          <li><strong>Telefone / WhatsApp</strong> — fornecido voluntariamente para retorno comercial.</li>
          <li><strong>E-mail</strong> — fornecido voluntariamente para contato.</li>
          <li><strong>Dados de navegação</strong> — coletados automaticamente por ferramentas de análise (veja seção 4).</li>
        </ul>
      </Section>

      <Section title="3. Finalidade do tratamento">
        <ul className="list-disc pl-5 space-y-1">
          <li>Responder a solicitações de contato e qualificar o interesse em nossos serviços.</li>
          <li>Entrar em contato para apresentar propostas comerciais.</li>
          <li>Analisar o comportamento de navegação para melhorar o site e a experiência do usuário.</li>
        </ul>
        <p>
          A base legal para o tratamento é o <strong>legítimo interesse</strong> (Art. 7º, IX da LGPD) para fins
          comerciais e o <strong>consentimento</strong> (Art. 7º, I) para cookies opcionais de análise.
        </p>
      </Section>

      <Section title="4. Cookies e rastreamento">
        <p>Este site utiliza os seguintes cookies e tecnologias de rastreamento:</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse mt-2">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-2 border border-gray-200 font-semibold">Ferramenta</th>
                <th className="text-left p-2 border border-gray-200 font-semibold">Tipo</th>
                <th className="text-left p-2 border border-gray-200 font-semibold">Finalidade</th>
                <th className="text-left p-2 border border-gray-200 font-semibold">Consentimento</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border border-gray-200">Vercel Analytics</td>
                <td className="p-2 border border-gray-200">Essencial / Análise</td>
                <td className="p-2 border border-gray-200">Métricas de acesso anonimizadas, sem cookies</td>
                <td className="p-2 border border-gray-200">Não requerido</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-2 border border-gray-200">Vercel Speed Insights</td>
                <td className="p-2 border border-gray-200">Essencial / Desempenho</td>
                <td className="p-2 border border-gray-200">Medição de desempenho técnico, sem cookies</td>
                <td className="p-2 border border-gray-200">Não requerido</td>
              </tr>
              <tr>
                <td className="p-2 border border-gray-200">Microsoft Clarity</td>
                <td className="p-2 border border-gray-200">Análise comportamental</td>
                <td className="p-2 border border-gray-200">Mapas de calor e gravação de sessões</td>
                <td className="p-2 border border-gray-200">Requerido</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3">
          Você pode alterar sua preferência de cookies a qualquer momento limpando os dados do site no seu navegador,
          o que fará o banner de consentimento reaparecer.
        </p>
      </Section>

      <Section title="5. Compartilhamento de dados">
        <p>
          Seus dados podem ser compartilhados com ferramentas de CRM e automação utilizadas internamente pela ORDO
          (como ClickUp, Make ou Zapier) exclusivamente para fins de gestão de relacionamento com clientes.
          Não vendemos, alugamos ou cedemos dados pessoais a terceiros para fins comerciais.
        </p>
      </Section>

      <Section title="6. Prazo de retenção">
        <p>
          Os dados coletados via formulário e chat são mantidos pelo prazo necessário para fins comerciais,
          com no máximo <strong>5 anos</strong> após o último contato, salvo obrigação legal que exija retenção maior.
        </p>
      </Section>

      <Section title="7. Seus direitos (LGPD – Art. 18)">
        <p>Como titular dos dados, você tem direito a:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Confirmar a existência de tratamento de seus dados.</li>
          <li>Acessar os dados que temos sobre você.</li>
          <li>Corrigir dados incompletos, inexatos ou desatualizados.</li>
          <li>Solicitar a anonimização, bloqueio ou eliminação dos seus dados.</li>
          <li>Revogar o consentimento dado a qualquer momento.</li>
          <li>Solicitar a portabilidade dos dados para outro fornecedor.</li>
        </ul>
        <p>
          Para exercer qualquer um desses direitos, envie um e-mail para{" "}
          <a href="mailto:contato@ordoautomacao.com.br" className="underline" style={{ color: "#4F3DB5" }}>
            contato@ordoautomacao.com.br
          </a>{" "}
          com o assunto <strong>"Direitos LGPD"</strong>. Responderemos em até 15 dias úteis.
        </p>
      </Section>

      <Section title="8. Alterações desta política">
        <p>
          Esta política pode ser atualizada periodicamente. A data da última atualização está indicada no topo desta página.
          Recomendamos que você a revise regularmente.
        </p>
      </Section>
    </>
  );
}

function PolicyEn() {
  return (
    <>
      <header className="mb-12">
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#4F3DB5" }}>
          Transparency & Privacy
        </p>
        <h1
          className="text-4xl font-extrabold text-gray-900 mb-4"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Privacy Policy
        </h1>
        <p className="text-gray-500 text-sm">Last updated: August 2025</p>
      </header>

      <Section title="1. Who we are">
        <p>
          <strong>ORDO Consultoria</strong>, headquartered in Curitiba / São José dos Pinhais – Brazil, is the
          data controller for personal data collected through this website (ordoautomacao.com.br).
        </p>
        <p>
          For questions about this policy or to exercise your rights, contact us at{" "}
          <a href="mailto:contato@ordoautomacao.com.br" className="underline" style={{ color: "#4F3DB5" }}>
            contato@ordoautomacao.com.br
          </a>.
        </p>
      </Section>

      <Section title="2. Data we collect">
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Name</strong> — voluntarily provided via chat or contact form.</li>
          <li><strong>Phone / WhatsApp</strong> — voluntarily provided for commercial follow-up.</li>
          <li><strong>Email</strong> — voluntarily provided for contact purposes.</li>
          <li><strong>Browsing data</strong> — automatically collected by analytics tools (see section 4).</li>
        </ul>
      </Section>

      <Section title="3. Purpose of processing">
        <ul className="list-disc pl-5 space-y-1">
          <li>Responding to contact requests and qualifying interest in our services.</li>
          <li>Following up with commercial proposals.</li>
          <li>Analyzing browsing behavior to improve the website and user experience.</li>
        </ul>
      </Section>

      <Section title="4. Cookies and tracking">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse mt-2">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-2 border border-gray-200 font-semibold">Tool</th>
                <th className="text-left p-2 border border-gray-200 font-semibold">Type</th>
                <th className="text-left p-2 border border-gray-200 font-semibold">Purpose</th>
                <th className="text-left p-2 border border-gray-200 font-semibold">Consent</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border border-gray-200">Vercel Analytics</td>
                <td className="p-2 border border-gray-200">Analytics</td>
                <td className="p-2 border border-gray-200">Anonymized traffic metrics, no cookies</td>
                <td className="p-2 border border-gray-200">Not required</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-2 border border-gray-200">Vercel Speed Insights</td>
                <td className="p-2 border border-gray-200">Performance</td>
                <td className="p-2 border border-gray-200">Technical performance measurement, no cookies</td>
                <td className="p-2 border border-gray-200">Not required</td>
              </tr>
              <tr>
                <td className="p-2 border border-gray-200">Microsoft Clarity</td>
                <td className="p-2 border border-gray-200">Behavioral analytics</td>
                <td className="p-2 border border-gray-200">Heatmaps and session recordings</td>
                <td className="p-2 border border-gray-200">Required</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="5. Data sharing">
        <p>
          Your data may be shared with CRM and automation tools used internally by ORDO (such as ClickUp, Make,
          or Zapier) solely for customer relationship management. We do not sell, rent, or share personal data
          with third parties for commercial purposes.
        </p>
      </Section>

      <Section title="6. Your rights">
        <ul className="list-disc pl-5 space-y-1">
          <li>Access the data we hold about you.</li>
          <li>Correct inaccurate or incomplete data.</li>
          <li>Request deletion of your data.</li>
          <li>Withdraw consent at any time.</li>
          <li>Request data portability.</li>
        </ul>
        <p>
          To exercise any of these rights, email{" "}
          <a href="mailto:contato@ordoautomacao.com.br" className="underline" style={{ color: "#4F3DB5" }}>
            contato@ordoautomacao.com.br
          </a>{" "}
          with the subject <strong>"Privacy Rights"</strong>. We will respond within 15 business days.
        </p>
      </Section>

      <Section title="7. Changes to this policy">
        <p>
          This policy may be updated periodically. The date of the last update is shown at the top of this page.
        </p>
      </Section>
    </>
  );
}
