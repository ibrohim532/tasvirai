import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
<<<<<<< HEAD
import { ThemeToggle } from "../components/ui/themetoogle";

const ghost =
  "rounded-xl px-3.5 py-2 text-sm font-medium text-muted-foreground transition hover:bg-foreground/5 hover:text-foreground";
=======

const ghost =
  "rounded-xl px-3.5 py-2 text-sm font-medium text-muted-foreground transition hover:bg-white/5 hover:text-foreground";
const active =
  "rounded-xl bg-white/10 px-3.5 py-2 text-sm font-medium text-foreground";
>>>>>>> 6daf45bd9c7f394adad735bf241b3ff781303b7a
const solid =
  "rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground shadow-lg shadow-brand/30 transition hover:brightness-110";

export function SiteNav() {
  const { user, loading } = useSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", search: { mode: "login" }, replace: true });
  }

  return (
    <header className="sticky top-0 z-30 mx-auto max-w-6xl px-4 pt-4 sm:px-6">
<<<<<<< HEAD
      <nav className="glass-panel flex items-center justify-between rounded-2xl px-4 py-2.5 shadow-xl shadow-[var(--shadow-tint)]">
=======
      <nav className="glass-panel flex items-center justify-between rounded-2xl px-4 py-2.5 shadow-xl shadow-black/20">
>>>>>>> 6daf45bd9c7f394adad735bf241b3ff781303b7a
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-brand to-accent text-brand-foreground shadow-lg shadow-brand/40">
            <Sparkles className="size-[18px]" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">Tasvir AI</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
<<<<<<< HEAD
          <Link to="/studio" search={{}} className={ghost}>Studiya</Link>
          <a className={ghost} href="/#imkoniyatlar">Imkoniyatlar</a>
          <a className={ghost} href="/#qanday">Qanday ishlaydi</a>
        </div>

        <div className="flex items-center gap-1.5">
          <ThemeToggle className="mr-1" />
=======
          <Link to="/studio" search={{}} className={ghost} activeProps={{ className: active }}>Studiya</Link>
          <Link to="/imkoniyatlar" className={ghost} activeProps={{ className: active }}>Imkoniyatlar</Link>
          <Link to="/qanday" className={ghost} activeProps={{ className: active }}>Qanday ishlaydi</Link>
        </div>

        <div className="flex items-center gap-1.5">
>>>>>>> 6daf45bd9c7f394adad735bf241b3ff781303b7a
          {loading ? null : user ? (
            <>
              <Link to="/dashboard" className={ghost}>Panel</Link>
              <Link to="/studio" search={{}} className={`${ghost} hidden sm:block`}>Studiya</Link>
              <button onClick={signOut} className={solid}>Chiqish</button>
            </>
          ) : (
            <>
              <Link to="/auth" search={{ mode: "login" }} className={ghost}>Kirish</Link>
              <Link to="/auth" search={{ mode: "signup" }} className={solid}>Boshlash</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
