"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Trash2,
  Send,
  Flame,
  Thermometer,
  Snowflake,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from "lucide-react";
import type { Lead, LeadTemperature } from "@/lib/leads";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const TEMP_CONFIG: Record<
  LeadTemperature,
  { label: string; icon: React.ReactNode; bg: string; text: string; border: string }
> = {
  hot: {
    label: "Quente",
    icon: <Flame size={12} />,
    bg: "bg-red-50",
    text: "text-red-600",
    border: "border-red-200",
  },
  warm: {
    label: "Morno",
    icon: <Thermometer size={12} />,
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-200",
  },
  cold: {
    label: "Frio",
    icon: <Snowflake size={12} />,
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-200",
  },
};

function TempBadge({ temp }: { temp: LeadTemperature }) {
  const cfg = TEMP_CONFIG[temp];
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

// ─── Lead row with expandable conversation ────────────────────────────────────

function LeadRow({
  lead,
  onDelete,
  onResend,
}: {
  lead: Lead;
  onDelete: (id: string) => void;
  onResend: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [resending, setResending] = useState(false);

  async function handleResend() {
    setResending(true);
    await onResend(lead.id);
    setResending(false);
  }

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors">
        {/* Name */}
        <td className="px-5 py-4">
          <p className="text-sm font-semibold text-gray-900">{lead.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">{lead.serviceInterest ?? "—"}</p>
        </td>

        {/* Contact */}
        <td className="px-5 py-4 hidden sm:table-cell">
          <div className="flex flex-col gap-0.5">
            {lead.phone && (
              <span className="flex items-center gap-1 text-xs text-gray-600">
                <Phone size={11} className="text-gray-400" />
                {lead.phone}
              </span>
            )}
            {lead.email && (
              <span className="flex items-center gap-1 text-xs text-gray-600">
                <Mail size={11} className="text-gray-400" />
                {lead.email}
              </span>
            )}
            {!lead.phone && !lead.email && (
              <span className="text-xs text-gray-300">—</span>
            )}
          </div>
        </td>

        {/* Temperature */}
        <td className="px-5 py-4">
          <TempBadge temp={lead.temperature} />
        </td>

        {/* Summary */}
        <td className="px-5 py-4 hidden lg:table-cell max-w-xs">
          <p className="text-xs text-gray-500 leading-snug line-clamp-2">
            {lead.summary}
          </p>
        </td>

        {/* Date */}
        <td className="px-5 py-4 hidden md:table-cell">
          <p className="text-xs text-gray-500">{formatDate(lead.createdAt)}</p>
          {lead.webhookSent && (
            <span className="text-[10px] text-emerald-500 font-medium">✓ Enviado</span>
          )}
          {!lead.webhookSent && (
            <span className="text-[10px] text-gray-300 font-medium">Não enviado</span>
          )}
        </td>

        {/* Actions */}
        <td className="px-5 py-4">
          <div className="flex items-center gap-1 justify-end">
            <button
              onClick={() => setExpanded((v) => !v)}
              className="p-1.5 text-gray-400 hover:text-gray-700 rounded transition-colors"
              title="Ver conversa"
            >
              {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
            <button
              onClick={handleResend}
              disabled={resending}
              className="p-1.5 text-gray-400 hover:text-[#4F3DB5] rounded transition-colors disabled:opacity-40"
              title="Reenviar ao webhook"
            >
              <RefreshCw size={15} className={resending ? "animate-spin" : ""} />
            </button>
            <button
              onClick={() => onDelete(lead.id)}
              className="p-1.5 text-gray-400 hover:text-red-500 rounded transition-colors"
              title="Excluir lead"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </td>
      </tr>

      {/* Expandable conversation */}
      {expanded && (
        <tr>
          <td colSpan={6} className="px-5 pb-4 bg-gray-50">
            <div className="border border-gray-100 rounded-xl bg-white p-4 max-h-72 overflow-y-auto space-y-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Conversa
              </p>
              {lead.messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                    style={
                      msg.role === "user"
                        ? { backgroundColor: "#4F3DB5" }
                        : undefined
                    }
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | LeadTemperature>("all");

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/leads");
      if (res.ok) setLeads((await res.json()) as Lead[]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchLeads();
  }, [fetchLeads]);

  async function handleDelete(id: string) {
    if (!confirm("Excluir este lead?")) return;
    const res = await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
    if (res.ok) setLeads((prev) => prev.filter((l) => l.id !== id));
  }

  async function handleResend(id: string) {
    const res = await fetch(`/api/admin/leads/${id}`, { method: "POST" });
    if (res.ok) {
      setLeads((prev) =>
        prev.map((l) =>
          l.id === id
            ? { ...l, webhookSent: true, webhookSentAt: new Date().toISOString() }
            : l
        )
      );
    } else {
      alert("Falha ao reenviar. Verifique se o webhook está configurado na página de IA.");
    }
  }

  const filtered =
    filter === "all" ? leads : leads.filter((l) => l.temperature === filter);

  const counts = {
    all: leads.length,
    hot: leads.filter((l) => l.temperature === "hot").length,
    warm: leads.filter((l) => l.temperature === "warm").length,
    cold: leads.filter((l) => l.temperature === "cold").length,
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-3">
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
              Leads do Chat
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {counts.all} lead{counts.all !== 1 ? "s" : ""} captado
              {counts.all !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <Link
          href="/admin/ia"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors"
        >
          <Send size={13} />
          Configurar webhook
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(["all", "hot", "warm", "cold"] as const).map((t) => {
          const cfg = t === "all" ? null : TEMP_CONFIG[t];
          const active = filter === t;
          return (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                active
                  ? "border-[#4F3DB5] bg-[#EEEDFE] text-[#4F3DB5]"
                  : "border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}
            >
              {cfg ? cfg.icon : null}
              {t === "all" ? "Todos" : cfg?.label} ({counts[t]})
            </button>
          );
        })}
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-gray-400 text-sm py-8 text-center">Carregando…</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-400 mb-2">Nenhum lead ainda.</p>
          <p className="text-xs text-gray-300">
            Os leads aparecem aqui quando visitantes compartilham o contato pelo chat.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                  Contato
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Temperatura
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                  Resumo
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">
                  Data
                </th>
                <th className="px-5 py-3 w-28" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((lead) => (
                <LeadRow
                  key={lead.id}
                  lead={lead}
                  onDelete={handleDelete}
                  onResend={handleResend}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
