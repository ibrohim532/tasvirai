import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clapperboard, FolderOpen, Image as ImageIcon } from "lucide-react";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/imkoniyatlar")({
  head: () => ({
    meta: [
      { title: "Imkoniyatlar — Tasvir AI" },
      {
        name: "description",
        content: "Tasvir AI imkoniyatlari: AI video, AI rasm va shaxsiy galereya.",
      },
      { property: "og:title", content: "Imkoniyatlar — Tasvir AI" },
    ],
  }),
  component: Features,
});

const FEATURES = [
  { icon: Clapperboard, title: "AI Video", text: "Matndan harakatli sahna — nisbat va davomiylikni o'zingiz tanlang." },
  { icon: ImageIcon, title: "AI Rasm", text: "Fotorealistik yoki san'at uslubidagi rasmlar, bir klikda." },
  { icon: FolderOpen, title: "Shaxsiy galereya", text: "Har bir natija hisobingizda saqlanadi, istalgan vaqt yuklab oling." },
];

function Features() {
  return (
    <PageShell>
      <section className="relative z-10 mx-auto max-w-6xl px-6 pt-16 pb-20">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          Nimalar <span className="text-gradient-brand">qila olasiz</span>
        </h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Tasvir AI bilan g'oyangizni video yoki rasmga aylantiring va hammasini bir joyda saqlang.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="glass-panel group rounded-3xl p-7 transition hover:-translate-y-1 hover:border-brand/40"
            >
              <div className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-brand/30 to-accent/20 text-accent ring-1 ring-white/10">
                <Icon className="size-6" />
              </div>
              <h2 className="mt-5 text-lg font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            to="/qanday"
            className="inline-flex items-center gap-1.5 rounded-xl border border-glass-border bg-input px-4 py-2.5 text-sm font-medium transition hover:bg-white/10"
          >
            Qanday ishlaydi <ArrowRight className="size-4" />
          </Link>
          <Link
            to="/studio"
            search={{}}
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground shadow-lg shadow-brand/30 transition hover:brightness-110"
          >
            Studiyaga o'tish <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
