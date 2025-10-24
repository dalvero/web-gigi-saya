import { getSupabaseClient } from "../supabaseClient";
import { School } from "../types/schools";

export const schoolService = {
  async getAll(): Promise<School[]> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error("Supabase client not initialized.");

    const { data, error } = await supabase
      .from("sekolah")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async add(school: Omit<School, "id" | "created_at">): Promise<void> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error("Supabase client not initialized.");

    const { error } = await supabase.from("sekolah").insert([school]);
    if (error) throw error;
  },

  async remove(id: string): Promise<void> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error("Supabase client not initialized.");

    const { error } = await supabase.from("sekolah").delete().eq("id", id);
    if (error) throw error;
  },

  async update(id: string, updated: Partial<School>): Promise<void> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error("Supabase client not initialized.");

    const { error } = await supabase.from("sekolah").update(updated).eq("id", id);
    if (error) throw error;
  },
};
