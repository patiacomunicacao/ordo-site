"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";

/**
 * Renders the public Header on every route except /admin/*.
 * Placed in the root layout so it covers all pages automatically.
 */
export default function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Navbar />}
      {children}
    </>
  );
}
