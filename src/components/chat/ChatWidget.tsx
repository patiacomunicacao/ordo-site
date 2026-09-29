"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ChatMessage } from "@/types";
import { trackEvent } from "@/lib/gtag";

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Olá! Sou o assistente da ORDO. Posso ajudar a identificar qual serviço faz mais sentido para a sua empresa ou agendar uma conversa com nossa equipe. Como posso te ajudar?",
  createdAt: new Date(),
};

const FALLBACK_TEXT =
  "Nosso assistente está indisponível no momento, mas a equipe da ORDO pode te atender agora mesmo pelo WhatsApp.";

type Contact = { whatsapp: string; email: string };

function whatsappHref(whatsapp: string, question: string): string {
  const intro = "Olá! Vim pelo chat do site da ORDO.";
  const text = question ? `${intro} Minha dúvida: ${question.slice(0, 500)}` : intro;
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`;
}

// ─── WhatsApp icon (lucide não tem o logo) ───────────────────────────────────
function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.04 21.5h-.01a9.45 9.45 0 0 1-4.82-1.32l-.35-.21-3.58.94.96-3.49-.23-.36a9.43 9.43 0 0 1-1.45-5.03c0-5.22 4.25-9.46 9.48-9.46 2.53 0 4.91.99 6.7 2.78a9.4 9.4 0 0 1 2.77 6.7c0 5.22-4.25 9.46-9.47 9.46zm8.06-17.52A11.33 11.33 0 0 0 12.04.63C5.76.63.65 5.73.65 12.01c0 2.01.52 3.97 1.52 5.69L.55 23.37l5.8-1.52a11.36 11.36 0 0 0 5.69 1.45h.01c6.28 0 11.39-5.1 11.39-11.38 0-3.04-1.18-5.9-3.34-8.05z" />
    </svg>
  );
}

// ─── Typing indicator ────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-white shadow-sm rounded-2xl rounded-bl-sm px-4 py-3">
        <span className="flex gap-1.5 items-center">
          {[0, 150, 300].map((delay) => (
            <span
              key={delay}
              className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </span>
      </div>
    </div>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────
function FallbackBubble({ href, email }: { href: string; email: string }) {
  return (
    <div className="flex justify-start">
      <div className="max-w-[88%] rounded-2xl rounded-bl-sm px-4 py-3 text-sm leading-relaxed text-gray-700 bg-white shadow-sm">
        <p>{FALLBACK_TEXT}</p>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackEvent("contact_whatsapp", { method: "chat_fallback", page_location: window.location.href })
          }
          className="mt-3 flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#25D366" }}
        >
          <WhatsAppIcon />
          Falar no WhatsApp
        </a>
        {email && (
          <a
            href={`mailto:${email}`}
            className="mt-2 flex items-center justify-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors"
          >
            <Mail size={12} />
            ou envie um e-mail para {email}
          </a>
        )}
      </div>
    </div>
  );
}

function MessageBubble({ msg, contact, question }: { msg: ChatMessage; contact: Contact; question: string }) {
  if (msg.fallback && contact.whatsapp) {
    return <FallbackBubble href={whatsappHref(contact.whatsapp, question)} email={contact.email} />;
  }
  const isUser = msg.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "text-white rounded-br-sm"
            : "text-gray-700 bg-white shadow-sm rounded-bl-sm"
        }`}
        style={isUser ? { backgroundColor: "#5B2A86" } : undefined}
      >
        {msg.content}
      </div>
    </div>
  );
}

