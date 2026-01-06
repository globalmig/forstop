// components/slider/ItemList.tsx
"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import CardProduct from "./CardProduct";

export type ProductCardItem = {
  id: string | number;
  slug: string | null;
  image: string | null;
  product_name: string | null;
  product_code: string | null;
  category: string; // ✅ 이제 필수 (toplight/speaker/...)
};

interface ItemListProps {
  items: ProductCardItem[];
}

export default function ItemList({ items }: ItemListProps) {
  return (
    <Swiper
      loop
      autoplay={{ delay: 2500, disableOnInteraction: false }}
      modules={[Autoplay]}
      className="w-full"
      slidesPerView={2}
      spaceBetween={14}
      breakpoints={{
        480: { slidesPerView: 1.6, spaceBetween: 16 },
        640: { slidesPerView: 2, spaceBetween: 18 },
        768: { slidesPerView: 2.5, spaceBetween: 20 },
        1024: { slidesPerView: 3, spaceBetween: 24 },
        1280: { slidesPerView: 4, spaceBetween: 30 },
      }}
    >
      {items.map((item) => (
        <SwiperSlide key={`${item.category}-${item.id}`}>
          <CardProduct
            image={item.image || "/image/common/no-image.png"}
            product_name={item.product_name || "제품명"}
            slug={item.slug || ""}
            id={item.id}
            product_code={item.product_code || ""}
            category={item.category} // ✅ 추가
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
