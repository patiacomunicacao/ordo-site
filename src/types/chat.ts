export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
  /** Mensagem de contingência (IA indisponível): exibe botão para o WhatsApp. */
  fallback?: boolean;
}
