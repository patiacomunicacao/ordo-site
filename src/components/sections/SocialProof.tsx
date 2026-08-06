"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import type { Testimonial } from "@/types";
import { useTranslations } from "next-intl";

const METRIC_KEYS = ["projectsDelivered", "companiesServed", "reworkReduction", "withDefinedScope"] as const;
const METRIC_VALUES = ["30+", "15+", "40%", "100%"];

const TESTIMONIAL_KEYS = ["testimonial1", "testimonial2", "testimonial3"] as const;

const TESTIMONIAL_META: Omit<Testimonial, "text">[] = [
  { name: "Ricardo Almeida", role: "Diretor de Operações", company: "Almeida Construtora", initials: "RA" },
  { name: "Dra. Fernanda Rocha", role: "Sócia-diretora", company: "Clínica Rocha & Associados", initials: "FR" },
  { name: "Paulo Siqueira", role: "Sócio", company: "Siqueira & Lima Contabilidade", initials: "PL" },
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
  const t = useTranslations("socialProof");
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const testimonials: Testimonial[] = TESTIMONIAL_KEYS.map((key, i) => ({
    ...TESTIMONIAL_META[i],
    text: t(key),
  }));

  const next = useCallback(
    () => setCurrent((p) => (p + 1) % testimonials.length),
    [testimonials.length]
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
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          {METRIC_KEYS.map((key, i) => (
            <div
              key={key}
              className="flex flex-col items-center text-center rounded-2xl py-8 px-4"
              style={{ backgroundColor: "rgba(255,255,255,0.07)" }}
            >
              <span
                className="text-4xl font-extrabold text-white mb-2"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {METRIC_VALUES[i]}
              </span>
              <span className="text-sm text-purple-200 leading-snug">{t(key)}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
              {t("testimonialsEyebrow")}
            </span>
            <h2
              className="mt-3 text-2xl sm:text-3xl font-extrabold text-white"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {t("testimonialsTitle")}
            </h2>
          </div>

          <div className="hidden md:grid grid-cols-3 gap-6">
            {testimonials.map((tst) => (
              <TestimonialCard key={tst.name} testimonial={tst} />
            ))}
          </div>

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
              <TestimonialCard testimonial={testimonials[current]} />
            </motion.div>

            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setCurrent(i); setPaused(true); }}
                  aria-label={t("testimonialIndicator", { n: i + 1 })}
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
