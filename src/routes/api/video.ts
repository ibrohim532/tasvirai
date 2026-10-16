import { createFileRoute } from "@tanstack/react-router";

const BASE = "https://generativelanguage.googleapis.com/v1beta";
const OP_RE = /^models\/[\w.\-]+\/operations\/[\w\-]+$/;

const err = (message: string, status: number) => Response.json({ message }, { status });

export const Route = createFileRoute("/api/video")({
  server: {
    handlers: {
      // Veo videoni boshlaydi va operatsiya nomini qaytaradi
      POST: async ({ request }) => {
        const key = process.env["GEMINI_API_KEY"];
        if (!key) return err("GEMINI_API_KEY sozlanmagan", 500);

        const { prompt, aspectRatio, duration } = (await request.json()) as {
          prompt?: string;
          aspectRatio?: string;
          duration?: number;
        };
        if (!prompt?.trim()) return err("Prompt bo'sh", 400);

        const model = process.env["GEMINI_VIDEO_MODEL"] ?? "veo-3.1-generate-preview";
        const seconds = [4, 6, 8].includes(Number(duration)) ? Number(duration) : 8;

        const res = await fetch(`${BASE}/models/${model}:predictLongRunning`, {
          method: "POST",
          headers: { "x-goog-api-key": key, "Content-Type": "application/json" },
          body: JSON.stringify({
            instances: [{ prompt }],
            parameters: {
              aspectRatio: aspectRatio === "9:16" ? "9:16" : "16:9",
              durationSeconds: seconds,
            },
          }),
        });
        const data = (await res.json().catch(() => null)) as any;
        if (!res.ok || !data?.name) {
          return err(data?.error?.message ?? "Video buyurtma qilinmadi", res.status || 500);
        }
        return Response.json({ id: data.name });
      },

      // Holatni tekshirish yoki ?content=1 bilan tayyor videoni yuklash
      GET: async ({ request }) => {
        const key = process.env["GEMINI_API_KEY"];
        if (!key) return err("GEMINI_API_KEY sozlanmagan", 500);

        const url = new URL(request.url);
        const id = url.searchParams.get("id") ?? "";
        if (!OP_RE.test(id)) return err("Noto'g'ri id", 400);

        const res = await fetch(`${BASE}/${id}`, { headers: { "x-goog-api-key": key } });
        const op = (await res.json().catch(() => null)) as any;
        if (!res.ok) return err(op?.error?.message ?? "Holatni olib bo'lmadi", res.status);

        if (op?.error) return Response.json({ status: "failed", error: op.error });
        if (!op?.done) return Response.json({ status: "processing" });

        const sample = op.response?.generateVideoResponse?.generatedSamples?.[0];
        const uri: string | undefined = sample?.video?.uri;
        if (!uri) {
          const why = op.response?.generateVideoResponse?.raiMediaFilteredReasons?.[0];
          return Response.json({
            status: "failed",
            error: { message: why ?? "Video yaratilmadi (xavfsizlik filtri bo'lishi mumkin)." },
          });
        }

        if (!url.searchParams.get("content")) return Response.json({ status: "completed" });

        if (!uri.startsWith("https://generativelanguage.googleapis.com/")) {
          return err("Kutilmagan video manzili", 502);
        }
        const file = await fetch(uri, { headers: { "x-goog-api-key": key }, redirect: "follow" });
        if (!file.ok || !file.body) return err("Videoni yuklab bo'lmadi", file.status || 502);
        return new Response(file.body, { headers: { "Content-Type": "video/mp4" } });
      },
    },
  },
});
