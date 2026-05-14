"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { ArrowLeft, Save, Globe, ChevronDown, ChevronUp, Eye, X, Clock, Tag } from "lucide-react";
import Link from "next/link";
import ImageUpload from "@/components/admin/ImageUpload";
import type { DbPost } from "@/lib/db";

// TipTap needs to be client-only (no SSR)
const RichEditor = dynamic(() => import("@/components/admin/RichEditor"), {
  ssr: false,
  loading: () => (
    <div className="border border-gray-200 rounded-xl h-[480px] flex items-center justify-center bg-white">
      <span className="text-sm text-gray-400">Carregando editor…</span>
    </div>
  ),
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 96);
}

function calcReadingTime(html: string): number {
  const words = html.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

const TAGS = ["Processos", "Automação", "IA", "Gestão", "Treinamento", "Estratégia"];

// ─── Field component ──────────────────────────────────────────────────────────

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  maxLength,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  maxLength?: number;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4F3DB5] focus:border-transparent"
    />
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
  rows = 3,
  maxLength,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      maxLength={maxLength}
      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4F3DB5] focus:border-transparent resize-none"
    />
  );
}

// ─── Preview modal ────────────────────────────────────────────────────────────

function PreviewModal({
  form,
  onClose,
  onPublish,
  saving,
}: {
  form: FormState;
  onClose: () => void;
  onPublish: () => void;
  saving: boolean;
}) {
  const date = form.publishedAt
    ? new Date(form.publishedAt + "T12:00:00").toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-white"
      role="dialog"
      aria-modal="true"
      aria-label="Pré-visualização do post"
    >
      {/* Preview bar */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2">
          <Eye size={15} style={{ color: "#4F3DB5" }} />
          <span className="text-sm font-semibold text-gray-700">Pré-visualização</span>
          <span className="text-xs text-gray-400 hidden sm:inline">— como vai aparecer no site</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={14} />
            Fechar
          </button>
          <button
            type="button"
            onClick={onPublish}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-white text-sm font-semibold disabled:opacity-60 transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#4F3DB5" }}
          >
            <Globe size={14} />
            {saving ? "Publicando…" : "Publicar agora"}
          </button>
        </div>
      </div>

      {/* Scrollable preview area */}
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-14 pb-24">
          {/* Meta */}
          <div className="flex items-center gap-3 mb-4">
            {form.tag && (
              <span
                className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                style={{ backgroundColor: "#EEEDFE", color: "#4F3DB5" }}
              >
                <Tag size={10} />
                {form.tag}
              </span>
            )}
            {form.readingTime > 0 && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Clock size={11} />
                {form.readingTime} min de leitura
              </span>
            )}
          </div>

          {/* Title */}
          <h1
            className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {form.title || <span className="text-gray-300">Sem título</span>}
          </h1>

          {/* Summary */}
          {form.summary && (
            <p className="text-lg text-gray-500 leading-relaxed mb-4">{form.summary}</p>
          )}

          {/* Date & author */}
          <p className="text-sm text-gray-400 mb-8">
            {date}{form.author ? ` · ${form.author}` : ""}
          </p>

          {/* Cover image */}
          {form.coverImage && (
            <div className="rounded-2xl overflow-hidden mb-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.coverImage}
                alt={form.coverAlt || form.title}
                className="w-full max-h-[480px] object-cover"
              />
            </div>
          )}

          {!form.coverImage && <div className="h-px bg-gray-100 mb-10" />}

          {/* Content */}
          {form.content && form.content !== "<p></p>" ? (
            <article
              className="prose prose-gray prose-lg max-w-none
                prose-headings:font-extrabold prose-headings:text-gray-900
                prose-h1:text-3xl prose-h1:mt-10 prose-h1:mb-4
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-gray-600 prose-p:leading-relaxed
                prose-strong:text-gray-800
                prose-a:text-[#4F3DB5] prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: form.content }}
            />
          ) : (
            <p className="text-gray-300 italic text-sm">O conteúdo aparecerá aqui…</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── SEO panel (collapsible) ──────────────────────────────────────────────────

function SEOPanel({
  seoTitle,
  seoDescription,
  ogImage,
  onSeoTitle,
  onSeoDescription,
  onOgImage,
}: {
  seoTitle: string;
  seoDescription: string;
  ogImage: string;
  onSeoTitle: (v: string) => void;
  onSeoDescription: (v: string) => void;
  onOgImage: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-sm font-semibold text-gray-700"
      >
        <span className="flex items-center gap-2">
          <Globe size={14} style={{ color: "#4F3DB5" }} />
          SEO & Redes Sociais
        </span>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {open && (
        <div className="p-4 space-y-4 bg-white">
          <Field
            label="SEO Title"
            hint={`${seoTitle.length}/60 — deixe vazio para usar o título do post`}
          >
            <Input
              value={seoTitle}
              onChange={onSeoTitle}
              placeholder="Título para Google (opcional)"
              maxLength={60}
            />
          </Field>

          <Field
            label="Meta Description"
            hint={`${seoDescription.length}/160 — resumo exibido nos resultados de busca`}
          >
            <Textarea
              value={seoDescription}
              onChange={onSeoDescription}
              placeholder="Descrição para mecanismos de busca (opcional)"
              rows={2}
              maxLength={160}
            />
          </Field>

          <ImageUpload
            value={ogImage}
            onChange={onOgImage}
            label="OG Image (compartilhamento social)"
          />
        </div>
      )}
    </div>
  );
}

// ─── Main form ────────────────────────────────────────────────────────────────

type FormState = {
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string;
  coverAlt: string;
  tag: string;
  readingTime: number;
  status: "draft" | "published";
  publishedAt: string;
  seoTitle: string;
  seoDescription: string;
  ogImage: string;
  author: string;
};

function defaultState(): FormState {
  return {
    title: "",
    slug: "",
    summary: "",
    content: "",
    coverImage: "",
    coverAlt: "",
    tag: "",
    readingTime: 3,
    status: "draft",
    publishedAt: new Date().toISOString().slice(0, 10),
    seoTitle: "",
    seoDescription: "",
    ogImage: "",
    author: "ORDO",
  };
}

export default function PostForm({ post }: { post?: DbPost }) {
  const isEdit = !!post;
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [slugEdited, setSlugEdited] = useState(isEdit);
  const [showPreview, setShowPreview] = useState(false);

  const [form, setForm] = useState<FormState>(() => {
    if (!post) return defaultState();
    return {
      title: post.title,
      slug: post.slug,
      summary: post.summary,
      content: post.content,
      coverImage: post.coverImage,
      coverAlt: post.coverAlt,
      tag: post.tag,
      readingTime: post.readingTime,
      status: post.status,
      publishedAt: post.publishedAt
        ? post.publishedAt.slice(0, 10)
        : new Date().toISOString().slice(0, 10),
      seoTitle: post.seoTitle,
      seoDescription: post.seoDescription,
      ogImage: post.ogImage,
      author: post.author,
    };
  });

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // Auto-generate slug from title
  function handleTitleChange(value: string) {
    set("title", value);
    if (!slugEdited) {
      set("slug", slugify(value));
    }
  }

  // Auto-calculate reading time when content changes
  function handleContentChange(html: string) {
    set("content", html);
    set("readingTime", calcReadingTime(html));
  }

  // Validate slug uniqueness isn't checked here (server will return error)
  async function handleSave(targetStatus: "draft" | "published") {
    if (!form.title.trim()) {
      setError("O título é obrigatório.");
      return;
    }
    if (!form.slug.trim()) {
      setError("O slug é obrigatório.");
      return;
    }

    setError("");
    setSaving(true);

    const payload = {
      ...form,
      status: targetStatus,
      publishedAt:
        targetStatus === "published" && !form.publishedAt
          ? new Date().toISOString().slice(0, 10)
          : form.publishedAt || null,
    };

    try {
      const url = isEdit ? `/api/admin/posts/${post!.id}` : "/api/admin/posts";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? "Erro ao salvar.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Erro de conexão.");
    } finally {
      setSaving(false);
    }
  }

  // Keep doc title in sync
  useEffect(() => {
    document.title = form.title ? `${form.title} — Admin ORDO` : "Novo post — Admin ORDO";
  }, [form.title]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Preview modal */}
      {showPreview && (
        <PreviewModal
          form={form}
          onClose={() => setShowPreview(false)}
          onPublish={() => { void handleSave("published"); setShowPreview(false); }}
          saving={saving}
        />
      )}

      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/admin"
              className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors flex-shrink-0"
            >
              <ArrowLeft size={16} />
            </Link>
            <p className="text-sm font-medium text-gray-700 truncate">
              {form.title || (isEdit ? "Editar post" : "Novo post")}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {error && <p className="text-xs text-red-600 hidden sm:block">{error}</p>}
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Eye size={14} />
              <span className="hidden sm:inline">Preview</span>
            </button>
            <button
              type="button"
              onClick={() => handleSave("draft")}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60 transition-colors"
            >
              <Save size={14} />
              <span className="hidden sm:inline">Rascunho</span>
            </button>
            <button
              type="button"
              onClick={() => handleSave("published")}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-sm font-semibold disabled:opacity-60 transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#4F3DB5" }}
            >
              <Globe size={14} />
              {saving ? "Salvando…" : "Publicar"}
            </button>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && <p className="text-sm text-red-600 mb-4 sm:hidden">{error}</p>}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* ── Left: main content ── */}
          <div className="flex-1 min-w-0 space-y-5">
            {/* Title */}
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Título do post"
              className="w-full text-2xl font-bold text-gray-900 border-0 border-b-2 border-gray-100 focus:border-[#4F3DB5] focus:outline-none py-2 bg-transparent placeholder:text-gray-300 transition-colors"
              style={{ fontFamily: "var(--font-heading)" }}
            />

            {/* Slug */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 flex-shrink-0">/blog/</span>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => {
                  setSlugEdited(true);
                  set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
                }}
                placeholder="slug-do-post"
                className="flex-1 text-xs text-gray-500 border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#4F3DB5] font-mono"
              />
            </div>

            {/* Summary */}
            <Field label="Resumo / Excerpt">
              <Textarea
                value={form.summary}
                onChange={(v) => set("summary", v)}
                placeholder="Breve descrição exibida na listagem do blog…"
                rows={2}
              />
            </Field>

            {/* Rich Editor */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                Conteúdo
              </label>
              <RichEditor value={form.content} onChange={handleContentChange} />
            </div>
          </div>

          {/* ── Right: metadata sidebar ── */}
          <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0 space-y-5">
            {/* Publish settings */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
              <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Publicação
              </h3>

              {/* Status badge */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Status</span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    form.status === "published"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {form.status === "published" ? "Publicado" : "Rascunho"}
                </span>
              </div>

              {/* Date */}
              <Field label="Data de publicação">
                <Input
                  type="date"
                  value={form.publishedAt}
                  onChange={(v) => set("publishedAt", v)}
                />
              </Field>

              {/* Author */}
              <Field label="Autor">
                <Input
                  value={form.author}
                  onChange={(v) => set("author", v)}
                  placeholder="ORDO"
                />
              </Field>

              {/* Reading time (auto-calculated) */}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Tempo de leitura</span>
                <span className="font-medium">{form.readingTime} min</span>
              </div>
            </div>

            {/* Cover image */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
              <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Imagem de capa
              </h3>
              <ImageUpload
                value={form.coverImage}
                onChange={(url) => set("coverImage", url)}
              />
              {form.coverImage && (
                <Field label="Texto alternativo (alt)">
                  <Input
                    value={form.coverAlt}
                    onChange={(v) => set("coverAlt", v)}
                    placeholder="Descrição da imagem para acessibilidade"
                  />
                </Field>
              )}
            </div>

            {/* Taxonomy */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
              <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Categoria
              </h3>
              <div className="flex flex-wrap gap-2">
                {TAGS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => set("tag", form.tag === t ? "" : t)}
                    className="text-xs px-3 py-1.5 rounded-full border-2 font-medium transition-all"
                    style={
                      form.tag === t
                        ? {
                            backgroundColor: "#4F3DB5",
                            borderColor: "#4F3DB5",
                            color: "white",
                          }
                        : {
                            backgroundColor: "white",
                            borderColor: "#E5E7EB",
                            color: "#6B7280",
                          }
                    }
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* SEO */}
            <SEOPanel
              seoTitle={form.seoTitle}
              seoDescription={form.seoDescription}
              ogImage={form.ogImage}
              onSeoTitle={(v) => set("seoTitle", v)}
              onSeoDescription={(v) => set("seoDescription", v)}
              onOgImage={(v) => set("ogImage", v)}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}
