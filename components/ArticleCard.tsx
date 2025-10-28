"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Article } from "@/lib/types/articles";
import { articleService } from "@/lib/services/articleService";
import { CalendarDays } from "lucide-react";

export default function ArticleCard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await articleService.getAll();

        // Ambil hanya 4 artikel terbaru
        const recentArticles = data
          .slice(0, 4)
          .map((a) => ({
            ...a,
            created_at: new Date(a.created_at).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            }),
          }));

        setArticles(recentArticles);
      } catch (error) {
        console.error("Gagal mengambil artikel:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Loading state
  if (loading)
    return (
      <div className="text-center py-10 text-gray-500">
        Memuat artikel...
      </div>
    );

  // Jika kosong
  if (articles.length === 0)
    return (
      <div className="text-center py-10 text-gray-500">
        Tidak ada artikel yang tersedia hari ini.
      </div>
    );

  return (
    <div className="flex text-black flex-col gap-4 pb-20">
      {articles.map((article) => (
        <div
          key={article.id}
          className="flex items-center bg-white rounded-xl border border-gray-300 shadow-sm p-3"
        >
          <Image
            src={article.image}
            alt={article.title}
            className="rounded-lg object-cover mr-3"
            width={110}
            height={110}
          />
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-gray-800 leading-snug">
              {article.title}
            </h4>
            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
              {article.description}
            </p>
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <CalendarDays size={12} className="text-emerald-700" />
                <span>{article.created_at}</span>
              </div>
              <a
                href="#"
                className="text-emerald-700 font-medium hover:underline"
              >
                Baca selengkapnya
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
