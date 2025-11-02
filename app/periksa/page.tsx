"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/services/authService";
import { Students } from "@/lib/types/students";
import { Teachers } from "@/lib/types/teachers";
import Header from "@/components/Header";
import BottomNavbar from "@/components/BottomNavbar";
import { Upload, Users, X } from "lucide-react";
import { studentService } from "@/lib/services/studentService";

export default function PeriksaPage() {
    const router = useRouter();
    const [student, setStudent] = useState<Students | null>(null);
    const [teacher, setTeacher] = useState<Teachers | null>(null);
    const [studentsList, setStudentsList] = useState<Students[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<Students | null>(null);
    const [greeting, setGreeting] = useState<string>("");
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    // DETEKSI KEYBOARD 
    useEffect(() => {
        let initialHeight = window.innerHeight;
        const handleResize = () => {
        const newHeight = window.innerHeight;
        setIsKeyboardVisible(initialHeight - newHeight > 150);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // FETCH STUDENTS
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const studentsData = await studentService.getAll();
                setStudentsList(studentsData);
            } catch (err) {
                console.warn("Gagal ambil students:", err);
            }
        };

        fetchStudents();
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

    return (
        <div className="min-h-screen w-full bg-white font-poppins flex flex-col items-center">
            <div className="w-full max-w-md bg-white px-4 py-5">
                {/* HEADER */}
                <Header greeting={greeting} userName={userName} role={teacher ? "teacher" : "student"} />

                {/* STUDENT MODE */}
                {student && (
                    <div className="mt-4">
                        <div className="bg-emerald-400 text-black rounded-2xl p-4 mb-4 text-center">
                            <p className="font-semibold mb-1">Kamu belum diperiksa nih...</p>
                            <p className="text-sm mb-4">
                                Ayo periksa gigimu oleh guru atau dokter terlebih dahulu lalu
                                upload foto gigimu di sini untuk dideteksi oleh AI ya.
                            </p>
                            <button className="w-full bg-white text-emerald-700 font-semibold py-2 rounded-full hover:bg-gray-100 transition">
                                Upload Gambar
                            </button>
                        </div>

                        <div>
                            <h3 className="font-semibold text-black mb-2">Hasil Deteksi</h3>
                            <p className="text-sm text-black">
                                Kamu belum melakukan pemeriksaan gigi ya,{" "}
                                <span className="font-medium">{student.nama_depan}</span>.
                            </p>
                        </div>
                    </div>
                )}

                {/* TEACHER MODE */}
                {teacher && (
                    <div className="mt-4">
                        {!selectedStudent ? (
                        <>
                            <div className="bg-emerald-400 text-black rounded-2xl p-4 mb-4 text-center">
                                <p className="font-semibold mb-1">Ayo cek gigi muridmu!</p>
                                <p className="text-sm mb-4">
                                    Pilih salah satu muridmu untuk melakukan pemeriksaan gigi
                                    hari ini.
                                </p>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="w-full flex items-center justify-center gap-2 bg-white text-emerald-700 font-semibold py-2 rounded-full hover:bg-gray-100 transition"
                                >
                                    <Users size={18} /> Pilih Muridmu
                                </button>
                            </div>
                        </>
                        ) : (
                        <>
                            <div className="bg-emerald-400 text-black rounded-2xl p-4 mb-4 text-center">
                                <p className="font-semibold mb-1">
                                    Pemeriksaan untuk {selectedStudent.nama_depan}
                                </p>
                                <p className="text-sm mb-4">
                                    Upload foto gigi murid ini untuk dideteksi oleh AI.
                                </p>
                                <button className="w-full flex items-center justify-center gap-2 bg-white text-emerald-700 font-semibold py-2 rounded-full hover:bg-gray-100 transition">
                                    <Upload size={18} /> Upload Gambar
                                </button>
                            </div>
                        </>
                        )}
                    </div>
                )}
            </div>

            {/* MODAL PILIH MURID */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                    <div className="bg-white rounded-2xl w-80 p-4 relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-3 right-3 text-gray-600 hover:text-black"
                        >
                        <X size={20} />
                        </button>
                        <h3 className="text-center font-semibold text-black mb-3">
                            Pilih Murid
                        </h3>
                        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                            {studentsList.map((s) => (
                                <button
                                key={s.nisn}
                                onClick={() => {
                                    setSelectedStudent(s);
                                    setIsModalOpen(false);
                                }}
                                className="border border-gray-300 rounded-lg p-2 text-sm text-black hover:bg-gray-100 transition"
                                >
                                {s.nama_depan} {s.nama_belakang}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {!isKeyboardVisible && <BottomNavbar />}
        </div>
    );
}
