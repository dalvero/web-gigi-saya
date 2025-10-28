"use client";

import React from "react";
import { Home, FileText, Video, Stethoscope, ClipboardClock } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function BottomNavbar() {
  const router = useRouter();
  const pathname = usePathname();

  const items = [
    { label: "Home", icon: <Home size={25} />, path: "/home" },
    { label: "Artikel", icon: <FileText size={25} />, path: "/artikel" },
    { label: "Video", icon: <Video size={25} />, path: "/video" },
    { label: "Logbook", icon: <ClipboardClock size={25} />, path: "/logbook" },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-emerald-800 shadow-lg py-3 flex justify-around items-center rounded-t-3xl z-50 ">
      {/* KIRI */}
      <div className="flex gap-10">
        {items.slice(0, 2).map((item) => {
          const isActive = pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => router.push(item.path)}
              className={`flex flex-col items-center text-sm font-medium transition-all rounded-full p-2 ${
                isActive
                  ? "text-emerald-700 bg-emerald-100 shadow-inner"
                  : "text-white hover:text-gray-700 hover:bg-emerald-100/40"
              } focus:outline-none focus:ring-2 focus:ring-emerald-300`}
            >
              {item.icon}
            </button>
          );
        })}
      </div>

      {/* TOMBOL TENGAH */}
      <button
        onClick={() => router.push("/konsultasi")}
        className={`absolute bottom-5 p-4 rounded-full shadow-lg text-white transition-transform duration-200 ${
          pathname === "/konsultasi"
            ? "bg-emerald-500 ring-4 ring-emerald-200 scale-105"
            : "bg-emerald-600 hover:scale-105 active:scale-95 focus:ring-4 focus:ring-emerald-300"
        }`}
      >
        <Stethoscope size={30} />
      </button>

      {/* KANAN */}
      <div className="flex gap-8">
        {items.slice(2).map((item) => {
          const isActive = pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => router.push(item.path)}
              className={`flex flex-col items-center text-sm font-medium transition-all rounded-full p-2 ${
                isActive
                  ? "text-emerald-700 bg-emerald-100 shadow-inner"
                  : "text-white hover:text-gray-700 hover:bg-emerald-100/40"
              } focus:outline-none focus:ring-2 focus:ring-emerald-300`}
            >
              {item.icon}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
