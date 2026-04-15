import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

async function fetchPendingCount(): Promise<number> {
  const { count } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");
  return count || 0;
}

export function useAdminNotifications(): { pendingCount: number } {
  const [pendingCount, setPendingCount] = useState<number>(0);

  useEffect(() => {
    fetchPendingCount().then((count) => {
      setPendingCount(count);
      const base = "Admin — Caribou Nature";
      document.title = count > 0 ? `(${count}) ${base}` : base;
    });

    const interval = setInterval(async () => {
      const count = await fetchPendingCount();
      setPendingCount(count);
      const base = "Admin — Caribou Nature";
      document.title = count > 0 ? `(${count}) ${base}` : base;
    }, 30_000);

    return () => {
      clearInterval(interval);
      document.title = "Caribou Nature";
    };
  }, []);

  return { pendingCount };
}
