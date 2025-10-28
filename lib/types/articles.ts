/**
 * Article
 * ----------------------------
 * Struktur data artikel yang disimpan di tabel `articles` pada Supabase.
 * 
 * @property {number} id - ID artikel
 * @property {string} title - Judul artikel
 * @property {string} description - Deskripsi artikel
 * @property {string} image - URL gambar artikel
 * @property {string} created_at - Tanggal artikel dibuat (otomatis dari Supabase)
 */
export interface Article {
  id: number;
  title: string;
  description: string;
  image: string;
  created_at: string; // akan diisi otomatis oleh Supabase
}
