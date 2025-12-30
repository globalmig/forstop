// app/products/[slug]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import { ProductData } from "@/data/ProductData";
import Hero from "@/components/common/Hero";
import Link from "next/link";
import Contact from "@/components/common/Contact";

interface PageProps {
  params: { slug: string };
}

type Feature = { icon: string; title: string; desc: string };
type Spec = { label: string; value: string };

const items = ["무소음 설계로 조용한 사용", "고효율 에너지 절감", "견고한 내구성", "간편한 설치", "프리미엄 디자인"];

// ✅ 데이터 없을 때 쓸 기본 핵심기능 4개
const defaultFeatures: Feature[] = [
  {
    icon: "/icon/warning.png",
    title: "자동 경고 시스템",
    desc: "차량 동작과 동시에 고휘도 경고와 안내로 주변에 즉각적으로 위험을 인지시킵니다.",
  },
  {
    icon: "/icon/visibility.png",
    title: "시인성 강화 설계",
    desc: "난반사·먼거리 환경에서도 선명하게 보이도록 최적의 광학 설계를 적용했습니다.",
  },
  {
    icon: "/icon/durable.png",
    title: "산업용 내구성",
    desc: "진동·충격에 강한 구조로 현장 환경에서도 안정적으로 작동합니다.",
  },
  {
    icon: "/icon/weather.png",
    title: "전천후 사용",
    desc: "방진·방수 구조로 실내/실외 환경 변화에도 꾸준한 성능을 유지합니다.",
  },
];

// ✅ 데이터 없을 때 쓸 기본 스펙
const defaultSpecs: Spec[] = [
  { label: "입력 전원", value: "DC 12~90V" },
  { label: "소비 전력", value: "약 20W" },
  { label: "출력 방식", value: "LED + Voice Alarm" },
  { label: "방수 등급", value: "IP65" },
  { label: "하우징 소재", value: "Aluminum Die-cast" },
  { label: "렌즈 소재", value: "Polycarbonate" },
  { label: "사용 온도", value: "-40℃ ~ +60℃" },
  { label: "수명", value: "50,000 Hours" },
  { label: "적용 차량", value: "지게차, 산업 차량" },
];

export default function ProductDetailPage({ params }: PageProps) {
  const product = ProductData.find((p) => p.slug === params.slug);
  if (!product) notFound();

  // ✅ product에 데이터가 없으면 기본값으로 채워서 렌더
  const features: Feature[] = (product as any).features?.length ? (product as any).features : defaultFeatures;

  const specs: Spec[] = (product as any).specs?.length ? (product as any).specs : defaultSpecs;

  // ✅ 같은 카테고리 추천 (본인 제외, 최대 4개)
  const related = ProductData.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 4);

  return (
    <>
      <Hero img={product.img} subtitle={product.category} title={product.title} sub={product.desc} />

      <section className="w-full max-w-[1440px] mx-auto px-4 py-20">
        {/* 상단: 이미지 + 기본 설명 */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="relative h-[400px] bg-black rounded-2xl overflow-hidden">
            <Image src={product.img} alt={product.title} fill className="object-contain" />
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-3">{product.title}</h1>
            <p className="text-gray-600 mb-6">{product.desc}</p>

            <div className="border-t pt-6">
              <p className="text-sm text-gray-500">카테고리: {product.category}</p>
              <p className="text-sm text-gray-500 mt-1">제품코드: {product.slug}</p>
            </div>
          </div>
        </div>

        {/* ✅ 핵심기능 4개 */}
        <div className="pt-16">
          <h2 className="text-2xl font-bold mb-6">핵심기능</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.slice(0, 4).map((f, index) => (
              <div key={index} className="border rounded-2xl p-6 bg-[#FBFCFD] flex flex-col gap-4 break-words">
                <Image src={f.icon} alt={f.title} width={46} height={46} />
                <h3 className="font-semibold text-lg">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 특징 리스트섹션 */}
      <section className="bg-[#F2F4F6] py-20 px-4 flex flex-col justify-center items-center">
        <h2 className="text-center pb-4">핵심기능</h2>
        <div className="space-y-4 max-w-[1440px] w-full">
          {items.map((text, index) => (
            <div key={index} className="bg-white shadow-md py-4 flex items-center px-4 rounded-2xl border">
              <p className="bg-black text-white py-3 px-4 rounded-lg mr-10">{String(index + 1).padStart(2, "0")}</p>
              <p>{text}</p>
            </div>
          ))}
          <div className="bg-[#344666] text-white text-center px-4 py-12 rounded-2xl">
            <h3>산업 안전 기준 준수</h3>
            <p>산업안전보건기준 및 중대재해 예방 관리체계에 부합하는 필수 안전 설비</p>
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center py-20 px-4">
        {/* 스크롤 래퍼 */}
        <div className=" w-full overflow-x-auto">
          <div className="max-w-[1440px] mx-auto">
            <h2 className="text-center">제품 사양</h2>

            <div className="border border-gray-200 rounded-2xl overflow-hidden ">
              {/* 헤더 */}
              <div className="grid grid-cols-3 bg-gray-100 font-semibold">
                <div className="px-6 py-4 border-r border-gray-200 text-center">구분</div>
                <div className="col-span-2 px-6 py-4 text-center">{product.title}</div>
              </div>

              {/* 바디 */}
              {specs.map((s, idx) => (
                <div key={idx} className="grid grid-cols-3 border-t border-gray-200">
                  <div className="px-6 py-4 border-r border-gray-200 text-center font-medium text-gray-700">{s.label}</div>
                  <div className="col-span-2 px-6 py-4 text-center text-gray-700">{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Contact />
    </>
  );
}

// SEO를 위한 메타데이터 생성
export async function generateMetadata({ params }: PageProps) {
  const product = ProductData.find((p) => p.slug === params.slug);
  if (!product) return { title: "제품을 찾을 수 없습니다" };

  return {
    title: product.title,
    description: product.desc,
  };
}

// Static Generation을 위한 경로 생성
export async function generateStaticParams() {
  return ProductData.map((product) => ({ slug: product.slug }));
}
