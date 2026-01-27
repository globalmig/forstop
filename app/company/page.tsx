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
                <span className="text-[#2F7EF9]">포스탑</span>은 제철소 및 고위험 산업현장을 중심으로 산업안전용품을
                <br />
                전문적으로 공급하는 산업안전 전문기업입니다.
              </h2>

              <p className="mt-6 text-[14px] leading-relaxed text-slate-600 lg:text-[16px]">
                포스탑은 제철소를 비롯한 고위험 산업현장을 중심으로 산업안전용품을 전문적으로 공급하는 산업안전 전문기업입니다.
                <br />
                <br />
                현장 환경과 공정 특성을 면밀히 분석하여 사고 예방에 실질적인 효과를 갖춘 안전 장비만을 선별·제공하며, 시각·청각 경고 시스템, 작업자 인식 기반 안전설비, 온도 저하 및 작업 환경 개선 장비
                등 다양한 안전 솔루션을 통해 현장의 위험 요소를 선제적으로 관리합니다.
                <br />
                <br />
                포스탑은 단순한 제품 공급을 넘어 산업 현장의 안전 수준과 운영 효율을 동시에 향상시키는 것을 목표로 하며, 엄격한 품질 기준과 현장 검증을 기반으로 기업과 작업자가 신뢰할 수 있는 전문
                안전 납품 파트너로서의 역할을 수행하고 있습니다.
                <br />
                <br />
                또한 지속적인 제품 고도화와 현장 중심 대응을 통해 변화하는 산업 환경과 안전 요구에 능동적으로 대응하며, 산업 안전의 새로운 기준을 만들어가고 있습니다.
              </p>

              {/* <p className="mt-6 text-[14px] leading-relaxed text-slate-600 lg:text-[15px]">
                강한 조도와 난반사, 고열 환경에서도 선명하게 인식되는 탑라이트·고보라이트를 통해 멀리서도 확실한 시각적 경고 효과를 제공합니다. 작업자와 차량, 크레인 등 중장비의 이동 동선과 접근·교차
                구역을 명확히 표시해 충돌 사고와 이동 동선 내 사고 위험을 효과적으로 줄입니다.
                <br />
                <br />
                또한 열원, 낙하물, 제한구역 등 현장 내 위험 요소를 실시간으로 시각화하여 작업자가 위험 구역을 즉시 인지할 수 있도록 돕습니다. 정확한 표지와 체계적인 경고 시스템으로 작업 효율을 높이고
                산업재해 발생 가능성을 근본적으로 낮추는 안전 솔루션입니다.
              </p> */}
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

              {/* <div className="mt-8 grid grid-cols-1 gap-6 border-b border-[#515862]/50 py-10 pt-6 md:grid-cols-2">
                <div>
                  <p className="text-[20px] font-semibold text-slate-700">물류 분야</p>
                  <p className="mt-1 text-[20px] font-semibold text-slate-700">(Logistics Safety)</p>
                </div>

                <ul className="list-disc space-y-1 pl-5 text-slate-600">
                  <li>지게차용 사람인식 카메라 시스템</li>
                  <li>후방 안전 시스템</li>
                  <li>바디캠 / 액션캠</li>
                  <li>도어락</li>
                  <li>이동식 에어컨 (1구 / 2구)</li>
                  <li>에어커튼</li>
                </ul>
              </div> */}

              <div className="mt-8 grid grid-cols-1 gap-6 border-b border-[#515862]/50 py-10 pt-6 md:grid-cols-2">
                <div>
                  <p className="text-[20px] font-semibold text-slate-700">물류 분야</p>
                  <p className="mt-1 text-[20px] font-semibold text-slate-700">(Logistics Safety)</p>
                </div>

                <ul className="list-disc space-y-1 pl-5 text-slate-600">
                  <li>지게차용 사람인식 카메라 시스템</li>
                  <li>후방 안전 시스템</li>
                  <li>바디캠 / 액션캠</li>
                  <li>KEY LOCKS (지문/카드/번호인식)</li>

                  <li>충전식 작업등</li>
                </ul>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-6 border-b border-[#515862]/50 py-10 pt-6 md:grid-cols-2">
                <div>
                  <p className="text-[20px] font-semibold text-slate-700">환경개선분야</p>
                  <p className="mt-1 text-[20px] font-semibold text-slate-700">(Environmental Improvement)</p>
                </div>

                <ul className="list-disc space-y-1 pl-5 text-slate-600">
                  <li>이동식 에어컨 (1구 / 2구 /3구)</li>
                  <li>에어커튼</li>
                  <li>산업용 냉풍기</li>
                  <li>냉각팬 (1.5 / 2.0)</li>
                  <li>산업용 이동식 회전형 안개분사기</li>
                  <li>산업용 이동식 공기순환 냉각팬</li>
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
                  <li>휴대용 멀티모션 경광 스피커</li>
                  <li>모션센서 옥외음성경보장치</li>
                  <li>모션센서 음성경보장치</li>
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
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248.34954667841438!2d129.3372710160803!3d36.00661280391964!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x356701cb964df655%3A0x82108e96c7f6f92c!2zKOyjvCntj6zsiqTtg5E!5e0!3m2!1sko!2skr!4v1769491609113!5m2!1sko!2skr"
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
