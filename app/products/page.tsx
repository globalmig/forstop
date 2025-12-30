// page.tsx (제품 목록)
"use client";

import React, { useMemo, useState } from "react";
import Hero from "@/components/common/Hero";
import CardProduct from "../../components/slider/CardProduct";
import DropBox from "@/components/common/DropBox";
import Contact from "@/components/common/Contact";
import { ProductData } from "@/data/ProductData";

const filterOptions = [
  { label: "전체", value: "all" },
  { label: "지게차 / 중장비", value: "heavy" },
  { label: "탑라이트 / 표시기", value: "toplight" },
  { label: "음성경보장치 / 스피커", value: "speaker" },
  { label: "이동식 에어컨 / 냉각팬", value: "cooling" },
  { label: "카메라 외 기타", value: "etc" },
];

export default function Page() {
  const [filter, setFilter] = useState("all");

  const filteredData = useMemo(() => {
    if (filter === "all") return ProductData;
    return ProductData.filter((p) => p.category === filter);
  }, [filter]);

  return (
    <>
      <Hero img="/image/hero_product01.png" subtitle="ALL PRODUCTS" title="상품소개" />

      <div className="w-full max-w-[1440px] mx-auto px-4 pt-12 flex-col flex justify-center items-end">
        <div className="flex items-center justify-start mb-6">
          <DropBox options={filterOptions} defaultValue="all" onChange={(value) => setFilter(value)} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full pb-40">
          {filteredData.map((item) => (
            <div key={item.id} className="mb-12">
              <CardProduct slug={item.slug} img={item.img} title={item.title} desc={item.desc} id={""} />
            </div>
          ))}
        </div>
      </div>

      <section>
        <Contact />
      </section>
    </>
  );
}
