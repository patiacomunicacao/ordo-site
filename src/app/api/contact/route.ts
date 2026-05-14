import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { ContactSchema } from "@/lib/validations";

export const runtime = "nodejs";

const SERVICE_LABELS: Record<string, string> = {
  mapeamento: "Mapeamento de Processos",
  automacao: "Automação de Processos",
  ia: "Implementação de IA",
  gestao: "Gestão de Projetos",
  treinamento: "Treinamento e Capacitação",
  transformacao: "Transformação Digital",
};

function buildTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) return null;

  return nodemailer.createTransport({
    service: "gmail",
    auth: { type: "login", user, pass },
  });
}

function buildHtml(data: {
  name: string;
  email: string;
  phone: string;
  company: string;
  serviceInterest: string;
  message?: string;
}): string {
  const serviceLabel =
    SERVICE_LABELS[data.serviceInterest] ?? data.serviceInterest;

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 0;">
    <tr>
      <td align="center">
        <table width="540" cellpadding="0" cellspacing="0"
          style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08);">

          <!-- Header -->
          <tr>
            <td style="background:#4F3DB5;padding:24px 32px;">
              <p style="margin:0;font-size:20px;font-weight:700;color:#ffffff;letter-spacing:.5px;">
                ORDO Consultoria
              </p>
              <p style="margin:4px 0 0;font-size:13px;color:#cbc7f4;">
                Novo contato recebido pelo site
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:28px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                ${row("Nome", data.name)}
                ${row("E-mail", `<a href="mailto:${data.email}" style="color:#4F3DB5;">${data.email}</a>`)}
                ${row("Telefone", data.phone)}
                ${row("Empresa", data.company)}
                ${row("Serviço de interesse", serviceLabel)}
                ${
                  data.message
                    ? `<tr>
                        <td colspan="2" style="padding:14px 0 0;">
                          <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:.6px;">Mensagem</p>
                          <p style="margin:0;font-size:14px;color:#374151;line-height:1.6;background:#f9fafb;padding:12px 14px;border-radius:8px;border-left:3px solid #4F3DB5;">
                            ${data.message.replace(/\n/g, "<br />")}
                          </p>
                        </td>
                      </tr>`
                    : ""
                }
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:14px 32px;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:11px;color:#9ca3af;">
                Recebido em ${new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })} (horário de Brasília)
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function row(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:8px 0;font-size:12px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:.6px;width:160px;vertical-align:top;">
        ${label}
      </td>
      <td style="padding:8px 0;font-size:14px;color:#374151;vertical-align:top;">
        ${value}
      </td>
    </tr>`;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  const result = ContactSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Dados inválidos", issues: result.error.flatten() },
      { status: 422 }
    );
  }

  const { name, email, phone, company, serviceInterest, message } = result.data;
  const serviceLabel = SERVICE_LABELS[serviceInterest] ?? serviceInterest;

  const transporter = buildTransporter();

  if (!transporter) {
    // Dev fallback: log to console when credentials aren't configured
    console.log("[ORDO] Novo contato recebido:", {
      name, email, phone, company, serviceInterest, message,
      receivedAt: new Date().toISOString(),
    });
    return NextResponse.json({ success: true });
  }

  try {
    await transporter.sendMail({
      from: `"ORDO Site" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,           // entrega para o mesmo inbox
      replyTo: email,                        // responder abre e-mail do lead
      subject: `[ORDO] Novo contato — ${name} (${serviceLabel})`,
      html: buildHtml({ name, email, phone, company, serviceInterest, message }),
      text: [
        `Nome: ${name}`,
        `E-mail: ${email}`,
        `Telefone: ${phone}`,
        `Empresa: ${company}`,
        `Serviço: ${serviceLabel}`,
        message ? `Mensagem: ${message}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    });
  } catch (err) {
    console.error("[ORDO] Erro ao enviar e-mail:", err);
    // Não expõe detalhes do erro para o cliente
    return NextResponse.json(
      { error: "Não foi possível enviar sua mensagem. Tente novamente ou entre em contato pelo WhatsApp." },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true });
}
