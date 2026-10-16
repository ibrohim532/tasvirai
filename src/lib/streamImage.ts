/** Rasm route'iga bitta so'rov yuboradi va base64 natijani qaytaradi. */
export async function streamImage(
  endpoint: string,
  prompt: string,
  onFrame: (dataUrl: string, isFinal: boolean) => void,
  aspectRatio?: string,
): Promise<void> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, aspectRatio }),
  });
  const raw = await res.text();
  let json: unknown = null;
  try {
    json = JSON.parse(raw);
  } catch {
    /* matn bo'lishi mumkin */
  }
  if (!res.ok) {
    throw new Error((json as any)?.message ?? (raw || `Rasm yaratishda xatolik (${res.status})`));
  }
  const b64 = extractB64(json);
  if (!b64) throw new Error("Model rasm qaytarmadi. Promptni o'zgartirib ko'ring.");
  onFrame(`data:image/png;base64,${b64}`, true);
}

function extractB64(payload: unknown): string | null {
  const p = payload as any;
  if (!p) return null;
  if (typeof p["b64_json"] === "string") return p["b64_json"];
  if (typeof p["image"] === "string") return p["image"];
  const arr = p["data"];
  if (Array.isArray(arr) && typeof arr[0]?.b64_json === "string") return arr[0].b64_json;
  const choice = p["choices"]?.[0];
  const images = choice?.message?.images ?? choice?.delta?.images;
  const url = images?.[0]?.image_url?.url;
  if (typeof url === "string") return url.split(",").pop() ?? null;
  return null;
}

export function dataUrlToBlob(dataUrl: string): Blob {
  const parts = dataUrl.split(",");
  const head = parts[0] ?? "";
  const body = parts[1] ?? "";
  const mime = head.match(/:(.*?);/)?.[1] ?? "image/png";
  const bin = atob(body);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}
