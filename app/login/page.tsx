"use client";
import { authService } from "@/lib/services/authService";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [nisn, setNISN] = useState("");
  const [password_sekolah, setPasswordSekolah] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      // LOGIN MENGGUNAKAN NISN DAN PASSWORD SEKOLAH
      await authService.loginWithNISN({ nisn, password_sekolah });

      // AMBIL DATA LENGKAP STUDENT       
      // (OPTIONAL KALAU INGIN PAKAI function getCurrentStudents)
      const currentStudent = await authService.getCurrentStudents();

      // VALIDASI KALAU DATA STUDENT TIDAK ADA
      if (!currentStudent) {
        throw new Error("Data siswa tidak ditemukan.");
      }

      // REDIRECT KE HOME
      router.push("/home");
    } catch (err) {
      setErrorMsg("Terjadi kesalahan saat login.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div
        className="items-center flex-col flex w-lg justify-center min-h-screen bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/bg_login.png')",
        }}
      >
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-md text-black w-[350px]"
      >
        <div className="flex-col">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Selamat Datang
          </h2>

          <p className="text-center mb-5 text-1xl">
            Gunakan NISN dan Password yang diberi oleh sekolah
            kamu untuk masuk ke aplikasi ini.
          </p>
        </div>

        <h1 className="text-1xl font-semibold pl-3">NISN</h1>
        <input
          type="text"
          placeholder="NISN"
          value={nisn}
          onChange={(e) => setNISN(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-3xl bg-gray-300 focus:outline-emerald-800 transition-all focus:bg-white"
        />

        <h1 className="text-1xl font-semibold pl-3">Password Sekolah</h1>
        <input
          type="password"
          placeholder="Password Sekolah"
          value={password_sekolah}
          onChange={(e) => setPasswordSekolah(e.target.value)}
          className="w-full mb-8 px-4 py-3 rounded-3xl bg-gray-300 focus:outline-emerald-800 transition-all focus:bg-white"
        />

        {errorMsg && <p className="text-red-500 text-center mb-4">{errorMsg}</p>}
        <button
          type="submit"
          className={`w-full text-1xl font-semibold text-white py-3 rounded-2xl transition-all cursor-pointer 
            ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-800 hover:bg-emerald-400'}`}
          disabled={loading}
        >
          {loading ? "Memproses..." : "Masuk"}
        </button>
      </form>
    </div>
  );
}
