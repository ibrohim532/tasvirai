import type { ReactNode } from "react";
import { Aurora } from "@/components/Aurora";
import { SiteNav } from "@/components/SiteNav";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <Aurora />
      <SiteNav />
      <main>{children}</main>
      <footer className="relative z-10 mx-auto max-w-6xl px-6 pb-10 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Tasvir AI · AI video va rasm generator
      </footer>
    </div>
  );
}
