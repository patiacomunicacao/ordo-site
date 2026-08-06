"use client";

import { useEditor, useEditorState, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TipTapImage from "@tiptap/extension-image";
import TipTapLink from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { Table, TableRow, TableHeader, TableCell } from "@tiptap/extension-table";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Code2,
  Link2,
  ImagePlus,
  Minus,
  Undo2,
  Redo2,
  Pilcrow,
  FileCode,
  X,
  Table as TableIcon,
  Columns2,
  Rows2,
  Trash2,
} from "lucide-react";
import { useRef, useState } from "react";

// ─── Toolbar button ───────────────────────────────────────────────────────────

function Btn({
  onClick,
  active,
  title,
  children,
  disabled,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      title={title}
      disabled={disabled}
      className="p-1.5 rounded transition-colors disabled:opacity-30"
      style={
        active
          ? { backgroundColor: "#4F3DB5", color: "white" }
          : { color: "#6b7280" }
      }
      onMouseEnter={(e) => {
        if (!active) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#f3f4f6";
      }}
      onMouseLeave={(e) => {
        if (!active) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "";
      }}
    >
      {children}
    </button>
  );
}

function Sep() {
  return <div className="h-5 w-px bg-gray-200 mx-0.5 flex-shrink-0" />;
}

// ─── Toolbar — uses useEditorState for proper reactivity in TipTap v3 ─────────

