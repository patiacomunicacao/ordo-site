"use client";

import { useState, useEffect } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { usePathname as useNextPathname } from "next/navigation";
import { Menu } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "@/components/layout/LocaleSwitcher";

function OrdoLogo({ className, white = false }: { className?: string; white?: boolean }) {
  return (
    <Link href="/" className={cn("flex items-center select-none", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={white ? "/images/logo-ordo-branco.png" : "/images/logo-ordo-color.png"}
        alt="ORDO Consultoria"
        className="h-[70px] w-auto"
      />
    </Link>
  );
}

export default function Navbar() {
  const t = useTranslations("nav");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const nextPathname = useNextPathname();
  const isHome = pathname === "/";

  const NAV_SECTIONS = [
    { anchor: "sobre", label: t("about") },
    { anchor: "servicos", label: t("services") },
    { anchor: "metodologia", label: t("methodology") },
    { anchor: "contato", label: t("contact") },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [nextPathname]);

  function sectionHref(anchor: string) {
    return isHome ? `#${anchor}` : `/#${anchor}`;
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled || !isHome
          ? "bg-white/95 backdrop-blur-md shadow-[0_1px_0_0_rgba(0,0,0,0.06)]"
          : "bg-white/70 backdrop-blur-sm"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <OrdoLogo />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            {NAV_SECTIONS.map((s) => (
              <a
                key={s.anchor}
                href={sectionHref(s.anchor)}
                className="text-sm font-medium text-gray-600 hover:text-[#4F3DB5] transition-colors duration-150"
              >
                {s.label}
              </a>
            ))}
            <Link
              href="/casos"
              className={cn(
                "text-sm font-medium transition-colors duration-150",
                pathname.startsWith("/casos")
                  ? "text-[#4F3DB5] font-semibold"
                  : "text-gray-600 hover:text-[#4F3DB5]"
              )}
            >
              {t("cases")}
            </Link>
            <Link
              href="/blog"
              className={cn(
                "text-sm font-medium transition-colors duration-150",
                pathname.startsWith("/blog")
                  ? "text-[#4F3DB5] font-semibold"
                  : "text-gray-600 hover:text-[#4F3DB5]"
              )}
            >
              {t("blog")}
            </Link>
            <LocaleSwitcher />
          </nav>

          {/* Desktop CTA */}
          <a
            href={sectionHref("contato")}
            className={cn(
              buttonVariants(),
              "hidden md:inline-flex text-white text-sm font-semibold px-5"
            )}
            style={{ backgroundColor: "#4F3DB5" }}
          >
            {t("cta")}
          </a>

          {/* Mobile Sheet */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-[#4F3DB5] transition-colors"
              aria-label={t("openMenu")}
            >
              <Menu size={22} />
            </SheetTrigger>

            <SheetContent side="right" className="w-72 p-0 flex flex-col">
              <div className="flex flex-col flex-1 px-6 pt-8 pb-6">
                <OrdoLogo className="mb-8" />

                <nav className="flex flex-col gap-0">
                  {NAV_SECTIONS.map((s) => (
                    <a
                      key={s.anchor}
                      href={sectionHref(s.anchor)}
                      className="text-sm font-medium text-gray-700 hover:text-[#4F3DB5] transition-colors py-3.5 border-b border-gray-100"
                      onClick={() => setIsOpen(false)}
                    >
                      {s.label}
                    </a>
                  ))}
                  <Link
                    href="/casos"
                    className={cn(
                      "text-sm font-medium py-3.5 border-b border-gray-100 transition-colors",
                      pathname.startsWith("/casos")
                        ? "text-[#4F3DB5] font-semibold"
                        : "text-gray-700 hover:text-[#4F3DB5]"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {t("cases")}
                  </Link>
                  <Link
                    href="/blog"
                    className={cn(
                      "text-sm font-medium py-3.5 border-b border-gray-100 transition-colors",
                      pathname.startsWith("/blog")
                        ? "text-[#4F3DB5] font-semibold"
                        : "text-gray-700 hover:text-[#4F3DB5]"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {t("blog")}
                  </Link>
                </nav>

                <div className="flex items-center justify-between mt-6 mb-4">
                  <LocaleSwitcher />
                </div>

                <a
                  href={sectionHref("contato")}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    buttonVariants(),
                    "mt-2 text-white font-semibold w-full justify-center"
                  )}
                  style={{ backgroundColor: "#4F3DB5" }}
                >
                  {t("cta")}
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
