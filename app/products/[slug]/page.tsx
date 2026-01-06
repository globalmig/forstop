// app/products/[slug]/page.tsx
export const revalidate = 60;

import { notFound } from "next/navigation";
import Image from "next/image";
import Hero from "@/components/common/Hero";
import Contact from "@/components/common/Contact";
import { supabase } from "@/lib/supabase";

interface PageProps {
  params: { slug: string };
}

type Spec = { label: string; value: string };

const CATEGORY_LABEL: Record<string, string> = {
  heavy: "지게차 / 중장비",
  toplight: "탑라이트 / 표시기",
  speaker: "음성경보장치 / 스피커",
  cooling: "이동식 에어컨 / 냉각팬",
  etc: "카메라 외 기타",
  light: "기타 제품",
};

const CATEGORY_TABLE: Record<string, string> = {
  light: "products_ligt",
  heavy: "heavy_specs",
  toplight: "toplight_specs",
  speaker: "speaker_specs",
  cooling: "cooling_specs",
  etc: "etc_specs",
};

type SpecField = { label: string; key: string; aliases?: string[] };

// ✅ DB 컬럼명이 다를 가능성 대비해서 aliases 추가 가능
const SPEC_FIELDS: Record<string, SpecField[]> = {
  toplight: [
    { label: "정격전압", key: "voltage" },
    { label: "방수등급", key: "waterproof" },
    { label: "밝기", key: "brightness" },
    { label: "인증", key: "certification" },
    { label: "유효거리", key: "effective_range", aliases: ["range", "valid_range"] },
    { label: "제품크기", key: "size" },
    { label: "제품무게", key: "weight" },
    { label: "작동전류", key: "operating_current", aliases: ["op_current", "working_current"] },
    { label: "제품수명", key: "lifespan", aliases: ["life", "life_span"] },
    {
      label: "제품출력",
      key: "productOutput",
      aliases: ["product_output", "output_power", "output", "power_output", "productOutput"],
    },
  ],
  speaker: [
    { label: "사용범위", key: "range" },
    { label: "동작전원", key: "power", aliases: ["operating_power"] },
    { label: "제품크기", key: "size" },
    { label: "센서", key: "sensor" },
    { label: "탐지거리", key: "detection_distance", aliases: ["detect_distance", "detectionRange"] },
    { label: "동작시간", key: "operating_time", aliases: ["operation_time"] },
    { label: "배터리", key: "battery" },
    { label: "음량", key: "volume" },
    { label: "방수등급", key: "waterproof" },
  ],
  etc: [
    { label: "사용범위", key: "range" },
    { label: "동작전원", key: "power" },
    { label: "소모전류", key: "current_consumption", aliases: ["consumption_current"] },
    { label: "인식범위", key: "recognition_range", aliases: ["recognitionRange"] },
    { label: "추가기능1", key: "extra_feature_1", aliases: ["extra1"] },
    { label: "추가기능2", key: "extra_feature_2", aliases: ["extra2"] },
    { label: "추가기능3", key: "extra_feature_3", aliases: ["extra3"] },
    { label: "비고", key: "note", aliases: ["remarks"] },
    { label: "디스플레이", key: "display" },
    { label: "해상도 및 화각", key: "resolution_fov", aliases: ["resolution", "fov"] },
    { label: "충전시간", key: "charging_time", aliases: ["charge_time"] },
    { label: "촬영가능시간", key: "recording_time", aliases: ["record_time"] },
    { label: "배터리", key: "battery" },
    { label: "각도", key: "angle" },
  ],
  heavy: [
    { label: "입력전원", key: "input_power", aliases: ["input"] },
    { label: "소비전력", key: "power_consumption", aliases: ["consumption_power"] },
    { label: "출력방식", key: "output_method", aliases: ["output"] },
    { label: "방수·방진 등급", key: "ip_rating", aliases: ["ip", "ipRate"] },
    { label: "하우징 소재", key: "housing_material" },
    { label: "브라켓 소재", key: "bracket_material" },
    { label: "렌즈 소재", key: "lens_material" },
    { label: "사용온도 범위", key: "operating_temperature", aliases: ["temperature_range"] },
    { label: "수명", key: "lifespan", aliases: ["life"] },
    { label: "적용 차량", key: "applicable_vehicles", aliases: ["vehicles"] },
  ],
  cooling: [
    { label: "냉방능력", key: "cooling_capacity" },
    { label: "소비전력", key: "power_consumption" },
    { label: "정격전압", key: "rated_voltage", aliases: ["voltage"] },
    { label: "정격전류", key: "rated_current", aliases: ["current"] },
    { label: "사용냉매", key: "refrigerant" },
    { label: "토출구", key: "outlet" },
    { label: "제품무게", key: "weight" },
    { label: "제품크기", key: "size" },
    { label: "냉품범위", key: "cooling_range" },
    { label: "물탱크용량", key: "water_tank_capacity" },
    { label: "연속가동", key: "continuous_operation" },
    { label: "추가기능", key: "extra_features" },
    { label: "풍량", key: "airflow" },
    { label: "최대RPM", key: "max_rpm" },
    { label: "방수등급", key: "waterproof" },
    { label: "소음레벨", key: "noise_level" },
    { label: "송풍거리", key: "air_distance" },
  ],
};

