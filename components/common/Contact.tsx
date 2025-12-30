import Link from "next/link";

export default function ContactBanner() {
  return (
    <section
      className="
        relative w-full text-white
        bg-[url('/image/main/bg_contact.png')] bg-cover bg-center bg-no-repeat
      "
    >
      {/* ✅ 오버레이 */}
      <div className="absolute inset-0 bg-[#0b1f3a]/60" />

      <div className="relative mx-auto max-w-[1440px] px-6 md:px-10">
        {/* ✅ 높이/정렬 */}
        <div className="grid min-h-[360px] md:min-h-[520px] md:grid-cols-2 items-center">
          {/* 좌측은 비워서 PC에서 오른쪽으로 밀리게 */}
          <div className="hidden md:block" />

          {/* ✅ 텍스트 영역 */}
          <div
            className="
    flex flex-col items-center md:items-start
    text-center md:text-left
    break-keep
    py-16 md:py-0
  "
          >
            <h3 className="text-xl md:text-3xl lg:text-4xl font-semibold leading-snug">한 번의 경고가 사고를 막습니다.</h3>

            <div className="mt-6 text-xl md:text-3xl lg:text-4xl font-semibold leading-snug">
              <p>산업 현장 시각 경고 시스템</p>
              <p>포스탑</p>
            </div>

            <p className="mt-6 text-2xl md:text-4xl font-bold tracking-wide">010-2539-2878</p>

            <Link
              href="/contact"
              className="
      mt-8
      inline-flex items-center justify-center
      rounded-full border border-white
      px-10 py-4
      text-base md:text-lg
      font-medium
      transition
      hover:bg-white hover:text-[#0b1f3a]
    "
            >
              문의하기
              <span className="ml-3 opacity-70">&gt;</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
