import { createFileRoute } from "@tanstack/react-router";

const BASE = "https://generativelanguage.googleapis.com/v1beta";
const ALLOWED = ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3"];

export const Route = createFileRoute("/api/generate-image")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env["GEMINI_API_KEY"];
        if (!key) return new Response("GEMINI_API_KEY sozlanmagan", { status: 500 });

        const { prompt, aspectRatio } = (await request.json()) as {
          prompt?: string;
          aspectRatio?: string;
        };
        if (!prompt?.trim()) return new Response("Prompt bo'sh", { status: 400 });

        const model = process.env["GEMINI_IMAGE_MODEL"] ?? "gemini-2.5-flash-image";
        const res = await fetch(`${BASE}/models/${model}:generateContent`, {
          method: "POST",
          headers: { "x-goog-api-key": key, "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseModalities: ["IMAGE"],
              ...(aspectRatio && ALLOWED.includes(aspectRatio)
                ? { imageConfig: { aspectRatio } }
                : {}),
            },
          }),
        });

        const data = (await res.json().catch(() => null)) as any;
        if (!res.ok) {
          return Response.json(
            { message: data?.error?.message ?? "Rasm yaratishda xatolik" },
            { status: res.status },
          );
        }

        const parts: any[] = data?.candidates?.[0]?.content?.parts ?? [];
        const img = parts.find((p) => p.inlineData?.data ?? p.inline_data?.data);
        const b64 = img?.inlineData?.data ?? img?.inline_data?.data;
        if (!b64) {
          return Response.json(
            { message: "Model rasm qaytarmadi. Promptni o'zgartirib ko'ring." },
            { status: 422 },
          );
        }
        return Response.json({ b64_json: b64 });
      },
    },
  },
});
