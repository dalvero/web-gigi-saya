"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabaseClient";

const supabase = getSupabaseClient();

import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { authService } from "@/lib/services/authService";
import { AuthUser } from "@/lib/types/auth";
import { articleService } from "@/lib/services/articleService";
import { schoolService } from "@/lib/services/schoolService";
import { studentService } from "@/lib/services/studentService";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null); // Hanya pakai AuthUser
  const [userCount, setUserCount] = useState<number>(0);
  const [articleCount, setArticleCount] = useState<number>(0);
  const [schoolCount, setSchoolCount] = useState<number>(0);
  const [studentCount, setStudentCount] = useState<number>(0);

  // FETCH USER
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

  // MENGAMBIL JUMLAH DATA USER
  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const usersData = await authService.getAll();
        if (Array.isArray(usersData)) {
          setUserCount(usersData.length);
          console.log("Jumlah user:", usersData.length);
        } else {
          console.warn("Data user bukan array:", usersData);
        }
      } catch (error) {
        console.log("Error fetching user count:", error);
      }
    };
    fetchUserCount();
  }, []);

  // MENGAMBIL JUMLAH DATA ARTICLE
  useEffect(() => {
    const fetchArticleCount = async () => {
      try {
        const article = await articleService.getAll();
        if (Array.isArray(article)) {
          setArticleCount(article.length);
          console.log("Jumlah artikel:", article.length);
        } else {
          console.warn("Data artikel bukan array:", article);
        }
      } catch (error) {
        console.log("Error fetching artikel count:", error);
      }
    };
    fetchArticleCount();
  }, []);

  // MENGAMBIL JUMLAH DATA SCHOOL
  useEffect(() => {
    const fetchSchoolCount = async () => {
      try {
        const schoolsData = await schoolService.getAll();
        if (Array.isArray(schoolsData)) {
          setSchoolCount(schoolsData.length);
          console.log("Jumlah sekolah:", schoolsData.length);
        } else {
          console.warn("Data sekolah bukan array:", schoolsData);
        }
      } catch (error) {
        console.log("Error fetching school count:", error);
      }
    };
    fetchSchoolCount();
  }, []);

  // MENGAMBIL JUMLAH DATA STUDENT
  useEffect(() => {
    const fetchStudentCount = async () => {
      try {
        const studentsData = await studentService.getAll();
        if (Array.isArray(studentsData)) {
          setStudentCount(studentsData.length);
          console.log("Jumlah siswa:", studentsData.length);
        } else {
          console.warn("Data siswa bukan array:", studentsData);
        }
      } catch (error) {
        console.log("Error fetching student count:", error);
      }
    };
    fetchStudentCount();
  }, []);
  
  const handleLogout = async () => {
    await supabase?.auth.signOut();
    router.push("/admin/login");
  };

  // data dummy
  const stats = [
    { title: "Total User", value: userCount },
    { title: "Total Artikel", value: articleCount },
    { title: "Total School", value: schoolCount },
    { title: "Total Student", value: studentCount },
  ];

  return (
    <div className="flex min-h-screen w-full bg-gray-100 text-gray-800">
      <Sidebar onLogout={handleLogout} />

      <main className="flex-1 flex flex-col">
        <Navbar username={user?.username} email={user?.email} role={user?.role} />

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
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
