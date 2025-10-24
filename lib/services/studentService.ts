// studentService.ts
import { getSupabaseClient } from "../supabaseClient";
import { Student } from "../types/students";

export const studentService = {
  async getAll(): Promise<Student[]> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error("Supabase client not initialized.");
    const { data, error } = await supabase
      .from("students")
      .select("*, sekolah!students_sekolah_id_fkey(nama_sekolah)")
      .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
  },

  async add(student: Omit<Student, "id" | "created_at">): Promise<void> {
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error("Supabase client not initialized.");
      const { error } = await supabase.from("students").insert([student]);
      if (error) throw error;
  },

  async remove(id: string): Promise<void> {
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error("Supabase client not initialized.");
      const { error } = await supabase.from("students").delete().eq("id", id);
      if (error) throw error;
  },

  async update(id: string, updated: Partial<Student>): Promise<void> {
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error("Supabase client not initialized.");
      const { error } = await supabase.from("students").update(updated).eq("id", id);
      if (error) throw error;
  },
};
