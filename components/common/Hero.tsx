import React from "react";
import Image from "next/image";

interface HeroProps {
  img: string;
  subtitle: string;
  title: string;
  title2?: string;
  sub?: string;
}

export default function Hero({ img, subtitle, title, title2, sub }: HeroProps) {
  return (
    <section className="relative w-full h-[360px] md:h-[480px] lg:h-[720px]">
      {/* 배경 이미지 */}
      <Image src={img} alt={title} fill priority className="object-cover object-top" />

      {/* 어두운 오버레이 (가독성) */}
      <div className="absolute inset-0 bg-black/40" />

      {/* 텍스트 */}
      <div className="relative z-10 flex flex-col justify-center item h-full max-w-[1440px] mx-auto px-6 text-white text-center items-center">
        <h3 className="text-sm md:text-base font-light tracking-[0.5em] opacity-90">{subtitle}</h3>
        <h2 className="mt-5 text-2xl md:text-3xl lg:text-4xl font-bold mx-auto  mb-0">{title}</h2>
        {title2 && <h2 className="mt-2 text-2xl md:text-3xl lg:text-4xl font-bold  mx-auto">{title2}</h2>}

        {sub && <p className="mt-4 max-w-xl text-sm md:text-base text-center opacity-90">{sub}</p>}
      </div>
    </section>
  );
}
