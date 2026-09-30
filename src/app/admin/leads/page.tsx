"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
  Download,
  Search,
  MessageSquare,
  FileText,
  Building2,
} from "lucide-react";
import type { Lead, LeadSource, LeadStatus, LeadTemperature } from "@/lib/leads";

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

/** Link wa.me a partir do telefone digitado (assume Brasil quando falta o DDI). */
function whatsappLink(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10) return null;
  const full = digits.length <= 11 ? `55${digits}` : digits;
  return `https://wa.me/${full}`;
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

const STATUS_CONFIG: Record<LeadStatus, { label: string; className: string }> = {
  new: { label: "Novo", className: "bg-violet-50 text-violet-700 border-violet-200" },
  contacted: { label: "Em contato", className: "bg-sky-50 text-sky-700 border-sky-200" },
  meeting: { label: "Reunião", className: "bg-amber-50 text-amber-700 border-amber-200" },
  proposal: { label: "Proposta", className: "bg-orange-50 text-orange-700 border-orange-200" },
  won: { label: "Ganho", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  lost: { label: "Perdido", className: "bg-gray-100 text-gray-500 border-gray-200" },
};

const STATUS_ORDER = Object.keys(STATUS_CONFIG) as LeadStatus[];

const SOURCE_CONFIG: Record<LeadSource, { label: string; icon: React.ReactNode }> = {
  chat: { label: "Chat", icon: <MessageSquare size={11} /> },
  form: { label: "Formulário", icon: <FileText size={11} /> },
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

function SourceBadge({ source }: { source: LeadSource }) {
  const cfg = SOURCE_CONFIG[source];
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-500">
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

// ─── CSV export ───────────────────────────────────────────────────────────────

function csvCell(value: string): string {
  return `"${value.replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;
}

function downloadCsv(leads: Lead[]) {
  const header = [
    "Data",
    "Origem",
    "Status",
    "Nome",
    "Empresa",
    "E-mail",
    "Telefone",
    "Serviço",
    "Temperatura",
    "Resumo / mensagem",
    "Anotações",
  ];
  const rows = leads.map((l) => [
    new Date(l.createdAt).toLocaleString("pt-BR"),
    SOURCE_CONFIG[l.source].label,
    STATUS_CONFIG[l.status].label,
    l.name,
    l.company ?? "",
    l.email ?? "",
    l.phone ?? "",
    l.serviceInterest ?? "",
    TEMP_CONFIG[l.temperature].label,
    l.summary,
    l.notes,
  ]);
  // ";" e BOM para o Excel em português abrir com acentos e colunas corretas.
  const csv = "﻿" + [header, ...rows].map((r) => r.map(csvCell).join(";")).join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `leads-ordo-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Notes editor ─────────────────────────────────────────────────────────────

function NotesEditor({
  lead,
  onSave,
}: {
  lead: Lead;
  onSave: (id: string, notes: string) => Promise<boolean>;
}) {
  const [notes, setNotes] = useState(lead.notes);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const dirty = notes !== lead.notes;

  async function save() {
    setState("saving");
    const ok = await onSave(lead.id, notes);
    setState(ok ? "saved" : "error");
  }

  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
        Anotações
      </p>
      <textarea
        value={notes}
        onChange={(e) => {
          setNotes(e.target.value);
          setState("idle");
        }}
        rows={6}
        placeholder="Ex.: Liguei em 30/09, pediu proposta para automação do financeiro…"
        className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5B2A86]/30 focus:border-[#5B2A86] resize-y"
      />
      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={!dirty || state === "saving"}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-40 transition-opacity"
          style={{ backgroundColor: "#5B2A86" }}
        >
          {state === "saving" ? "Salvando…" : "Salvar anotações"}
        </button>
        {state === "saved" && !dirty && (
          <span className="text-xs text-emerald-600">Salvo</span>
        )}
        {state === "error" && (
          <span className="text-xs text-red-600">Erro ao salvar</span>
        )}
      </div>
    </div>
  );
}

// ─── Lead row ─────────────────────────────────────────────────────────────────

function LeadRow({
  lead,
  onDelete,
  onResend,
  onUpdate,
}: {
  lead: Lead;
  onDelete: (id: string) => void;
  onResend: (id: string) => Promise<void>;
  onUpdate: (id: string, data: { status?: LeadStatus; notes?: string }) => Promise<boolean>;
}) {
  const [expanded, setExpanded] = useState(false);
  const [resending, setResending] = useState(false);
  const wa = lead.phone ? whatsappLink(lead.phone) : null;

  async function handleResend() {
    setResending(true);
    await onResend(lead.id);
    setResending(false);
  }

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors align-top">
        {/* Name */}
        <td className="px-5 py-4">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="text-left"
          >
            <p className="text-sm font-semibold text-gray-900 hover:text-[#5B2A86]">
              {lead.name}
            </p>
          </button>
          {lead.company && (
            <p className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
              <Building2 size={11} className="text-gray-400" />
              {lead.company}
            </p>
          )}
          <p className="text-xs text-gray-400 mt-0.5">{lead.serviceInterest ?? "—"}</p>
        </td>

        {/* Contact */}
        <td className="px-5 py-4 hidden sm:table-cell">
          <div className="flex flex-col gap-0.5">
            {lead.phone && (
              <a
                href={wa ?? `tel:${lead.phone}`}
                target={wa ? "_blank" : undefined}
                rel={wa ? "noopener noreferrer" : undefined}
                className="flex items-center gap-1 text-xs text-gray-600 hover:text-[#5B2A86]"
              >
                <Phone size={11} className="text-gray-400" />
                {lead.phone}
              </a>
            )}
            {lead.email && (
              <a
                href={`mailto:${lead.email}`}
                className="flex items-center gap-1 text-xs text-gray-600 hover:text-[#5B2A86]"
              >
                <Mail size={11} className="text-gray-400" />
                {lead.email}
              </a>
            )}
            {!lead.phone && !lead.email && (
              <span className="text-xs text-gray-300">—</span>
            )}
          </div>
        </td>

        {/* Source + temperature */}
        <td className="px-5 py-4 hidden sm:table-cell">
          <div className="flex flex-col items-start gap-1.5">
            <SourceBadge source={lead.source} />
            <TempBadge temp={lead.temperature} />
          </div>
        </td>

        {/* Status */}
        <td className="px-5 py-4">
          <select
            value={lead.status}
            onChange={(e) => void onUpdate(lead.id, { status: e.target.value as LeadStatus })}
            aria-label={`Status de ${lead.name}`}
            className={`text-xs font-semibold rounded-full border px-2.5 py-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#5B2A86]/30 ${STATUS_CONFIG[lead.status].className}`}
          >
            {STATUS_ORDER.map((s) => (
              <option key={s} value={s}>
                {STATUS_CONFIG[s].label}
              </option>
            ))}
          </select>
          {lead.notes && (
            <p className="mt-1 text-[10px] text-gray-400">com anotações</p>
          )}
        </td>

        {/* Date */}
        <td className="px-5 py-4 hidden md:table-cell">
          <p className="text-xs text-gray-500">{formatDate(lead.createdAt)}</p>
          {lead.webhookSent ? (
            <span className="text-[10px] text-emerald-500 font-medium">✓ Enviado</span>
          ) : (
            <span className="text-[10px] text-gray-300 font-medium">Não enviado</span>
          )}
        </td>

        {/* Actions */}
        <td className="px-5 py-4">
          <div className="flex items-center gap-1 justify-end">
            <button
              onClick={() => setExpanded((v) => !v)}
              className="p-1.5 text-gray-400 hover:text-gray-700 rounded transition-colors"
              title={expanded ? "Recolher" : "Ver detalhes e anotações"}
            >
              {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
            <button
              onClick={handleResend}
              disabled={resending}
              className="p-1.5 text-gray-400 hover:text-[#5B2A86] rounded transition-colors disabled:opacity-40"
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

      {/* Details */}
      {expanded && (
        <tr>
          <td colSpan={6} className="px-5 pb-5 bg-gray-50">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-1">
              <div className="border border-gray-100 rounded-xl bg-white p-4">
                {/* No celular a coluna de contato fica oculta: mostra aqui. */}
                {(lead.phone || lead.email) && (
                  <div className="sm:hidden flex flex-wrap gap-2 mb-4">
                    {lead.phone && (
                      <a
                        href={wa ?? `tel:${lead.phone}`}
                        target={wa ? "_blank" : undefined}
                        rel={wa ? "noopener noreferrer" : undefined}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5B2A86] border border-[#5B2A86]/30 rounded-lg px-3 py-1.5"
                      >
                        <Phone size={12} />
                        {lead.phone}
                      </a>
                    )}
                    {lead.email && (
                      <a
                        href={`mailto:${lead.email}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5B2A86] border border-[#5B2A86]/30 rounded-lg px-3 py-1.5"
                      >
                        <Mail size={12} />
                        {lead.email}
                      </a>
                    )}
                  </div>
                )}
                <NotesEditor lead={lead} onSave={(id, notes) => onUpdate(id, { notes })} />
              </div>

              <div className="border border-gray-100 rounded-xl bg-white p-4 max-h-80 overflow-y-auto">
                {lead.source === "form" ? (
                  <>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Mensagem do formulário
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {lead.summary || "Sem mensagem."}
                    </p>
                  </>
                ) : (
                  <>
                    {lead.summary && (
                      <>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                          Resumo da IA
                        </p>
                        <p className="text-sm text-gray-700 leading-relaxed mb-4">
                          {lead.summary}
                        </p>
                      </>
                    )}
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      Conversa
                    </p>
                    <div className="space-y-2">
                      {lead.messages.map((msg, i) => (
                        <div
                          key={i}
                          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                              msg.role === "user" ? "text-white" : "bg-gray-100 text-gray-700"
                            }`}
                            style={msg.role === "user" ? { backgroundColor: "#5B2A86" } : undefined}
                          >
                            {msg.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type StatusFilter = "all" | LeadStatus;

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sourceFilter, setSourceFilter] = useState<"all" | LeadSource>("all");
  const [tempFilter, setTempFilter] = useState<"all" | LeadTemperature>("all");
  const [query, setQuery] = useState("");

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

  async function handleUpdate(
    id: string,
    data: { status?: LeadStatus; notes?: string }
  ): Promise<boolean> {
    const previous = leads;
    // Atualização otimista: a troca de status aparece na hora.
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...data } : l)));
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      const updated = (await res.json()) as Lead;
      setLeads((prev) => prev.map((l) => (l.id === id ? updated : l)));
      return true;
    } catch {
      setLeads(previous);
      alert("Não foi possível salvar a alteração. Tente novamente.");
      return false;
    }
  }

  // Filtros de origem, temperatura e busca (as abas de status contam sobre este conjunto).
  const baseFiltered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((l) => {
      if (sourceFilter !== "all" && l.source !== sourceFilter) return false;
      if (tempFilter !== "all" && l.temperature !== tempFilter) return false;
      if (!q) return true;
      return [l.name, l.company, l.email, l.phone, l.serviceInterest, l.summary, l.notes]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(q));
    });
  }, [leads, sourceFilter, tempFilter, query]);

  const filtered =
    statusFilter === "all"
      ? baseFiltered
      : baseFiltered.filter((l) => l.status === statusFilter);

  const statusCounts = useMemo(() => {
    const counts = { all: baseFiltered.length } as Record<StatusFilter, number>;
    for (const s of STATUS_ORDER) counts[s] = baseFiltered.filter((l) => l.status === s).length;
    return counts;
  }, [baseFiltered]);

  const selectClass =
    "text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5B2A86]/30";

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
              Leads
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {leads.length} lead{leads.length !== 1 ? "s" : ""} do chat e do formulário
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => downloadCsv(filtered)}
            disabled={filtered.length === 0}
            className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors disabled:opacity-40"
          >
            <Download size={13} />
            Exportar CSV
          </button>
          <Link
            href="/admin/ia"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors"
          >
            <Send size={13} />
            Configurar webhook
          </Link>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {(["all", ...STATUS_ORDER] as StatusFilter[]).map((s) => {
          const active = statusFilter === s;
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                active
                  ? "border-[#5B2A86] bg-[#F3EEF9] text-[#5B2A86]"
                  : "border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}
            >
              {s === "all" ? "Todos" : STATUS_CONFIG[s].label} ({statusCounts[s]})
            </button>
          );
        })}
      </div>

      {/* Search + filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <label className="relative flex-1 min-w-[220px]">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome, empresa, e-mail, telefone ou anotação…"
            aria-label="Buscar leads"
            className="w-full text-sm border border-gray-200 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5B2A86]/30"
          />
        </label>
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value as "all" | LeadSource)}
          aria-label="Filtrar por origem"
          className={selectClass}
        >
          <option value="all">Todas as origens</option>
          <option value="chat">Chat</option>
          <option value="form">Formulário</option>
        </select>
        <select
          value={tempFilter}
          onChange={(e) => setTempFilter(e.target.value as "all" | LeadTemperature)}
          aria-label="Filtrar por temperatura"
          className={selectClass}
        >
          <option value="all">Todas as temperaturas</option>
          <option value="hot">Quente</option>
          <option value="warm">Morno</option>
          <option value="cold">Frio</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-gray-400 text-sm py-8 text-center">Carregando…</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          {leads.length === 0 ? (
            <>
              <p className="text-gray-400 mb-2">Nenhum lead ainda.</p>
              <p className="text-xs text-gray-300">
                Os leads aparecem aqui quando visitantes deixam o contato pelo chat ou pelo
                formulário do site.
              </p>
            </>
          ) : (
            <p className="text-gray-400">Nenhum lead encontrado com esses filtros.</p>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-x-auto">
          <table className="w-full sm:min-w-[720px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                  Contato
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                  Origem
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Status
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
                  onUpdate={handleUpdate}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
