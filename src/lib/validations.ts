import { z } from "zod";

export const ContactSchema = z.object({
  name: z.string().min(2, "Informe seu nome completo"),
  email: z.string().email("Informe um e-mail válido"),
  phone: z
    .string()
    .min(10, "Informe o telefone com DDD")
    .regex(/^[\d\s()\-+]+$/, "Formato inválido"),
  company: z.string().min(1, "Informe o nome da empresa"),
  serviceInterest: z.string().min(1, "Selecione uma opção"),
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

// ─── Admin ────────────────────────────────────────────────────────────────────

/** URL http(s), caminho relativo ("/img.png") ou vazio. */
const optionalUrl = (label: string) =>
  z
    .string()
    .trim()
    .max(2000, `${label}: URL longa demais`)
    .refine((v) => v === "" || v.startsWith("/") || /^https?:\/\/\S+$/i.test(v), {
      message: `${label}: informe uma URL começando com https://`,
    });

const text = (label: string, max: number) =>
  z.string().max(max, `${label}: máximo de ${max} caracteres`);

const requiredText = (label: string, max: number) =>
  text(label, max).trim().min(1, `${label} é obrigatório`);

const PostFieldsSchema = z.object({
  title: requiredText("Título", 200),
  slug: z
    .string()
    .trim()
    .max(120, "Slug: máximo de 120 caracteres")
    .regex(/^[a-z0-9-]*[a-z0-9][a-z0-9-]*$/, "Slug: use apenas letras minúsculas, números e hífens"),
  summary: text("Resumo", 600),
  content: text("Conteúdo", 500_000),
  coverImage: optionalUrl("Imagem de capa"),
  coverAlt: text("Texto alternativo da capa", 300),
  tag: text("Categoria", 60),
  readingTime: z.coerce
    .number()
    .int("Tempo de leitura deve ser um número inteiro")
    .min(1, "Tempo de leitura: mínimo de 1 minuto")
    .max(240, "Tempo de leitura: máximo de 240 minutos"),
  status: z.enum(["draft", "published"], "Status inválido"),
  seoTitle: text("Título SEO", 200),
  seoDescription: text("Descrição SEO", 400),
  ogImage: optionalUrl("Imagem de compartilhamento"),
  author: requiredText("Autor", 100),
  publishedAt: z
    .string()
    .nullable()
    .refine((v) => v === null || v === "" || !Number.isNaN(Date.parse(v)), {
      message: "Data de publicação inválida",
    })
    .transform((v) => (v ? v : null)),
});

/** Criação: título e slug obrigatórios; o resto recebe padrão na rota. */
export const PostCreateSchema = PostFieldsSchema.partial().required({
  title: true,
  slug: true,
});

/** Edição: todos os campos opcionais, mas validados quando presentes. */
export const PostUpdateSchema = PostFieldsSchema.partial();

export const SiteConfigSchema = z.object({
  email: z.email("E-mail de contato inválido"),
  phone: requiredText("Telefone", 40),
  whatsapp: z
    .string()
    .transform((v) => v.replace(/\D/g, ""))
    .pipe(
      z
        .string()
        .regex(/^\d{10,15}$/, "WhatsApp: informe DDI + DDD + número, ex.: 5541999990000")
    ),
  address: text("Endereço", 200),
  addressFull: text("Endereço do rodapé", 300),
  businessHours: text("Horário de atendimento", 100),
  linkedin: optionalUrl("LinkedIn"),
  instagram: optionalUrl("Instagram"),
});

const KbPromptSchema = z.object({
  company: z.object({
    name: requiredText("Nome da empresa", 120),
    description: text("Descrição da empresa", 1000),
    location: text("Localização", 200),
  }),
  services: z
    .array(
      z.object({
        id: z.string().min(1),
        name: text("Nome do serviço", 120),
        description: text("Descrição do serviço", 1000),
        highlights: text("Destaques do serviço", 1000),
      })
    )
    .max(50, "Máximo de 50 serviços"),
  faqs: z
    .array(
      z.object({
        id: z.string().min(1),
        question: text("Pergunta", 500),
        answer: text("Resposta", 3000),
      })
    )
    .max(100, "Máximo de 100 perguntas"),
  behavior: z.object({
    tone: text("Tom de voz", 300),
    mainGoal: text("Objetivo principal", 2000),
    restrictions: text("Restrições", 3000),
    customInstructions: text("Instruções adicionais", 10_000),
  }),
});

/** Só a parte usada no prompt — para o preview ao vivo no admin. */
export const KnowledgePromptSchema = KbPromptSchema;

export const KnowledgeBaseSchema = KbPromptSchema.extend({
  integrations: z.object({
    webhooks: z
      .array(
        z
          .object({
            id: z.string().min(1),
            name: text("Nome do webhook", 120),
            url: z.string().trim().max(2000, "URL do webhook longa demais"),
            enabled: z.boolean(),
          })
          .refine((w) => !w.enabled || /^https?:\/\/\S+$/i.test(w.url), {
            message: "Webhook ativo precisa de uma URL começando com https://",
          })
      )
      .max(20, "Máximo de 20 webhooks"),
  }),
});

/** Primeira mensagem de erro, em formato amigável para exibir no admin. */
export function firstIssueMessage(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Dados inválidos";
}

export const LeadUpdateSchema = z
  .object({
    status: z.enum(
      ["new", "contacted", "meeting", "proposal", "won", "lost"],
      "Status do lead inválido"
    ),
    notes: text("Anotações", 10_000),
  })
  .partial()
  .refine((d) => d.status !== undefined || d.notes !== undefined, {
    message: "Nada para atualizar",
  });
