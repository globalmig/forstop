import Hero from "@/components/common/Hero";
import React from "react";
import Link from "next/link";
import ItemList from "@/components/slider/ItemList";
import Image from "next/image";
import Contact from "@/components/common/Contact";

export default function page() {
  return (
    <>
      <Hero img={"/image/main/hero.png"} subtitle={"SAFETY SOLUTION PRODUCTS"} title={"산업현장 사고를 줄이는"} title2={"스마트 안전 시스템"} />

      <section className="flex flex-col justify-center items-center py-20 md:py-32 gap-4 px-4 text-center md:text-start">
        <h2>다양한 제품을 확인하고, 안전의 새로운 기준을 경험해보세요</h2>
        <p>다양한 제품을 확인하고, 안전의 새로운 기준을 경험해보세요</p>
        <Link
          href="/products"
          className="border text-[#2F7EF9] rounded-full border-[#2F7EF9] px-10 py-3 mb-4
        "
        >
          ALL PRODUCTS
          <span aria-hidden="true" className="opacity-70">
            &gt;
          </span>
        </Link>
        {/* TODO: data 연결해야함 */}
        <ItemList />
      </section>

      <section className="w-full  bg-gradient-to-r from-[#96C2EA]/15 to-[#003EFF]/5">
        <div className="mx-auto w-full max-w-[1440px] overflow-hidden ">
          <div className="flex min-h-[520px] flex-col-reverse lg:flex-row">
            {/* LEFT */}
            <div className="w-full lg:w-[60%] px-4 py-20 lg:px-12">
              <h2 className="text-[22px] leading-snug font-bold text-[#0F172A] lg:text-[28px]">
                <span className="text-[#2F7EF9]">포스탑</span>은 고위험 산업현장의 위험 인지를
                <br className="hidden md:block" />
                <span className="pl-2">책임지는 산업 안전 솔루션 기업입니다.</span>
              </h2>

              <p className="mt-6 text-[14px] leading-relaxed text-slate-600 lg:text-[15px]">
                강한 조도와 난반사, 고열 환경에서도 선명하게 인식되는 탑라이트·고보라이트를 통해 멀리서도 확실한 시각적 경고 효과를 제공합니다. 작업자와 차량, 크레인 등 중장비의 이동 동선과 접근·교차
                구역을 명확히 표시해 충돌 사고와 이동 동선 내 사고 위험을 효과적으로 줄입니다.
                <br />
                <br />
                또한 열원, 낙하물, 제한구역 등 현장 내 위험 요소를 실시간으로 시각화하여 작업자가 위험 구역을 즉시 인지할 수 있도록 돕습니다. 정확한 표지와 체계적인 경고 시스템으로 작업 효율을 높이고
                산업재해 발생 가능성을 근본적으로 낮추는 안전 솔루션입니다.
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
              <Image
                src="/image/main/solution.png" // 스샷 이미지 경로로 교체
                alt="포스탑 산업 안전 솔루션"
                fill
                className="object-cover"
                priority
              />
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
