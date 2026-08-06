"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink, BarChart3, Flame, Gauge, Globe, TrendingUp } from "lucide-react";

const VERCEL_URL = "https://vercel.com/patiacomunicacao/ordo-site/analytics";
const CLARITY_URL = "https://clarity.microsoft.com/projects";
const GA4_URL = "https://analytics.google.com";

function ToolCard({
  icon,
  title,
  description,
  href,
  badge,
  metrics,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  badge: string;
  metrics: string[];
  color: string;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: color + "18" }}
          >
            <span style={{ color }}>{icon}</span>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
            {badge}
          </span>
        </div>

        <h2 className="text-base font-bold text-gray-900 mb-1">{title}</h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-5">{description}</p>

        <div className="grid grid-cols-2 gap-2 mb-6">
          {metrics.map((m) => (
            <div key={m} className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
              {m}
            </div>
          ))}
        </div>

        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 w-full justify-center px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: color }}
        >
          Abrir dashboard
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}

function SetupStep({ n, title, description }: { n: string; title: string; description: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white mt-0.5"
        style={{ backgroundColor: "#4F3DB5" }}
      >
        {n}
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-900">{title}</p>
        <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const clarityConfigured = true; // show setup guide regardless

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/admin"
          className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1
            className="text-2xl font-extrabold text-gray-900"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Analytics
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Monitoramento de acessos, comportamento e performance do site
          </p>
        </div>
      </div>

      {/* Tool cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <ToolCard
          icon={<TrendingUp size={22} />}
          title="Google Analytics 4"
          description="Rastreamento completo de conversões, funil de leads, origem do tráfego e integração com Search Console."
          href={GA4_URL}
          badge="Conversões"
          color="#E37400"
          metrics={[
            "Eventos de lead",
            "Origem do tráfego",
            "Funil de conversão",
            "Search Console",
            "Relatórios de público",
            "Metas e conversões",
          ]}
        />

        <ToolCard
          icon={<BarChart3 size={22} />}
          title="Vercel Analytics"
          description="Visitas, visitantes únicos, páginas mais acessadas, países e dispositivos. Dados em tempo real."
          href={VERCEL_URL}
          badge="Ativo"
          color="#4F3DB5"
          metrics={[
            "Visitas totais",
            "Visitantes únicos",
            "Páginas visitadas",
            "Países de acesso",
            "Dispositivos",
            "Tempo real",
          ]}
        />

        <ToolCard
          icon={<Flame size={22} />}
          title="Microsoft Clarity"
          description="Mapa de calor, gravação de sessões e análise de cliques. Veja exatamente como os usuários navegam."
          href={CLARITY_URL}
          badge="Gratuito"
          color="#E8611A"
          metrics={[
            "Mapa de calor",
            "Gravação de sessões",
            "Análise de cliques",
            "Scroll tracking",
            "Rage clicks",
            "Dead clicks",
          ]}
        />

        <ToolCard
          icon={<Gauge size={22} />}
          title="Speed Insights"
          description="Core Web Vitals do Google: LCP, FID, CLS. Monitora a performance real do site para SEO."
          href={VERCEL_URL.replace("/analytics", "/speed-insights")}
          badge="Ativo"
          color="#059669"
          metrics={[
            "LCP (carregamento)",
            "FID (interatividade)",
            "CLS (estabilidade)",
            "Score por página",
            "Histórico",
            "Por dispositivo",
          ]}
        />
      </div>

      {/* GA4 setup guide */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#E37400" + "18" }}>
            <TrendingUp size={16} style={{ color: "#E37400" }} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">Configurar Google Analytics 4 (rastreamento de conversões)</h2>
            <p className="text-xs text-gray-400">Integra com Search Console · rastreia leads do chat e formulário</p>
          </div>
        </div>
        <div className="space-y-5">
          <SetupStep
            n="1"
            title="Criar propriedade no GA4"
            description={<>Acesse <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="text-[#4F3DB5] underline">analytics.google.com</a> → clique em &quot;Criar propriedade&quot; → preencha nome &quot;ORDO Site&quot; → URL: ordoautomacao.com.br → crie.</>}
          />
          <SetupStep
            n="2"
            title="Copiar o ID de medição"
            description='Na propriedade criada, vá em Administrador → Fluxos de dados → clique no fluxo → copie o ID de medição (formato G-XXXXXXXXXX).'
          />
          <SetupStep
            n="3"
            title="Adicionar no Vercel"
            description={<>No painel do Vercel → Settings → Environment Variables → adicione:<br /><code className="text-xs bg-gray-100 px-2 py-0.5 rounded font-mono mt-1 inline-block">NEXT_PUBLIC_GA_ID = G-XXXXXXXXXX</code><br />Marque os ambientes Production, Preview e Development.</>}
          />
          <SetupStep
            n="4"
            title="Fazer redeploy"
            description="No Vercel → Deployments → clique nos 3 pontos do último deploy → Redeploy. O GA4 começa a rastrear após consentimento do usuário."
          />
          <SetupStep
            n="5"
            title="Marcar generate_lead como conversão"
            description='No GA4 → Administrador → Eventos → encontre "generate_lead" → ative o toggle "Marcar como conversão". Os dados aparecem em Relatórios → Conversões.'
          />
          <SetupStep
            n="6"
            title="Vincular ao Search Console (opcional mas recomendado)"
            description='No GA4 → Administrador → Vinculações de produtos → Search Console → vincule a propriedade ordoautomacao.com.br. Passa a mostrar quais termos de busca geram visitas e conversões.'
          />
        </div>
      </div>

      {/* Clarity setup guide */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#E8611A18" }}>
            <Flame size={16} style={{ color: "#E8611A" }} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">Ativar Microsoft Clarity (mapa de calor)</h2>
            <p className="text-xs text-gray-400">Leva 5 minutos · 100% gratuito · sem limite de dados</p>
          </div>
        </div>

        <div className="space-y-5">
          <SetupStep
            n="1"
            title="Criar conta no Microsoft Clarity"
            description={
              <>Acesse{" "}
                <a href="https://clarity.microsoft.com" target="_blank" rel="noopener noreferrer" className="text-[#4F3DB5] underline">
                  clarity.microsoft.com
                </a>{" "}e faça login com uma conta Microsoft (pode ser Outlook ou conta criada gratuitamente).
              </>
            }
          />
          <SetupStep
            n="2"
            title="Criar novo projeto"
            description='Clique em "New project" → nome: "ORDO Site" → URL: ordoautomacao.com.br → Create.'
          />
          <SetupStep
            n="3"
            title="Copiar o ID do projeto"
            description='Na tela de instalação, o Clarity mostrará um código JavaScript. Copie apenas o ID — é a string curta como "abc123xyz" no meio do script.'
          />
          <SetupStep
            n="4"
            title="Adicionar no Vercel"
            description={
              <>No painel do Vercel → Settings → Environment Variables → adicione:<br />
                <code className="text-xs bg-gray-100 px-2 py-0.5 rounded font-mono mt-1 inline-block">
                  NEXT_PUBLIC_CLARITY_ID = seu_id_aqui
                </code>
              </>
            }
          />
          <SetupStep
            n="5"
            title="Fazer redeploy"
            description="No Vercel → Deployments → clique nos 3 pontos do último deploy → Redeploy. O Clarity começará a coletar dados em minutos."
          />
        </div>
      </div>

      {/* Vercel Analytics activation */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#4F3DB518" }}>
            <Globe size={16} style={{ color: "#4F3DB5" }} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">Ativar Vercel Analytics (se ainda não estiver ativo)</h2>
            <p className="text-xs text-gray-400">Necessário ativar no painel do Vercel</p>
          </div>
        </div>

        <div className="space-y-4">
          <SetupStep
            n="1"
            title="Acessar o painel do projeto"
            description={
              <>Acesse{" "}
                <a href="https://vercel.com/patiacomunicacao/ordo-site" target="_blank" rel="noopener noreferrer" className="text-[#4F3DB5] underline">
                  vercel.com/patiacomunicacao/ordo-site
                </a>.
              </>
            }
          />
          <SetupStep
            n="2"
            title="Ativar Analytics"
            description='Clique na aba "Analytics" → clique em "Enable" → confirme. O plano gratuito inclui 2.500 eventos/mês.'
          />
          <SetupStep
            n="3"
            title="Pronto"
            description="Os dados aparecem automaticamente após o próximo deploy. O código já está no site."
          />
        </div>
      </div>
    </div>
  );
}
