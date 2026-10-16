import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
<<<<<<< HEAD
import { ArrowRight, Clapperboard, FolderOpen, Image as ImageIcon, Sparkles } from "lucide-react";
import heroValley from "@/assets/hero-valley.jpg";
import authGlass from "@/assets/auth-glass.jpg";
import { Aurora } from "@/components/Aurora";
import { SiteNav } from "@/components/SiteNav";
=======
import { ArrowRight, Sparkles } from "lucide-react";
import heroValley from "@/assets/hero-valley.jpg";
import authGlass from "@/assets/auth-glass.jpg";
import { PageShell } from "@/components/PageShell";
>>>>>>> 6daf45bd9c7f394adad735bf241b3ff781303b7a

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tasvir AI — video va rasm generatori" },
      {
        name: "description",
        content:
          "Matn yozing, Tasvir sizga professional AI video va fotorealistik rasm yaratib beradi. Bepul boshlang.",
      },
      { property: "og:title", content: "Tasvir AI — video va rasm generatori" },
      {
        property: "og:description",
        content:
          "Matndan video va rasm yaratuvchi O'zbek tilidagi AI studiya. Bir klikda tayyor natija.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

<<<<<<< HEAD
const IDEAS = ["Tog' ko'lida quyosh botishi", "Samarqand ko'chalari, kino uslubida", "Kosmosdagi yolg'iz astronavt"];

const FEATURES = [
  { icon: Clapperboard, title: "AI Video", text: "Matndan harakatli sahna — nisbat va davomiylikni o'zingiz tanlang." },
  { icon: ImageIcon, title: "AI Rasm", text: "Fotorealistik yoki san'at uslubidagi rasmlar, bir klikda." },
  { icon: FolderOpen, title: "Shaxsiy galereya", text: "Har bir natija hisobingizda saqlanadi, istalgan vaqt yuklab oling." },
];

const STEPS = [
  { n: "01", title: "Tavsif yozing", text: "Sahna, uslub va yorug'likni oddiy so'zlar bilan ifodalang." },
  { n: "02", title: "Sozlang", text: "Rasm yoki video, nisbat va davomiylikni tanlang." },
  { n: "03", title: "Yuklab oling", text: "Natija galereyada saqlanadi va tayyor holda yuklanadi." },
=======
const IDEAS = [
  "Tog' ko'lida quyosh botishi",
  "Samarqand ko'chalari, kino uslubi",
  "Kosmosdagi yolg'iz astronavt",
>>>>>>> 6daf45bd9c7f394adad735bf241b3ff781303b7a
];

function Index() {
  const [prompt, setPrompt] = useState("");
  const navigate = useNavigate();

  function start(text = prompt) {
    navigate({ to: "/studio", search: text ? { prompt: text } : {} });
  }

  return (
<<<<<<< HEAD
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <Aurora />
      <SiteNav />

      <main>
        <section className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 px-6 pt-16 pb-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <span className="glass-panel inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium text-accent">
              <Sparkles className="size-3.5" /> AI Studiya · video + rasm
            </span>
            <h1 className="mt-6 text-5xl font-bold leading-[1.04] tracking-tight md:text-6xl">
              G'oyani bir zumda <span className="text-gradient-brand">video va rasmga</span> aylantiring.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
              Matn yozing — Tasvi r professional video sahnalar va fotorealistik rasmlarni yaratadi.
              Dizayn bilimi shart emas.
            </p>

            <form
              className="glass-panel mt-8 flex max-w-lg items-center gap-2 rounded-2xl p-2 shadow-2xl shadow-brand/10 focus-within:border-brand/60"
              onSubmit={(e) => {
                e.preventDefault();
                start();
              }}
            >
              <input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                type="text"
                placeholder="Masalan: quyosh botayotgan tog' ko'li..."
                className="w-full bg-transparent px-3 py-2.5 text-sm placeholder:text-muted-foreground/70 focus:outline-none"
              />
              <button
                type="submit"
                className="group inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground shadow-lg shadow-brand/30 transition hover:brightness-110"
              >
                Yaratish <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
              </button>
            </form>

            <div className="mt-4 flex max-w-lg flex-wrap gap-2">
              {IDEAS.map((idea) => (
                <button
                  key={idea}
                  onClick={() => start(idea)}
                  className="rounded-full border border-glass-border bg-input px-3 py-1 text-xs text-muted-foreground transition hover:border-brand/50 hover:text-foreground"
                >
                  {idea}
                </button>
              ))}
            </div>

            <dl className="mt-9 flex gap-8 text-sm">
              {[["2 ta", "rejim: rasm va video"], ["10s", "gacha video"], ["4K", "yuqori sifat"]].map(([v, l]) => (
                <div key={v}>
                  <dt className="font-display text-2xl font-bold">{v}</dt>
                  <dd className="text-muted-foreground">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="absolute inset-6 rounded-3xl bg-brand/30 blur-3xl" aria-hidden />
            <div className="glass-panel relative rounded-3xl p-3.5 shadow-2xl shadow-[var(--shadow-tint)]">
              <img
                src={heroValley}
                width={1024}
                height={768}
                alt="AI yaratgan shomdagi tog' vodiysi tasviri"
                className="aspect-[4/3] w-full rounded-2xl object-cover"
              />
              <div className="flex items-center justify-between px-1.5 pt-3.5 pb-1">
                <div>
                  <div className="font-display text-sm font-semibold">Tog' ko'lagi — kino</div>
                  <div className="text-xs text-muted-foreground">rasm · 4:3 · HD</div>
                </div>
                <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">Tayyor</span>
              </div>
            </div>
            <div className="glass-panel animate-float absolute right-3 top-3 rounded-2xl px-4 py-3 shadow-xl">
              <div className="text-xs text-muted-foreground">Sifat</div>
              <div className="text-gradient-brand font-display text-lg font-bold">Ultra HD</div>
            </div>
          </div>
        </section>

        <section id="imkoniyatlar" className="relative z-10 mx-auto max-w-6xl scroll-mt-24 px-6 py-12">
          <div className="grid gap-5 md:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <article
                key={title}
                className="glass-panel group rounded-3xl p-7 transition hover:-translate-y-1 hover:border-brand/40"
              >
                <div className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-brand/30 to-accent/20 text-accent ring-1 ring-foreground/10">
                  <Icon className="size-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="qanday" className="relative z-10 mx-auto max-w-6xl scroll-mt-24 px-6 py-12">
          <h2 className="text-3xl font-bold md:text-4xl">Uch qadamda tayyor</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {STEPS.map((st) => (
              <div key={st.n} className="relative rounded-3xl border border-glass-border p-7">
                <div className="text-gradient-brand font-display text-4xl font-bold">{st.n}</div>
                <h3 className="mt-3 text-lg font-semibold">{st.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{st.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="boshlash" className="relative z-10 mx-auto max-w-6xl px-6 pt-6 pb-20">
          <div className="glass-panel grid overflow-hidden rounded-3xl shadow-2xl shadow-brand/10 md:grid-cols-2">
            <div className="p-8 md:p-12">
              <span className="inline-flex rounded-full bg-brand/15 px-3 py-1 text-xs font-semibold text-brand">
                Bepul boshlang
              </span>
              <h2 className="mt-4 text-3xl font-bold">Hisobingizni yarating</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                E-pochta yoki Google orqali kiring va studiyaga o'ting.
              </p>
              <div className="mt-7 flex flex-col gap-3">
                <Link
                  to="/auth"
                  search={{ mode: "signup" }}
                  className="rounded-xl bg-brand px-4 py-3 text-center text-sm font-semibold text-brand-foreground shadow-lg shadow-brand/30 transition hover:brightness-110"
                >
                  Ro'yxatdan o'tish
                </Link>
                <Link
                  to="/auth"
                  search={{ mode: "login" }}
                  className="rounded-xl border border-glass-border bg-input px-4 py-3 text-center text-sm font-medium transition hover:bg-foreground/10"
                >
                  Hisobim bor — kirish
                </Link>
              </div>
            </div>
            <div className="relative hidden md:block">
              <img
                src={authGlass}
                loading="lazy"
                width={1024}
                height={1024}
                alt="Muzli shisha panellar abstrakt tasviri"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-transparent" />
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 mx-auto max-w-6xl px-6 pb-10 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Tasvir AI · AI video va rasm generator
      </footer>
    </div>
=======
    <PageShell>
      <section className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 px-6 pt-16 pb-14 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <span className="glass-panel inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium text-accent">
            <Sparkles className="size-3.5" /> AI Studiya · video + rasm
          </span>
          <h1 className="mt-6 text-5xl font-bold leading-[1.04] tracking-tight md:text-6xl">
            G'oyani bir zumda <span className="text-gradient-brand">video va rasmga</span>{" "}
            aylantiring.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
            Matn yozing — Tasvir professional video sahnalar va fotorealistik rasmlarni yaratadi.
            Dizayn bilimi shart emas.
          </p>

          <form
            className="glass-panel mt-8 flex max-w-lg items-center gap-2 rounded-2xl p-2 shadow-2xl shadow-brand/10 focus-within:border-brand/60"
            onSubmit={(e) => {
              e.preventDefault();
              start();
            }}
          >
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              type="text"
              placeholder="Masalan: quyosh botayotgan tog' ko'li..."
              className="w-full bg-transparent px-3 py-2.5 text-sm placeholder:text-muted-foreground/70 focus:outline-none"
            />
            <button
              type="submit"
              className="group inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground shadow-lg shadow-brand/30 transition hover:brightness-110"
            >
              Yaratish <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
            </button>
          </form>

          <div className="mt-4 flex max-w-lg flex-wrap gap-2">
            {IDEAS.map((idea) => (
              <button
                key={idea}
                onClick={() => start(idea)}
                className="rounded-full border border-glass-border bg-input px-3 py-1 text-xs text-muted-foreground transition hover:border-brand/50 hover:text-foreground"
              >
                {idea}
              </button>
            ))}
          </div>

          <dl className="mt-9 flex gap-8 text-sm">
            {[
              ["2 ta", "rejim: rasm va video"],
              ["8s", "gacha video"],
              ["HD", "yuqori sifat"],
            ].map(([v, l]) => (
              <div key={v}>
                <dt className="font-display text-2xl font-bold">{v}</dt>
                <dd className="text-muted-foreground">{l}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <Link
              to="/imkoniyatlar"
              className="inline-flex items-center gap-1 text-accent hover:underline"
            >
              Imkoniyatlar <ArrowRight className="size-3.5" />
            </Link>
            <Link
              to="/qanday"
              className="inline-flex items-center gap-1 text-accent hover:underline"
            >
              Qanday ishlaydi <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-6 rounded-3xl bg-brand/30 blur-3xl" aria-hidden />
          <div className="glass-panel relative rounded-3xl p-3.5 shadow-2xl shadow-black/40">
            <img
              src={heroValley}
              width={1024}
              height={768}
              alt="AI yaratgan shomdagi tog' vodiysi tasviri"
              className="aspect-[4/3] w-full rounded-2xl object-cover"
            />
            <div className="flex items-center justify-between px-1.5 pt-3.5 pb-1">
              <div>
                <div className="font-display text-sm font-semibold">Tog' ko'lagi — kino</div>
                <div className="text-xs text-muted-foreground">rasm · 4:3 · HD</div>
              </div>
              <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">
                Tayyor
              </span>
            </div>
          </div>
          <div className="glass-panel animate-float absolute -bottom-6 -left-6 rounded-2xl px-4 py-3 shadow-xl">
            <div className="text-xs text-muted-foreground">Sifat</div>
            <div className="text-gradient-brand font-display text-lg font-bold">Ultra HD</div>
          </div>
        </div>
      </section>

      <section id="boshlash" className="relative z-10 mx-auto max-w-6xl px-6 pt-6 pb-20">
        <div className="glass-panel grid overflow-hidden rounded-3xl shadow-2xl shadow-brand/10 md:grid-cols-2">
          <div className="p-8 md:p-12">
            <span className="inline-flex rounded-full bg-brand/15 px-3 py-1 text-xs font-semibold text-brand">
              Bepul boshlang
            </span>
            <h2 className="mt-4 text-3xl font-bold">Hisobingizni yarating</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              E-pochta yoki Google orqali kiring va studiyaga o'ting.
            </p>
            <div className="mt-7 flex flex-col gap-3">
              <Link
                to="/auth"
                search={{ mode: "signup" }}
                className="rounded-xl bg-brand px-4 py-3 text-center text-sm font-semibold text-brand-foreground shadow-lg shadow-brand/30 transition hover:brightness-110"
              >
                Ro'yxatdan o'tish
              </Link>
              <Link
                to="/auth"
                search={{ mode: "login" }}
                className="rounded-xl border border-glass-border bg-input px-4 py-3 text-center text-sm font-medium transition hover:bg-white/10"
              >
                Hisobim bor — kirish
              </Link>
            </div>
          </div>
          <div className="relative hidden md:block">
            <img
              src={authGlass}
              loading="lazy"
              width={1024}
              height={1024}
              alt="Muzli shisha panellar abstrakt tasviri"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-transparent" />
          </div>
        </div>
      </section>
    </PageShell>
>>>>>>> 6daf45bd9c7f394adad735bf241b3ff781303b7a
  );
}
