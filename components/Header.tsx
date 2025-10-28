"use client"
import { Menu, Settings } from "lucide-react";

type HeaderProps = {
  greeting: string;
  studentName: string;
};

export default function Header({ greeting, studentName }: HeaderProps) {
  return (
    <header className="flex items-center justify-between mt-4 mb-4">
        <div>
          <p className="text-sm text-black">{greeting},</p>
          <h1 className="text-lg text-black font-semibold text-primary">{studentName}</h1>
        </div>
        <div className="flex items-center gap-3">
          <Settings className="text-black cursor-pointer" size={20} />
          <Menu className="cursor-pointer text-black" size={24} />
        </div>
    </header>
  );
}
