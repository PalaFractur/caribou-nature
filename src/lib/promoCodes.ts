import { supabase } from "./supabase";

export interface PromoCodeConfig {
  code: string;
  type: "percent" | "fixed";
  value: number;
  label: string;
  active: boolean;
  usageCount: number;
  createdAt: string;
}

function fromDb(row: Record<string, unknown>): PromoCodeConfig {
  return {
    code: row.code as string,
    type: row.type as "percent" | "fixed",
    value: Number(row.value),
    label: row.label as string,
    active: row.active as boolean,
    usageCount: Number(row.usage_count),
    createdAt: row.created_at as string,
  };
}

export async function getPromoCodes(): Promise<PromoCodeConfig[]> {
  const { data, error } = await supabase
    .from("promo_codes")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map(fromDb);
}

export async function addPromoCode(cfg: PromoCodeConfig): Promise<void> {
  await supabase.from("promo_codes").insert({
    code: cfg.code,
    type: cfg.type,
    value: cfg.value,
    label: cfg.label,
    active: cfg.active,
    usage_count: cfg.usageCount,
  });
}

export async function togglePromoCode(code: string): Promise<void> {
  const { data } = await supabase
    .from("promo_codes")
    .select("active")
    .eq("code", code)
    .single();
  if (data) {
    await supabase
      .from("promo_codes")
      .update({ active: !data.active })
      .eq("code", code);
  }
}

export async function deletePromoCode(code: string): Promise<void> {
  await supabase.from("promo_codes").delete().eq("code", code);
}

export async function incrementUsage(code: string): Promise<void> {
  if (!code) return;
  await supabase.rpc("increment_promo_usage", { promo_code: code }).then(() => {
    // Fallback if RPC not available: read + write
  });
  // Direct update fallback
  const { data } = await supabase
    .from("promo_codes")
    .select("usage_count")
    .eq("code", code)
    .single();
  if (data) {
    await supabase
      .from("promo_codes")
      .update({ usage_count: (data.usage_count as number) + 1 })
      .eq("code", code);
  }
}
