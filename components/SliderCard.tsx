"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";
import { useEffect } from "react";

const cards = [
  {
    title: "Konsultasi",
    desc: "Guardian siap bantu Anissa dalam menjaga kesehatan gigi!",
    img: "/images/dokter.png",
  },
  {
    title: "Pembersihan Gigi",
    desc: "Ketahui cara menjaga gigi agar tetap bersih dan sehat.",
    img: "/images/artikel_anak.png",
  },
  {
    title: "Edukasi Anak",
    desc: "Belajar menyikat gigi dengan cara menyenangkan!",
    img: "/images/artikel_anak.png",
  },
];

/*
 * Komponen SliderCard
 * Digunakan untuk menampilkan slider card
 */
export default function SliderCard() {
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    renderMode: "performance",
    mode: "snap",
    slides: {
      perView: 1,
      spacing: 16,
    },
  });

  // AUTOPLAY SETIAP 3 DETIK
  useEffect(() => {
    const timer = setInterval(() => {
      instanceRef.current?.next();
    }, 3000);
    return () => clearInterval(timer);
  }, [instanceRef]);

  return (
    <div ref={sliderRef} className="keen-slider mb-6">
      {cards.map((card, i) => (
        <div
          key={i}
          className="keen-slider__slide bg-emerald-800 rounded-2xl p-5 flex items-center text-white shadow-lg"
        >
          <Image
            src={card.img}
            alt={card.title}
            className="w-24 h-24 rounded-lg object-cover mr-4"
            width={100}
            height={100}
          />
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
            <p className="text-sm text-white/80">{card.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
