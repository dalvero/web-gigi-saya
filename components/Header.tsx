"use client";
import { useState } from "react";
import { Menu, Settings, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/services/authService";

type HeaderProps = {
  greeting: string;
  userName: string;
  role: string;
};

export default function Header({ greeting, userName, role }: HeaderProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = async () => {
    try {
      // PANGGIL FUNSI LOGOUT DARI authService
      if (role === "teacher") {
        await authService.logoutTeachers();
      } else if (role === "student") {
        await authService.logoutStudents();
      }
      

      // BERSIHKAN localStorage & sessionStorage
      localStorage.clear();
      sessionStorage.clear();

      // REDIRECT KE LOGIN
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="relative flex items-center justify-between mt-4 mb-4">
      {/* GREETING */}
      <div>
        <p className="text-sm text-black">{greeting},</p>
        <h1 className="text-lg text-black font-semibold text-primary">
          {userName}
        </h1>
      </div>

      {/* ICONS */}
      <div className="flex items-center gap-3 relative">
        <Settings className="text-black cursor-pointer" size={20} />
        <div className="relative">
          <Menu
            className="cursor-pointer text-black"
            size={24}
            onClick={toggleMenu}
          />

          {/* DROPDOWN MENU */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-xl border border-gray-100 animate-fadeIn z-50">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-xl"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ANIMASI FADE-IN */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.15s ease-in-out;
        }
      `}</style>
    </header>
  );
}