// ─── Chat window ──────────────────────────────────────────────────────────────
function ChatWindow({
  messages,
  isLoading,
  input,
  onInputChange,
  onSend,
  onClose,
  inputRef,
  messagesEndRef,
  contact,
}: {
  contact: Contact;
  messages: ChatMessage[];
  isLoading: boolean;
  input: string;
  onInputChange: (v: string) => void;
  onSend: () => void;
  onClose: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.96 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="w-[320px] sm:w-[360px] rounded-2xl shadow-2xl overflow-hidden flex flex-col bg-white border border-gray-100"
      style={{ height: "480px" }}
      aria-label="Chat com ORDO IA"
      role="dialog"
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between flex-shrink-0"
        style={{ backgroundColor: "#5B2A86" }}
      >
        <div className="flex items-center gap-2.5">
          {/* Avatar */}
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm"
            style={{ backgroundColor: "rgba(255,255,255,0.18)", color: "white" }}
          >
            OA
          </div>
          <div>
            <p className="text-sm font-semibold text-white leading-tight">ORDO IA</p>
            <span className="flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[0.65rem] text-purple-200">online</span>
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10"
          aria-label="Fechar chat"
        >
          <X size={17} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
        {messages.map((msg, i) => (
          <MessageBubble
            key={msg.id}
            msg={msg}
            contact={contact}
            question={lastUserMessage(messages.slice(0, i))}
          />
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-3 py-3 border-t border-gray-100 bg-white flex gap-2 flex-shrink-0">
        <Input
          ref={inputRef}
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          placeholder="Digite sua mensagem..."
          className="flex-1 text-sm border-gray-200"
          disabled={isLoading}
          aria-label="Mensagem"
        />
        <Button
          onClick={onSend}
          disabled={isLoading || !input.trim()}
          size="sm"
          className="text-white flex-shrink-0 px-3"
          style={{ backgroundColor: "#5B2A86" }}
          aria-label="Enviar mensagem"
        >
          <Send size={15} />
        </Button>
      </div>
    </motion.div>
  );
}

function lastUserMessage(messages: ChatMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "user") return messages[i].content;
  }
  return "";
}

// ─── Main widget ──────────────────────────────────────────────────────────────
export default function ChatWidget({ whatsapp, email }: Contact) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages or loading state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input when window opens; clear unread badge
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setHasUnread(false);
    }
  }, [isOpen]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      createdAt: new Date(),
    };

    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Mensagens de contingência não fazem parte da conversa com a IA.
          messages: history
            .filter((m) => !m.fallback)
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = (await res.json()) as { content?: string; error?: string; leadCaptured?: boolean };
      if (!data.content) throw new Error(data.error ?? "Resposta vazia");

      if (data.leadCaptured) {
        trackEvent("generate_lead", { method: "chat", page_location: window.location.href });
      }

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.content!,
          createdAt: new Date(),
        },
      ]);
    } catch {
      // IA indisponível (sem créditos, fora do ar, rede): oferece o WhatsApp.
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: whatsapp
            ? FALLBACK_TEXT
            : `Nosso assistente está indisponível no momento. Fale com a equipe pelo e-mail ${email}.`,
          createdAt: new Date(),
          fallback: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, whatsapp, email]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <ChatWindow
            messages={messages}
            isLoading={isLoading}
            input={input}
            onInputChange={setInput}
            onSend={sendMessage}
            onClose={() => setIsOpen(false)}
            inputRef={inputRef}
            messagesEndRef={messagesEndRef}
            contact={{ whatsapp, email }}
          />
        )}
      </AnimatePresence>

      {/* Floating button */}
      <motion.button
        onClick={() => setIsOpen((v) => !v)}
        className="relative w-14 h-14 rounded-full text-white shadow-xl flex items-center justify-center"
        style={{ backgroundColor: "#5B2A86" }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        aria-label={isOpen ? "Fechar chat" : "Abrir chat com ORDO IA"}
      >
        {/* Pulsing badge — shown when closed and unread */}
        {!isOpen && hasUnread && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center">
            <span
              className="absolute w-4 h-4 rounded-full animate-ping opacity-75"
              style={{ backgroundColor: "#C9B3E6" }}
            />
            <span
              className="relative w-3 h-3 rounded-full"
              style={{ backgroundColor: "#C9B3E6" }}
            />
          </span>
        )}

        {/* Icon toggle */}
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={22} />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle size={22} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
