import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

// ✅ 카테고리별 테이블 맵 (부모 products_ligt 제거 기준)
const TABLE_MAP: Record<string, string> = {
  toplight: "toplight_specs",
  speaker: "speaker_specs",
  etc: "etc_specs",
  heavy: "heavy_specs",
  cooling: "cooling_specs",
};

// ✅ 카테고리 한글 라벨 맵 (UI 전용)
const CATEGORY_LABEL_MAP: Record<string, string> = {
  toplight: "탑라이트 / 표시기",
  speaker: "음성경보장치 / 스피커",
  cooling: "이동식 에어컨 / 냉각팬",
  heavy: "지게차 / 중장비",
  etc: "카메라 외 기타",
};

type Row = {
  id: string | number;
  slug: string | null;
  product_name: string | null;
  product_code: string | null;
  category: string | null;
  image: string | null;
  _table: string; // 내부용
  _category: string; // 내부용
};

// ✅ 삭제 서버 액션 (category+id 필요)
async function deleteProduct(formData: FormData) {
  "use server";

  const id = String(formData.get("id") || "");
  const category = String(formData.get("category") || "");

  if (!id || !category) return;

  const table = TABLE_MAP[category];
  if (!table) throw new Error("잘못된 category");

  const { error } = await supabaseAdmin.from(table).delete().eq("id", id);

  if (error) {
    console.error("❌ DELETE ERROR:", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export default async function AdminProductsPage() {
  // ✅ 모든 테이블에서 목록을 가져와 합치기
  const results = await Promise.all(
    Object.entries(TABLE_MAP).map(async ([category, table]) => {
      const { data, error } = await supabaseAdmin.from(table).select("id, slug, product_name, product_code, category, image").order("id", { ascending: false });

      if (error) {
        console.error(`❌ ${table} fetch error:`, error.message);
        return [] as Row[];
      }

      return (data ?? []).map((p: any) => ({
        ...p,
        // ✅ DB에 category 컬럼이 있으면 그걸 쓰고, 없으면 맵 key로 강제
        category: p.category ?? category,
        _table: table,
        _category: category,
      })) as Row[];
    })
  );

  const data = results.flat();

  // ✅ 전체 최신순 정렬(대충 id 기준) - 필요하면 created_at으로 바꾸는게 더 정확
  data.sort((a, b) => Number(b.id) - Number(a.id));

  return (
    <div className="max-w-[1200px] mx-auto p-6 pt-32">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">상품 관리</h1>
        <Link href="/admin/products/new" className="bg-black text-white px-4 py-2 rounded-xl">
          + 상품등록
        </Link>
      </div>

      <div className="border rounded-2xl overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-100 font-semibold text-sm">
          <div className="col-span-3 p-3">카테고리</div>
          <div className="col-span-3 p-3">상품명</div>
          <div className="col-span-2 p-3">코드</div>
          <div className="col-span-2 p-3">슬러그</div>
          <div className="col-span-2 p-3 text-right">관리</div>
        </div>

        {data?.map((p) => (
          <div key={`${p._category}-${p.id}`} className="grid grid-cols-12 border-t text-sm items-center">
            {/* ✅ 여기만 한글 라벨로 출력 */}
            <div className="col-span-3 p-3">{CATEGORY_LABEL_MAP[p._category] ?? p._category}</div>

            <div className="col-span-3 p-3">{p.product_name || "-"}</div>
            <div className="col-span-2 p-3">{p.product_code || "-"}</div>
            <div className="col-span-2 p-3">{p.slug || "-"}</div>

            <div className="col-span-2 p-3 flex justify-end gap-2">
              {/* ✅ 수정 링크: category도 같이 전달해야 안전 */}
              <Link href={`/admin/products/${p._category}/${p.id}`} className="px-3 py-1 rounded-lg border">
                수정
              </Link>

              {/* ✅ 삭제: category+id 넘김 */}
              <form action={deleteProduct}>
                <input type="hidden" name="id" value={String(p.id)} />
                <input type="hidden" name="category" value={p._category} />
                <button type="submit" className="px-3 py-1 rounded-lg border text-red-600">
                  삭제
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
