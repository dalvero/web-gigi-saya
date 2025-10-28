"use client";

import React from "react";

/**
 * Button
 * ----------------------------
 * Komponen tombol interaktif dengan berbagai variant dan opsi styling.
 */
type Variant = "primary" | "secondary" | "alert" | "custom";

interface ButtonProps {
  text: string;
  variant?: Variant;
  width?: string; // EX: "w-full", "w-[200px]"
  textColor?: string; // EX: "text-white", "text-black"
  bgColor?: string; // EX: "bg-emerald-800"
  hoverColor?: string; // EX: "hover:bg-emerald-600"
  focusColor?: string; // EX: "focus:ring-2 focus:ring-emerald-400"
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export default function Button({
  text,
  variant = "primary",
  width = "w-full",
  textColor,
  bgColor,
  hoverColor,
  focusColor,
  disabled = false,
  loading = false,
  onClick,
  className = "",
  type = "button",
}: ButtonProps) {
  const baseStyle = `py-3 rounded-2xl font-semibold transition-all cursor-pointer disabled:cursor-not-allowed`;

  // WARNA DEFAULT BERDASARKAN VARIANT
  const variantStyles: Record<Variant, string> = {
    primary: "bg-emerald-800 text-white hover:bg-emerald-600 focus:ring-2 focus:ring-emerald-400",
    secondary: "bg-gray-500 text-white hover:bg-gray-400 focus:ring-2 focus:ring-gray-300",
    alert: "bg-red-600 text-white hover:bg-red-500 focus:ring-2 focus:ring-red-400",
    custom: "", // CUSTOM AGAR BISA PAKAI KOMBINASI SENDIRI
  };

  // JIKA VARIANT = CUSTOM, AMBIL DARI PROPS
  const customStyle =
    variant === "custom"
      ? `${bgColor ?? ""} ${textColor ?? ""} ${hoverColor ?? ""} ${
          focusColor ?? ""
        }`
      : variantStyles[variant];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${width} ${baseStyle} ${customStyle} ${
        disabled || loading ? "bg-gray-400 cursor-not-allowed" : ""
      } ${className}`}
    >
      {loading ? "Memproses..." : text}
    </button>
  );
}
