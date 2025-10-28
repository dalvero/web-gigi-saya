"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, Edit, Trash2, ChevronLeft, ChevronRight, X, ImagePlus } from "lucide-react";
import Swal from "sweetalert2";
import { Article } from "@/lib/types/articles";
import { articleService } from "@/lib/services/articleService";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import Button from "@/components/Button";
import InputField from "@/components/InputField";

export default function ManajemenArtikel() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [newArticle, setNewArticle] = useState<Omit<Article, "id" | "created_at">>({
    title: "",
    description: "",
    image: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const articlesPerPage = 8;

  // 📦 Ambil data artikel dari Supabase
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await articleService.getAll();
        setArticles(data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };
    fetchArticles();
  }, []);

  // TAMBAH ARTIKEL
  const handleAddArticle = async () => {
    if (!newArticle.title || !newArticle.description || !imageFile) {
      Swal.fire({
        icon: "warning",
        title: "Data belum lengkap",
        text: "Judul, deskripsi, dan gambar wajib diisi!",
        confirmButtonColor: "#0d9488",
      });
      return;
    }

    try {
      const imageUrl = await articleService.uploadImage(imageFile);
      await articleService.add({ ...newArticle, image: imageUrl });

      Swal.fire({
        icon: "success",
        title: "Artikel berhasil ditambahkan!",
        timer: 1500,
        showConfirmButton: false,
      });

      setIsModalOpen(false);
      setNewArticle({ title: "", description: "", image: "" });
      setImageFile(null);

      // REFRESH DATA
      const updated = await articleService.getAll();
      setArticles(updated);
    } catch (error) {
      console.error(error);
      Swal.fire("Gagal menambahkan artikel", "Terjadi kesalahan", "error");
    }
  };

  // UPDATE ARTIKEL
  const handleUpdateArticle = async () => {
    if (!editingArticle) return;
    try {
      await articleService.update(editingArticle.id, editingArticle);
      const updated = await articleService.getAll();
      setArticles(updated);
      setIsEditModalOpen(false);
      setEditingArticle(null);

      Swal.fire({
        icon: "success",
        title: "Artikel berhasil diperbarui!",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire("Gagal memperbarui artikel", "", "error");
    }
  };

  // HAPUS ARTIKEL
  const handleDelete = async (id: number) => {
    const confirmation = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Artikel akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (!confirmation.isConfirmed) return;

    try {
      await articleService.remove(id);
      setArticles((prev) => prev.filter((a) => a.id !== id));
      Swal.fire("Artikel dihapus!", "", "success");
    } catch {
      Swal.fire("Gagal menghapus artikel", "", "error");
    }
  };

  // FILTER PENCARIAN
  const filteredArticles = useMemo(() => {
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [articles, searchTerm]);

  // PAGINATION
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * articlesPerPage,
    currentPage * articlesPerPage
  );

  return (
    <div className="flex w-full min-h-screen bg-gray-100">
      <Sidebar onLogout={async () => {}} />
      <div className="flex-1">
        <Navbar />
        <div className="bg-gray-100 p-8">
          <h1 className="text-3xl font-bold text-teal-700 mb-4">Manajemen Artikel</h1>

          {/* SEARCH DAN BUTTON TAMBAH */}
          <div className="bg-white rounded-lg shadow-md p-3 mb-4 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700" size={20} />
              <input
                type="text"
                placeholder="Cari artikel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-gray-700 w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="cursor-pointer bg-emerald-700 hover:bg-emerald-500 text-white font-semibold px-5 py-2 rounded-lg transition-colors"
            >
              + Tambah Artikel
            </button>
          </div>

          {/* TABEL ARTIKEL */}
          <div className="bg-white rounded-lg shadow-md overflow-x-auto p-3">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Gambar</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Judul</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Deskripsi</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Tanggal</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedArticles.map((a) => (
                  <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <img src={a.image} alt={a.title} className="w-14 h-14 rounded-lg object-cover" />
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-800">{a.title}</td>
                    <td className="py-3 px-4 text-gray-600 line-clamp-2">{a.description}</td>
                    <td className="py-3 px-4 text-gray-700">
                      {new Date(a.created_at).toLocaleDateString("id-ID")}
                    </td>
                    <td className="py-3 px-4 flex gap-2">
                      <button
                        onClick={() => {
                          setEditingArticle(a);
                          setIsEditModalOpen(true);
                        }}
                        className="p-2 text-teal-600 hover:bg-teal-50 rounded"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(a.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* PAGINATION */}
            <div className="flex justify-between items-center mt-6">
              <p className="text-sm text-gray-600">
                Menampilkan {paginatedArticles.length} dari {filteredArticles.length}
              </p>
              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className="p-2 border text-gray-700 border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  className="p-2 border text-gray-700 border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL TAMBAH ARTIKEL */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-teal-700 mb-4">Tambah Artikel</h2>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Judul Artikel"
                value={newArticle.title}
                onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                className="border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <textarea
                placeholder="Deskripsi"
                value={newArticle.description}
                onChange={(e) => setNewArticle({ ...newArticle, description: e.target.value })}
                className="border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <label className="flex items-center gap-2 cursor-pointer border border-gray-300 p-2 rounded-lg hover:bg-gray-50">
                <ImagePlus className="text-emerald-700" size={18} />
                <span className="text-gray-700">
                  {imageFile ? imageFile.name : "Pilih gambar"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
              </label>
              <button
                onClick={handleAddArticle}
                className="bg-emerald-700 hover:bg-emerald-600 text-white font-semibold py-2 rounded-lg cursor-pointer transition"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDIT ARTIKEL */}
      {isEditModalOpen && editingArticle && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button onClick={() => setIsEditModalOpen(false)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-teal-700 mb-4">Edit Artikel</h2>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                value={editingArticle.title}
                onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                className="border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <textarea
                value={editingArticle.description}
                onChange={(e) => setEditingArticle({ ...editingArticle, description: e.target.value })}
                className="border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="text"
                value={editingArticle.image}
                onChange={(e) => setEditingArticle({ ...editingArticle, image: e.target.value })}
                className="border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                onClick={handleUpdateArticle}
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
