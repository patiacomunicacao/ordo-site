"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import type { Testimonial } from "@/types";

const METRICS = [
  { value: "30+", label: "Projetos entregues" },
  { value: "15+", label: "Empresas atendidas" },
  { value: "40%", label: "Redução média de retrabalho" },
  { value: "100%", label: "Com escopo definido" },
];

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Ricardo Almeida",
    role: "Diretor de Operações",
    company: "Almeida Construtora",
    initials: "RA",
    text: "A ORDO mapeou nossa operação de obras em 3 semanas e identificou onde perdíamos tempo. Em 60 dias, reduzimos o ciclo de aprovação interna de 12 para 3 dias. O impacto no prazo de entrega foi imediato.",
  },
  {
    name: "Dra. Fernanda Rocha",
    role: "Sócia-diretora",
    company: "Clínica Rocha & Associados",
    initials: "FR",
    text: "Nossa clínica cresceu rápido e os processos não acompanharam. A ORDO estruturou o fluxo de agendamento, prontuário e faturamento. Hoje trabalhamos com 30% mais pacientes sem aumentar a equipe.",
  },
  {
    name: "Paulo Siqueira",
    role: "Sócio",
    company: "Siqueira & Lima Contabilidade",
    initials: "PL",
    text: "Resistia à automação por achar que perderia o controle. A ORDO mostrou o contrário: automatizamos tarefas repetitivas e agora tenho mais tempo para análises que realmente agregam valor ao cliente.",
  },
];

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="flex flex-col h-full bg-white/10 border border-white/15 rounded-2xl p-7 backdrop-blur-sm">
      <Quote size={28} className="mb-4 flex-shrink-0" style={{ color: "#AFA9EC" }} />
      <p className="text-sm text-purple-100 leading-relaxed flex-1 mb-6">
        &ldquo;{testimonial.text}&rdquo;
      </p>
      <div className="flex items-center gap-3 pt-5 border-t border-white/10">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
          style={{ backgroundColor: "#4F3DB5" }}
        >
          {testimonial.initials}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{testimonial.name}</p>
          <p className="text-xs text-purple-300">
            {testimonial.role} · {testimonial.company}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SocialProof() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(
    () => setCurrent((p) => (p + 1) % TESTIMONIALS.length),
    []
  );

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [paused, next]);

  return (
    <section
      id="depoimentos"
      className="py-24"
      style={{ backgroundColor: "#3C3489" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Metrics */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          {METRICS.map((m) => (
            <div
              key={m.label}
              className="flex flex-col items-center text-center rounded-2xl py-8 px-4"
              style={{ backgroundColor: "rgba(255,255,255,0.07)" }}
            >
              <span
                className="text-4xl font-extrabold text-white mb-2"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {m.value}
              </span>
              <span className="text-sm text-purple-200 leading-snug">{m.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
              O que dizem nossos clientes
            </span>
            <h2
              className="mt-3 text-2xl sm:text-3xl font-extrabold text-white"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Resultados reais, empresas reais
            </h2>
          </div>

          {/* Desktop: 3 columns */}
          <div className="hidden md:grid grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <TestimonialCard key={t.name} testimonial={t} />
            ))}
          </div>

          {/* Mobile: carousel */}
          <div
            className="md:hidden"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={() => setPaused(true)}
            onTouchEnd={() => setPaused(false)}
          >
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
            >
              <TestimonialCard testimonial={TESTIMONIALS[current]} />
            </motion.div>

            {/* Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setCurrent(i); setPaused(true); }}
                  aria-label={`Depoimento ${i + 1}`}
                  className="w-2 h-2 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: i === current ? "white" : "rgba(255,255,255,0.3)",
                    transform: i === current ? "scale(1.3)" : "scale(1)",
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
