"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const differentials = [
  "Foco exclusivo em pequenas e médias empresas",
  "Metodologia ágil com resultados em semanas, não meses",
  "Soluções acessíveis e sem dependência de grandes plataformas",
  "Acompanhamento próximo durante e após a implementação",
  "Time com experiência em operações, tecnologia e negócios",
];

export default function About() {
  return (
    <section id="sobre" className="py-24" style={{ backgroundColor: "#EEEDFE" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
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
              Quem somos
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
              Consultoria com propósito para quem constrói o Brasil
            </h2>
            <p className="mt-5 text-gray-600 leading-relaxed">
              A ORDO nasceu da crença de que pequenas e médias empresas merecem
              acesso às mesmas ferramentas de eficiência que grandes corporações
              — sem o custo proibitivo nem a complexidade desnecessária.
            </p>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Somos uma consultoria de processos, automação e IA que trabalha lado
              a lado com empreendedores e gestores para transformar a operação do
              negócio em vantagem competitiva real.
            </p>

            <ul className="mt-8 space-y-3">
              {differentials.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2
                    size={20}
                    className="flex-shrink-0 mt-0.5"
                    style={{ color: "#4F3DB5" }}
                  />
                  <span className="text-sm text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Visual / Stats */}
          <motion.div
            className="grid grid-cols-2 gap-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {[
              { value: "50+", label: "Projetos entregues" },
              { value: "30%", label: "Redução média de retrabalho" },
              { value: "3x", label: "Retorno sobre o investimento" },
              { value: "100%", label: "Foco em PMEs brasileiras" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl p-8 flex flex-col items-center text-center shadow-sm"
                style={{ backgroundColor: "white" }}
              >
                <span
                  className="text-4xl font-extrabold"
                  style={{ color: "#4F3DB5" }}
                >
                  {stat.value}
                </span>
                <span className="mt-2 text-sm text-gray-500 font-medium leading-snug">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
