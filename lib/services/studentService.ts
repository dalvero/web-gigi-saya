import { getSupabaseClient } from "../supabaseClient";
import { Student } from "../types/students";

/**
 * studentService
 * ----------------------------
 * Layanan CRUD untuk mengelola data siswa di tabel `students` pada Supabase.
 */
export const studentService = {
  /**
   * getAll()
   * ----------------------------
   * Mengambil semua data siswa dari tabel `students`, termasuk detail sekolah.
   * 
   * @returns {Promise<Student[]>} - Daftar semua siswa.
   */
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

  /**
   * add()
   * ----------------------------
   * Menambahkan data siswa baru ke tabel `students`.
   * 
   * @param student - Data siswa yang akan ditambahkan, tidak termasuk `id` dan `created_at`.
   */
  async add(student: Omit<Student, "id" | "created_at">): Promise<void> {
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error("Supabase client not initialized.");
      const { error } = await supabase.from("students").insert([student]);
      if (error) throw error;
  },

  /**
   * remove()
   * ----------------------------
   * Menghapus data siswa dari tabel `students` berdasarkan `id`.
   * 
   * @param id - UUID siswa yang akan dihapus.
   */
  async remove(id: string): Promise<void> {
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error("Supabase client not initialized.");
      const { error } = await supabase.from("students").delete().eq("id", id);
      if (error) throw error;
  },

  /**
   * update()
   * ----------------------------
   * Memperbarui data siswa di tabel `students` berdasarkan `id`.
   * 
   * @param id - UUID siswa yang akan diperbarui.
   * @param updated - Data siswa yang akan diperbarui, tidak termasuk `id` dan `created_at`.
   */
  async update(id: string, updated: Partial<Student>): Promise<void> {
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error("Supabase client not initialized.");
      const { error } = await supabase.from("students").update(updated).eq("id", id);
      if (error) throw error;
  },
};
