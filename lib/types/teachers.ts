/**
 * Student
 * ----------------------------
 * Struktur data siswa yang disimpan di tabel `students` pada Supabase.
 * 
 * @property {string} id - UUID guru dari Supabase Auth
 * @property {string} nama_depan - Nama depan guru
 * @property {string} nama_belakang - Nama belakang guru
 * @property {string} email - Email guru
 * @property {string} address - Alamat guru
 * @property {string} city - Kota guru
 * @property {string} created_at - Tanggal dan waktu pembuatan akun
 */
export interface Teachers {
  id?: string;
  nama_depan: string;
  nama_belakang: string;
  email: string;
  address: string;
  city: string;
  role: string;
  created_at?: string;
}
