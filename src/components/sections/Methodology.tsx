"use client";

import { motion } from "framer-motion";
import { Search, Lightbulb, Wrench, BarChart2 } from "lucide-react";
import type { MethodologyStep } from "@/types";

const STEPS: (MethodologyStep & { IconComponent: React.ComponentType<{ size?: number; className?: string }> })[] = [
  {
    number: "01",
    icon: "Search",
    IconComponent: Search,
    title: "Diagnóstico",
    description:
      "Mapeamos sua operação atual, identificamos gargalos e priorizamos as oportunidades com maior potencial de retorno para o seu negócio.",
  },
  {
    number: "02",
    icon: "Lightbulb",
    IconComponent: Lightbulb,
    title: "Mapa de Soluções",
    description:
      "Desenvolvemos um plano de ação claro com iniciativas priorizadas, cronograma realista e estimativa de impacto para cada entrega.",
  },
  {
    number: "03",
    icon: "Wrench",
    IconComponent: Wrench,
    title: "Implementação",
    description:
      "Executamos as soluções lado a lado com sua equipe — automações, fluxos otimizados e ferramentas integradas ao dia a dia do negócio.",
  },
  {
    number: "04",
    icon: "BarChart2",
    IconComponent: BarChart2,
    title: "Monitoramento",
    description:
      "Acompanhamos os resultados, ajustamos o que for necessário e garantimos que os ganhos se consolidem e evoluam continuamente.",
  },
];

export default function Methodology() {
  return (
    <section id="metodologia" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "#4F3DB5" }}
          >
            Nosso método
          </span>
          <h2
            className="mt-3 text-3xl sm:text-4xl font-extrabold text-gray-900"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Como trabalhamos
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            Um processo estruturado, do diagnóstico à manutenção dos resultados.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Horizontal connector — desktop only */}
          <div className="hidden lg:block absolute top-[2.6rem] left-[calc(12.5%+2.5rem)] right-[calc(12.5%+2.5rem)] h-px bg-gradient-to-r from-transparent via-[#AFA9EC] to-transparent" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                className="flex flex-col items-center text-center lg:items-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
              >
                {/* Mobile: left-aligned with vertical line */}
                <div className="flex items-start gap-5 lg:flex-col lg:items-center lg:gap-0 w-full lg:w-auto">
                  {/* Circle */}
                  <div className="relative flex-shrink-0">
                    {/* Vertical connector — mobile only */}
                    {i < STEPS.length - 1 && (
                      <div
                        className="lg:hidden absolute top-full left-1/2 -translate-x-1/2 w-px h-10 mt-2"
                        style={{ backgroundColor: "#AFA9EC" }}
                      />
                    )}
                    <div
                      className="relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-md lg:mb-6"
                      style={{ backgroundColor: "#4F3DB5" }}
                    >
                      <step.IconComponent size={26} className="text-white" />
                    </div>
                  </div>

                  {/* Text */}
                  <div className="flex-1 pt-1 lg:pt-0 lg:text-center">
                    <span
                      className="block text-[0.65rem] font-bold tracking-widest uppercase mb-1"
                      style={{ color: "#AFA9EC" }}
                    >
                      PASSO {step.number}
                    </span>
                    <h3
                      className="text-base font-bold text-gray-900 mb-2"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
