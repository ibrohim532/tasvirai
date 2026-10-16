import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { streamImage, dataUrlToBlob } from "@/lib/streamImage";
import { Aurora } from "@/components/Aurora";
import { SiteNav } from "@/components/SiteNav";

type Kind = "image" | "video";

export const Route = createFileRoute("/_authenticated/studio")({
  validateSearch: (search: Record<string, unknown>): { prompt?: string } =>
    typeof search["prompt"] === "string" ? { prompt: search["prompt"] } : {},
  head: () => ({
    meta: [
      { title: "Studiya — AI video va rasm yaratish | Tasvir" },
      {
        name: "description",
        content:
          "Tasvir studiyasida prompt yozing, nisbat va davomiylikni tanlang va AI video yoki rasm yarating.",
      },
      { property: "og:title", content: "Studiya — AI video va rasm yaratish | Tasvir" },
      {
        property: "og:description",
        content: "Prompt yozing va bir klikda AI video yoki rasm oling.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Studio,
});

const SUGGESTIONS = [
  "Tuman bosgan tog' vodiysi, tong chog'i, kinematografik yorug'lik",
  "Neon chiroqli kelajak shahri, yomg'ir, keng burchakli kadr",
  "Oltin soatda dalada yugurayotgan ot, sekin harakat",
];

const IMAGE_RATIOS = ["1:1", "16:9", "9:16", "4:3"] as const;
const VIDEO_RATIOS = ["16:9", "9:16"] as const;
const DURATIONS = [4, 6, 8] as const;

function Studio() {
  const search = Route.useSearch();
  const { user } = useSession();
  const queryClient = useQueryClient();

  const [kind, setKind] = useState<Kind>("image");
  const [prompt, setPrompt] = useState(search.prompt ?? "");
  const [ratio, setRatio] = useState<string>("1:1");
  const [duration, setDuration] = useState<number>(8);
  const [busy, setBusy] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [previewFinal, setPreviewFinal] = useState(false);

  const ratios = kind === "image" ? IMAGE_RATIOS : VIDEO_RATIOS;
  useEffect(() => {
    if (!ratios.includes(ratio as never)) setRatio(ratios[0]);
  }, [kind]); // eslint-disable-line react-hooks/exhaustive-deps

  const { data: items = [] } = useQuery({
    queryKey: ["generations", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("generations")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(24);
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

  async function save(kindArg: Kind, blob: Blob, ext: string) {
    if (!user) return;
    const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("media")
      .upload(path, blob, { contentType: blob.type });
    if (upErr) throw upErr;
    const { error: insErr } = await supabase.from("generations").insert({
      user_id: user.id,
      kind: kindArg,
      prompt,
      aspect_ratio: ratio,
      duration_seconds: kindArg === "video" ? duration : null,
      status: "completed",
      storage_path: path,
    });
    if (insErr) throw insErr;
    queryClient.invalidateQueries({ queryKey: ["generations", user.id] });
  }

  async function generateImage() {
    setStatusText("Rasm chizilmoqda...");
    let last: string | null = null;
    await streamImage(
      "/api/generate-image",
      prompt,
      (url, final) => {
        last = url;
        setPreview(url);
        setPreviewFinal(final);
      },
      ratio,
    );
    if (!last) throw new Error("Rasm qaytmadi");
    setStatusText("Saqlanmoqda...");
    await save("image", dataUrlToBlob(last), "png");
  }

  async function generateVideo() {
    setStatusText("Video buyurtma berilmoqda...");
    const createRes = await fetch("/api/video", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, aspectRatio: ratio, duration }),
    });
    if (!createRes.ok) {
      const raw = await createRes.text();
      if (createRes.status === 429)
        throw new Error("Google limiti tugadi yoki so'rovlar juda ko'p. Biroz kutib, qayta urinib ko'ring.");
      let msg = raw;
      try {
        msg = JSON.parse(raw).message ?? raw;
      } catch {
        /* keep raw */
      }
      throw new Error(msg);
    }
    const job = await createRes.json();

    setStatusText("Video tayyorlanmoqda (1-3 daqiqa)...");
    for (let i = 0; i < 90; i++) {
      await new Promise((r) => setTimeout(r, 6000));
      const pollRes = await fetch(`/api/video?id=${encodeURIComponent(job.id)}`);
      if (!pollRes.ok) throw new Error(await pollRes.text());
      const status = await pollRes.json();
      if (status.progress) setStatusText(`Video tayyorlanmoqda... ${status.progress}%`);
      if (status.status === "failed") {
        throw new Error(status.error?.message ?? "Video yaratilmadi");
      }
      if (status.status === "completed") {
        setStatusText("Yuklab olinmoqda...");
        const contentRes = await fetch(
          `/api/video?id=${encodeURIComponent(job.id)}&content=1`,
        );
        if (!contentRes.ok) throw new Error(await contentRes.text());
        const blob = await contentRes.blob();
        setPreview(URL.createObjectURL(blob));
        setPreviewFinal(true);
        setStatusText("Saqlanmoqda...");
        await save("video", blob, "mp4");
        return;
      }
    }
    throw new Error("Video juda uzoq davom etdi. Keyinroq urinib ko'ring.");
  }

  async function onGenerate() {
    if (!prompt.trim()) {
      toast.error("Avval tavsif (prompt) yozing.");
      return;
    }
    setBusy(true);
    setPreview(null);
    setPreviewFinal(false);
    try {
      if (kind === "image") await generateImage();
      else await generateVideo();
      toast.success("Tayyor!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Xatolik yuz berdi");
    } finally {
      setBusy(false);
      setStatusText("");
    }
  }

  const previewIsVideo = useMemo(
    () => kind === "video" && !!preview && !preview.startsWith("data:image"),
    [kind, preview],
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <Aurora />
      <SiteNav />

      <main className="relative z-10 mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-4xl font-bold">
          <span className="text-gradient-brand">Studiya</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Tavsif yozing, rejimni tanlang va natijani oling.
        </p>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_0.85fr]">
          <section className="glass-panel rounded-3xl p-6 shadow-lg shadow-brand/5">
            <div className="flex gap-1 rounded-xl border border-glass-border bg-input p-1">
              <button
                onClick={() => setKind("image")}
                className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${
                  kind === "image"
                    ? "bg-brand text-brand-foreground"
                    : "text-muted-foreground hover:text-brand"
                }`}
              >
                Rasm
              </button>
              <button
                onClick={() => setKind("video")}
                className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${
                  kind === "video"
                    ? "bg-brand text-brand-foreground"
                    : "text-muted-foreground hover:text-brand"
                }`}
              >
                Video
              </button>
            </div>

            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Sahna, uslub, yorug'lik va kamera burchagini batafsil yozing..."
              className="mt-5 w-full resize-none rounded-2xl border border-glass-border bg-input p-4 text-sm leading-relaxed placeholder:text-muted-foreground/70 focus:border-brand focus:outline-none"
            />

            <div className="mt-3 flex flex-wrap gap-2">
              {SUGGESTIONS.map((t) => (
                <button
                  key={t}
                  onClick={() => setPrompt(t)}
                  className="line-clamp-1 max-w-full rounded-full border border-glass-border bg-input px-3 py-1 text-xs text-muted-foreground transition hover:border-brand/50 hover:text-foreground"
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="mt-5">
              <div className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Nisbat
              </div>
              <div className="flex flex-wrap gap-2">
                {ratios.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRatio(r)}
                    className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                      ratio === r
                        ? "bg-brand/15 text-brand ring-1 ring-brand/40"
                        : "border border-glass-border bg-input text-muted-foreground hover:text-brand"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {kind === "video" && (
              <div className="mt-5">
                <div className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Davomiylik
                </div>
                <div className="flex flex-wrap gap-2">
                  {DURATIONS.map((d) => (
                    <button
                      key={d}
                      onClick={() => setDuration(d)}
                      className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                        duration === d
                          ? "bg-brand/15 text-brand ring-1 ring-brand/40"
                          : "border border-glass-border bg-input text-muted-foreground hover:text-brand"
                      }`}
                    >
                      {d}s
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={onGenerate}
              disabled={busy}
              className="mt-6 w-full rounded-2xl bg-gradient-to-r from-brand to-brand/80 py-3.5 text-sm font-semibold text-brand-foreground shadow-lg shadow-brand/30 transition hover:brightness-110 disabled:opacity-60"
            >
              {busy ? statusText || "Yaratilmoqda..." : "Yaratish"}
            </button>
          </section>

          <section className="glass-panel rounded-3xl p-6 shadow-lg shadow-brand/5">
            <div className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Natija
            </div>
            <div
              style={{ aspectRatio: ratio.replace(":", " / ") }}
              className={`relative mx-auto grid max-h-[560px] w-full place-items-center overflow-hidden rounded-2xl border border-glass-border bg-black/30 ${busy && !preview ? "shimmer" : ""}`}
            >
              {preview ? (
                previewIsVideo ? (
                  <video
                    src={preview}
                    controls
                    autoPlay
                    loop
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <img
                    src={preview}
                    alt="Yaratilgan natija"
                    className={`h-full w-full object-contain transition-[filter] duration-700 ${
                      previewFinal ? "blur-0" : "blur-xl"
                    }`}
                  />
                )
              ) : (
                <span className="px-6 text-center text-xs uppercase tracking-widest text-muted-foreground/70">
                  {busy ? statusText : "Natija shu yerda ko'rinadi"}
                </span>
              )}
            </div>
          </section>
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-bold">Galereya</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Sizning saqlangan ishlaringiz.
          </p>

          {items.length === 0 ? (
            <div className="glass-panel mt-5 rounded-3xl p-10 text-center text-sm text-muted-foreground">
              Hozircha bo'sh. Birinchi rasm yoki videoyingizni yarating.
            </div>
          ) : (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {items.map((item) => (
                <figure
                  key={item.id}
                  className="glass-panel group relative overflow-hidden rounded-2xl transition hover:-translate-y-0.5 hover:border-brand/40"
                >
                  {item.url ? (
                    item.kind === "video" ? (
                      <video
                        src={item.url}
                        controls
                        className="aspect-square w-full bg-black object-cover"
                      />
                    ) : (
                      <img
                        src={item.url}
                        loading="lazy"
                        alt={item.prompt}
                        className="aspect-square w-full object-cover"
                      />
                    )
                  ) : (
                    <div className="aspect-square w-full" />
                  )}
                  <figcaption className="flex items-center justify-between gap-2 p-3">
                    <span className="line-clamp-1 text-xs text-muted-foreground">
                      {item.prompt}
                    </span>
                    {item.url && (
                      <a
                        href={item.url}
                        download
                        className="shrink-0 rounded-lg bg-brand px-2.5 py-1.5 text-xs font-semibold text-brand-foreground"
                      >
                        Yuklab olish
                      </a>
                    )}
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
