"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabaseClient";

const supabase = getSupabaseClient();

import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { authService } from "@/lib/services/authService";
import { AuthUser } from "@/lib/types/auth";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null); // Hanya pakai AuthUser

  useEffect(() => {
    const getUser = async () => {
      const currentUser = await authService.getCurrentUser();

      if (!currentUser) {
        router.push("/admin/login");
      } else {
        setUser(currentUser);
      }
    };

    getUser();
  }, [router]);


  const handleLogout = async () => {
    await supabase?.auth.signOut();
    router.push("/admin/login");
  };

  // data dummy
  const stats = [
    { title: "Total User", value: 105 },
    { title: "Total Artikel", value: 10 },
    { title: "Total Produk", value: 20 },
    { title: "Report User", value: 5 },
  ];

  return (
    <div className="flex min-h-screen w-full bg-gray-100 text-gray-800">
      <Sidebar onLogout={handleLogout} />

      <main className="flex-1 flex flex-col">
        <Navbar username={user?.username} email={user?.email} />

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-1">
            Welcome back, {user?.username || "Admin"}
          </h2>
          <p className="text-gray-500 mb-6">Overview</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow p-5 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-700 font-medium">{item.title}</h3>
                </div>
                <p className="text-3xl font-bold text-emerald-700">
                  {item.value}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="text-emerald-600 font-semibold">
                    ↑ 8.5%
                  </span>{" "}
                  up from yesterday
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
