/**
 * Student
 * ----------------------------
 * Struktur data siswa yang disimpan di tabel `students` pada Supabase.
 * 
 * @property {string} id - UUID siswa dari Supabase Auth
 * @property {string} nama_depan - Nama depan siswa
 * @property {string} nama_belakang - Nama belakang siswa
 * @property {string} nisn - Nomor Induk Siswa Nasional
 * @property {string} sekolah_id - UUID sekolah yang dimiliki siswa
 * @property {string} tanggal_lahir - Tanggal lahir siswa
 * @property {string} created_at - Tanggal dan waktu pembuatan akun
 */
export interface Students {
  id?: string;
  nama_depan: string;
  nama_belakang: string;
  nisn: string;
  sekolah_id: string;
  tanggal_lahir: string;
  role: string;
  created_at?: string;
}
