"use client";

import React from "react";
import {
  User,
  FileText,
  School,
  BookUser,
  Settings,
  LogOut,
  Gift,
  LayoutDashboard,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

interface SidebarProps {
  onLogout: () => Promise<void>;
}

export default function Sidebar({ onLogout }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Daftar menu sidebar
  const menuItems = [
    { icon: <LayoutDashboard />, label: "Dashboard", path: "/admin/dashboard" },
    { icon: <User />, label: "Users", path: "/admin/dashboard/users" },
    { icon: <FileText />, label: "Artikel", path: "/admin/dashboard/artikel" },
    { icon: <School />, label: "Schools", path: "/admin/dashboard/schools" },
    { icon: <BookUser />, label: "Students", path: "/admin/dashboard/students" },
    { icon: <Gift />, label: "Redeem", path: "/dashboard/redeem" },
  ];

  return (
    <aside className="w-64 bg-emerald-500 text-white flex flex-col justify-between">
      <div>
        <div className="p-6 font-bold text-center text-lg border-b border-emerald-400">
          Gigi Saya
        </div>

        {/* NAVIGATION MENU */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <NavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              active={pathname === item.path}
              onClick={() => router.push(item.path)}
            />
          ))}
        </nav>
      </div>

      {/* FOOTER SECTION */}
      <div className="p-4 border-t border-emerald-400 space-y-2">
        <NavItem
          icon={<Settings />}
          label="Setting"
          onClick={() => router.push("/dashboard/setting")}
          active={pathname === "/dashboard/setting"}
        />

        <button
          onClick={onLogout}
          className="flex items-center gap-2 w-full text-left hover:bg-emerald-600 p-2 rounded-md transition"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}

// Sub-komponen NavItem
function NavItem({
  icon,
  label,
  active = false,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center cursor-pointer gap-3 w-full text-left p-2 rounded-md transition ${
        active
          ? "bg-emerald-600 font-semibold"
          : "hover:bg-emerald-700"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
