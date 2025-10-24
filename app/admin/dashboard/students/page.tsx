"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, Edit, Trash2, ChevronLeft, ChevronRight, X } from "lucide-react";
import { studentService } from "@/lib/services/studentService";
import { schoolService } from "@/lib/services/schoolService";
import { Student } from "@/lib/types/students";
import { School } from "@/lib/types/schools";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import Swal from "sweetalert2";

export default function ManajemenStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [schools, setSchools] = useState<School[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [newStudent, setNewStudent] = useState<Student>({
    nama: "",
    nisn: "",
    sekolah_id: "",
    tanggal_lahir: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const studentsPerPage = 10;

  // FETCH STUDENTS & SCHOOLS 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsData, schoolsData] = await Promise.all([
          studentService.getAll(),
          schoolService.getAll(),
        ]);
        setStudents(studentsData);
        setSchools(schoolsData);
        console.log("Sekolah Data", schoolsData.length);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // ADD STUDENT 
  const handleAddStudent = async () => {
    if (!newStudent.nama || !newStudent.nisn || !newStudent.sekolah_id || !newStudent.tanggal_lahir) {
      Swal.fire({
        icon: "warning",
        title: "Data belum lengkap",
        text: "Semua field wajib diisi!",
        confirmButtonColor: "#0d9488",
      });
      return;
    }

    try {
      await studentService.add({
        nama: newStudent.nama,
        nisn: newStudent.nisn,
        sekolah_id: newStudent.sekolah_id,
        tanggal_lahir: newStudent.tanggal_lahir,
      });

      const updatedStudents = await studentService.getAll();
      setStudents(updatedStudents);
      setNewStudent({ nama: "", nisn: "", sekolah_id: "", tanggal_lahir: "" });
      setIsModalOpen(false);

      Swal.fire({
        icon: "success",
        title: "Siswa berhasil ditambahkan!",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal menambahkan siswa",
        text: "Terjadi kesalahan tak terduga",
      });
    }
  };

  // DELETE STUDENT 
  const handleDelete = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data siswa akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (!confirm.isConfirmed) return;

    try {
      await studentService.remove(id);
      setStudents((prev) => prev.filter((s) => s.id !== id));

      Swal.fire({
        icon: "success",
        title: "Siswa berhasil dihapus!",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal menghapus siswa",
        text:"Terjadi kesalahan tak terduga",
      });
    }
  };

  // UPDATE STUDENT 
  const handleUpdateStudent = async () => {
    if (!editingStudent) return;

    try {
      await studentService.update(editingStudent.id!, {
        nama: editingStudent.nama,
        nisn: editingStudent.nisn,
        sekolah_id: editingStudent.sekolah_id,
        tanggal_lahir: editingStudent.tanggal_lahir,
      });

      const updated = await studentService.getAll();
      setStudents(updated);
      setIsEditModalOpen(false);
      setEditingStudent(null);

      Swal.fire({
        icon: "success",
        title: "Data siswa berhasil diperbarui!",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal memperbarui siswa",
        text:"Terjadi kesalahan tak terduga",
      });
    }
  };

  const handleEditClick = (student: Student) => {
    setEditingStudent(student);
    setIsEditModalOpen(true);
  };

  // FILTER & PAGINATION 
  const filteredStudents = useMemo(() => {
    return students.filter(
      (s) =>
        s.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.nisn.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * studentsPerPage,
    currentPage * studentsPerPage
  );

  const getRandomColor = (seed: string) => {
    const colors = ["bg-red-400", "bg-green-400", "bg-blue-400", "bg-yellow-400", "bg-purple-400"];
    const index = seed.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // GET NAMA SEKOLAH 
  const getSchoolName = (id: string) => {
    const school = schools.find((s) => s.id === id);
    return school ? school.nama_sekolah : "-";
  };

  return (
    <div className="flex w-full min-h-screen bg-gray-100">
      <Sidebar onLogout={async () => {}} />
      <div className="flex-1">
        <Navbar />

        <div className="bg-gray-100 p-8">
          <h1 className="text-3xl font-bold text-teal-700 mb-2">Manajemen Siswa</h1>

          {/* SEARCH + BUTTON */}
          <div className="bg-white rounded-lg shadow-md p-3 mb-2 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700" size={20} />
              <input
                type="text"
                placeholder="Cari siswa berdasarkan nama atau NISN"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-gray-700 w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="cursor-pointer bg-emerald-700 hover:bg-emerald-500 text-white font-semibold px-5 py-2 rounded-lg transition-colors"
            >
              + Tambah Siswa
            </button>
          </div>

          {/* TABLE STUDENT */}
          <div className="bg-white rounded-lg shadow-md p-3 overflow-x-auto">
            <table className="w-full bg-white">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Nama</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">NISN</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Tanggal Lahir</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Sekolah</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedStudents.map((student) => (
                  <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${getRandomColor(
                          student.nama
                        )}`}
                      >
                        {student.nama[0]}
                      </div>
                      <span className="font-medium text-gray-800">{student.nama}</span>
                    </td>
                    <td className="py-4 px-4 text-gray-700">{student.nisn}</td>
                    <td className="py-4 px-4 text-gray-700">{student.tanggal_lahir}</td>
                    <td className="py-4 px-4 text-gray-700">{getSchoolName(student.sekolah_id)}</td>
                    <td className="py-4 px-4 flex gap-2">
                      <button
                        onClick={() => handleEditClick(student)}
                        className="p-2 text-teal-600 cursor-pointer hover:bg-teal-50 rounded"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(student.id!)}
                        className="p-2 text-red-600 cursor-pointer hover:bg-red-50 rounded"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* PAGINATION */}
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-gray-600">
                Showing {paginatedStudents.length} of {filteredStudents.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className="p-2 border text-gray-700 border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  className="p-2 border text-gray-700 border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL TAMBAH STUDENT */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-white/30 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-teal-700 mb-4">Tambah Siswa</h2>

            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Nama"
                value={newStudent.nama}
                onChange={(e) => setNewStudent({ ...newStudent, nama: e.target.value })}
                className="border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="text"
                placeholder="NISN"
                value={newStudent.nisn}
                onChange={(e) => setNewStudent({ ...newStudent, nisn: e.target.value })}
                className="border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-teal-500"
              />
              <select
                value={newStudent.sekolah_id}
                onChange={(e) => setNewStudent({ ...newStudent, sekolah_id: e.target.value })}
                className="border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Pilih Sekolah</option>
                {schools.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nama_sekolah} — {s.kota}
                  </option>
                ))}
              </select>
              <h1 className="text-sm font-semibold text-gray-500 ml-2">
                Tanggal Lahir
              </h1>
              <input
                type="date"
                placeholder="Tanggal Lahir"
                value={newStudent.tanggal_lahir}
                onChange={(e) => setNewStudent({ ...newStudent, tanggal_lahir: e.target.value })}
                className="border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-teal-500"
              />
              <button
                onClick={handleAddStudent}
                className="bg-emerald-700 cursor-pointer hover:bg-emerald-600 text-white font-semibold py-2 rounded-lg transition"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDIT STUDENT */}
      {isEditModalOpen && editingStudent && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-white/30 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-teal-700 mb-4">Edit Siswa</h2>

            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Nama"
                value={editingStudent.nama}
                onChange={(e) =>
                  setEditingStudent({ ...editingStudent, nama: e.target.value })
                }
                className="border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="text"
                placeholder="NISN"
                value={editingStudent.nisn}
                onChange={(e) =>
                  setEditingStudent({ ...editingStudent, nisn: e.target.value })
                }
                className="border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-teal-500"
              />
              <select
                value={editingStudent.sekolah_id}
                onChange={(e) =>
                  setEditingStudent({ ...editingStudent, sekolah_id: e.target.value })
                }
                className="border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Pilih Sekolah</option>
                {schools.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nama_sekolah} — {s.kota}
                  </option>
                ))}
              </select>
              <h1 className="text-sm font-semibold text-gray-500 ml-2">
                Tanggal Lahir
              </h1>
              <input
                type="date"
                placeholder="Tanggal Lahir"
                value={editingStudent.tanggal_lahir}
                onChange={(e) =>
                  setEditingStudent({ ...editingStudent, tanggal_lahir: e.target.value })
                }
                className="border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-teal-500"
              />
              <button
                onClick={handleUpdateStudent}
                className="bg-emerald-700 cursor-pointer hover:bg-emerald-600 text-white font-semibold py-2 rounded-lg transition"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
