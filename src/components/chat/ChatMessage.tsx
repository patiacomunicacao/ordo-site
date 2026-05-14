// ChatMessage — bolha de mensagem individual do widget de chat
// Props: role ("user" | "assistant"), content (string), isStreaming (boolean)
// Inclui: alinhamento e cor diferenciados por role,
// indicador de digitação (3 pontos animados) quando isStreaming e content vazio,
// renderização de markdown simples (negrito, quebras de linha)

import type { ChatMessage as ChatMessageType } from "@/types";

interface Props {
  message: ChatMessageType;
  isStreaming?: boolean;
}

export default function ChatMessage({ message, isStreaming }: Props) {
  // TODO: implementar
  void message;
  void isStreaming;
  return null;
}
