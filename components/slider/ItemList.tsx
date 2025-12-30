"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import CardProduct from "../../components/slider/CardProduct";
import { ProductData } from "@/data/ProductData";

export default function ItemList() {
  return (
    <Swiper
      loop
      autoplay={{ delay: 2500, disableOnInteraction: false }}
      modules={[Autoplay]}
      className="w-full"
      // ✅ 기본값 (가장 작은 화면)
      slidesPerView={2}
      spaceBetween={14}
      // ✅ 반응형
      breakpoints={{
        480: { slidesPerView: 1.6, spaceBetween: 16 },
        640: { slidesPerView: 2, spaceBetween: 18 },
        768: { slidesPerView: 2.5, spaceBetween: 20 },
        1024: { slidesPerView: 3, spaceBetween: 24 },
        1280: { slidesPerView: 4, spaceBetween: 30 },
      }}
    >
      {ProductData.map((item) => (
        <SwiperSlide key={item.id}>
          <CardProduct img={item.img} title={item.title} desc={item.desc} id={item.id} slug={""} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
