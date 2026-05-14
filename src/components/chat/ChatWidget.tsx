"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ChatMessage } from "@/types";

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Olá! Sou o assistente da ORDO. Posso ajudar a identificar qual serviço faz mais sentido para a sua empresa ou agendar uma conversa com nossa equipe. Como posso te ajudar?",
  createdAt: new Date(),
};

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
function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "text-white rounded-br-sm"
            : "text-gray-700 bg-white shadow-sm rounded-bl-sm"
        }`}
        style={isUser ? { backgroundColor: "#4F3DB5" } : undefined}
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
}: {
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
        style={{ backgroundColor: "#4F3DB5" }}
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
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
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
          style={{ backgroundColor: "#4F3DB5" }}
          aria-label="Enviar mensagem"
        >
          <Send size={15} />
        </Button>
      </div>
    </motion.div>
  );
}

// ─── Main widget ──────────────────────────────────────────────────────────────
export default function ChatWidget() {
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
          messages: history.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = (await res.json()) as { content?: string; error?: string; leadCaptured?: boolean };

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            data.content ??
            data.error ??
            "Não consegui processar sua mensagem. Tente novamente.",
          createdAt: new Date(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Ocorreu um erro ao processar sua mensagem. Tente novamente ou entre em contato pelo e-mail contato@ordoconsultoria.com.br.",
          createdAt: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);

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
          />
        )}
      </AnimatePresence>

      {/* Floating button */}
      <motion.button
        onClick={() => setIsOpen((v) => !v)}
        className="relative w-14 h-14 rounded-full text-white shadow-xl flex items-center justify-center"
        style={{ backgroundColor: "#4F3DB5" }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        aria-label={isOpen ? "Fechar chat" : "Abrir chat com ORDO IA"}
      >
        {/* Pulsing badge — shown when closed and unread */}
        {!isOpen && hasUnread && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center">
            <span
              className="absolute w-4 h-4 rounded-full animate-ping opacity-75"
              style={{ backgroundColor: "#AFA9EC" }}
            />
            <span
              className="relative w-3 h-3 rounded-full"
              style={{ backgroundColor: "#AFA9EC" }}
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
