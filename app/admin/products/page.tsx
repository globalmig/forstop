import Link from "next/link";
import DeleteProductForm from "@/app/admin/products/_components/DeleteProductForm";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

// 카테고리별 테이블 맵 (products_ligt 오타 테이블 제거 기준)
const TABLE_MAP: Record<string, string> = {
  toplight: "toplight_specs",
  speaker: "speaker_specs",
  etc: "etc_specs",
  heavy: "heavy_specs",
  cooling: "cooling_specs",
};

// 카테고리 라벨 맵 (UI 용)
const CATEGORY_LABEL_MAP: Record<string, string> = {
  toplight: "탑라이트 / 표시등",
  speaker: "경보장치 / 스피커",
  cooling: "이동식 에어컨 / 냉각기",
  heavy: "지게차 / 중장비",
  etc: "카메라/기타",
};

type Row = {
  id: string | number;
  slug: string | null;
  product_name: string | null;
  product_code: string | null;
  category: string | null;
  image: string | null;
  _table: string;
  _category: string;
};

// 삭제 서버 액션 (category+id 필요)
async function deleteProduct(formData: FormData) {
  "use server";

  const id = String(formData.get("id") || "");
  const category = String(formData.get("category") || "");

  if (!id || !category) return;

  const table = TABLE_MAP[category];
  if (!table) throw new Error("unknown category");

  const { error } = await supabaseAdmin.from(table).delete().eq("id", id);

  if (error) {
    console.error("DELETE ERROR:", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export default async function AdminProductsPage({ searchParams }: { searchParams?: { q?: string; category?: string } }) {
  // 모든 테이블에서 목록을 가져와 합치기
  const results = await Promise.all(
    Object.entries(TABLE_MAP).map(async ([category, table]) => {
      const { data, error } = await supabaseAdmin.from(table).select("id, slug, product_name, product_code, category, image").order("id", { ascending: false });

      if (error) {
        console.error(`${table} fetch error:`, error.message);
        return [] as Row[];
      }

      return (data ?? []).map((p: any) => ({
        ...p,
        category: p.category ?? category,
        _table: table,
        _category: category,
      })) as Row[];
    })
  );

  const data = results.flat();

  const qRaw = (searchParams?.q ?? "").trim();
  const q = qRaw.toLowerCase();
  const categoryFilter = (searchParams?.category ?? "").trim().toLowerCase();

  let filtered = data;
  if (categoryFilter) {
    filtered = filtered.filter((p) => p._category === categoryFilter || String(p.category ?? "").toLowerCase() === categoryFilter);
  }
  if (q) {
    filtered = filtered.filter((p) => {
      const name = String(p.product_name ?? "");
      const code = String(p.product_code ?? "");
      const slug = String(p.slug ?? "");
      const cat = String(p._category ?? "");
      const catLabel = String(CATEGORY_LABEL_MAP[p._category] ?? "");
      const hay = `${name} ${code} ${slug} ${cat} ${catLabel}`.toLowerCase();
      return hay.includes(q);
    });
  }

  // 신규 추가순 정렬 (id 내림차순)
  filtered.sort((a, b) => Number(b.id) - Number(a.id));

  return (
    <div className="max-w-[1200px] mx-auto p-6 pt-32">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">상품 관리</h1>
        <Link href="/admin/products/new" className="bg-black text-white px-4 py-2 rounded-xl">
          + 상품등록
        </Link>
      </div>

      <form method="GET" className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-6">
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <div className="w-full sm:w-60">
            <label className="text-xs text-gray-500">카테고리</label>
            <select name="category" defaultValue={categoryFilter} className="w-full border rounded-xl px-3 py-2 mt-1 bg-white">
              <option value="">전체</option>
              {Object.keys(TABLE_MAP).map((key) => (
                <option key={key} value={key}>
                  {CATEGORY_LABEL_MAP[key] ?? key}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full">
            <label className="text-xs text-gray-500">검색</label>
            <input
              name="q"
              defaultValue={qRaw}
              placeholder="상품명/코드/슬러그/카테고리"
              className="w-full border rounded-xl px-3 py-2 mt-1"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button type="submit" className="bg-black text-white px-4 py-2 rounded-xl">
            검색
          </button>
          <Link href="/admin/products" className="px-4 py-2 rounded-xl border">
            초기화
          </Link>
        </div>
      </form>

      <div className="text-xs text-gray-500 mb-3">
        검색 결과: <b>{filtered.length}</b>건
      </div>

      <div className="border rounded-2xl overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-100 font-semibold text-sm">
          <div className="col-span-3 p-3">카테고리</div>
          <div className="col-span-3 p-3">상품명</div>
          <div className="col-span-2 p-3">코드</div>
          <div className="col-span-2 p-3">슬러그</div>
          <div className="col-span-2 p-3 text-right">관리</div>
        </div>

        {filtered?.map((p) => (
          <div key={`${p._category}-${p.id}`} className="grid grid-cols-12 border-t text-sm items-center">
            <div className="col-span-3 p-3">{CATEGORY_LABEL_MAP[p._category] ?? p._category}</div>

            <div className="col-span-3 p-3">{p.product_name || "-"}</div>
            <div className="col-span-2 p-3">{p.product_code || "-"}</div>
            <div className="col-span-2 p-3">{p.slug || "-"}</div>

            <div className="col-span-2 p-3 flex justify-end gap-2">
              <Link href={`/admin/products/${p._category}/${p.id}`} className="px-3 py-1 rounded-lg border">
                수정
              </Link>

              <DeleteProductForm action={deleteProduct} id={p.id} category={p._category} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
