"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Mail, Phone, MapPin, Clock, Share2 } from "lucide-react";
import type { SiteConfig } from "@/lib/site-config";

// ─── UI helpers ───────────────────────────────────────────────────────────────

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
  hint,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  hint?: string;
}) {
  return (
    <div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4F3DB5] focus:border-transparent"
      />
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
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
      <div className="p-6 space-y-4">{children}</div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ConfiguracoesPage() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchConfig = useCallback(async () => {
    const res = await fetch("/api/admin/site-config");
    if (res.ok) setConfig(await res.json() as SiteConfig);
  }, []);

  useEffect(() => { void fetchConfig(); }, [fetchConfig]);

  async function handleSave() {
    if (!config) return;
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/admin/site-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  }

  function set<K extends keyof SiteConfig>(key: K, value: string) {
    if (!config) return;
    setConfig({ ...config, [key]: value });
  }

  if (!config) {
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
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors">
              <ArrowLeft size={16} />
            </Link>
            <div>
              <p className="text-sm font-semibold text-gray-900">Configurações do Site</p>
              <p className="text-xs text-gray-400">Contato, redes sociais e informações gerais</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold disabled:opacity-60 transition-opacity hover:opacity-90"
            style={{ backgroundColor: saved ? "#059669" : "#4F3DB5" }}
          >
            <Save size={14} />
            {saving ? "Salvando…" : saved ? "Salvo!" : "Salvar"}
          </button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Contato */}
        <SectionCard
          icon={<Phone size={16} />}
          title="Contato"
          subtitle="Aparece no rodapé, na seção de contato e no chat da IA"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>E-mail</Label>
              <Input
                value={config.email}
                onChange={(v) => set("email", v)}
                placeholder="contato@empresa.com.br"
                type="email"
              />
            </div>
            <div>
              <Label>Telefone (exibição)</Label>
              <Input
                value={config.phone}
                onChange={(v) => set("phone", v)}
                placeholder="(41) 99999-0000"
              />
            </div>
            <div>
              <Label>WhatsApp (número)</Label>
              <Input
                value={config.whatsapp}
                onChange={(v) => set("whatsapp", v)}
                placeholder="5541999990000"
                hint="Somente números com DDI+DDD. Ex: 5541999990000"
              />
            </div>
            <div>
              <Label>Horário de atendimento</Label>
              <Input
                value={config.businessHours}
                onChange={(v) => set("businessHours", v)}
                placeholder="Seg–Sex, 8h às 18h"
              />
            </div>
          </div>
        </SectionCard>

        {/* Localização */}
        <SectionCard
          icon={<MapPin size={16} />}
          title="Localização"
          subtitle="Endereço exibido no site"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Endereço curto</Label>
              <Input
                value={config.address}
                onChange={(v) => set("address", v)}
                placeholder="São José dos Pinhais / PR"
                hint="Usado na seção de contato"
              />
            </div>
            <div>
              <Label>Endereço completo</Label>
              <Input
                value={config.addressFull}
                onChange={(v) => set("addressFull", v)}
                placeholder="São José dos Pinhais · Curitiba e região"
                hint="Usado no rodapé"
              />
            </div>
          </div>
        </SectionCard>

        {/* Redes sociais */}
        <SectionCard
          icon={<Share2 size={16} />}
          title="Redes Sociais"
          subtitle="Links exibidos no rodapé"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>LinkedIn</Label>
              <Input
                value={config.linkedin}
                onChange={(v) => set("linkedin", v)}
                placeholder="https://linkedin.com/company/..."
              />
            </div>
            <div>
              <Label>Instagram</Label>
              <Input
                value={config.instagram}
                onChange={(v) => set("instagram", v)}
                placeholder="https://instagram.com/..."
              />
            </div>
          </div>
        </SectionCard>

        {/* Info */}
        <div className="flex items-start gap-2 text-xs text-gray-400 bg-white border border-gray-100 rounded-xl px-4 py-3">
          <Mail size={13} className="mt-0.5 flex-shrink-0" />
          <p>
            O e-mail de <strong className="text-gray-600">envio dos formulários</strong> é configurado
            separadamente nas variáveis de ambiente (<code className="bg-gray-100 px-1 rounded">GMAIL_USER</code>).
            O campo acima é apenas o e-mail de <strong className="text-gray-600">exibição</strong> no site.
          </p>
        </div>
      </div>
    </div>
  );
}
