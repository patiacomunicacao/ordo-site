"use client";

import { motion } from "framer-motion";
import { Users, Zap, HeartHandshake, TrendingUp } from "lucide-react";

const DIFFERENTIALS = [
  {
    icon: Users,
    title: "Foco exclusivo em PMEs",
    description:
      "Entendemos a realidade das pequenas e médias empresas: times enxutos, recursos limitados e necessidade de resultados rápidos. Nossas soluções são dimensionadas para o seu contexto.",
  },
  {
    icon: Zap,
    title: "Metodologia ágil",
    description:
      "Trabalhamos em ciclos curtos com entregas incrementais. Você vê o progresso semana a semana e pode ajustar o rumo antes de comprometer tempo e orçamento.",
  },
  {
    icon: HeartHandshake,
    title: "Acompanhamento próximo",
    description:
      "Não somos consultores que entregam relatórios e somem. Ficamos ao seu lado durante toda a implementação e no período de consolidação dos resultados.",
  },
  {
    icon: TrendingUp,
    title: "ROI mensurável",
    description:
      "Definimos métricas de sucesso antes de começar e acompanhamos cada uma delas. Transparência total sobre o retorno gerado em relação ao investimento feito.",
  },
];

export default function WhyOrdo() {
  return (
    <section
      id="por-que-ordo"
      className="py-24"
      style={{ backgroundColor: "#EEEDFE" }}
    >
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
            Nossos diferenciais
          </span>
          <h2
            className="mt-3 text-3xl sm:text-4xl font-extrabold text-gray-900"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Por que a ORDO?
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Combinamos experiência prática, metodologia comprovada e tecnologia
            acessível para transformar a operação da sua empresa.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DIFFERENTIALS.map((item, i) => (
            <motion.div
              key={item.title}
              className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4 group hover:shadow-md transition-shadow duration-200"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-200"
                style={{ backgroundColor: "#EEEDFE" }}
              >
                <item.icon
                  size={22}
                  style={{ color: "#4F3DB5" }}
                />
              </div>

              {/* Text */}
              <div>
                <h3
                  className="text-base font-bold text-gray-900 mb-2 leading-snug"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Accent bar */}
              <div
                className="mt-auto h-0.5 rounded-full w-8 group-hover:w-full transition-all duration-300"
                style={{ backgroundColor: "#4F3DB5" }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
