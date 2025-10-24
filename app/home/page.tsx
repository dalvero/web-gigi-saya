"use client";
import { Search, Menu, Settings, Video, FileText, Star } from "lucide-react";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen max-w-lg bg-white px-4 py-5 font-poppins">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-black">Selamat pagi,</p>
          <h1 className="text-lg text-black font-semibold text-primary">Anissa</h1>
        </div>
        <div className="flex items-center gap-3">
          <Settings className="text-black cursor-pointer" size={20} />
          <Menu className="cursor-pointer text-black" size={24} />
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="relative mb-5">
        <input
          type="text"
          placeholder="Pencarian"
          className="w-full pl-10 pr-4 py-2 bg-gray-300 text-black rounded-full border border-gray-300 focus:bg-white transition-all focus:outline-emerald-800"
        />
        <Search className="absolute left-3 top-2.5 text-black" size={18} />
      </div>

      {/* KONSULTASI CARD*/}
      <div className="relative bg-emerald-800 rounded-2xl p-5 mb-6 flex items-center justify-between text-white">        
        <div className="bg-emerald-800  flex">          
           <Image src="/images/dokter.png" alt="dokter" className="w-25 h-25 rounded-lg object-cover mr-3" width={100} height={100} />
          <div className="flex-col pl-10 py-2 items-center justify-center">
            <h2 className="text-xl font-semibold mb-2">Konsultasi</h2>
            <p className="text-sm text-white/80">
              Guardian siap bantu Anissa dalam menjaga kesehatan gigi!
            </p>
          </div>
        </div>        
      </div>

      {/* POJOK INFORMASI */}
      <div className="mb-5">
        <h3 className="text-base font-semibold mb-3 text-black">
          Pojok Informasi
        </h3>
        <div className="flex text-black justify-between gap-3">
          {/* VIDEO CARD */}
          <div className="cursor-pointer flex flex-col items-center border border-lightGrey rounded-xl py-3 w-1/2 hover:bg-lightGrey transition">
            <Video className="text-secondary mb-2" size={24} />
            <p className="text-sm font-medium">Video</p>
            <span className="text-xs">12 Video</span>
          </div>

          {/* ARTIKEL CARD */}
          <div className="cursor-pointer flex flex-col items-center border border-lightGrey rounded-xl py-3 w-1/2 hover:bg-lightGrey transition">
            <FileText className="text-secondary mb-2" size={24} />
            <p className="text-sm font-medium">Artikel</p>
            <span className="text-xs text-grey">28 Artikel</span>
          </div>
        </div>
      </div>

      {/* INFORMASI TERBARU */}
      <div className="mb-3 flex justify-between items-center">
        <h3 className="text-base font-semibold text-black">
          Informasi Terbaru
        </h3>
        <a href="#" className="text-emerald-800 text-sm font-medium">
          Selengkapnya
        </a>
      </div>

      {/* ARTIKEL LIST */}
      <div className="flex text-black flex-col gap-4 pb-20">
        {[1, 2].map((item) => (
          <div
            key={item}
            className="flex items-center bg-white rounded-xl border border-gray-400 shadow-sm p-3"
          >
            <Image src="/images/artikel_anak.png" alt="artikel" className="w-25 h-25 rounded-lg object-cover mr-3" width={120} height={120} />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-dark leading-snug">
                Anak sering mual muntah tiap sikat gigi? Ini tandanya.
              </h4>
              <p className="text-xs text-grey mt-1 line-clamp-2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor...
              </p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center text-alert text-xs font-semibold">
                  <Star size={12} className="fill-alert text-alert mr-1" />
                  3.8
                </div>
                <a
                  href="#"
                  className="text-secondary text-xs hover:underline font-medium"
                >
                  Baca selengkapnya
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* BOTTOM NAVIGATION */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-lg bg-white shadow-md py-2 flex justify-around rounded-t-2xl">
        <button className="text-black flex flex-col items-center text-xs">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mb-1"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 2L2 9h2v9h4v-6h4v6h4V9h2L10 2z" />
          </svg>
          Home
        </button>
        <button className="text-black flex flex-col items-center text-xs">
          <FileText size={18} className="mb-1" /> Artikel
        </button>
        <button className="text-black flex flex-col items-center text-xs">
          <Video size={18} className="mb-1" /> Video
        </button>
      </div>
    </div>
  );
}
