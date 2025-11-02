"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/services/authService";

export default function AdminLoginPage() {
  // STATE UNTUK MENYIMPAN INPUT USER
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  /**
   * HANDLE LOGIN ADMIN
   * - Memanggil loginWithEmail dari authService
   * - Mengecek role user (hanya admin yang bisa masuk)
   * - Mengarahkan ke /admin setelah login berhasil
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      // PROSES LOGIN VIA SUPABASE AUTH
      await authService.loginWithEmail({ email, password });

      // AMBIL USER YANG SEDANG LOGIN DARI TABEL 'users'
      const currentUser = await authService.getCurrentUser();

      // VALIDASI ROLE
      if (!currentUser || currentUser.role !== "guru") {
        throw new Error("Akses ditolak. Hanya Guru yang dapat login di sini.");
      }

      // ARAHKAN KE DASHBOARD ADMIN
      router.push("/admin/dashboard");
    } catch (err) {
      setErrorMsg("Terjadi kesalahan saat login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-cover bg-center" style={{
        backgroundImage: "url('/images/bg_login.png')",
      }}>
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >
        <h1 className="text-2xl font-bold text-center mb-4 text-emerald-800">
          Masuk sebagai Guru
        </h1>
        <p className="text-center text-gray-500 text-1xl mb-4 font-medium">
          Masukan email dan password untuk masuk ke dalam Guru Dashboard.
        </p>

        {/* PESAN ERROR */}
        {errorMsg && (
          <p className="text-red-500 text-sm mb-3 text-center">{errorMsg}</p>
        )}

        {/* INPUT EMAIL */}
        <h1 className="text-sm font-semibold text-gray-500 mb-2">
          Email Address
        </h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-2 rounded-md text-gray-500 bg-gray-200 focus:outline-gray-500 focus:bg-white"
          required
        />

        {/* INPUT PASSWORD */}
        <h1 className="text-sm font-semibold text-gray-500 mb-2">
          Password
        </h1>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 p-2 rounded-md text-gray-500 bg-gray-200 focus:outline-gray-500 focus:bg-white"
          required
        />

        {/* TOMBOL LOGIN */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-emerald-800 text-white py-2 rounded-md mt-6 transition ${
            loading ? "opacity-70 cursor-not-allowed" : "hover:bg-emerald-500 cursor-pointer"
          }`}
        >
          {loading ? "Memproses..." : "Masuk"}
        </button>

        {/* TOMBOL REGISTER */}
        <p className="text-sm text-center mt-4 text-gray-600">
          Belum punya akun?{" "}
          <button
            type="button"
            onClick={() => router.push("/guru/register")}
            className="text-gray-500 font-medium cursor-pointer hover:text-emerald-800"
          >
            Daftar di sini
          </button>
        </p>
      </form>
    </div>
  );
}
