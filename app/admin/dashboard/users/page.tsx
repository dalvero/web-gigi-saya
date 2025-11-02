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
import { authService } from "@/lib/services/authService";
import { AuthUser } from "@/lib/types/auth";

export default function ManajemenStudents() {
    const [users, setUsers] = useState<AuthUser[]>([]);

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const [selectedUser, setSelectedUser] = useState<AuthUser | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const usersPerPage = 10;

    // FETCH USERS
    useEffect(() => {
        const fetchUsers = async () => {
        try {
            const usersData = await authService.getAll();
            setUsers(usersData);
        } catch (error) {
            console.log("Error fetching users:", error);
        }
        };
        fetchUsers();
    }, []);

    // FILTER & PAGINATION 
    const filteredUsers = useMemo(() => {
        return users.filter(
        (u) =>
            u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.role?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);

    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * usersPerPage,
        currentPage * usersPerPage
    );

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
                <h1 className="text-3xl font-bold text-teal-700 mb-2">Manajemen User</h1>

                {/* SEARCH + BUTTON */}
                <div className="bg-white rounded-lg shadow-md p-3 mb-2 flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700" size={20} />
                    <input
                        type="text"
                        placeholder="Cari user berdasarkan username, email, atau role"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="text-gray-700 w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    </div>

                    <button
                    onClick={() => setIsModalOpen(true)}
                    className="cursor-pointer bg-emerald-700 hover:bg-emerald-500 text-white font-semibold px-5 py-2 rounded-lg transition-colors"
                    >
                    + Tambah User
                    </button>
                </div>

                {/* TABLE USER */}
                <div className="bg-white rounded-lg shadow-md p-3 overflow-x-auto">
                    <table className="w-full bg-white">
                    <thead>
                        <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Username</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedUsers.map((user) => (
                        <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4 px-4 flex items-center gap-3">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${getRandomColor(
                                user.username
                                )}`}
                            >
                                {user.username[0]}
                            </div>
                            <span className="font-medium text-gray-800">{user.username}</span>  
                            </td>
                            <td className="py-4 px-4 text-gray-700">{user.email}</td>
                            <td className="py-4 px-4 text-gray-700">{user.role}</td>                            
                            <td className="py-4 px-4 flex gap-2">
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="p-2 text-teal-600 cursor-pointer hover:bg-teal-50 rounded"
                            >
                                <Edit size={18} />
                            </button>
                            <button
                                onClick={() => setIsDeleteModalOpen(true)}
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
                        Showing {paginatedUsers.length} of {filteredUsers.length}
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
    </div>
  );
}
