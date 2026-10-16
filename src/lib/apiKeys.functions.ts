import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateApiKey, sha256Hex } from "@/lib/apiKeys.server";

export const listApiKeys = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("api_keys")
      .select("id, name, key_prefix, created_at, last_used_at, revoked_at")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  });

export const createApiKey = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { name?: string }) => input)
  .handler(async ({ data, context }) => {
    const name = (data.name ?? "").trim().slice(0, 60) || "Asosiy kalit";
    const rawKey = generateApiKey();
    const keyHash = await sha256Hex(rawKey);
    const keyPrefix = rawKey.slice(0, 10);

    const { error } = await context.supabase.from("api_keys").insert({
      user_id: context.userId,
      name,
      key_hash: keyHash,
      key_prefix: keyPrefix,
    });
    if (error) throw new Error(error.message);

    // The full key is returned only once, at creation time.
    return { key: rawKey, name };
  });

export const revokeApiKey = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("api_keys")
      .update({ revoked_at: new Date().toISOString() })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
