// app/page.tsx
import Hero from "@/components/common/Hero";
import React from "react";
import Link from "next/link";
import ItemList from "@/components/slider/ItemList";
import Image from "next/image";
import Contact from "@/components/common/Contact";
import { supabase } from "@/lib/supabase";
import type { ProductCardItem } from "@/components/slider/CardProduct";

type Product = {
  id: string | number;
  slug?: string | null;
  image?: string | null;
  product_name?: string | null;
  product_code?: string | null;
  category?: string | null;
};

// ✅ slug 있는 것만 통과시키는 타입가드 (3번)
function hasSlug(p: Product): p is Product & { slug: string } {
  return typeof p.slug === "string" && p.slug.trim().length > 0;
}

export default async function Page() {
  // ✅ 카테고리별 테이블 조회
  const [{ data: toplight }, { data: speaker }, { data: heavy }, { data: cooling }, { data: etc }] = await Promise.all([
    supabase.from("toplight_specs").select("*"),
    supabase.from("speaker_specs").select("*"),
    supabase.from("heavy_specs").select("*"),
    supabase.from("cooling_specs").select("*"),
    supabase.from("etc_specs").select("*"),
  ]);

  // ✅ 하나의 배열로 통합
  const allProducts: Product[] = [
    ...(toplight ?? []).map((v) => ({ ...v, category: "toplight" })),
    ...(speaker ?? []).map((v) => ({ ...v, category: "speaker" })),
    ...(heavy ?? []).map((v) => ({ ...v, category: "heavy" })),
    ...(cooling ?? []).map((v) => ({ ...v, category: "cooling" })),
    ...(etc ?? []).map((v) => ({ ...v, category: "etc" })),
  ];

  // ✅ ItemList에 맞는 형태로 변환 + slug 없는 건 제거
  const items: ProductCardItem[] = allProducts.filter(hasSlug).map((p) => ({
    id: p.id,
    slug: p.slug, // ✅ 여기서 string 확정
    image: p.image ?? null,
    product_name: p.product_name ?? null,
    product_code: p.product_code ?? null,
    category: (p.category ?? "etc") as string,
  }));

  return (
    <>
      <Hero img={"/image/main/hero.png"} subtitle={"SAFETY SOLUTION PRODUCTS"} title={"산업현장 사고를 줄이는"} title2={"스마트 안전 시스템"} />

      <section className="flex flex-col justify-center items-center py-20 md:py-32 gap-4 px-4 text-center md:text-start">
        <h2>다양한 제품을 확인하고, 안전의 새로운 기준을 경험해보세요</h2>
        <p>다양한 제품을 확인하고, 안전의 새로운 기준을 경험해보세요</p>

        <Link href="/products" className="border text-[#2F7EF9] rounded-full border-[#2F7EF9] px-10 py-3 mb-4">
          ALL PRODUCTS <span aria-hidden="true">&gt;</span>
        </Link>

        {/* ✅ 카테고리 통합 상품 리스트 (slug 없는 상품 제외됨) */}
        <ItemList items={items} />
      </section>

      <section className="w-full bg-gradient-to-r from-[#96C2EA]/15 to-[#003EFF]/5">
        <div className="mx-auto w-full max-w-[1440px] overflow-hidden">
          <div className="flex min-h-[520px] flex-col-reverse lg:flex-row">
            {/* LEFT */}
            <div className="w-full lg:w-[60%] px-4 py-20 lg:px-12">
              <h2 className="text-[22px] leading-snug font-bold text-[#0F172A] lg:text-[28px]">
                <span className="text-[#2F7EF9]">포스탑</span>은 고위험 산업현장의 위험 인지를
                <br className="hidden md:block" />
                <span className="pl-2">책임지는 산업 안전 솔루션 기업입니다.</span>
              </h2>

              <p className="mt-6 text-[14px] leading-relaxed text-slate-600 lg:text-[15px]">
                강한 조도와 난반사, 고열 환경에서도 선명하게 인식되는 탑라이트·고보라이트를 통해 멀리서도 확실한 시각적 경고 효과를 제공합니다.
                <br />
                <br />
                정확한 표지와 체계적인 경고 시스템으로 산업재해 발생 가능성을 근본적으로 낮추는 안전 솔루션입니다.
              </p>

              <Link
                href="/"
                className="mt-10 inline-flex items-center gap-2 rounded-full border border-[#2F7EF9] px-7 py-3 text-sm font-medium text-[#2F7EF9] transition hover:bg-[#2F7EF9] hover:text-white"
              >
                More View <span aria-hidden="true">→</span>
              </Link>
            </div>

            {/* RIGHT */}
            <div className="relative w-full lg:w-[40%] min-h-[260px] lg:min-h-[420px]">
              <Image src="/image/main/solution.png" alt="포스탑 산업 안전 솔루션" fill className="object-cover" priority />
            </div>
          </div>
        </div>
      </section>

      <section>
        <Contact />
      </section>
    </>
  );
}