function Toolbar({
  editor,
  onImageInsert,
  onHtmlInsert,
  onTableInsert,
}: {
  editor: Editor;
  onImageInsert: () => void;
  onHtmlInsert: () => void;
  onTableInsert: () => void;
}) {
  const state = useEditorState({
    editor,
    selector: (ctx) => ({
      isBold: ctx.editor.isActive("bold"),
      isItalic: ctx.editor.isActive("italic"),
      isUnderline: ctx.editor.isActive("underline"),
      isStrike: ctx.editor.isActive("strike"),
      isH1: ctx.editor.isActive("heading", { level: 1 }),
      isH2: ctx.editor.isActive("heading", { level: 2 }),
      isH3: ctx.editor.isActive("heading", { level: 3 }),
      isParagraph: ctx.editor.isActive("paragraph"),
      isBulletList: ctx.editor.isActive("bulletList"),
      isOrderedList: ctx.editor.isActive("orderedList"),
      isBlockquote: ctx.editor.isActive("blockquote"),
      isCode: ctx.editor.isActive("code"),
      isCodeBlock: ctx.editor.isActive("codeBlock"),
      isLink: ctx.editor.isActive("link"),
      isTable: ctx.editor.isActive("table"),
      canUndo: ctx.editor.can().undo(),
      canRedo: ctx.editor.can().redo(),
    }),
  });

  function setLink() {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = prompt("URL do link:", prev ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().setLink({ href: url, target: "_blank" }).run();
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-gray-200 bg-gray-50 rounded-t-xl">
      {/* Undo / Redo */}
      <Btn onClick={() => editor.chain().focus().undo().run()} disabled={!state.canUndo} title="Desfazer (Ctrl+Z)">
        <Undo2 size={15} />
      </Btn>
      <Btn onClick={() => editor.chain().focus().redo().run()} disabled={!state.canRedo} title="Refazer (Ctrl+Y)">
        <Redo2 size={15} />
      </Btn>

      <Sep />

      {/* Inline formatting */}
      <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={state.isBold} title="Negrito (Ctrl+B)">
        <Bold size={15} />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={state.isItalic} title="Itálico (Ctrl+I)">
        <Italic size={15} />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleUnderline().run()} active={state.isUnderline} title="Sublinhado (Ctrl+U)">
        <UnderlineIcon size={15} />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleStrike().run()} active={state.isStrike} title="Tachado">
        <Strikethrough size={15} />
      </Btn>

      <Sep />

      {/* Block types */}
      <Btn
        onClick={() => editor.chain().focus().setParagraph().run()}
        active={state.isParagraph && !state.isH1 && !state.isH2 && !state.isH3}
        title="Parágrafo normal"
      >
        <Pilcrow size={15} />
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        active={state.isH1}
        title="Título H1"
      >
        <Heading1 size={15} />
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={state.isH2}
        title="Título H2"
      >
        <Heading2 size={15} />
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={state.isH3}
        title="Título H3"
      >
        <Heading3 size={15} />
      </Btn>

      <Sep />

      {/* Lists */}
      <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={state.isBulletList} title="Lista com marcadores">
        <List size={15} />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={state.isOrderedList} title="Lista numerada">
        <ListOrdered size={15} />
      </Btn>

      <Sep />

      {/* Blocks */}
      <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={state.isBlockquote} title="Citação">
        <Quote size={15} />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleCode().run()} active={state.isCode} title="Código inline">
        <Code size={15} />
      </Btn>
      <Btn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={state.isCodeBlock} title="Bloco de código">
        <Code2 size={15} />
      </Btn>

      <Sep />

      {/* Link & Image */}
      <Btn onClick={setLink} active={state.isLink} title="Inserir / editar link">
        <Link2 size={15} />
      </Btn>
      <Btn onClick={onImageInsert} title="Inserir imagem do computador">
        <ImagePlus size={15} />
      </Btn>

      <Sep />

      {/* Table */}
      <Btn onClick={onTableInsert} active={state.isTable} title="Inserir tabela">
        <TableIcon size={15} />
      </Btn>

      {/* Table context controls — only shown when cursor is inside a table */}
      {state.isTable && (
        <>
          <Btn
            onClick={() => editor.chain().focus().addColumnBefore().run()}
            title="Adicionar coluna antes"
          >
            <Columns2 size={15} />
          </Btn>
          <Btn
            onClick={() => editor.chain().focus().addColumnAfter().run()}
            title="Adicionar coluna depois"
          >
            <Columns2 size={15} style={{ transform: "scaleX(-1)" }} />
          </Btn>
          <Btn
            onClick={() => editor.chain().focus().deleteColumn().run()}
            title="Remover coluna"
            disabled={false}
          >
            <span className="text-[11px] font-bold leading-none">−C</span>
          </Btn>
          <Sep />
          <Btn
            onClick={() => editor.chain().focus().addRowBefore().run()}
            title="Adicionar linha antes"
          >
            <Rows2 size={15} />
          </Btn>
          <Btn
            onClick={() => editor.chain().focus().addRowAfter().run()}
            title="Adicionar linha depois"
          >
            <Rows2 size={15} style={{ transform: "scaleY(-1)" }} />
          </Btn>
          <Btn
            onClick={() => editor.chain().focus().deleteRow().run()}
            title="Remover linha"
          >
            <span className="text-[11px] font-bold leading-none">−L</span>
          </Btn>
          <Sep />
          <Btn
            onClick={() => editor.chain().focus().deleteTable().run()}
            title="Remover tabela inteira"
          >
            <Trash2 size={15} />
          </Btn>
        </>
      )}

      <Sep />

      {/* Divider */}
      <Btn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Linha divisória">
        <Minus size={15} />
      </Btn>

      <Sep />

      {/* Raw HTML insert */}
      <Btn onClick={onHtmlInsert} title="Inserir HTML bruto">
        <FileCode size={15} />
      </Btn>
    </div>
  );
}

// ─── HTML insert modal ────────────────────────────────────────────────────────

function HtmlInsertModal({
  onInsert,
  onClose,
}: {
  onInsert: (html: string) => void;
  onClose: () => void;
}) {
  const [raw, setRaw] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <p className="text-sm font-semibold text-gray-900">Inserir HTML</p>
            <p className="text-xs text-gray-400 mt-0.5">Cole o código HTML — será inserido no conteúdo do post</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-5">
          <textarea
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            placeholder="<h2>Título</h2><p>Parágrafo...</p>"
            className="w-full h-48 px-3 py-2 border border-gray-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#4F3DB5] resize-none"
            autoFocus
          />
        </div>
        <div className="flex justify-end gap-2 px-5 pb-5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => { if (raw.trim()) { onInsert(raw.trim()); onClose(); } }}
            disabled={!raw.trim()}
            className="px-4 py-2 text-sm font-semibold text-white rounded-lg disabled:opacity-50 transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#4F3DB5" }}
          >
            Inserir
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Table insert modal ───────────────────────────────────────────────────────

