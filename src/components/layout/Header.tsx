"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_SECTIONS = [
  { anchor: "servicos", label: "Serviços" },
  { anchor: "sobre", label: "Sobre" },
  { anchor: "como-funciona", label: "Como Funciona" },
  { anchor: "depoimentos", label: "Depoimentos" },
  { anchor: "contato", label: "Contato" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  // On non-home pages the header is always over content, so keep solid bg
  const solid = isScrolled || !isHome;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  function sectionHref(anchor: string) {
    return isHome ? `#${anchor}` : `/#${anchor}`;
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        solid ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span
              className="text-2xl font-bold tracking-tight"
              style={{ color: "#4F3DB5" }}
            >
              ORDO
            </span>
            <span
              className={`text-sm font-medium hidden sm:block transition-colors ${
                solid ? "text-gray-500" : "text-gray-300"
              }`}
            >
              Consultoria
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_SECTIONS.map((s) => (
              <a
                key={s.anchor}
                href={sectionHref(s.anchor)}
                className={`text-sm font-medium transition-colors hover:text-[#4F3DB5] ${
                  solid ? "text-gray-600" : "text-white/90"
                }`}
              >
                {s.label}
              </a>
            ))}
            <Link
              href="/blog"
              className={`text-sm font-medium transition-colors hover:text-[#4F3DB5] ${
                pathname.startsWith("/blog")
                  ? "text-[#4F3DB5] font-semibold"
                  : solid
                  ? "text-gray-600"
                  : "text-white/90"
              }`}
            >
              Blog
            </Link>
          </nav>

          {/* CTA */}
          <div className="hidden md:block">
            <a
              href={sectionHref("contato")}
              className={cn(buttonVariants(), "text-white font-semibold")}
              style={{ backgroundColor: "#4F3DB5" }}
            >
              Fale Conosco
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className={`md:hidden p-2 rounded-md transition-colors ${
              solid ? "text-gray-600" : "text-white"
            }`}
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-1">
          {NAV_SECTIONS.map((s) => (
            <a
              key={s.anchor}
              href={sectionHref(s.anchor)}
              className="text-sm font-medium text-gray-700 hover:text-[#4F3DB5] transition-colors py-2 px-2 rounded-lg hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              {s.label}
            </a>
          ))}
          <Link
            href="/blog"
            className={`text-sm font-medium py-2 px-2 rounded-lg hover:bg-gray-50 transition-colors ${
              pathname.startsWith("/blog")
                ? "text-[#4F3DB5] font-semibold"
                : "text-gray-700 hover:text-[#4F3DB5]"
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Blog
          </Link>
          <a
            href={sectionHref("contato")}
            onClick={() => setIsMenuOpen(false)}
            className={cn(
              buttonVariants(),
              "text-white font-semibold mt-3 w-full justify-center"
            )}
            style={{ backgroundColor: "#4F3DB5" }}
          >
            Fale Conosco
          </a>
        </div>
      )}
    </header>
  );
}
