"use client";
import Button from "@/components/Button";
import InputField from "@/components/InputField";
import { authService } from "@/lib/services/authService";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [nisn, setNISN] = useState("");
  const [password_sekolah, setPasswordSekolah] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * handleLogin()
   * ----------------------------
   * Menangani proses login menggunakan NISN dan password sekolah.
   * 
   * @param e - Event form submit.
   */
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

        <InputField 
          label = "NISN"
          type="text"
          placeholder="NISN"
          value={nisn}
          onChange={(e) => setNISN(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-3xl bg-gray-300 focus:outline-emerald-800 transition-all focus:bg-white"
        />

        <InputField 
          label = "Password Sekolah"
          type="password"
          placeholder="Password Sekolah"
          value={password_sekolah}
          onChange={(e) => setPasswordSekolah(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-3xl bg-gray-300 focus:outline-emerald-800 transition-all focus:bg-white"
        />

        {errorMsg && <p className="text-red-500 text-center mb-4">{errorMsg}</p>}
        <Button
          text={loading ? "Memproses..." : "Masuk"}
          type="submit"
          variant="primary"          
          width="w-full"
          disabled={loading}          
          loading={loading}
        />
      </form>
    </div>
  );
}
