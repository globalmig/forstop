"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function GNB() {
  const [open, setOpen] = useState(false);

  // 메뉴 열렸을 때 스크롤 잠금 + ESC로 닫기
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKeyDown);
    } else {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="absolute top-0 left-0 w-full z-50">
      <nav className="w-full">
        <div className="flex justify-between items-center w-full max-w-[1440px] mx-auto text-xl h-24 px-4">
          {/* 로고 */}
          <Link href="/" className="font-bold text-white" onClick={close}>
            포스탑
          </Link>

          {/* PC 메뉴 */}
          <ul className="hidden md:flex gap-10 items-center text-white">
            <li>
              <Link href="/company">회사소개</Link>
            </li>
            <li>
              <Link href="/products">제품소개</Link>
            </li>
            <li>
              <Link href="/contact">제품문의</Link>
            </li>
          </ul>

          {/* 모바일 햄버거 버튼 */}
          <button type="button" className="md:hidden inline-flex items-center justify-center w-11 h-11" aria-label="메뉴 열기" aria-expanded={open} onClick={() => setOpen(true)}>
            {/* 햄버거 아이콘 */}
            <span className="sr-only">메뉴</span>
            <div className="flex flex-col gap-1.5">
              <span className="block w-6 h-0.5 bg-white" />
              <span className="block w-6 h-0.5 bg-white" />
              <span className="block w-6 h-0.5 bg-white" />
            </div>
          </button>
        </div>
      </nav>

      {/* 모바일 오버레이 + 슬라이드 메뉴 */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* 배경 오버레이 */}
          <button type="button" className="absolute inset-0 bg-black/40" aria-label="메뉴 닫기" onClick={close} />

          {/* 메뉴 패널 */}
          <div className="absolute top-0 right-0 h-full w-[82%] max-w-[360px] bg-white shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <span className="font-bold text-lg">MENU</span>
              <button type="button" className="w-10 h-10 inline-flex items-center justify-center" aria-label="닫기" onClick={close}>
                {/* X 아이콘 */}
                <span className="text-2xl leading-none">×</span>
              </button>
            </div>

            <ul className="flex flex-col gap-4 text-lg">
              <li>
                <Link href="/company" onClick={close} className="block py-2">
                  회사소개
                </Link>
              </li>
              <li>
                <Link href="/products" onClick={close} className="block py-2">
                  제품소개
                </Link>
              </li>
              <li>
                <Link href="/contact" onClick={close} className="block py-2">
                  제품문의
                </Link>
              </li>
            </ul>

            {/* CTA 필요하면 */}
            {/* <div className="mt-8">
              <Link href="/contact" onClick={close} className="block text-center py-3 rounded-lg bg-black text-white">
                문의하기
              </Link>
            </div> */}
          </div>
        </div>
      )}
    </header>
  );
}
