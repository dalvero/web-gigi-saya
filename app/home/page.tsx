"use client";
import BottomNavbar from "@/components/BottomNavbar";
import { Students } from "@/lib/types/auth";
import { Search, Video, FileText, Star } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/services/authService";
import InputField from "@/components/InputField";
import Header from "@/components/Header";
import SliderCard from "@/components/SliderCard";
import ArticleCard from "@/components/ArticleCard";


export default function HomePage() {
  const router = useRouter();
  const [student, setStudent] = useState<Students | null>(null);
  const [greeting, setGreeting] = useState<string>("");
  
  useEffect(() => {
    const getStudent = async () => {
      const currentStudent = await authService.getCurrentStudents();

      if (!currentStudent) {
        router.push("/login");
        // router.push("/home");
      } else {
        setStudent(currentStudent);
      }
    };

    const setTimeGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 11) setGreeting("Selamat Pagi");
      else if (hour < 15) setGreeting("Selamat Siang");
      else if (hour < 18) setGreeting("Selamat Sore");
      else setGreeting("Selamat Malam");
    };
    
    setTimeGreeting();
    getStudent();
  }, [router]);



  return (
    <div className="min-h-screen w-full bg-gray font-poppins flex flex-col items-center">
      <div className="w-full max-w-md bg-white px-4 py-5">
        {/* HEADER */}
        <Header greeting={greeting} studentName={student?.nama || ""} />

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
              <span className="text-xs text-grey">28 Artikel</span>
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

        {/* Spasi bawah agar tidak tertutup navbar */}
        <div className="h-20" />
      </div>

      {/* BOTTOM NAVIGATION */}
      <BottomNavbar />
    </div>
  );
}
