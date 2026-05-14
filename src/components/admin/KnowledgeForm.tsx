"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Trash2,
  Save,
  Eye,
  EyeOff,
  ArrowLeft,
  Building2,
  Wrench,
  HelpCircle,
  Bot,
  Webhook,
} from "lucide-react";
import Link from "next/link";
import type { KnowledgeBase, KbService, KbFaq } from "@/lib/knowledge";

// ─── Small UI helpers ─────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
      {children}
    </label>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4F3DB5] focus:border-transparent"
    />
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4F3DB5] focus:border-transparent resize-none"
    />
  );
}

function SectionCard({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: "#EEEDFE" }}
        >
          <span style={{ color: "#4F3DB5" }}>{icon}</span>
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// ─── Services list ────────────────────────────────────────────────────────────

function ServiceEditor({
  services,
  onChange,
}: {
  services: KbService[];
  onChange: (s: KbService[]) => void;
}) {
  function update(id: string, field: keyof KbService, value: string) {
    onChange(services.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  }
  function remove(id: string) {
    onChange(services.filter((s) => s.id !== id));
  }
  function add() {
    onChange([
      ...services,
      { id: crypto.randomUUID(), name: "", description: "", startingPrice: "", highlights: "" },
    ]);
  }

  return (
    <div className="space-y-4">
      {services.map((s, i) => (
        <div key={s.id} className="border border-gray-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
              Serviço {i + 1}
            </span>
            <button
              type="button"
              onClick={() => remove(s.id)}
              className="p-1 text-gray-300 hover:text-red-400 transition-colors"
              title="Remover"
            >
              <Trash2 size={14} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label>Nome do serviço</Label>
              <Input
                value={s.name}
                onChange={(v) => update(s.id, "name", v)}
                placeholder="Ex: Automação de Processos"
              />
            </div>
            <div>
              <Label>Preço inicial</Label>
              <Input
                value={s.startingPrice}
                onChange={(v) => update(s.id, "startingPrice", v)}
                placeholder="Ex: R$ 4.000"
              />
            </div>
          </div>
          <div>
            <Label>Descrição curta</Label>
            <Input
              value={s.description}
              onChange={(v) => update(s.id, "description", v)}
              placeholder="O que a empresa entrega com esse serviço"
            />
          </div>
          <div>
            <Label>Destaques / benefícios</Label>
            <Input
              value={s.highlights}
              onChange={(v) => update(s.id, "highlights", v)}
              placeholder="Ex: ROI mensurável, entrega em 4 semanas, suporte incluso"
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="w-full py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-[#4F3DB5] hover:text-[#4F3DB5] transition-colors flex items-center justify-center gap-2"
      >
        <Plus size={14} />
        Adicionar serviço
      </button>
    </div>
  );
}

// ─── FAQ list ─────────────────────────────────────────────────────────────────

function FaqEditor({
  faqs,
  onChange,
}: {
  faqs: KbFaq[];
  onChange: (f: KbFaq[]) => void;
}) {
  function update(id: string, field: keyof KbFaq, value: string) {
    onChange(faqs.map((f) => (f.id === id ? { ...f, [field]: value } : f)));
  }
  function remove(id: string) {
    onChange(faqs.filter((f) => f.id !== id));
  }
  function add() {
    onChange([...faqs, { id: crypto.randomUUID(), question: "", answer: "" }]);
  }

  return (
    <div className="space-y-4">
      {faqs.map((f, i) => (
        <div key={f.id} className="border border-gray-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
              Pergunta {i + 1}
            </span>
            <button
              type="button"
              onClick={() => remove(f.id)}
              className="p-1 text-gray-300 hover:text-red-400 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
          <div>
            <Label>Pergunta</Label>
            <Input
              value={f.question}
              onChange={(v) => update(f.id, "question", v)}
              placeholder="Ex: Quanto tempo leva um projeto?"
            />
          </div>
          <div>
            <Label>Resposta</Label>
            <Textarea
              value={f.answer}
              onChange={(v) => update(f.id, "answer", v)}
              placeholder="Resposta que a IA deve dar quando essa pergunta surgir"
              rows={2}
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="w-full py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-[#4F3DB5] hover:text-[#4F3DB5] transition-colors flex items-center justify-center gap-2"
      >
        <Plus size={14} />
        Adicionar pergunta
      </button>
    </div>
  );
}

// ─── Prompt preview ───────────────────────────────────────────────────────────

function PromptPreview({ prompt }: { prompt: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
        style={{ color: "#4F3DB5" }}
      >
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
        {show ? "Ocultar prompt gerado" : "Visualizar prompt gerado"}
      </button>
      {show && (
        <pre className="bg-gray-900 text-gray-100 text-xs rounded-xl p-5 overflow-auto whitespace-pre-wrap leading-relaxed max-h-96">
          {prompt}
        </pre>
      )}
    </div>
  );
}

// ─── Main form ────────────────────────────────────────────────────────────────

export default function KnowledgeForm() {
  const [kb, setKb] = useState<KnowledgeBase | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [preview, setPreview] = useState("");

  const fetchKb = useCallback(async () => {
    const res = await fetch("/api/admin/knowledge");
    if (res.ok) setKb((await res.json()) as KnowledgeBase);
  }, []);

  useEffect(() => {
    void fetchKb();
  }, [fetchKb]);

  // Rebuild preview whenever kb changes
  useEffect(() => {
    if (!kb) return;
    void fetch("/api/admin/knowledge/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(kb),
    })
      .then((r) => r.json())
      .then((d: { prompt: string }) => setPreview(d.prompt))
      .catch(() => null);
  }, [kb]);

  async function handleSave() {
    if (!kb) return;
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/admin/knowledge", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(kb),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  }

  function setCompany(field: keyof KnowledgeBase["company"], value: string) {
    if (!kb) return;
    setKb({ ...kb, company: { ...kb.company, [field]: value } });
  }

  function setBehavior(field: keyof KnowledgeBase["behavior"], value: string) {
    if (!kb) return;
    setKb({ ...kb, behavior: { ...kb.behavior, [field]: value } });
  }

  function setIntegrations(field: keyof KnowledgeBase["integrations"], value: string) {
    if (!kb) return;
    setKb({ ...kb, integrations: { ...(kb.integrations ?? { clickupWebhookUrl: "" }), [field]: value } });
  }

  if (!kb) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-400">Carregando…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <p className="text-sm font-semibold text-gray-900">Base de Conhecimento da IA</p>
              <p className="text-xs text-gray-400">Configurações do assistente de chat</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold disabled:opacity-60 transition-opacity hover:opacity-90"
            style={{ backgroundColor: saved ? "#059669" : "#4F3DB5" }}
          >
            <Save size={14} />
            {saving ? "Salvando…" : saved ? "Salvo!" : "Salvar alterações"}
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Company */}
        <SectionCard
          icon={<Building2 size={16} />}
          title="Informações da Empresa"
          subtitle="Dados que a IA usa para se apresentar e fornecer contato"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Nome da empresa</Label>
              <Input
                value={kb.company.name}
                onChange={(v) => setCompany("name", v)}
                placeholder="ORDO Consultoria"
              />
            </div>
            <div>
              <Label>Localização</Label>
              <Input
                value={kb.company.location}
                onChange={(v) => setCompany("location", v)}
                placeholder="Curitiba / São José dos Pinhais, PR"
              />
            </div>
            <div className="sm:col-span-2">
              <Label>Descrição (o que a empresa faz)</Label>
              <Textarea
                value={kb.company.description}
                onChange={(v) => setCompany("description", v)}
                placeholder="especializada em mapeamento de processos, automação e IA para PMEs"
                rows={2}
              />
            </div>
            <div>
              <Label>E-mail de contato</Label>
              <Input
                value={kb.company.email}
                onChange={(v) => setCompany("email", v)}
                placeholder="contato@empresa.com.br"
                type="email"
              />
            </div>
            <div>
              <Label>WhatsApp</Label>
              <Input
                value={kb.company.whatsapp}
                onChange={(v) => setCompany("whatsapp", v)}
                placeholder="(41) 99999-0000"
              />
            </div>
          </div>
        </SectionCard>

        {/* Services */}
        <SectionCard
          icon={<Wrench size={16} />}
          title="Serviços"
          subtitle="A IA usa esses dados para recomendar o serviço certo para cada visitante"
        >
          <ServiceEditor
            services={kb.services}
            onChange={(s) => setKb({ ...kb, services: s })}
          />
        </SectionCard>

        {/* FAQs */}
        <SectionCard
          icon={<HelpCircle size={16} />}
          title="Perguntas Frequentes"
          subtitle="A IA responderá essas perguntas com as respostas que você definir aqui"
        >
          <FaqEditor
            faqs={kb.faqs}
            onChange={(f) => setKb({ ...kb, faqs: f })}
          />
        </SectionCard>

        {/* Behavior */}
        <SectionCard
          icon={<Bot size={16} />}
          title="Comportamento da IA"
          subtitle="Tom de voz, objetivo e restrições"
        >
          <div className="space-y-4">
            <div>
              <Label>Tom de voz</Label>
              <Input
                value={kb.behavior.tone}
                onChange={(v) => setBehavior("tone", v)}
                placeholder="Ex: cordial, direto e profissional"
              />
            </div>
            <div>
              <Label>Objetivo principal</Label>
              <Textarea
                value={kb.behavior.mainGoal}
                onChange={(v) => setBehavior("mainGoal", v)}
                placeholder="O que a IA deve tentar alcançar em cada conversa?"
                rows={2}
              />
            </div>
            <div>
              <Label>Restrições (o que a IA NÃO deve fazer)</Label>
              <Textarea
                value={kb.behavior.restrictions}
                onChange={(v) => setBehavior("restrictions", v)}
                placeholder="Ex: Não inventar dados, não prometer resultados específicos, não falar mal de concorrentes"
                rows={2}
              />
            </div>
            <div>
              <Label>Instruções adicionais (livre)</Label>
              <Textarea
                value={kb.behavior.customInstructions}
                onChange={(v) => setBehavior("customInstructions", v)}
                placeholder="Qualquer instrução extra que não se encaixe nos campos acima. Ex: Se o visitante perguntar sobre determinado assunto, redirecione para..."
                rows={4}
              />
            </div>
          </div>
        </SectionCard>

        {/* Integrations */}
        <SectionCard
          icon={<Webhook size={16} />}
          title="Integrações"
          subtitle="Envie leads automaticamente para o ClickUp, Make, Zapier ou qualquer webhook"
        >
          <div>
            <Label>URL do Webhook (ClickUp / Make / Zapier)</Label>
            <Input
              value={kb.integrations?.clickupWebhookUrl ?? ""}
              onChange={(v) => setIntegrations("clickupWebhookUrl", v)}
              placeholder="https://hooks.zapier.com/... ou https://hook.eu1.make.com/..."
            />
            <p className="text-xs text-gray-400 mt-1.5">
              Quando um lead for capturado pelo chat, os dados (nome, telefone, e-mail, resumo e temperatura) serão enviados via POST para este endereço. Deixe em branco para desativar.
            </p>
          </div>
        </SectionCard>

        {/* Prompt preview */}
        <SectionCard
          icon={<Eye size={16} />}
          title="Preview do Prompt"
          subtitle="Visualize exatamente o que a IA recebe antes de cada conversa"
        >
          <PromptPreview prompt={preview} />
        </SectionCard>
      </div>
    </div>
  );
}
