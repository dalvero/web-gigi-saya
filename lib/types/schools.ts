/**
 * School
 * ----------------------------
 * Struktur data sekolah yang disimpan di tabel `schools` pada Supabase.
 * 
 * @property {string} id - UUID sekolah dari Supabase Auth
 * @property {string} nama_sekolah - Nama lengkap sekolah
 * @property {string} provinsi - Provinsi tempat sekolah berada
 * @property {string} kota - Kota tempat sekolah berada
 * @property {string} password_sekolah - Password untuk login sebagai admin
 * @property {string} created_at - Tanggal dan waktu pembuatan akun
 */
export interface School {
  id?: string;
  nama_sekolah: string;
  provinsi: string;
  kota: string;
  password_sekolah: string;
  created_at?: string;
}
