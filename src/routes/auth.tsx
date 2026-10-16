import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Eye, EyeOff, Image, LockKeyhole, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { Button } from "@/components/ui/button";
<<<<<<< HEAD
import { ThemeToggle } from "@/components/ui/themetoogle";
=======
>>>>>>> 6daf45bd9c7f394adad735bf241b3ff781303b7a

type Mode = "login" | "signup"; 

const GOOGLE_FLAG = "tasvir_google_login_pending";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>) => ({
    mode: search["mode"] === "signup" ? ("signup" as const) : ("login" as const),
  }),
  head: () => ({
    meta: [
      { title: "Kirish va ro'yxatdan o'tish — Tasvir" },
      {
        name: "description",
        content:
          "Tasvir AI studiyasiga e-pochta yoki Google orqali kiring va video hamda rasm yaratishni boshlang.",
      },
      { property: "og:title", content: "Kirish va ro'yxatdan o'tish — Tasvir" },
      {
        property: "og:description",
        content: "Tasvir hisobingizga kiring va AI studiyadan foydalaning.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

async function logEvent(userId: string, type: "login" | "signup") {
  await supabase.from("login_events").insert({
    user_id: userId,
    event_type: type,
    user_agent: navigator.userAgent,
  });
}

function AuthPage() {
  const { mode: initialMode } = Route.useSearch();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { session } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) return;

    // Google orqali qaytgan bo'lsa, kirish hodisasini bir marta yozamiz
    try {
      if (localStorage.getItem(GOOGLE_FLAG)) {
        localStorage.removeItem(GOOGLE_FLAG);
        void logEvent(session.user.id, "login");
      }
    } catch {
      // localStorage mavjud bo'lmasa, e'tibor bermaymiz
    }

    navigate({ to: "/dashboard", replace: true });
  }, [session, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { display_name: name },
          },
        });
        if (error) throw error;
        if (!data.session) {
          toast.success("Tasdiqlash havolasi e-pochtangizga yuborildi.");
        } else if (data.user) {
          await logEvent(data.user.id, "signup");
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (data.user) await logEvent(data.user.id, "login");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Xatolik yuz berdi");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setBusy(true);
    try {
      localStorage.setItem(GOOGLE_FLAG, "1");
    } catch {
      // ixtiyoriy: faqat log yozish uchun
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth`,
      },
    });

    if (error) {
      try {
        localStorage.removeItem(GOOGLE_FLAG);
      } catch {
        // e'tibor bermaymiz
      }
      toast.error("Google orqali kirishda xatolik");
      setBusy(false);
    }
    // Muvaffaqiyatli bo'lsa brauzer Google sahifasiga yo'naltiriladi.
    // Qaytgach useSession sessiyani topadi va useEffect /dashboard ga o'tkazadi.
  }

  function changeMode(nextMode: Mode) {
    setMode(nextMode);
    setPassword("");
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-auth-background px-5 py-8 text-auth-foreground sm:px-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 size-80 rounded-full bg-brand/15 blur-[110px]" />
        <div className="absolute -bottom-24 -right-24 size-96 rounded-full bg-accent/10 blur-[130px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--auth-border)_1px,transparent_1px)] bg-[size:32px_32px] opacity-20" />
      </div>

      <Link
        to="/"
        aria-label="Bosh sahifaga qaytish"
        className="absolute left-5 top-5 z-10 grid size-10 place-items-center rounded-full border border-auth-border bg-auth-surface text-auth-muted transition hover:bg-auth-surface-strong hover:text-auth-foreground sm:left-8 sm:top-8"
      >
        <ArrowLeft className="size-4" />
      </Link>

<<<<<<< HEAD
      <ThemeToggle className="absolute right-5 top-6 z-10 sm:right-8 sm:top-8" />

=======
>>>>>>> 6daf45bd9c7f394adad735bf241b3ff781303b7a
      <section className="auth-rise relative z-10 w-full max-w-md">
        <div className="border border-auth-border bg-auth-surface px-6 py-7 shadow-2xl backdrop-blur-2xl sm:px-10 sm:py-9">
          <div className="text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-brand text-brand-foreground shadow-lg shadow-brand/25">
              <Image className="size-7" strokeWidth={1.7} />
            </div>
            <p className="mt-5 font-display text-xl font-bold">Tasvir AI</p>
            <h1 className="mt-5 text-2xl font-bold sm:text-3xl">
              {mode === "signup" ? "Yangi hisob yarating" : "Xush kelibsiz"}
            </h1>
            <p className="mt-2 text-sm text-auth-muted">
              {mode === "signup"
                ? "G‘oyalaringizni rasm va videoga aylantirishni boshlang."
                : "Ijodiy studiyangizga qaytish uchun kiring."}
            </p>
          </div>

          <div
            className="mt-7 grid grid-cols-2 rounded-lg border border-auth-border bg-auth-background/50 p-1"
            role="tablist"
            aria-label="Hisob amali"
          >
            <Button
              type="button"
              variant="ghost"
              onClick={() => changeMode("login")}
              className={`h-10 rounded-md hover:bg-auth-surface-strong hover:text-auth-foreground ${
                mode === "login" ? "bg-auth-surface-strong text-auth-foreground" : "text-auth-muted"
              }`}
            >
              Kirish
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => changeMode("signup")}
              className={`h-10 rounded-md hover:bg-auth-surface-strong hover:text-auth-foreground ${
                mode === "signup" ? "bg-auth-surface-strong text-auth-foreground" : "text-auth-muted"
              }`}
            >
              Ro‘yxatdan o‘tish
            </Button>
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <label className="block text-sm font-medium text-auth-muted">
                Ismingiz
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  placeholder="Ism va familiya"
                  className="mt-2 h-12 w-full rounded-lg border border-auth-border bg-auth-background/55 px-4 text-auth-foreground outline-none transition placeholder:text-auth-muted/55 focus:border-brand focus:ring-2 focus:ring-brand/25"
                />
              </label>
            )}
            <label className="block text-sm font-medium text-auth-muted">
              Elektron pochta
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ism@misol.uz"
                className="mt-2 h-12 w-full rounded-lg border border-auth-border bg-auth-background/55 px-4 text-auth-foreground outline-none transition placeholder:text-auth-muted/55 focus:border-brand focus:ring-2 focus:ring-brand/25"
              />
            </label>
            <label className="block text-sm font-medium text-auth-muted">
              Parol
              <span className="relative mt-2 block">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Kamida 6 ta belgi"
                  className="h-12 w-full rounded-lg border border-auth-border bg-auth-background/55 px-4 pr-12 text-auth-foreground outline-none transition placeholder:text-auth-muted/55 focus:border-brand focus:ring-2 focus:ring-brand/25"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={showPassword ? "Parolni yashirish" : "Parolni ko‘rsatish"}
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-1.5 top-1.5 text-auth-muted hover:bg-auth-surface-strong hover:text-auth-foreground"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </Button>
              </span>
            </label>

            <Button
              type="submit"
              disabled={busy}
              className="h-12 w-full rounded-lg bg-brand font-semibold text-brand-foreground shadow-lg shadow-brand/20 hover:bg-brand/90 active:scale-[0.99]"
            >
              <Sparkles />
              {busy ? "Kuting..." : mode === "signup" ? "Hisob yaratish" : "Tizimga kirish"}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-auth-muted">
            <span className="h-px flex-1 bg-auth-border" />
            yoki davom eting
            <span className="h-px flex-1 bg-auth-border" />
          </div>

          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={google}
            className="h-12 w-full rounded-lg border-auth-border bg-auth-surface text-auth-foreground hover:bg-auth-surface-strong hover:text-auth-foreground"
          >
            <span className="grid size-5 place-items-center rounded-full bg-auth-foreground text-xs font-bold text-auth-background">
              G
            </span>
            Google orqali davom etish
          </Button>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-auth-muted">
          <LockKeyhole className="size-4" />
          Xavfsiz va himoyalangan ulanish
        </div>
      </section>
    </main>
  );
}