"use client";

import { useRef } from "react";
import { ImagePlus, X } from "lucide-react";
import NextImage from "next/image";

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

  async function handleFile(file: File) {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    if (res.ok) {
      const { url } = (await res.json()) as { url: string };
      onChange(url);
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
          <NextImage src={value} alt="Imagem" fill className="object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full h-28 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-[#4F3DB5] hover:text-[#4F3DB5] transition-colors cursor-pointer"
        >
          <ImagePlus size={20} />
          <span className="text-xs">Clique para enviar</span>
        </button>
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
