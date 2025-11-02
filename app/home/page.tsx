"use client";
import BottomNavbar from "@/components/BottomNavbar";
import { Students } from "@/lib/types/students";
import { Search, Video, FileText, Star } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/services/authService";
import InputField from "@/components/InputField";
import Header from "@/components/Header";
import SliderCard from "@/components/SliderCard";
import ArticleCard from "@/components/ArticleCard";
import { articleService } from "@/lib/services/articleService";
import { Teachers } from "@/lib/types/teachers";


export default function HomePage() {
  const router = useRouter();
  const [student, setStudent] = useState<Students | null>(null);
  const [teacher, setTeacher] = useState<Teachers | null>(null);
  const [articleCount, setArticleCount] = useState<number | null>(null);
  const [greeting, setGreeting] = useState<string>("");
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  
  // LOADING UNTUK MENUNGGU PENGECEKAN USER 
  const [checkingUser, setCheckingUser] = useState(true);

  useEffect(() => {
    const setTimeGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 11) setGreeting("Selamat Pagi");
      else if (hour < 15) setGreeting("Selamat Siang");
      else if (hour < 18) setGreeting("Selamat Sore");
      else setGreeting("Selamat Malam");
    };

    setTimeGreeting();

    // CEK STUDENT DULU (localStorage), LALU TEAHCER
    const getUser = async () => {
      try {
        if (typeof window === "undefined") {
          // SSR SAFETY
          setCheckingUser(false);
          return;
        }

        const nisn = localStorage.getItem("currentStudentNISN");
        const teacherEmail = localStorage.getItem("currentTeacherEmail");

        if (nisn) {
          try {
            const currentStudent = await authService.getCurrentStudents();
            if (currentStudent) {
              setStudent(currentStudent);
              setCheckingUser(false);
              return;
            }
            // JIKA currentStudent null, JANGAN LANGSUNG REDIRECT
            // COBA CEK TEACHER TERLEBIH DAHULU
          } catch (err) {
            console.warn("Gagal ambil student:", err);
          }
        }

        if (teacherEmail) {
          try {
            const currentTeacher = await authService.getCurrentTeachers();
            if (currentTeacher) {
              setTeacher(currentTeacher);
              setCheckingUser(false);
              return;
            }
            console.log(teacherEmail);
          } catch (err) {
            console.warn("Gagal ambil teacher:", err);
          }          
        }                        
        router.replace("/login");
      } finally {
        setCheckingUser(false);
      }
    };

    getUser();
  }, [router]);


  // DETEKSI APAKAH KEYBOARD MUNCUL
  useEffect(() => {
    let initialHeight = window.innerHeight;

    const handleResize = () => {
      const newHeight = window.innerHeight;
      // JIKA TINGGI VIEWPORT BERKURANG > 150px -> KEYBOARD MUNCUL
      if (initialHeight - newHeight > 150) {
        setIsKeyboardVisible(true);
      } else {
        setIsKeyboardVisible(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // MENGAMBIL JUMLAHA ARTIKEL
  useEffect(() => {
    const fetchData = async () => {
      try {    
        const article = await articleService.getAll();
        if (Array.isArray(article)) {
          setArticleCount(article.length);
          console.log("Jumlah artikel:", article.length);
        } else {
          console.warn("Data artikel bukan array:", article);
        }
      } catch (error) {
      console.log("Error fetching data: ", error);
      }
    };
    fetchData();
  }, []);

  // JIKA MASIH LOADING, TAMPILKAN LOADING SEDERHANA
  if (checkingUser) {
    return (
      <div className="min-h-screen w-full bg-gray font-poppins flex items-center justify-center">
        <div className="text-gray-600">Memeriksa sesi pengguna...</div>
      </div>
    );
  }

  // BENTUK userName DENGAN AMAN DAN TRIM
  const formatName = (first?: string | null, last?: string | null) => {
    const name = `${first ?? ""} ${last ?? ""}`.trim();
    return name || "";
  };

  // JIKA ADA student, GUNAKAN NAMA DARI student
  // JIKA ADA teacher, GUNAKAN NAMA DARI teacher
  // JIKA KEDUANYA NULL, GUNAKAN STRING KOSONG
  const userName =
    (student && formatName(student.nama_depan, student.nama_belakang)) ||
    (teacher && formatName(teacher.nama_depan, teacher.nama_belakang)) ||
    "";
  
  console.log(userName);

  return (
    <div className="min-h-screen w-full bg-gray font-poppins flex flex-col items-center">
      <div className="w-full max-w-md bg-white px-4 py-5">
        {/* HEADER */}
        <Header greeting={greeting} userName={userName} role={teacher ? "teacher" : "student"} />

        {/* SEARCH BAR */}
        <div className="relative mb-5">
          <InputField
            type="text"
            placeholder="Pencarian"
            className="w-full pl-10 bg-gray-300 text-black rounded-full border border-gray-300 focus:bg-white transition-all focus:outline-emerald-800"
          />
          <Search className="absolute left-4 top-4 text-black" size={18} />
        </div>

        {/* SLIDER CARD */}
        <SliderCard />

        {/* POJOK INFORMASI */}
        <div className="mb-5">
          <h3 className="text-base font-semibold mb-3 text-black">
            Pojok Informasi
          </h3>
          <div className="flex text-black justify-between gap-3">
            <div className="cursor-pointer flex flex-col items-center border border-lightGrey rounded-xl py-3 w-1/2 hover:bg-lightGrey transition">
              <Video className="text-secondary mb-2" size={24} />
              <p className="text-sm font-medium">Video</p>
              <span className="text-xs">12 Video</span>
            </div>
            <div className="cursor-pointer flex flex-col items-center border border-lightGrey rounded-xl py-3 w-1/2 hover:bg-lightGrey transition">
              <FileText className="text-secondary mb-2" size={24} />
              <p className="text-sm font-medium">Artikel</p>
              <span className="text-xs text-grey">{articleCount? articleCount: 0}</span>
            </div>
          </div>
        </div>

        {/* INFORMASI TERBARU */}
        <div className="mb-3 flex justify-between items-center">
          <h3 className="text-base font-semibold text-black">
            Informasi Terbaru
          </h3>
          <a href="#" className="text-emerald-800 text-sm font-medium">
            Selengkapnya
          </a>
        </div>

        <ArticleCard />

        {/* SPASI BAWAH AGAR TIDAK TERTUTUP NAVBAR */}
        <div className="h-20" />
      </div>

      {/* BOTTOM NAVIGATION */}
      {!isKeyboardVisible && <BottomNavbar />}
    </div>
  );
}
