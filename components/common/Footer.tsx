import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#2A2E3B] text-white/80 flex justify-center mx-auto py-20">
      <div className="text-start">
        <h4>(주)포스탑</h4>
        <p className="text-sm">
          대표자: 박민영 | 사업자 번호: 640-88-03370
          <br />
          전화 번호: 010-2539-2878
          <br />
          주소: 경상북도 포항시 북구 죽도로28번길 46, 1층(죽도동, 라오스데오)
        </p>
        <br />
        <Link href={"/admin"}>관리자페이지</Link>
      </div>
    </footer>
  );
}
