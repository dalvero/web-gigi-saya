"use client";

import React from "react";

interface NavbarProps {
    username?: string;
    email?: string;
}

export default function Navbar({ username, email }: NavbarProps) {
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-emerald-800">Dashboard</h1>

      {username && (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-700 font-bold">
            {username.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium">{email}</p>
            <p className="text-sm text-gray-500">Admin</p>
          </div>
        </div>
      )}
    </header>
  );
}
