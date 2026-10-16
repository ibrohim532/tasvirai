// Server-only helpers for Tasvir AI public API keys.
// Never import this module from client components.

export async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function generateApiKey(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  const body = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `tv_${body}`;
}

/** Extracts `Bearer <key>` from a request and returns the raw key or null. */
export function bearerKey(request: Request): string | null {
  const header = request.headers.get("Authorization") ?? "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() ?? null;
}

/**
 * Verifies a public API key against the api_keys table.
 * Returns the owner's user id when valid, otherwise null.
 * Uses the admin client because callers are external (no Supabase session).
 */
export async function verifyApiKey(request: Request): Promise<string | null> {
  const raw = bearerKey(request);
  if (!raw || !raw.startsWith("tv_")) return null;

  const hash = await sha256Hex(raw);
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data, error } = await supabaseAdmin
    .from("api_keys")
    .select("id, user_id, revoked_at")
    .eq("key_hash", hash)
    .maybeSingle();

  if (error || !data || data.revoked_at) return null;

  // Best-effort usage stamp; never block the request on it.
  void supabaseAdmin
    .from("api_keys")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", data.id)
    .then(() => undefined);

  return data.user_id;
}

export const API_CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
};

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...API_CORS_HEADERS },
  });
}
