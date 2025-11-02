/**
 * RoleType
 * ----------------------------
 * Menentukan jenis peran (role) yang dimiliki user.
 * 
 * - "admin"    → Pengelola sekolah, dapat menambah guru dan mengelola data siswa.
 * - "guru"     → Pengajar atau kader yang ditambahkan oleh admin.
 * - "orangtua" → User yang login menggunakan NISN anak (tanpa akun email Supabase).
 */
export type RoleType = "admin" | "teacher" | "student";

/**
 * AuthUser
 * ----------------------------
 * Struktur data user yang disimpan di tabel `users` pada Supabase.
 * 
 * @property {string} id - UUID user dari Supabase Auth
 * @property {string} username - Nama tampilan user
 * @property {string} [email] - Email (hanya untuk admin dan guru)
 * @property {string} [address] - Alamat user
 * @property {string} [city] - Kota tempat tinggal user
 * @property {RoleType} role - Role user di sistem
 * @property {string} created_at - Tanggal dan waktu pembuatan akun
 */
export interface AuthUser {
  id: string;
  username: string;
  email?: string;
  address?: string;
  city?: string;
  role: RoleType;
  created_at: string;
}


/**
 * EmailLoginData
 * ----------------------------
 * Struktur data yang digunakan untuk login menggunakan email dan password.
 * 
 * Dipakai oleh role:
 * - Admin
 * - Guru
 * 
 * @example
 * const data: EmailLoginData = { email: "admin@mail.com", password: "123456" };
 */
export interface EmailLoginData {
  email: string;
  password: string;
}

/**
 * NISNLoginData
 * ----------------------------
 * Struktur data untuk login menggunakan NISN anak dan password sekolah.
 * 
 * Digunakan oleh:
 * - Orang tua / wali murid
 * 
 * @example
 * const data: NISNLoginData = { nisn: "1234567890", password_sekolah: "rahasia" };
 */
export interface NISNLoginData {
  nisn: string;
  password_sekolah: string;
}

/**
 * RegisterData
 * ----------------------------
 * Struktur data untuk mendaftarkan akun baru (Admin atau Guru).
 * 
 * @property {string} username - Nama user
 * @property {string} email - Email untuk autentikasi Supabase
 * @property {string} password - Password akun
 * @property {string} [address] - Alamat opsional
 * @property {string} [city] - Kota opsional
 * @property {Exclude<RoleType, "orangtua">} role - Role hanya bisa "admin" atau "guru"
 * 
 * @example
 * const data: RegisterData = {
 *   username: "Budi",
 *   email: "budi@guru.com",
 *   password: "123456",
 *   address: "Jl. Merdeka No.1",
 *   city: "Bandung",
 *   role: "guru"
 * };
 */
export interface RegisterData {
  username: string;
  nama_depan: string;
  nama_belakang: string;
  email: string;
  password: string;
  address?: string;
  city?: string;
  role: Exclude<RoleType, "orangtua">;
}
