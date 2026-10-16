import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { Aurora } from "@/components/Aurora";
import { SiteNav } from "@/components/SiteNav";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Boshqaruv paneli — Tasvir AI" },
      {
        name: "description",
        content:
          "Tasvir AI boshqaruv paneli: kreditlaringiz, yaratilgan rasm va videolar tarixi hamda hisobingizga kirishlar tarixi.",
      },
      { property: "og:title", content: "Boshqaruv paneli — Tasvir AI" },
      {
        property: "og:description",
        content: "Hisobingiz statistikasi va butun generatsiya tarixi bir joyda.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function fmt(d: string) {
  return new Date(d).toLocaleString("uz-UZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Dashboard() {
  const { user } = useSession();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: history = [] } = useQuery({
    queryKey: ["generations-history", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("generations")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      const withUrls = await Promise.all(
        data.map(async (row) => {
          if (!row.storage_path) return { ...row, url: null as string | null };
          const { data: signed } = await supabase.storage
            .from("media")
            .createSignedUrl(row.storage_path, 3600);
          return { ...row, url: signed?.signedUrl ?? null };
        }),
      );
      return withUrls;
    },
  });

  const { data: logins = [] } = useQuery({
    queryKey: ["login-events", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("login_events")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data;
    },
  });

  const images = history.filter((h) => h.kind === "image").length;
  const videos = history.filter((h) => h.kind === "video").length;

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <Aurora />
      <SiteNav />

      <main className="relative z-10 mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-4xl font-bold">
          Salom,{" "}
          <span className="text-gradient-brand">
            {profile?.display_name ?? user?.email?.split("@")[0] ?? "do'stim"}
          </span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Bu yerda hisobingiz va butun yaratish tarixingiz saqlanadi.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Kreditlar", value: profile?.credits ?? 0 },
            { label: "Jami ishlar", value: history.length },
            { label: "Rasmlar", value: images },
            { label: "Videolar", value: videos },
          ].map((s) => (
            <div
              key={s.label}
<<<<<<< HEAD
              className="glass-panel rounded-3xl p-6 shadow-lg shadow-white/10"
=======
              className="glass-panel rounded-3xl p-6 shadow-lg shadow-brand/5"
>>>>>>> 6daf45bd9c7f394adad735bf241b3ff781303b7a
            >
              <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {s.label}
              </div>
              <div className="mt-2 font-display text-3xl font-bold">{s.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Link
            to="/studio"
            search={{}}
<<<<<<< HEAD
            className="inline-flex rounded-2xl bg-brand px-5 py-3 text-sm font-semibold text-brand-foreground shadow-md shadow-white/10 transition hover:bg-brand/90"
=======
            className="inline-flex rounded-2xl bg-brand px-5 py-3 text-sm font-semibold text-brand-foreground shadow-md shadow-brand/30 transition hover:bg-brand/90"
>>>>>>> 6daf45bd9c7f394adad735bf241b3ff781303b7a
          >
            Yangi yaratish
          </Link>
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-bold">Yaratish tarixi</h2>
          {history.length === 0 ? (
            <div className="glass-panel mt-5 rounded-3xl p-10 text-center text-sm text-muted-foreground">
              Hozircha bo'sh. Studiyada birinchi ishingizni yarating.
            </div>
          ) : (
            <div className="glass-panel mt-5 divide-y divide-glass-border overflow-hidden rounded-3xl">
              {history.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4">
                  <div className="size-14 shrink-0 overflow-hidden rounded-xl border border-glass-border bg-input">
                    {item.url && item.kind === "image" ? (
                      <img
                        src={item.url}
                        loading="lazy"
                        alt={item.prompt}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-lg">
                        {item.kind === "video" ? "🎬" : "🖼️"}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="line-clamp-1 text-sm font-medium">{item.prompt}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {item.kind === "video" ? "Video" : "Rasm"} · {item.aspect_ratio} ·{" "}
                      {fmt(item.created_at)}
                    </div>
                  </div>
                  {item.url && (
                    <a
                      href={item.url}
                      download
                      className="shrink-0 rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-brand-foreground"
                    >
                      Yuklab olish
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-12 pb-10">
          <h2 className="text-2xl font-bold">Hisobga kirishlar tarixi</h2>
          {logins.length === 0 ? (
            <div className="glass-panel mt-5 rounded-3xl p-8 text-center text-sm text-muted-foreground">
              Hozircha yozuv yo'q.
            </div>
          ) : (
            <ul className="glass-panel mt-5 divide-y divide-glass-border overflow-hidden rounded-3xl">
              {logins.map((l) => (
                <li
                  key={l.id}
                  className="flex items-center justify-between gap-3 p-4 text-sm"
                >
                  <span className="font-medium">
                    {l.event_type === "signup" ? "Ro'yxatdan o'tish" : "Kirish"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {fmt(l.created_at)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
