"use client";

import { useRef, useState } from "react";
import { ImagePlus, X, Loader2, AlertCircle } from "lucide-react";

const MAX_MB = 5;
const MAX_BYTES = MAX_MB * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

export default function ImageUpload({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setError("");

    if (!ALLOWED.includes(file.type)) {
      setError("Formato não suportado. Use JPG, PNG ou WebP.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(`Imagem muito grande. Máximo ${MAX_MB} MB (seu arquivo: ${(file.size / 1024 / 1024).toFixed(1)} MB).`);
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "Erro ao enviar imagem. Tente novamente.");
        return;
      }

      const { url } = (await res.json()) as { url: string };
      onChange(url);
    } catch {
      setError("Falha de conexão. Verifique sua internet e tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {label && (
        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
          {label}
        </label>
      )}

      {value ? (
        <div className="relative w-full h-36 rounded-lg overflow-hidden group border border-gray-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Imagem de capa" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => { onChange(""); setError(""); }}
            className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
            title="Remover imagem"
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => { setError(""); inputRef.current?.click(); }}
          disabled={loading}
          className="w-full h-28 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            borderColor: error ? "#ef4444" : "#e5e7eb",
            color: error ? "#ef4444" : "#9ca3af",
          }}
          onMouseEnter={(e) => {
            if (!error && !loading)
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#4F3DB5";
          }}
          onMouseLeave={(e) => {
            if (!error)
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#e5e7eb";
          }}
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" style={{ color: "#4F3DB5" }} />
              <span className="text-xs" style={{ color: "#4F3DB5" }}>Enviando…</span>
            </>
          ) : (
            <>
              <ImagePlus size={20} />
              <span className="text-xs">Clique para enviar</span>
              <span className="text-[10px] text-gray-300">JPG, PNG ou WebP · máx. {MAX_MB} MB</span>
            </>
          )}
        </button>
      )}

      {error && (
        <div className="flex items-start gap-1.5 mt-2 text-xs text-red-600">
          <AlertCircle size={13} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (file) await handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
