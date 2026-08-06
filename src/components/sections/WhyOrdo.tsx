"use client";

import { motion } from "framer-motion";
import { Users, Zap, HeartHandshake, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";

const DIFFERENTIAL_KEYS = ["focusPme", "agileMethod", "closeSupport", "measurableRoi"] as const;
const ICONS = [Users, Zap, HeartHandshake, TrendingUp];

export default function WhyOrdo() {
  const t = useTranslations("whyOrdo");
  return (
    <section
      id="por-que-ordo"
      className="py-24"
      style={{ backgroundColor: "#EEEDFE" }}
    >
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
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DIFFERENTIAL_KEYS.map((key, i) => {
            const Icon = ICONS[i];
            return (
              <motion.div
                key={key}
                className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4 group hover:shadow-md transition-shadow duration-200"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-200"
                  style={{ backgroundColor: "#EEEDFE" }}
                >
                  <Icon size={22} style={{ color: "#4F3DB5" }} />
                </div>
                <div>
                  <h3
                    className="text-base font-bold text-gray-900 mb-2 leading-snug"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {t(`${key}.title`)}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {t(`${key}.description`)}
                  </p>
                </div>
                <div
                  className="mt-auto h-0.5 rounded-full w-8 group-hover:w-full transition-all duration-300"
                  style={{ backgroundColor: "#4F3DB5" }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
