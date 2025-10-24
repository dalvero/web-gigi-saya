"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/services/authService";

/**
 * Halaman registrasi untuk ADMIN.
 * - Mendaftar akun baru via Supabase Auth
 * - Menyimpan data tambahan ke tabel 'users'
 * - Role otomatis di-set ke "admin"
 */
export default function AdminRegisterPage() {
  // STATE INPUT FORM
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  /**
   * Fungsi untuk menangani proses registrasi admin
   */
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // VALIDASI PASSWORD
    if (password !== confirmPassword) {
      setErrorMsg("Password dan konfirmasi password tidak cocok.");
      return;
    }

    setLoading(true);
    try {
      await authService.registerUser({
        username,
        email,
        password,
        address: "", // DEFAULT NULL
        city: "", // DEFAULT NULL
        role: "admin", // ROLE OTOMATIS ADMIN
      });

      router.push("/admin/login");
    } catch (err) {
      setErrorMsg("Terjadi kesalahan saat registrasi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center w-full min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/bg_login.png')",
      }}
    >
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >
        <h1 className="text-2xl font-bold text-center mb-4 text-emerald-800">
          Buat Akun Admin
        </h1>
        <p className="text-center text-gray-500 text-1xl mb-4 font-medium">
          Ayo buat Akun Admin terlebih dahulu.
        </p>

        {/* PESAN ERROR */}
        {errorMsg && (
          <p className="text-red-500 text-sm mb-3 text-center">{errorMsg}</p>
        )}

        {/* INPUT NAMA PENGGUNA */}
        <h1 className="text-sm font-semibold text-gray-500 mb-2">
          Username
        </h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-3 p-2 rounded-md text-gray-500 bg-gray-200 focus:outline-gray-500 focus:bg-white"
          required
        />

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

        {/* KONFIRMASI PASSWORD */}
        <input
          type="password"
          placeholder="Konfirmasi Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full mb-3 p-2 rounded-md text-gray-500 bg-gray-200 focus:outline-gray-500 focus:bg-white"
          required
        />

        {/* TOMBOL SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-emerald-800 text-white py-2 rounded-md mt-6 transition ${
            loading ? "opacity-70 cursor-not-allowed" : "hover:bg-emerald-500 cursor-pointer"
          }`}
        >
          {loading ? "Memproses..." : "Daftar"}
        </button>

        {/* TOMBOL LOGIN */}
        <p className="text-sm text-center mt-4 text-gray-600">
          Sudah punya akun?{" "}
          <button
            type="button"
            onClick={() => router.push("/admin/login")}
            className="text-gray-500 font-medium cursor-pointer hover:text-emerald-800"
          >
            Masuk di sini
          </button>
        </p>
      </form>
    </div>
  );
}
