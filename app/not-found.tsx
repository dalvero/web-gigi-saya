"use client";

import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen max-w-lg mx-auto flex flex-col items-center justify-center bg-white px-6 font-poppins bg-cover bg-center text-center"
        style={{
          backgroundImage: "url('/images/bg_login.png')",
        }}
    >
      {/* 404 TITLE */}
      <h1 className="text-9xl font-bold text-white mb-3">
        404
      </h1>

      {/* JUDUL DAN PESAN */}
      <AlertTriangle className="text-white mb-3" size={46} />
      <h1 className="text-2xl font-semibold text-white mb-2">
        Oops! Halaman tidak ditemukan
      </h1>
      <p className="text-white text-sm font-medium mb-8 max-w-sm">
        Sepertinya kamu tersesat di rongga gigi yang salah
        Jangan khawatir, ayo kembali ke halaman utama.
      </p>

      {/* TOMBOL KEMBALI */}
      <button
        onClick={() => router.push("/home")}
        className="bg-white text-emerald-700 font-semibold px-6 py-2 rounded-full shadow-md cursor-pointer hover:scale-110 transition"
      >
        Kembali ke Beranda
      </button>

      {/* FOOTER MINI */}
      <p className="text-white text-sm font-medium mt-12">
        © {new Date().getFullYear()} Aplikasi Kesehatan Gigi Anak
      </p>
    </div>
  );
}
