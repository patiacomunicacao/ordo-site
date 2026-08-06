import type { Metadata } from "next";
import { Outfit, DM_Sans } from "next/font/google";
import "../globals.css";

const outfit = Outfit({ variable: "--font-heading", subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"] });
const dmSans = DM_Sans({ variable: "--font-sans", subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: { default: "Admin — ORDO", template: "%s — Admin ORDO" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${outfit.variable} ${dmSans.variable} antialiased`}>
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  );
}
