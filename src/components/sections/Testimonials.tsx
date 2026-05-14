"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Ana Paula Figueiredo",
    role: "CEO",
    company: "Figueiredo & Associados",
    text: "A ORDO transformou completamente nossa operação. Em 60 dias, reduzimos o tempo de onboarding de clientes de 3 semanas para 4 dias. O impacto foi imediato e mensurável.",
    initials: "AF",
  },
  {
    name: "Rodrigo Mendes",
    role: "Diretor de Operações",
    company: "Grupo Delta",
    text: "Tentamos automatizar nossos processos antes com outras empresas e sempre esbarramos em soluções caras e difíceis de manter. Com a ORDO foi diferente — prático, acessível e funciona.",
    initials: "RM",
  },
  {
    name: "Carla Souza",
    role: "Sócia-fundadora",
    company: "Studio CS Design",
    text: "Como uma empresa pequena, eu achei que automação e IA eram coisa de grande empresa. A ORDO me mostrou que dá para implementar com o orçamento que eu tinha e os resultados são reais.",
    initials: "CS",
  },
];

export default function Testimonials() {
  return (
    <section
      id="depoimentos"
      className="py-24"
      style={{ backgroundColor: "#EEEDFE" }}
    >
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
            O que dizem nossos clientes
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-gray-900">
            Resultados reais, pessoas reais
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <Card className="h-full border-0 shadow-md bg-white">
                <CardContent className="pt-8 pb-6 px-6 flex flex-col h-full">
                  <Quote
                    size={32}
                    className="mb-4 flex-shrink-0"
                    style={{ color: "#AFA9EC" }}
                  />
                  <p className="text-gray-600 leading-relaxed flex-1 text-sm">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-4 mt-6 pt-5 border-t border-gray-100">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                      style={{ backgroundColor: "#4F3DB5" }}
                    >
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {t.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {t.role} · {t.company}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
