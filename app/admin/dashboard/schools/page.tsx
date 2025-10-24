"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, Edit, Trash2, ChevronLeft, ChevronRight, X } from "lucide-react";
import { schoolService } from "@/lib/services/schoolService";
import { School } from "@/lib/types/schools";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import Swal from "sweetalert2";

export default function ManajamenSchools() {
  const [schools, setSchools] = useState<School[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newSchool, setNewSchool] = useState<School>({
    nama_sekolah: "",
    provinsi: "",
    kota: "",
    password_sekolah: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const schoolsPerPage = 10;

  // AMBIL DATA SEKOLAH
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const data = await schoolService.getAll();
        setSchools(data);
      } catch (error) {
        console.error("Error fetching schools:", error);
      }
    };
    fetchSchools();
  }, []);

  // TAMBAH SEKOLAH
  const handleAddSchool = async () => {
    if (
      !newSchool.nama_sekolah ||
      !newSchool.provinsi ||
      !newSchool.kota ||
      !newSchool.password_sekolah
    ) {
      Swal.fire({
        icon: "warning",
        title: "Data belum lengkap",
        text: "Semua field wajib diisi!",
        confirmButtonColor: "#0d9488",
      });
      return;
    }

    try {
      await schoolService.add({
        nama_sekolah: newSchool.nama_sekolah,
        provinsi: newSchool.provinsi,
        kota: newSchool.kota,
        password_sekolah: newSchool.password_sekolah,
      });

      const updatedSchools = await schoolService.getAll();
      setSchools(updatedSchools);
      setNewSchool({ nama_sekolah: "", provinsi: "", kota: "", password_sekolah: "" });
      setIsModalOpen(false);

      Swal.fire({
        icon: "success",
        title: "Sekolah berhasil ditambahkan!",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal menambahkan sekolah",
        text: "Terjadi kesalahan tak terduga",
      });
    }
  };


  // DELETE SEKOLAH
  const handleDelete = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data sekolah akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (!confirm.isConfirmed) return;

    try {
      await schoolService.remove(id);
      setSchools((prev) => prev.filter((s) => s.id !== id));

      Swal.fire({
        icon: "success",
        title: "Sekolah berhasil dihapus!",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal menghapus sekolah",
        text: "Terjadi kesalahan tak terduga",
      });
    }
  };


  // UPDATE SEKOLAH
  const handleUpdateSchool = async () => {
    if (!editingSchool) return;

    try {
      await schoolService.update(editingSchool.id!, {
        nama_sekolah: editingSchool.nama_sekolah,
        provinsi: editingSchool.provinsi,
        kota: editingSchool.kota,
        password_sekolah: editingSchool.password_sekolah,
      });

      const updated = await schoolService.getAll();
      setSchools(updated);
      setIsEditModalOpen(false);
      setEditingSchool(null);

      Swal.fire({
        icon: "success",
        title: "Data sekolah berhasil diperbarui!",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal memperbarui sekolah",
        text: "Terjadi kesalahan tak terduga",
      });
    }
  };



  // HANDLE FOR OPEN EDIT MODAL 
  const handleEditClick = (school: School) => {
    setEditingSchool(school);
    setIsEditModalOpen(true);
  };


  // FILTER SEARCH
  const filteredSchools = useMemo(() => {
    return schools.filter(
      (s) =>
        s.nama_sekolah.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.provinsi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.kota.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [schools, searchTerm]);

  // PAGINATION
  const totalPages = Math.ceil(filteredSchools.length / schoolsPerPage);
  const paginatedSchools = filteredSchools.slice(
    (currentPage - 1) * schoolsPerPage,
    currentPage * schoolsPerPage
  );

  // RANDOM COLOR (UNTUK AVATAR)
  const getRandomColor = (seed: string) => {
    const colors = ["bg-red-400", "bg-green-400", "bg-blue-400", "bg-yellow-400", "bg-purple-400"];
    const index = seed.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="flex w-full min-h-screen bg-gray-100">
      <Sidebar onLogout={async () => {}} />
      <div className="flex-1">
        <Navbar />

        <div className="bg-gray-100 p-8">
          <h1 className="text-3xl font-bold text-teal-700 mb-2">Manajemen Sekolah</h1>

          {/* SEARCH + BUTTON */}
          <div className="bg-white rounded-lg shadow-md p-3 mb-2 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700" size={20} />
              <input
                type="text"
                placeholder="Cari sekolah berdasarkan nama, provinsi, atau kota"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-gray-700 w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="cursor-pointer bg-emerald-700 hover:bg-emerald-500 text-white font-semibold px-5 py-2 rounded-lg transition-colors"
            >
              + Tambah Sekolah
            </button>
          </div>

          {/* TABLE SEKOLAH */}
          <div className="bg-white rounded-lg shadow-md p-3 overflow-x-auto">
            <table className="w-full bg-white">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Nama Sekolah</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Provinsi</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Kota</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Password Sekolah</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSchools.map((school) => (
                  <tr key={school.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${getRandomColor(
                          school.nama_sekolah
                        )}`}
                      >
                        {school.nama_sekolah[0]}
                      </div>
                      <span className="font-medium text-gray-800">{school.nama_sekolah}</span>
                    </td>
                    <td className="py-4 px-4 text-gray-700">{school.provinsi}</td>
                    <td className="py-4 px-4 text-gray-700">{school.kota}</td>
                    <td className="py-4 px-4 text-gray-700">{school.password_sekolah}</td>
                    <td className="py-4 px-4 flex gap-2">
                      <button
                        onClick={() => handleEditClick(school)}
                        className="p-2 text-teal-600 cursor-pointer hover:bg-teal-50 rounded"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(school.id!)}
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
                Showing {paginatedSchools.length} of {filteredSchools.length}
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

      {/* MODAL TAMBAH SEKOLAH */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-white/30 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-teal-700 mb-4">Tambah Sekolah</h2>

            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Nama Sekolah"
                value={newSchool.nama_sekolah}
                onChange={(e) => setNewSchool({ ...newSchool, nama_sekolah: e.target.value })}
                className="border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="text"
                placeholder="Provinsi"
                value={newSchool.provinsi}
                onChange={(e) => setNewSchool({ ...newSchool, provinsi: e.target.value })}
                className="border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="text"
                placeholder="Kota"
                value={newSchool.kota}
                onChange={(e) => setNewSchool({ ...newSchool, kota: e.target.value })}
                className="border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="text"
                placeholder="Password Sekolah"
                value={newSchool.password_sekolah}
                onChange={(e) => setNewSchool({ ...newSchool, password_sekolah: e.target.value })}
                className="border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                onClick={handleAddSchool}
                className="bg-emerald-700 hover:bg-emerald-600 text-white font-semibold py-2 rounded-lg transition"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && editingSchool && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-white/30 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-teal-700 mb-4">Edit Sekolah</h2>

            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Nama Sekolah"
                value={editingSchool.nama_sekolah}
                onChange={(e) =>
                  setEditingSchool({ ...editingSchool, nama_sekolah: e.target.value })
                }
                className="border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="text"
                placeholder="Provinsi"
                value={editingSchool.provinsi}
                onChange={(e) =>
                  setEditingSchool({ ...editingSchool, provinsi: e.target.value })
                }
                className="border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="text"
                placeholder="Kota"
                value={editingSchool.kota}
                onChange={(e) =>
                  setEditingSchool({ ...editingSchool, kota: e.target.value })
                }
                className="border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="text"
                placeholder="Password Sekolah"
                value={editingSchool.password_sekolah}
                onChange={(e) =>
                  setEditingSchool({
                    ...editingSchool,
                    password_sekolah: e.target.value,
                  })
                }
                className="border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />

              <button
                onClick={handleUpdateSchool}
                className="bg-emerald-700 hover:bg-emerald-600 text-white font-semibold py-2 rounded-lg transition"
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

