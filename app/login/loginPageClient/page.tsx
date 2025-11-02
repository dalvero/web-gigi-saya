"use client";
import Button from "@/components/Button";
import InputField from "@/components/InputField";
import { authService } from "@/lib/services/authService";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // MENGAMBIL QUERY PARAMETER ROLE (DEFAULT: STUDENT)
  const role = searchParams.get("role") || "student";

  const [identifier, setIdentifier] = useState(""); // NISN ATAU EMAIL
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      if (role === "teacher") {
        await authService.loginWithEmail({
          email: identifier,
          password,
        });
      } else {
        await authService.loginWithNISN({
          nisn: identifier,
          password_sekolah: password,
        });
      }

      // HILANGKAN FOKUS AGAR KEYBOARD MENUTUP
      if (typeof window !== "undefined") {
        const active = document.activeElement as HTMLElement | null;
        if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA")) {
          active.blur();
        }
        window.scrollTo(0, 0);
      }

      router.push("/home");
    } catch (err) {
      console.error(err);
      setErrorMsg("Terjadi kesalahan saat login.");
    } finally {
      setLoading(false);
    }
  };

  // TEKS DINAMIS
  const isTeacher = role === "teacher";
  const title = isTeacher ? "Selamat Datang Guru" : "Selamat Datang";
  const subtitle = isTeacher
    ? "Gunakan Email dan Password yang sudah anda buat untuk masuk ke aplikasi ini."
    : "Gunakan NISN dan Password yang diberi oleh sekolah kamu untuk masuk ke aplikasi ini.";

  const label = isTeacher ? "Email" : "NISN";
  const placeholder = isTeacher ? "Email" : "NISN";
  const passwordLabel = isTeacher ? "Password" : "Password Sekolah";

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
          <h2 className="text-2xl font-semibold mb-4 text-center">{title}</h2>
          <p className="text-center mb-5 text-1xl">{subtitle}</p>
        </div>

        <InputField
          label={label}
          type="text"
          placeholder={placeholder}
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="w-full px-4 py-3 rounded-3xl bg-gray-300 focus:outline-emerald-800 transition-all focus:bg-white"
        />

        <InputField
          label={passwordLabel}
          type="password"
          placeholder={passwordLabel}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 mb-4 py-3 rounded-3xl bg-gray-300 focus:outline-emerald-800 transition-all focus:bg-white"
        />

        {errorMsg && <p className="text-red-500 text-center mb-4">{errorMsg}</p>}

        <Button
          text={loading ? "Memproses..." : "Masuk"}
          type="submit"
          variant="primary"
          width="w-full"
          disabled={loading}
          loading={loading}
          className="mb-2"
        />

        <p className="text-sm text-center mb-4 text-gray-600">
          {isTeacher ? "Masuk sebagai Siswa?" : "Masuk sebagai Guru?"}{" "}
          <button
            type="button"
            onClick={() =>
              router.push(isTeacher ? "/login" : "/login?role=teacher")
            }
            className="text-gray-500 font-medium cursor-pointer hover:text-emerald-800"
          >
            Masuk di sini
          </button>
        </p>
      </form>
    </div>
  );
}
