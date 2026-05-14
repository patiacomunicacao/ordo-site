"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, CheckCircle2, Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const schema = z.object({
  name: z.string().min(2, "Informe seu nome completo"),
  email: z.string().email("Informe um e-mail válido"),
  company: z.string().min(1, "Informe o nome da empresa"),
  message: z.string().min(10, "Descreva brevemente sua necessidade (mín. 10 caracteres)"),
});

type FormData = z.infer<typeof schema>;

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    // TODO: integrar com serviço de e-mail (ex: Resend, SendGrid)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Form data:", data);
    setSubmitted(true);
  };

  return (
    <section id="contato" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "#4F3DB5" }}
            >
              Entre em contato
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
              Pronto para transformar seu negócio?
            </h2>
            <p className="mt-5 text-gray-500 leading-relaxed">
              Preencha o formulário ao lado e entraremos em contato em até 1 dia
              útil para entender sua situação e propor os próximos passos.
            </p>

            <div className="mt-10 space-y-6">
              <div className="flex items-start gap-4">
                <div
                  className="p-3 rounded-xl flex-shrink-0"
                  style={{ backgroundColor: "#EEEDFE" }}
                >
                  <Mail size={20} style={{ color: "#4F3DB5" }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">E-mail</p>
                  <a
                    href="mailto:contato@ordoconsultoria.com.br"
                    className="text-sm text-gray-500 hover:text-[#4F3DB5] transition-colors"
                  >
                    contato@ordoconsultoria.com.br
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div
                  className="p-3 rounded-xl flex-shrink-0"
                  style={{ backgroundColor: "#EEEDFE" }}
                >
                  <MessageSquare size={20} style={{ color: "#4F3DB5" }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Resposta rápida
                  </p>
                  <p className="text-sm text-gray-500">
                    Use o chat no canto da tela para uma conversa imediata com
                    nosso assistente.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {submitted ? (
              <div
                className="rounded-2xl p-12 flex flex-col items-center text-center"
                style={{ backgroundColor: "#EEEDFE" }}
              >
                <CheckCircle2 size={52} style={{ color: "#4F3DB5" }} className="mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Mensagem enviada!
                </h3>
                <p className="text-gray-500 text-sm">
                  Retornaremos em até 1 dia útil. Até logo!
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5 rounded-2xl border border-gray-100 p-8 shadow-sm"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Nome completo
                    </Label>
                    <Input
                      id="name"
                      placeholder="João Silva"
                      {...register("name")}
                      className={errors.name ? "border-red-400" : ""}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="company" className="text-sm font-medium text-gray-700">
                      Empresa
                    </Label>
                    <Input
                      id="company"
                      placeholder="Minha Empresa Ltda"
                      {...register("company")}
                      className={errors.company ? "border-red-400" : ""}
                    />
                    {errors.company && (
                      <p className="text-xs text-red-500">{errors.company.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    E-mail
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="joao@empresa.com.br"
                    {...register("email")}
                    className={errors.email ? "border-red-400" : ""}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                    Como podemos ajudar?
                  </Label>
                  <Textarea
                    id="message"
                    rows={4}
                    placeholder="Descreva brevemente o desafio ou oportunidade que você quer explorar..."
                    {...register("message")}
                    className={errors.message ? "border-red-400" : ""}
                  />
                  {errors.message && (
                    <p className="text-xs text-red-500">{errors.message.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full text-white font-semibold py-5 hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "#4F3DB5" }}
                >
                  {isSubmitting ? (
                    "Enviando..."
                  ) : (
                    <>
                      Enviar mensagem
                      <Send size={16} className="ml-2" />
                    </>
                  )}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