type ProductRow = {
  id: string | number;
  slug: string;
  image: string | null;
  product_name: string | null;
  product_code: string | null;
  category: string | null;
  description: unknown | null;
  model_name: string | null;
  [key: string]: any;
};

function toStringArray(v: unknown): string[] {
  if (!v) return [];
  if (Array.isArray(v)) return v.filter(Boolean).map(String);

  if (typeof v === "string") {
    try {
      const parsed = JSON.parse(v);
      if (Array.isArray(parsed)) return parsed.filter(Boolean).map(String);
    } catch {
      return v.trim() ? [v] : [];
    }
  }
  return [];
}

// ✅ 카테고리 값이 한글/대문자/라벨로 와도 heavy/toplight... 로 맞춰줌
function normalizeCategory(raw: unknown): "" | keyof typeof CATEGORY_LABEL {
  const c = String(raw ?? "")
    .trim()
    .toLowerCase();
  if (!c) return "";

  if (c === "heavy" || c.includes("중장비") || c.includes("지게차")) return "heavy";
  if (c === "toplight" || c.includes("탑라이트") || c.includes("표시기")) return "toplight";
  if (c === "speaker" || c.includes("스피커") || c.includes("음성")) return "speaker";
  if (c === "cooling" || c.includes("에어컨") || c.includes("냉각")) return "cooling";
  if (c === "etc" || c.includes("기타") || c.includes("카메라")) return "etc";
  if (c === "light" || c.includes("기타 제품")) return "light";

  // 혹시 이미 정확한 키가 들어온 경우
  if (["heavy", "toplight", "speaker", "cooling", "etc", "light"].includes(c)) {
    return c as any;
  }

  return "";
}

// ✅ spec value를 key 또는 aliases로 찾아서 가져오기
function pickValue(row: ProductRow, key: string, aliases?: string[]) {
  if (key in row) return row[key];
  if (aliases) {
    for (const a of aliases) {
      if (a in row) return row[a];
    }
  }
  return undefined;
}

async function getProductBySlug(slug: string): Promise<ProductRow | null> {
  for (const [cat, table] of Object.entries(CATEGORY_TABLE)) {
    const { data, error } = await supabase.from(table).select("*").eq("slug", slug).maybeSingle();

    if (error) {
      console.error(`[getProductBySlug] table=${table} error=`, error.message);
      continue;
    }

    if (data) {
      const row = data as ProductRow;

      // ✅ 여기 핵심: DB category가 뭘로 오든 table 기준 cat을 우선 적용 + normalize
      row.category = normalizeCategory(row.category) || (cat as any);

      // console.log(`✅ Found in table: ${table}`);
      // console.log(`📦 Normalized Category: ${row.category}`);
      // console.log(`📝 All columns:`, Object.keys(data));

      return row;
    }
  }
  return null;
}

