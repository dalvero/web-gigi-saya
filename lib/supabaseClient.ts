// /lib/supabaseClient.ts
"use client"

import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabase: SupabaseClient | null = null;

/**
 * Kembalikan Supabase client jika dijalankan di client (browser).
 * - Jika dipanggil di server / saat build, fungsi ini mengembalikan null.
 * - Inisialisasi hanya dilakukan sekali saat runtime client.
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (typeof window === "undefined") {
    // Jangan inisialisasi di server / build
    return null;
  }

  if (supabase) return supabase;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  console.log("🔍 NEXT_PUBLIC_SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log("🔍 NEXT_PUBLIC_SUPABASE_ANON_KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "EXISTS" : "MISSING");


  if (!url || !key) {
    console.warn(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Supabase client will not be initialized."
    );
    return null;
  }

  supabase = createClient(url, key);
  return supabase;
}
