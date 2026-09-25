"use client";

import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/gtag";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, CheckCircle2, Mail, Phone, MapPin, Clock, AtSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ContactSchema, type ContactFormData } from "@/lib/validations";
import { cn, instagramHandle } from "@/lib/utils";
import type { SiteConfig } from "@/lib/site-config";
import type { HomeContent } from "@/content/home/types";
import { useTranslations } from "next-intl";
import { Eyebrow } from "@/components/brand/GridMark";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-red-500 mt-1">{message}</p>;
}

export default function ContactForm({
  siteConfig: cfg,
  content,
}: {
  siteConfig: SiteConfig;
  content: HomeContent["contact"];
}) {
  const t = useTranslations("contact");
  const [submitted, setSubmitted] = useState(false);

  const CONTACT_INFO = [
    { icon: Phone,  label: t("labelWhatsApp"), value: cfg.phone,         href: `https://wa.me/${cfg.whatsapp}` },
    { icon: Mail,   label: t("labelEmail"),    value: cfg.email,         href: `mailto:${cfg.email}` },
    { icon: AtSign, label: content.instagramLabel, value: instagramHandle(cfg.instagram), href: cfg.instagram },
    { icon: MapPin, label: t("labelLocation"), value: cfg.address,       href: null },
    { icon: Clock,  label: t("labelHours"),    value: cfg.businessHours, href: null },
  ];

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({ resolver: zodResolver(ContactSchema) });

  // CTAs com `data-service` (cards de serviço, capa, CTA final) pré-selecionam o serviço.
  useEffect(() => {
    const allowed = new Set<string>(content.serviceOptions.map((o) => o.value));
    function onClick(e: MouseEvent) {
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-service]");
      const service = el?.dataset.service;
      if (service && allowed.has(service)) {
        setValue("serviceInterest", service, { shouldValidate: false });
      }
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [content.serviceOptions, setValue]);

  const onSubmit = async (data: ContactFormData) => {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setSubmitted(true);
      trackEvent("generate_lead", {
        method: "contact_form",
        page_location: window.location.href,
      });
    }
  };

  return (
    <section id="contato" aria-labelledby="contato-title" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <h2 id="contato-title" className="mt-4 font-heading text-[1.75rem] sm:text-4xl font-extrabold text-gray-900 leading-tight">
              {t("title")}
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">{t("subtitle")}</p>
            <ul className="mt-10 space-y-6">
              {CONTACT_INFO.map(({ icon: Icon, label, value, href }) => (
                <li key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#F3EEF9" }}>
                    <Icon size={18} style={{ color: "#5B2A86" }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-0.5">{label}</p>
                    {href ? (
                      <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined} className="text-sm text-gray-700 hover:text-[#5B2A86] transition-colors">{value}</a>
                    ) : (
                      <p className="text-sm text-gray-700">{value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            {submitted ? (
              <div className="rounded-2xl p-12 flex flex-col items-center text-center" style={{ backgroundColor: "#F3EEF9" }}>
                <CheckCircle2 size={52} style={{ color: "#5B2A86" }} className="mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: "var(--font-heading)" }}>{t("successTitle")}</h3>
                <p className="text-gray-500 text-sm">{t("successBody")}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-2xl border border-[#E4D8F2] p-5 sm:p-8 shadow-sm" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">{t("fieldName")}</Label>
                    <Input id="name" placeholder={t("fieldNamePlaceholder")} className={cn("mt-1.5", errors.name && "border-red-400")} {...register("name")} />
                    <FieldError message={errors.name?.message} />
                  </div>
                  <div>
                    <Label htmlFor="company" className="text-sm font-medium text-gray-700">{t("fieldCompany")}</Label>
                    <Input id="company" placeholder={t("fieldCompanyPlaceholder")} className={cn("mt-1.5", errors.company && "border-red-400")} {...register("company")} />
                    <FieldError message={errors.company?.message} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">{t("fieldEmail")}</Label>
                    <Input id="email" type="email" placeholder={t("fieldEmailPlaceholder")} className={cn("mt-1.5", errors.email && "border-red-400")} {...register("email")} />
                    <FieldError message={errors.email?.message} />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">{t("fieldPhone")}</Label>
                    <Input id="phone" type="tel" placeholder={t("fieldPhonePlaceholder")} className={cn("mt-1.5", errors.phone && "border-red-400")} {...register("phone")} />
                    <FieldError message={errors.phone?.message} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="serviceInterest" className="text-sm font-medium text-gray-700">{t("fieldService")}</Label>
                  <select
                    id="serviceInterest"
                    defaultValue=""
                    aria-invalid={!!errors.serviceInterest}
                    className={cn(
                      "mt-1.5 h-10 w-full rounded-lg border border-input bg-white px-2.5 text-base md:text-sm text-gray-900 transition-colors focus-visible:border-ring",
                      errors.serviceInterest && "border-red-400"
                    )}
                    {...register("serviceInterest")}
                  >
                    <option value="" disabled>{t("fieldServicePlaceholder")}</option>
                    {content.serviceOptions.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <FieldError message={errors.serviceInterest?.message} />
                </div>
                <div>
                  <Label htmlFor="message" className="text-sm font-medium text-gray-700">{t("fieldMessage")}{" "}<span className="text-gray-500 font-normal">{t("fieldMessageOptional")}</span></Label>
                  <Textarea id="message" rows={4} placeholder={t("fieldMessagePlaceholder")} className="mt-1.5" {...register("message")} />
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full text-white font-semibold py-5 hover:opacity-90 transition-opacity" style={{ backgroundColor: "#5B2A86" }}>
                  {isSubmitting ? t("submitting") : <>{t("submit")}<Send size={15} className="ml-2" /></>}
                </Button>
                <p className="text-xs text-center text-gray-500">{t("privacyNote")}</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
