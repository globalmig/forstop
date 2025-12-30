"use client";

import { useState } from "react";
import Hero from "@/components/common/Hero";
import React from "react";

export default function page() {
  const [agree, setAgree] = useState(true);

  const privacyText = `개인정보 처리방침
(주)○○○(이하 "회사"라 한다)는 개인정보 보호법 제30조에 따라 정보주체의 개인정보를 보호하고 관련 고충을 신속하고 원활하게 처리하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.

제1조 (개인정보의 처리 목적)
회사는 다음의 목적을 위하여 개인정보를 처리합니다.
1. 문의 및 상담 응대
2. 문의 접수 및 내용 확인
3. 상담 및 요청 사항 처리
4. 처리 결과 안내 및 회신

제2조 (처리하는 개인정보 항목)
필수항목: 성명, 연락처(휴대전화번호)
선택항목: 이메일

제3조 (보유 및 이용기간)
문의 처리 완료 후 1년 보관 후 파기 (관련 법령에 따라 보관이 필요한 경우 해당 기간 보관)

제4조 (개인정보의 제3자 제공)
회사는 원칙적으로 개인정보를 제3자에게 제공하지 않습니다.

※ 자세한 내용은 실제 회사 방침에 맞게 수정하세요.`;

  const onSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!agree) {
      alert("개인정보 수집 및 이용에 동의해주세요.");
      return;
    }
    // TODO: 여기서 API 호출/메일 발송/DB 저장 처리
    alert("문의가 접수되었습니다!");
  };

  return (
    <>
      <Hero img={"/image/hero_contact.png"} subtitle={"CONTACT"} title={"제품문의"} sub="문의시 빠른 상담 도와드리겠습니다." />

      <section className="w-full flex justify-center px-4 py-16">
        <div className="w-full max-w-[1100px]">
          {/* 타이틀 */}
          <h2 className="text-2xl font-semibold mb-10 text-center">문의하기</h2>

          <form onSubmit={onSubmit} className="w-full">
            {/* 상단 2열 입력 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="text-blue-600">*</span> 성함
                </label>
                <input type="text" placeholder="성함을 기재해주세요." className="w-full h-11 rounded-lg border border-gray-200 px-4 outline-none focus:border-gray-400" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="text-blue-600">*</span> 연락처
                </label>
                <input type="tel" placeholder="연락처를 기재해주세요." className="w-full h-11 rounded-lg border border-gray-200 px-4 outline-none focus:border-gray-400" required />
              </div>
            </div>

            {/* 문의 내용 */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="text-blue-600">*</span> 문의 내용
              </label>
              <textarea placeholder="문의 내용을 기재해주세요." className="w-full min-h-[220px] rounded-lg border border-gray-200 p-4 outline-none focus:border-gray-400 resize-none" required />
            </div>

            {/* 동의 체크 */}
            <div className="mt-6 flex items-center gap-3">
              <input id="agree" type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="h-4 w-4" />
              <label htmlFor="agree" className="text-sm text-gray-700 font-medium">
                개인정보 수집 및 이용 동의
              </label>
            </div>

            {/* 개인정보 박스 */}
            <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4">
              <div className="h-[150px] overflow-y-auto pr-2 text-xs leading-5 text-gray-600 whitespace-pre-line">{privacyText}</div>
            </div>

            {/* 버튼 */}
            <div className="mt-10 flex justify-center">
              <button type="submit" className="w-full max-w-[360px] h-16 rounded-lg bg-slate-700 text-white font-semibold hover:bg-slate-800 transition">
                문의하기
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
