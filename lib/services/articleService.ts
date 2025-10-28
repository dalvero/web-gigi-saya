import { getSupabaseClient } from "../supabaseClient";
import { Article } from "../types/articles";

/**
 * articleService
 * ----------------------------
 * Layanan CRUD untuk tabel `articles` dan upload gambar ke storage Supabase.
 */
export const articleService = {  
  /**
   * AMBIL SEMUA ARTIKEL
   * ----------------------------
   * Mengambil semua artikel dari tabel `articles` diurutkan berdasarkan `created_at` secara descending.
   * @returns {Promise<Article[]>} Daftar artikel.
   */
  async getAll(): Promise<Article[]> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error("Supabase client not initialized.");

    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * TAMBAH ARTIKEL BARU
   * ----------------------------
   * Menambahkan artikel baru ke tabel `articles`.
   * @param {Omit<Article, "id" | "created_at">} article - Data artikel baru.
   * @returns {Promise<void>}
   */
  async add(article: Omit<Article, "id" | "created_at">): Promise<void> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error("Supabase client not initialized.");

    const { error } = await supabase.from("articles").insert([article]);
    if (error) throw error;
  },

  /**
   * UPDATE ARTIKEL
   * ----------------------------
   * Memperbarui artikel yang ada di tabel `articles`.
   * @param {number} id - ID artikel yang akan diperbarui.
   * @param {Partial<Article>} updated - Data yang akan diperbarui.
   * @returns {Promise<void>}
   */
  async update(id: number, updated: Partial<Article>): Promise<void> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error("Supabase client not initialized.");

    const { error } = await supabase.from("articles").update(updated).eq("id", id);
    if (error) throw error;
  },

  /**
   * HAPUS ARTIKEL
   * ----------------------------
   * Menghapus artikel dari tabel `articles` berdasarkan ID.
   * @param {number} id - ID artikel yang akan dihapus.
   * @returns {Promise<void>}
   */
  async remove(id: number): Promise<void> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error("Supabase client not initialized.");

    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) throw error;
  },

  /**
   * UPLOAD GAMBAR KE SUPABASE STORAGE
   * ----------------------------
   * Mengunggah gambar ke bucket `article-images` di Supabase Storage.
   * @param {File} file - File gambar yang akan diunggah.
   * @returns {Promise<string>} URL publik gambar yang diunggah.
   */
  async uploadImage(file: File): Promise<string> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error("Supabase client not initialized.");

    const fileName = `${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("article-images") // pastikan kamu sudah buat bucket "article-images"
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("article-images").getPublicUrl(fileName);
    return data.publicUrl;
  },
};
