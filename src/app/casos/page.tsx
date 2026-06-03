import type { Metadata } from "next";
import CaseClickUp from "@/components/cases/CaseClickUp";

export const metadata: Metadata = {
  title: "Cases",
  description: "Resultados reais de empresas que transformaram sua operação com a ORDO — automação, IA e implementação de ferramentas.",
};

export default function CasosPage() {
  return (
    <main className="min-h-screen pt-20">
      {/* Page header */}
      <div className="bg-white pt-14 pb-16 text-center border-b border-gray-100">
        <span
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: "#4F3DB5" }}
        >
          Resultados reais
        </span>
        <h1
          className="mt-3 text-4xl font-extrabold text-gray-900"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Cases ORDO
        </h1>
        <p className="mt-3 text-gray-500 max-w-lg mx-auto text-sm leading-relaxed">
          Projetos que entregamos — com números, metodologia e impacto real na operação dos clientes.
        </p>
      </div>

      {/* Cases */}
      <CaseClickUp />
    </main>
  );
}
