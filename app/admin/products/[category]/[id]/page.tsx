// app/admin/products/[category]/[id]/page.tsx
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import ProductForm from "../../_components/ProductForm";

const TABLE_MAP: Record<string, string> = {
  cooling: "cooling_specs",
  etc: "etc_specs",
  heavy: "heavy_specs",
  speaker: "speaker_specs",
  toplight: "toplight_specs",
};

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: { category: string; id: string } }) {
  const table = TABLE_MAP[params.category];
  if (!table) {
    return (
      <div className="max-w-4xl mx-auto p-6 pt-32">
        <h1 className="text-2xl font-bold mb-6 text-red-600">잘못된 카테고리: {params.category}</h1>
      </div>
    );
  }

  const { data: product, error } = await supabaseAdmin.from(table).select("*").eq("id", params.id).maybeSingle();

  // ✅ DB 에러 확인
  if (error) {
    console.error("❌ DB Error fetching product:", error);
    return (
      <div className="max-w-4xl mx-auto p-6 pt-32">
        <h1 className="text-2xl font-bold mb-6 text-red-600">데이터 로드 실패: {error.message}</h1>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto p-6 pt-32">
        <h1 className="text-2xl font-bold mb-6 text-red-600">제품을 찾을 수 없습니다 (ID: {params.id})</h1>
      </div>
    );
  }

  // ✅ 디버깅: product 데이터 확인
  console.log("📦 Product data loaded:", {
    id: product.id,
    category: params.category,
    detail_images: product.detail_images,
    detail_images_type: typeof product.detail_images,
  });

  const initial = {
    ...product,
    category: params.category,
  };

  return (
    <div className="max-w-4xl mx-auto p-6 pt-32">
      <h1 className="text-2xl font-bold mb-6">제품 수정</h1>
      <ProductForm mode="edit" id={params.id} initial={initial} />
    </div>
  );
}
