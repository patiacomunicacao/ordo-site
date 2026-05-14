"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, CheckCircle2, Mail, Phone, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ContactSchema, type ContactFormData } from "@/lib/validations";
import { SERVICES } from "@/data/services";
import { cn } from "@/lib/utils";

const CONTACT_INFO = [
  {
    icon: Mail,
    label: "E-mail",
    value: "contato@ordoconsultoria.com.br",
    href: "mailto:contato@ordoconsultoria.com.br",
  },
  {
    icon: Phone,
    label: "WhatsApp",
    value: "(41) 99999-0000",
    href: "https://wa.me/5541999990000",
  },
  {
    icon: MapPin,
    label: "Localização",
    value: "São José dos Pinhais / PR",
    href: null,
  },
  {
    icon: Clock,
    label: "Horário",
    value: "Seg–Sex, 8h às 18h",
    href: null,
  },
];

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-red-500 mt-1">{message}</p>;
}

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(ContactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) setSubmitted(true);
  };

  return (
    <section id="contato" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left — info */}
          <div>
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "#4F3DB5" }}
            >
              Entre em contato
            </span>
            <h2
              className="mt-3 text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Pronto para transformar seu negócio?
            </h2>
            <p className="mt-4 text-gray-500 leading-relaxed">
              Preencha o formulário e retornamos em até 1 dia útil. Ou use o chat
              no canto da tela para uma resposta imediata.
            </p>

            <ul className="mt-10 space-y-6">
              {CONTACT_INFO.map(({ icon: Icon, label, value, href }) => (
                <li key={label} className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "#EEEDFE" }}
                  >
                    <Icon size={18} style={{ color: "#4F3DB5" }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-0.5">
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        target={href.startsWith("http") ? "_blank" : undefined}
                        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="text-sm text-gray-700 hover:text-[#4F3DB5] transition-colors"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm text-gray-700">{value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — form */}
          <div>
            {submitted ? (
              <div
                className="rounded-2xl p-12 flex flex-col items-center text-center"
                style={{ backgroundColor: "#EEEDFE" }}
              >
                <CheckCircle2 size={52} style={{ color: "#4F3DB5" }} className="mb-4" />
                <h3
                  className="text-xl font-bold text-gray-900 mb-2"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Mensagem recebida!
                </h3>
                <p className="text-gray-500 text-sm">
                  Retornaremos em até 1 dia útil. Até breve!
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5 rounded-2xl border border-gray-100 p-8 shadow-sm"
                noValidate
              >
                {/* Nome + Empresa */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Nome completo *
                    </Label>
                    <Input
                      id="name"
                      placeholder="João Silva"
                      className={cn("mt-1.5", errors.name && "border-red-400")}
                      {...register("name")}
                    />
                    <FieldError message={errors.name?.message} />
                  </div>
                  <div>
                    <Label htmlFor="company" className="text-sm font-medium text-gray-700">
                      Empresa *
                    </Label>
                    <Input
                      id="company"
                      placeholder="Minha Empresa Ltda"
                      className={cn("mt-1.5", errors.company && "border-red-400")}
                      {...register("company")}
                    />
                    <FieldError message={errors.company?.message} />
                  </div>
                </div>

                {/* E-mail + Telefone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      E-mail *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="joao@empresa.com"
                      className={cn("mt-1.5", errors.email && "border-red-400")}
                      {...register("email")}
                    />
                    <FieldError message={errors.email?.message} />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      WhatsApp / Telefone *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(41) 99999-0000"
                      className={cn("mt-1.5", errors.phone && "border-red-400")}
                      {...register("phone")}
                    />
                    <FieldError message={errors.phone?.message} />
                  </div>
                </div>

                {/* Serviço de interesse */}
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Serviço de interesse *
                  </Label>
                  <div className="mt-1.5">
                    <Controller
                      name="serviceInterest"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger
                            className={cn(
                              "w-full h-9",
                              errors.serviceInterest && "border-red-400"
                            )}
                          >
                            <SelectValue placeholder="Selecione um serviço..." />
                          </SelectTrigger>
                          <SelectContent>
                            {SERVICES.map((s) => (
                              <SelectItem key={s.id} value={s.id}>
                                {s.title}
                              </SelectItem>
                            ))}
                            <SelectItem value="outro">Outro / Não sei ainda</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <FieldError message={errors.serviceInterest?.message} />
                </div>

                {/* Mensagem */}
                <div>
                  <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                    Mensagem{" "}
                    <span className="text-gray-400 font-normal">(opcional)</span>
                  </Label>
                  <Textarea
                    id="message"
                    rows={4}
                    placeholder="Descreva brevemente o desafio ou o que você está buscando..."
                    className="mt-1.5"
                    {...register("message")}
                  />
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
                      <Send size={15} className="ml-2" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-gray-400">
                  Seus dados são usados somente para entrar em contato com você.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
