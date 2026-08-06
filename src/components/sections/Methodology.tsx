"use client";

import { motion } from "framer-motion";
import { Search, Lightbulb, Wrench, BarChart2 } from "lucide-react";
import { useTranslations } from "next-intl";

const STEP_KEYS = ["diagnosis", "solutionMap", "implementation", "monitoring"] as const;
const STEP_NUMBERS = ["01", "02", "03", "04"];
const STEP_ICONS = [Search, Lightbulb, Wrench, BarChart2];

export default function Methodology() {
  const t = useTranslations("methodology");
  return (
    <section id="metodologia" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            {t("eyebrow")}
          </span>
          <h2
            className="mt-3 text-3xl sm:text-4xl font-extrabold text-gray-900"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        <div className="relative">
          <div className="hidden lg:block absolute top-[2.6rem] left-[calc(12.5%+2.5rem)] right-[calc(12.5%+2.5rem)] h-px bg-gradient-to-r from-transparent via-[#AFA9EC] to-transparent" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
            {STEP_KEYS.map((key, i) => {
              const IconComponent = STEP_ICONS[i];
              return (
                <motion.div
                  key={key}
                  className="flex flex-col items-center text-center lg:items-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                >
                  <div className="flex items-start gap-5 lg:flex-col lg:items-center lg:gap-0 w-full lg:w-auto">
                    <div className="relative flex-shrink-0">
                      {i < STEP_KEYS.length - 1 && (
                        <div
                          className="lg:hidden absolute top-full left-1/2 -translate-x-1/2 w-px h-10 mt-2"
                          style={{ backgroundColor: "#AFA9EC" }}
                        />
                      )}
                      <div
                        className="relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-md lg:mb-6"
                        style={{ backgroundColor: "#4F3DB5" }}
                      >
                        <IconComponent size={26} className="text-white" />
                      </div>
                    </div>
                    <div className="flex-1 pt-1 lg:pt-0 lg:text-center">
                      <span
                        className="block text-[0.65rem] font-bold tracking-widest uppercase mb-1"
                        style={{ color: "#AFA9EC" }}
                      >
                        {t("step")} {STEP_NUMBERS[i]}
                      </span>
                      <h3
                        className="text-base font-bold text-gray-900 mb-2"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {t(`${key}.title`)}
                      </h3>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {t(`${key}.description`)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