function TableInsertModal({
  onInsert,
  onClose,
}: {
  onInsert: (rows: number, cols: number) => void;
  onClose: () => void;
}) {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [hovered, setHovered] = useState<{ r: number; c: number } | null>(null);

  const GRID = 8;

  const displayRows = hovered ? Math.max(hovered.r + 1, rows) : rows;
  const displayCols = hovered ? Math.max(hovered.c + 1, cols) : cols;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <p className="text-sm font-semibold text-gray-900">Inserir tabela</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Passe o mouse para selecionar o tamanho
            </p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="p-5">
          {/* Grid picker */}
          <div
            className="inline-grid gap-1 mb-4"
            style={{ gridTemplateColumns: `repeat(${GRID}, 1.5rem)` }}
          >
            {Array.from({ length: GRID * GRID }).map((_, i) => {
              const r = Math.floor(i / GRID);
              const c = i % GRID;
              const active = r < (hovered ? hovered.r + 1 : rows) && c < (hovered ? hovered.c + 1 : cols);
              return (
                <div
                  key={i}
                  className="w-6 h-6 rounded-sm border cursor-pointer transition-colors"
                  style={{
                    backgroundColor: active ? "#EEEDFE" : "#f9fafb",
                    borderColor: active ? "#4F3DB5" : "#e5e7eb",
                  }}
                  onMouseEnter={() => setHovered({ r, c })}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => { setRows(r + 1); setCols(c + 1); }}
                />
              );
            })}
          </div>

          <p className="text-xs text-gray-500 mb-5">
            {displayRows} × {displayCols} (linhas × colunas)
          </p>

          {/* Manual inputs */}
          <div className="flex gap-3 mb-5">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Linhas</label>
              <input
                type="number"
                min={1}
                max={20}
                value={rows}
                onChange={(e) => setRows(Math.max(1, Math.min(20, Number(e.target.value))))}
                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4F3DB5]"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Colunas</label>
              <input
                type="number"
                min={1}
                max={10}
                value={cols}
                onChange={(e) => setCols(Math.max(1, Math.min(10, Number(e.target.value))))}
                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4F3DB5]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => { onInsert(rows, cols); onClose(); }}
              className="px-4 py-2 text-sm font-semibold text-white rounded-lg transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#4F3DB5" }}
            >
              Inserir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main editor ──────────────────────────────────────────────────────────────

export default function RichEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showHtmlModal, setShowHtmlModal] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ link: false, underline: false }),
      Underline,
      TipTapImage.configure({ inline: false, allowBase64: false }),
      TipTapLink.configure({
        openOnClick: false,
        HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" },
      }),
      Placeholder.configure({ placeholder: "Escreva o conteúdo do post aqui…" }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "focus:outline-none",
      },
    },
  });

  async function uploadAndInsert(file: File) {
    if (!editor) return;
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    if (res.ok) {
      const { url } = (await res.json()) as { url: string };
      editor.chain().focus().setImage({ src: url, alt: file.name }).run();
    }
  }

  function insertTable(rows: number, cols: number) {
    if (!editor) return;
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
  }

  if (!editor) return null;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      {showHtmlModal && (
        <HtmlInsertModal
          onInsert={(html) => editor.chain().focus().insertContent(html).run()}
          onClose={() => setShowHtmlModal(false)}
        />
      )}
      {showTableModal && (
        <TableInsertModal
          onInsert={insertTable}
          onClose={() => setShowTableModal(false)}
        />
      )}
      <Toolbar
        editor={editor}
        onImageInsert={() => fileInputRef.current?.click()}
        onHtmlInsert={() => setShowHtmlModal(true)}
        onTableInsert={() => setShowTableModal(true)}
      />
      <EditorContent editor={editor} />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (file) await uploadAndInsert(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
