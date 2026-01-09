// app/api/products/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

type ProductListItem = {
  id: string;
  slug: string;
  image: string | null;
  product_name: string | null;
  product_code: string | null;
  category: string; // heavy/toplight/speaker/cooling/etc
};

// product_code가 없으면 description에서 첫 줄 뽑아서 대체(선택)
function pickProductCode(row: any) {
  if (row?.product_code) return String(row.product_code);

  const d = row?.description;
  if (Array.isArray(d) && d.length) return String(d[0]);

  if (typeof d === "string" && d.trim()) {
    const t = d.trim();

    // 문자열 JSON 배열일 수도 있어서 파싱 시도
    if (t.startsWith("[") && t.endsWith("]")) {
      try {
        const arr = JSON.parse(t);
        if (Array.isArray(arr) && arr.length) return String(arr[0]);
      } catch {}
    }

    // 그냥 문자열이면 첫 줄
    return t.split("\n")[0] || "";
  }

  return "";
}

function toListItem(row: any, categoryFallback: string): ProductListItem {
  return {
    id: String(row.id),
    slug: row.slug ?? "",
    image: row.image ?? null,
    product_name: row.product_name ?? null,
    product_code: row.product_code ?? pickProductCode(row) ?? null,
    category: row.category ?? categoryFallback,
  };
}

async function fetchTable(table: string, categoryFallback: string) {
  const { data, error } = await supabase.from(table).select("id, slug, image, product_name, product_code, description, category").order("id", { ascending: false });

  if (error) throw new Error(`${table}: ${error.message}`);
  return (data ?? []).map((r) => toListItem(r, categoryFallback));
}

// ✅ GET - 전체 상품 조회 (카테고리별 테이블 합쳐서 반환)
export async function GET() {
  try {
    const [heavy, toplight, speaker, cooling, etc] = await Promise.all([
      fetchTable("heavy_specs", "heavy"),
      fetchTable("toplight_specs", "toplight"),
      fetchTable("speaker_specs", "speaker"),
      fetchTable("cooling_specs", "cooling"),
      fetchTable("etc_specs", "etc"),
    ]);

    const merged = [...heavy, ...toplight, ...speaker, ...cooling, ...etc];

    // 합친 뒤 id 기준 정렬 (id가 숫자라면 유효)
    merged.sort((a, b) => Number(b.id) - Number(a.id));

    return NextResponse.json(merged);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}

// ✅ POST 막기(공개 API면 위험) — 등록은 /api/admin 에서만
export async function POST() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
