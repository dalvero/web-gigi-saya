import type { SupabaseClient } from "@supabase/supabase-js";
import {
  AuthUser,
  EmailLoginData,
  NISNLoginData,
  RegisterData,  
} from "@/lib/types/auth";
import { Students } from "@/lib/types/students";
import { Teachers } from "../types/teachers";

/*
 * currentStudentNISN
 * ----------------------------
 * Variabel ini menyimpan NISN siswa yang sedang login.
 * Nilainya diambil dari localStorage di browser, atau null di server.
 */
let currentStudentNISN: string | null = 
  typeof window !== "undefined" ? localStorage.getItem("currentStudentNISN") : null;

/**
 * currentTeacherEmail
 * ----------------------------
 * Variabel ini menyimpan email guru yang sedang login.
 * Nilainya diambil dari localStorage di browser, atau null di server.
 */
let currentTeacherEmail: string | null = 
  typeof window !== "undefined" ? localStorage.getItem("currentTeacherEmail") : null;


async function getSupabase(): Promise<SupabaseClient> {
  // Jika di server (SSR / build di Vercel)
  if (typeof window === "undefined") {
    console.warn("⚠️ getSupabase() dipanggil di server — menggunakan fallback client.");
    const { createClient } = await import("@supabase/supabase-js");
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    return createClient(url, key);
  }

  const { getSupabaseClient } = await import("@/lib/supabaseClient");
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error(
      "Supabase client gagal diinisialisasi. Pastikan environment variable sudah benar."
    );
  }
  return supabase;
}


/**
 * authService
 * ----------------------------
 * Modul ini menangani semua proses autentikasi dan manajemen akun user
 * menggunakan Supabase. 
 * Mencakup login (email/NISN), registrasi admin/guru, dan pengambilan data user.
 */
