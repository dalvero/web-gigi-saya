"use client";

import React from "react";

/**
 * InputType
 * ----------------------------
 * Tipe input yang didukung oleh komponen InputField.
 */
type InputFieldType =
  | "text"
  | "password"
  | "email"
  | "number"
  | "date"
  | "time"
  | "search"
  | "tel";

/**
 * InputFieldProps
 * ----------------------------
 * Properti-properti yang digunakan oleh komponen InputField.
 */
interface InputFieldProps {
  label?: string;
  type?: InputFieldType;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  error?: string; // OPSIONAL  
}

/**
 * InputField
 * ----------------------------
 * Komponen input field yang dapat digunakan untuk berbagai tipe input.
 */
export default function InputField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  className = "",
}: InputFieldProps) {
  return (
    <div className="mb-4 w-full">
      <label className="text-1xl font-semibold pl-3 block mb-1">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 rounded-3xl bg-gray-300 focus:outline-emerald-800 transition-all focus:bg-white ${className}`}
      />
    </div>
  );
}
