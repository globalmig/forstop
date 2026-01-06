"use client";

import React, { useEffect, useMemo, useState } from "react";
import Hero from "@/components/common/Hero";
import CardProduct from "@/components/slider/CardProduct";
import DropBox from "@/components/common/DropBox";
import Contact from "@/components/common/Contact";
import { supabase } from "@/lib/supabase";

const filterOptions = [
  { label: "전체", value: "all" },
  { label: "지게차 / 중장비", value: "heavy" },
  { label: "탑라이트 / 표시기", value: "toplight" },
  { label: "음성경보장치 / 스피커", value: "speaker" },
  { label: "이동식 에어컨 / 냉각팬", value: "cooling" },
  { label: "카메라 외 기타", value: "etc" },
];

type Product = {
  id: string | number;
  slug: string;
  image: string;
  product_name: string;
  product_code: string;
  category: string;
};

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      try {
        // 모든 테이블에서 데이터 가져오기
        const [
          { data: lightData, error: lightError },
          { data: coolingData, error: coolingError },
          { data: etcData, error: etcError },
          { data: heavyData, error: heavyError },
          { data: speakerData, error: speakerError },
          { data: toplightData, error: toplightError },
        ] = await Promise.all([
          supabase.from("products_ligt").select("*"),
          supabase.from("cooling_specs").select("*"),
          supabase.from("etc_specs").select("*"),
          supabase.from("heavy_specs").select("*"),
          supabase.from("speaker_specs").select("*"),
          supabase.from("toplight_specs").select("*"),
        ]);

        // 각 테이블의 데이터 확인
        console.log("lightData:", lightData?.length, lightData);
        console.log("coolingData:", coolingData?.length, coolingData);
        console.log("etcData:", etcData?.length, etcData);
        console.log("heavyData:", heavyData?.length, heavyData);
        console.log("speakerData:", speakerData?.length, speakerData);
        console.log("toplightData:", toplightData?.length, toplightData);

        // 에러 체크
        if (lightError) console.error("Error fetching light products:", lightError);
        if (coolingError) console.error("Error fetching cooling products:", coolingError);
        if (etcError) console.error("Error fetching etc products:", etcError);
        if (heavyError) console.error("Error fetching heavy products:", heavyError);
        if (speakerError) console.error("Error fetching speaker products:", speakerError);
        if (toplightError) console.error("Error fetching toplight products:", toplightError);

        // 모든 데이터 합치기 (category가 없으면 테이블명으로 추가)
        const allProducts: Product[] = [
          ...(lightData ?? []).map((item) => ({ ...item, category: item.category || "light" })),
          ...(coolingData ?? []).map((item) => ({ ...item, category: item.category || "cooling" })),
          ...(etcData ?? []).map((item) => ({ ...item, category: item.category || "etc" })),
          ...(heavyData ?? []).map((item) => ({ ...item, category: item.category || "heavy" })),
          ...(speakerData ?? []).map((item) => ({ ...item, category: item.category || "speaker" })),
          ...(toplightData ?? []).map((item) => ({ ...item, category: item.category || "toplight" })),
        ];

        console.log("Total products:", allProducts.length);
        console.log(
          "All slugs:",
          allProducts.map((item) => item.slug)
        );

        setProducts(allProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      }

      setLoading(false);
    };

    fetchProducts();
  }, []);

  const filteredData = useMemo(() => {
    if (filter === "all") return products;
    return products.filter((p) => p.category === filter);
  }, [products, filter]);

  return (
    <>
      <Hero img="/image/hero_product01.png" subtitle="ALL PRODUCTS" title="상품소개" />

      <div className="w-full max-w-[1440px] mx-auto px-4 pt-12 flex-col flex justify-center items-end">
        <div className="flex items-center justify-start mb-6">
          <DropBox options={filterOptions} defaultValue="all" onChange={setFilter} />
        </div>

        {loading ? (
          <div className="w-full py-20 text-center text-slate-500">불러오는 중…</div>
        ) : filteredData.length === 0 ? (
          <div className="w-full py-20 text-center text-slate-500">해당 카테고리에 상품이 없습니다.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full pb-40">
            {filteredData.map((item) => (
              <div key={`${item.category}-${item.id}`} className="mb-12">
                <CardProduct slug={item.slug} image={item.image} product_name={item.product_name} product_code={item.product_code} id={String(item.id)} />
              </div>
            ))}
          </div>
        )}
      </div>

      <section>
        <Contact />
      </section>
    </>
  );
}
