import Hero from "@/components/common/Hero";
import React from "react";
import Image from "next/image";
// import Link from "next/link"; // 안 쓰면 제거

export default function Page() {
  return (
    <div>
      <Hero img={"/image/hero_company.png"} subtitle={"COMPANY"} title={"회사소개"} />

      <section className="w-full">
        <div className="mx-auto w-full max-w-[1440px] overflow-hidden">
          <div className="flex flex-col-reverse lg:flex-row">
            {/* LEFT */}
            <div className="w-full px-4 py-14 lg:px-12 lg:py-20">
              <h2 className="text-[22px] leading-snug font-bold text-[#0F172A] lg:text-[28px]">
                <span className="text-[#2F7EF9]">포스탑</span>은 고위험 산업현장의 위험 인지를
                <br />
                책임지는 산업 안전 솔루션 기업입니다.
              </h2>

              <p className="mt-6 text-[14px] leading-relaxed text-slate-600 lg:text-[15px]">
                강한 조도와 난반사, 고열 환경에서도 선명하게 인식되는 탑라이트·고보라이트를 통해 멀리서도 확실한 시각적 경고 효과를 제공합니다. 작업자와 차량, 크레인 등 중장비의 이동 동선과 접근·교차
                구역을 명확히 표시해 충돌 사고와 이동 동선 내 사고 위험을 효과적으로 줄입니다.
                <br />
                <br />
                또한 열원, 낙하물, 제한구역 등 현장 내 위험 요소를 실시간으로 시각화하여 작업자가 위험 구역을 즉시 인지할 수 있도록 돕습니다. 정확한 표지와 체계적인 경고 시스템으로 작업 효율을 높이고
                산업재해 발생 가능성을 근본적으로 낮추는 안전 솔루션입니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-[#F8FCFF]">
        <div className="mx-auto max-w-[1440px] px-4">
          <div className="flex min-h-[520px] flex-col justify-center lg:flex-row">
            <div className="w-full py-16">
              <h2 className="text-[22px] font-bold text-[#0F172A] lg:text-[28px]">
                <span className="text-[#2F7EF9]">BUSINESS AREAS</span>
              </h2>

              <div className="mt-8 grid grid-cols-1 gap-6 border-b border-[#515862]/50 py-10 pt-6 md:grid-cols-2">
                <div>
                  <p className="text-[20px] font-semibold text-slate-700">물류 분야</p>
                  <p className="mt-1 text-[20px] font-semibold text-slate-700">(Logistics Safety)</p>
                </div>

                <ul className="list-disc space-y-1 pl-5 text-slate-600">
                  <li>지게차용 사람인식 카메라 시스템</li>
                  <li>소형운반차 후방 안전 시스템</li>
                  <li>이동식 에어컨 (1구 / 2구)</li>
                  <li>에어커튼</li>
                </ul>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-6 border-b border-[#515862]/50 py-10 pt-6 md:grid-cols-2">
                <div>
                  <p className="text-[20px] font-semibold text-slate-700">산업현장 분야</p>
                  <p className="mt-1 text-[20px] font-semibold text-slate-700">(Industrial Safety)</p>
                </div>

                <ul className="list-disc space-y-1 pl-5 text-slate-600">
                  <li>탑 라이트 (150W/300W/600W/800W)</li>
                  <li>가상안전라인 표시기</li>
                  <li>모션센서 음성경보장치 및 스피커</li>
                  <li>산업용 냉풍기 및 HVLS 냉각팬</li>
                  <li>산업용 이동식 회전형 안개분사기</li>
                  <li>산업용 Britz 바디캠</li>
                  <li>산업용 액션캠/CCTV</li>
                  <li>충전식 작업등</li>
                  <li>KEY LOCKS (지문/카드/번호인식)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-gradient-to-r from-[#96C2EA]/15 to-[#003EFF]/5">
        <div className="mx-auto max-w-[1440px] px-4">
          <div className="flex min-h-[520px] flex-col justify-center lg:flex-row ">
            <div className="w-full py-16">
              <h2 className="text-[22px] text-center font-bold text-[#0F172A] lg:text-[28px]">
                <span className="text-[#2F7EF9]">포스탑</span> 오시는 길 안내
              </h2>

              {/* TODO: 구글 맵 넣기 */}
              <div className="mt-4 md:mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 ">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3227.559773253578!2d129.337364!3d36.0066217!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x356701cb964df655%3A0x82108e96c7f6f92c!2zKOyjvCntj6zsiqTtg5E!5e0!3m2!1sko!2skr!4v1767003821241!5m2!1sko!2skr"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-64 md:h-full rounded-2xl shadow-lg"
                ></iframe>
                <div className="cardList flex flex-col gap-4">
                  <div className="card w-full rounded-2xl bg-white/60 border border-slate-200 p-8 shadow-md">
                    <div className="flex gap-4 mb-4">
                      <div className="flex justify-center items-center">
                        <Image src={"/icon/local.png"} alt="주소아이콘" width={20} height={20} />
                      </div>
                      <h4 className="m-0">주소</h4>
                    </div>
                    <p>경상북도 포항시 북구 죽도로28번길 46, 1층 (죽도동, 라오스데오) 포스탑</p>
                  </div>

                  <div className="card w-full rounded-2xl bg-white/60 border border-slate-200 p-8 shadow-md">
                    <div className="flex gap-4 mb-4">
                      <div className="flex justify-center items-center">
                        <Image src={"/icon/call.png"} alt="주소아이콘" width={26} height={20} />
                      </div>
                      <h4 className="m-0">전화</h4>
                    </div>
                    <p>010-2539-2878</p>
                  </div>
                  <div className="card w-full rounded-2xl bg-white/60 border border-slate-200 p-8 shadow-md">
                    <div className="flex gap-4 mb-4">
                      <div className="flex justify-center items-center">
                        <Image src={"/icon/printer.png"} alt="주소아이콘" width={28} height={20} />
                      </div>
                      <h4 className="m-0">팩스</h4>
                    </div>
                    <p>070-0000-0000</p>
                  </div>
                  <div className="card w-full rounded-2xl bg-white/60 border border-slate-200 p-8 shadow-md">
                    <div className="flex gap-4 mb-4">
                      <div className="flex justify-center items-center">
                        <Image src={"/icon/email.png"} alt="주소아이콘" width={28} height={20} />
                      </div>
                      <h4 className="m-0">이메일</h4>
                    </div>
                    <p>stone5882@naver.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
