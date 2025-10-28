import { getSupabaseClient } from "../supabaseClient";
import { School } from "../types/schools";

/**
 * schoolService
 * ----------------------------
 * Layanan CRUD untuk mengelola data sekolah di tabel `sekolah` pada Supabase.
 */
export const schoolService = {
  /**
   * getAll()
   * ----------------------------
   * Mengambil semua data sekolah dari tabel `sekolah`.
   * 
   * @returns {Promise<School[]>} - Daftar semua sekolah.
   */
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

  /**
   * add()
   * ----------------------------
   * Menambahkan data sekolah baru ke tabel `sekolah`.
   * 
   * @param school - Data sekolah yang akan ditambahkan, tidak termasuk `id` dan `created_at`.
   */
  async add(school: Omit<School, "id" | "created_at">): Promise<void> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error("Supabase client not initialized.");

    const { error } = await supabase.from("sekolah").insert([school]);
    if (error) throw error;
  },

  /**
   * remove()
   * ----------------------------
   * Menghapus data sekolah dari tabel `sekolah` berdasarkan `id`.
   * 
   * @param id - UUID sekolah yang akan dihapus.
   */
  async remove(id: string): Promise<void> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error("Supabase client not initialized.");

    const { error } = await supabase.from("sekolah").delete().eq("id", id);
    if (error) throw error;
  },

  /**
   * update()
   * ----------------------------
   * Memperbarui data sekolah di tabel `sekolah` berdasarkan `id`.
   * 
   * @param id - UUID sekolah yang akan diperbarui.
   * @param updated - Data sekolah yang akan diperbarui, tidak termasuk `id` dan `created_at`.
   */
  async update(id: string, updated: Partial<School>): Promise<void> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error("Supabase client not initialized.");

    const { error } = await supabase.from("sekolah").update(updated).eq("id", id);
    if (error) throw error;
  },
};
