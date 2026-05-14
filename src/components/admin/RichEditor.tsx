"use client";

import { useEditor, useEditorState, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TipTapImage from "@tiptap/extension-image";
import TipTapLink from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
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
} from "lucide-react";
import { useRef } from "react";

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
}: {
  editor: Editor;
  onImageInsert: () => void;
}) {
  // useEditorState ensures the toolbar re-renders whenever marks/nodes change
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

      {/* Divider */}
      <Btn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Linha divisória">
        <Minus size={15} />
      </Btn>
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

  if (!editor) return null;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <Toolbar editor={editor} onImageInsert={() => fileInputRef.current?.click()} />
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
