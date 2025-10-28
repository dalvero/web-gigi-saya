/**
 * Student
 * ----------------------------
 * Struktur data siswa yang disimpan di tabel `students` pada Supabase.
 * 
 * @property {string} id - UUID siswa dari Supabase Auth
 * @property {string} nama - Nama lengkap siswa
 * @property {string} nisn - Nomor Induk Siswa Nasional
 * @property {string} sekolah_id - UUID sekolah yang dimiliki siswa
 * @property {string} tanggal_lahir - Tanggal lahir siswa
 * @property {string} created_at - Tanggal dan waktu pembuatan akun
 */
export interface Student {
  id?: string;
  nama: string;
  nisn: string;
  sekolah_id: string;
  tanggal_lahir: string;
  created_at?: string;
}