function buildSpecs(p: ProductRow): Spec[] {
  const cat = String(p.category || "");
  const fields = SPEC_FIELDS[cat] || [];
  const specs: Spec[] = [];

  const push = (label: string, value: any) => {
    const v = value == null ? "" : String(value).trim();
    if (v && v !== "null" && v !== "undefined") specs.push({ label, value: v });
  };

  // 공통 - 모델명
  if (p.model_name) push("모델명", p.model_name);

  console.log(`🔍 Building specs for category: ${cat}`);
  console.log(
    `📋 Expected fields:`,
    fields.map((f) => f.key)
  );

  // ✅ 누락 필드 체크 + aliases로 값 찾기
  fields.forEach((f) => {
    const value = pickValue(p, f.key, f.aliases);

    if (value === undefined) {
      // 디버깅에 도움되는 누락 로그
      console.log(`🚨 Missing field: ${f.key} (aliases: ${f.aliases?.join(",") ?? "-"})`);
    } else {
      console.log(`  - ${f.label} (${f.key}):`, value);
    }

    push(f.label, value);
  });

  console.log(`✅ Total specs built: ${specs.length}`);
  return specs;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const product = await getProductBySlug(params.slug);

  if (!product) notFound();

  const title = product.product_name ?? "제품";
  const categoryValue = product.category ?? "";
  const categoryLabel = CATEGORY_LABEL[categoryValue] ?? categoryValue ?? "PRODUCT";

  const img = product.image || "/image/common/no-image.png";

  const items = toStringArray(product.description);
  const specs = buildSpecs(product);

  return (
    <>
      <Hero img={img} subtitle={categoryLabel} title={title} sub={product.product_code ?? ""} />

      <section className="w-full max-w-[1440px] mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="relative h-[320px] rounded-2xl overflow-hidden bg-gray-50">
            <Image src={img} alt={title} fill className="object-contain" unoptimized />
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-3">{title}</h1>

            <div className="border-t pt-6 space-y-2">
              <p className="text-sm text-gray-500">카테고리: {categoryLabel}</p>
              <p className="text-sm text-gray-500">제품코드: {product.product_code ?? "-"}</p>
              {product.model_name && <p className="text-sm text-gray-500">모델명: {product.model_name}</p>}
            </div>
          </div>
        </div>
      </section>

      {/* 핵심기능 */}
      {items.length > 0 && (
        <section className="bg-[#F2F4F6] py-20 px-4 flex flex-col justify-center items-center">
          <h2 className="text-center pb-4">핵심기능</h2>

          <div className="space-y-4 max-w-[1440px] w-full">
            {items.map((text, index) => (
              <div key={index} className="bg-white shadow-md py-4 flex items-center px-4 rounded-2xl border">
                <p className="bg-black text-white py-3 px-4 rounded-lg mr-10 flex-shrink-0">{String(index + 1).padStart(2, "0")}</p>
                <p className="break-words">{text}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 제품 사양 */}
      {specs.length > 0 ? (
        <section className="flex flex-col items-center py-20 px-4">
          <div className="w-full overflow-x-auto">
            <div className="max-w-[1440px] mx-auto">
              <h2 className="text-center mb-8">제품 사양</h2>

              <div className="border border-gray-200 rounded-2xl overflow-hidden">
                <div className="grid grid-cols-3 bg-gray-100 font-semibold">
                  <div className="px-6 py-4 border-r border-gray-200 text-center">구분</div>
                  <div className="col-span-2 px-6 py-4 text-center">{title}</div>
                </div>

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
      ) : (
        <section className="flex flex-col items-center py-20 px-4">
          <div className="text-gray-500">제품 사양 정보가 없습니다.</div>
        </section>
      )}

      <Contact />
    </>
  );
}
