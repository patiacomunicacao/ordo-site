import { z } from "zod";

export const ContactSchema = z.object({
  name: z.string().min(2, "Informe seu nome completo"),
  email: z.string().email("Informe um e-mail válido"),
  phone: z
    .string()
    .min(10, "Informe o telefone com DDD")
    .regex(/^[\d\s()\-+]+$/, "Formato inválido"),
  company: z.string().min(1, "Informe o nome da empresa"),
  serviceInterest: z.string().min(1, "Selecione um serviço de interesse"),
  message: z.string().optional(),
});

export type ContactFormData = z.infer<typeof ContactSchema>;

export const ChatSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    })
  ),
});

export type ChatPayload = z.infer<typeof ChatSchema>;
