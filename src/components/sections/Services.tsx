"use client";

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { ArrowRight } from "lucide-react";
import { SERVICES } from "@/data/services";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Service } from "@/types";

type LucideIconName = keyof typeof LucideIcons;

function ServiceIcon({ name }: { name: string }) {
  const Icon = LucideIcons[name as LucideIconName] as React.ComponentType<{
    size?: number;
    className?: string;
  }>;
  if (!Icon) return null;
  return <Icon size={22} />;
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
  }).format(value);
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <motion.div
      className="group relative flex flex-col bg-white rounded-2xl border-2 border-gray-100 hover:border-[#4F3DB5] hover:shadow-lg transition-all duration-300 p-6"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      {/* Icon */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-colors group-hover:bg-[#4F3DB5]"
        style={{ backgroundColor: "#EEEDFE", color: "#4F3DB5" }}
      >
        <span className="group-hover:text-white transition-colors">
          <ServiceIcon name={service.icon} />
        </span>
      </div>

      {/* Price badge */}
      <span
        className="self-start text-[0.7rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-3"
        style={{ backgroundColor: "#EEEDFE", color: "#4F3DB5" }}
      >
        A partir de {formatPrice(service.priceFrom)}
      </span>

      <h3
        className="text-base font-bold text-gray-900 mb-2 leading-snug"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {service.title}
      </h3>

      <p className="text-sm text-gray-500 leading-relaxed flex-1 mb-5">
        {service.description}
      </p>

      <a
        href="#contato"
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "w-full justify-center text-xs font-semibold border-gray-200 group-hover:border-[#4F3DB5] group-hover:text-[#4F3DB5] transition-colors"
        )}
      >
        Saiba mais
        <ArrowRight size={13} className="ml-1" />
      </a>
    </motion.div>
  );
}

export default function Services() {
  return (
    <section id="servicos" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "#4F3DB5" }}
          >
            O que fazemos
          </span>
          <h2
            className="mt-3 text-3xl sm:text-4xl font-extrabold text-gray-900"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Serviços sob medida para PMEs
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            Soluções práticas com escopo claro, entrega ágil e resultado mensurável.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
            >
              <ServiceCard service={service} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
