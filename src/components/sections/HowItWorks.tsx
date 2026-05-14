"use client";

import { motion } from "framer-motion";
import { Search, Lightbulb, Rocket, BarChart2 } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Diagnóstico",
    description:
      "Mapeamos sua operação atual, entendemos os gargalos e identificamos as maiores oportunidades de melhoria com rápido retorno.",
  },
  {
    number: "02",
    icon: Lightbulb,
    title: "Plano de Ação",
    description:
      "Desenvolvemos um plano objetivo com prioridades claras, cronograma realista e estimativa de impacto para cada iniciativa.",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Implementação",
    description:
      "Executamos as soluções lado a lado com sua equipe — automações, fluxos otimizados e ferramentas de IA integradas ao dia a dia.",
  },
  {
    number: "04",
    icon: BarChart2,
    title: "Acompanhamento",
    description:
      "Monitoramos os resultados, ajustamos o que for necessário e garantimos que os ganhos se consolidem no longo prazo.",
  },
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "#4F3DB5" }}
          >
            Nosso método
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-gray-900">
            Como trabalhamos
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            Um processo estruturado que garante resultado desde o primeiro
            contato até a entrega final.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connector line (desktop) */}
          <div
            className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5"
            style={{ backgroundColor: "#EEEDFE" }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                className="relative flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                {/* Circle */}
                <div
                  className="relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-md mb-6"
                  style={{ backgroundColor: "#4F3DB5" }}
                >
                  <step.icon size={28} color="white" />
                </div>

                <span
                  className="text-xs font-bold tracking-widest mb-2"
                  style={{ color: "#AFA9EC" }}
                >
                  PASSO {step.number}
                </span>
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
