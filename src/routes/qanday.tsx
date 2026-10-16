import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/qanday")({
  head: () => ({
    meta: [
      { title: "Qanday ishlaydi — Tasvir AI" },
      {
        name: "description",
        content: "Tasvir AI uch qadamda: tavsif yozing, sozlang va yuklab oling.",
      },
      { property: "og:title", content: "Qanday ishlaydi — Tasvir AI" },
    ],
  }),
  component: HowItWorks,
});

const STEPS = [
  { n: "01", title: "Tavsif yozing", text: "Sahna, uslub va yorug'likni oddiy so'zlar bilan ifodalang." },
  { n: "02", title: "Sozlang", text: "Rasm yoki video, nisbat va davomiylikni tanlang." },
  { n: "03", title: "Yuklab oling", text: "Natija galereyada saqlanadi va tayyor holda yuklanadi." },
];

function HowItWorks() {
  return (
    <PageShell>
      <section className="relative z-10 mx-auto max-w-6xl px-6 pt-16 pb-20">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          Uch qadamda <span className="text-gradient-brand">tayyor</span>
        </h1>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {STEPS.map((st) => (
            <div key={st.n} className="relative rounded-3xl border border-glass-border p-7">
              <div className="text-gradient-brand font-display text-4xl font-bold">{st.n}</div>
              <h2 className="mt-3 text-lg font-semibold">{st.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{st.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Link
            to="/auth"
            search={{ mode: "signup" }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground shadow-lg shadow-brand/30 transition hover:brightness-110"
          >
            Hoziroq boshlash <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