export const authService = {
  /**
   * getAll()
   * ----------------------------
   * Mengambil semua data user dari tabel `users`
   * 
   * @returns {Promise<AuthUser[]>} - Daftar semua user.
   */
  async getAll(): Promise<AuthUser[]> {
    const supabase = await getSupabase();
    if (!supabase) throw new Error("Supabase client not initialized.");
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
  },

  /**
   * Login untuk ADMIN atau GURU menggunakan email dan password.
   * 
   * @param {EmailLoginData} param0 - Data login berisi email dan password
   * @returns {Promise<any>} Data user dari Supabase Auth
   * @throws {Error} Jika email atau password salah
   * 
   * @example
   * await authService.loginWithEmail({ email: "admin@mail.com", password: "123456" });
   */
  async loginWithEmail({ email, password }: EmailLoginData) {
    const supabase = await getSupabase();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    currentTeacherEmail = email;
    if (typeof window !== "undefined") {
      localStorage.setItem("currentTeacherEmail", email);
    }

    return data;
  },

  /**
   * Login untuk ORANG TUA menggunakan NISN anak dan password sekolah.
   * 
   * @param {NISNLoginData} param0 - Data login berisi NISN dan password sekolah
   * @returns {Promise<any>} Data siswa dari tabel "students"
   * @throws {Error} Jika kombinasi NISN dan password tidak ditemukan
   * 
   * @example
   * await authService.loginWithNISN({ nisn: "1234567890", password: "rahasia" });
   */
  async loginWithNISN({ nisn, password_sekolah }: NISNLoginData) {
    const supabase = await getSupabase();

    const { data: student, error: studentError } = await supabase
      .from("students")
      .select("*")
      .eq("nisn", nisn.trim())
      .single();

    if (studentError || !student) {
      throw new Error("NISN tidak ditemukan");
    }

    currentStudentNISN = nisn;
    if (typeof window !== "undefined") {
      localStorage.setItem("currentStudentNISN", nisn);
    }

    // AMBIL DATA SEKOLAH BERDASARKAN sekolah_id
    const { data: sekolah, error: sekolahError } = await supabase
      .from("sekolah")
      .select("*")
      .eq("id", student.sekolah_id)
      .single();

    if (sekolahError || !sekolah) {
      throw new Error("Data sekolah tidak ditemukan");
    }

    // CEK PASSWORD SEKOLAH
    if (sekolah.password_sekolah !== password_sekolah) {
      throw new Error("Password sekolah salah");
    }

    // JIKA VALID, RETURN DATA SISWA
    return student;
  },

  /**
   * Mengambil data siswa yang sedang login berdasarkan NISN terakhir.
   */
  async getCurrentStudents(): Promise<Students | null> {
    if (!currentStudentNISN && typeof window !== "undefined") {
      currentStudentNISN = localStorage.getItem("currentStudentNISN");
    }
    if (!currentStudentNISN) return null;

    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("nisn", currentStudentNISN)
      .single();

    if (error || !data) return null;
    return data as Students;
  },

  /**
   * Mengambil data guru yang sedang login berdasarkan email.
   */
  async getCurrentTeachers(): Promise<Teachers | null> {
    if (!currentTeacherEmail && typeof window !== "undefined") {
      currentTeacherEmail = localStorage.getItem("currentTeacherEmail");
    }
    if (!currentTeacherEmail) return null;

    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from("teachers")
      .select("*")
      .eq("email", currentTeacherEmail)
      .single();

    if (error || !data) return null;
    return data as Teachers;  
  },


  /**
   * Logout siswa (hapus NISN tersimpan).
   */
  logoutStudents() {
    currentStudentNISN = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("currentStudentNISN");
    }
  },

  /**
   * Logout guru (hapus email tersimpan).
   */
  logoutTeachers() {
    currentTeacherEmail = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("currentTeacherEmail");
    }
  },

  /**
   * Registrasi user baru (ADMIN atau GURU).
   * 
   * Proses ini akan:
   * 1. Membuat akun autentikasi di Supabase Auth.
   * 2. Menyimpan data user tambahan ke tabel "users".
   *
   * @param {RegisterData} userData - Data registrasi user (email, username, role, dll.)
   * @returns {Promise<any>} Data hasil registrasi dari Supabase
   * @throws {Error} Jika proses signup atau insert gagal
   *
   * @example
   * await authService.registerUser({
   *   username: "Budi",
   *   email: "budi@guru.com",
   *   password: "123456",
   *   address: "Jl. Merdeka No.1",
   *   city: "Bandung",
   *   role: "guru"
   * });
   */
  async registerUser(userData: RegisterData) {
    const supabase = await getSupabase();
    const {
      email,
      password,
      username,
      nama_depan,
      nama_belakang,
      address,
      city,
      role,
    } = userData as RegisterData & {
      nama_depan?: string;
      nama_belakang?: string;
    };

    // TENTUKAN REDIRECT URL SESUAI ROLE
    let redirectUrl = `${window.location.origin}/app/login`;
    if (role === "admin") redirectUrl = `${window.location.origin}/admin/login`;
    if (role === "teacher") redirectUrl = `${window.location.origin}/guru/login`;

    // BUAT AKUN DI SUPABASE AUTH
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    if (error) throw new Error(`Gagal membuat akun: ${error.message}`);    
    // SIMPAN DETAIL TAMBAHAN DI TABEL USERS
    const userId = data.user?.id;
    if (!userId) throw new Error("Gagal mendapatkan ID user dari Supabase Auth.");

    const { error: insertError } = await supabase.from("users").insert([
      {
        id: userId,
        username,
        email,
        address: address || null,
        city: city || null,
        role,
        created_at: new Date().toISOString(),
      },
    ]);

    // DEBUG DISINI
    // console.log(insertError);

    if (insertError)
      throw new Error(`Gagal menyimpan data user: ${insertError.message}`);    

    // JIKA ROLE = "admin", SIMPAN JUGA KE TABEL ADMIN
    if (role === "admin") {
      const { error: adminError } = await supabase.from("admins").insert([
        {
          nama_depan: nama_depan ?? "",
          nama_belakang: nama_belakang ?? "",
          email,
          address: address || null,
          city: city || null,
          role: "admin",
          created_at: new Date().toISOString(),
        },
      ]);

      if (adminError)
      throw new Error(
        `Gagal menyimpan data ke tabel admins: ${adminError.message}`
      );
    }

    // JIKA ROLE = "guru", SIMPAN JUGA KE TABEL GURU
    if (role === "teacher") {
      const { error: guruError } = await supabase.from("teachers").insert([
        {
          nama_depan: nama_depan ?? "",
          nama_belakang: nama_belakang ?? "",
          email,
          address: address || null,
          city: city || null,
          role: "teacher",
          created_at: new Date().toISOString(),
        },
      ]);

      if (guruError)
      throw new Error(
        `Gagal menyimpan data ke tabel guru: ${guruError.message}`
      )
    }    
    return data;
  },



  /**
   * Mendapatkan data user yang sedang login.
   * Mengambil data dari Supabase Auth, lalu mencocokkannya dengan tabel "users".
   * 
   * @returns {Promise<AuthUser | null>} Data user yang sedang login, atau `null` jika tidak ada
   * @example
   * const user = await authService.getCurrentUser();
   * console.log(user?.role); // contoh: "admin"
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    const supabase = await getSupabase();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) return null;

    // AMBIL DATA LENGKAP USER DARI TABEL "users"
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();
    return data as AuthUser;
  },
};
