"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

function fadeUpProps(delay = 0) {
  return {
    initial: { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: EASE, delay },
  };
}

function GeometricBackground() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern id="hero-grid" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
          <path
            d="M 48 0 L 0 0 0 48"
            fill="none"
            stroke="#AFA9EC"
            strokeWidth="0.5"
            opacity="0.35"
          />
        </pattern>
        <pattern id="hero-dots" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
          <circle cx="0" cy="0" r="1.5" fill="#4F3DB5" opacity="0.18" />
          <circle cx="48" cy="48" r="1.5" fill="#4F3DB5" opacity="0.18" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hero-grid)" />
      <rect width="100%" height="100%" fill="url(#hero-dots)" />
    </svg>
  );
}

export default function Hero() {
  return (
    <section
      className="relative flex items-center min-h-screen pt-20 overflow-hidden"
      style={{ backgroundColor: "#EEEDFE" }}
    >
      <GeometricBackground />

      {/* Glow blobs */}
      <div
        className="absolute top-1/4 right-0 w-[40vw] h-[40vw] rounded-full opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(circle, #AFA9EC 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-[30vw] h-[30vw] rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #4F3DB5 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            {...fadeUpProps(0)}
            className="mb-6"
          >
            <span
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border"
              style={{
                backgroundColor: "rgba(79,61,181,0.08)",
                borderColor: "rgba(79,61,181,0.2)",
                color: "#4F3DB5",
              }}
            >
              <Sparkles size={12} />
              Empresas de Curitiba e região já transformaram seus processos
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            {...fadeUpProps(0.1)}
            className="text-4xl sm:text-5xl md:text-[3.5rem] font-extrabold text-gray-900 leading-[1.08] tracking-tight mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Processos mais inteligentes.{" "}
            <span style={{ color: "#4F3DB5" }}>Resultados que você vê.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            {...fadeUpProps(0.2)}
            className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-10 max-w-2xl"
          >
            Mapeamos, automatizamos e implementamos IA no dia a dia da sua empresa
            — sem complexidade, sem desperdício.
          </motion.p>

          {/* CTAs */}
          <motion.div
            {...fadeUpProps(0.3)}
            className="flex flex-col sm:flex-row gap-3"
          >
            <a
              href="#servicos"
              className={cn(
                buttonVariants({ size: "lg" }),
                "text-white font-semibold text-base px-7"
              )}
              style={{ backgroundColor: "#4F3DB5" }}
            >
              Conhecer os serviços
              <ArrowRight size={17} className="ml-1.5" />
            </a>
            <a
              href="#contato"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "text-base font-semibold px-7 border-2 bg-white/60"
              )}
              style={{ borderColor: "#4F3DB5", color: "#4F3DB5" }}
            >
              Falar com a ORDO
            </a>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 72L1440 72L1440 36C1200 72 960 0 720 20C480 40 240 72 0 36L0 72Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
