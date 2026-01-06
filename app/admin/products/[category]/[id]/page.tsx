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

export default async function EditProductPage({ params }: { params: { category: string; id: string } }) {
  const table = TABLE_MAP[params.category];
  if (!table) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-red-600">잘못된 카테고리: {params.category}</h1>
      </div>
    );
  }

  const { data: product } = await supabaseAdmin.from(table).select("*").eq("id", params.id).maybeSingle();

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-red-600">제품을 찾을 수 없습니다 (ID: {params.id})</h1>
      </div>
    );
  }

  const initial = { ...product, category: params.category };

  return (
    <div className="max-w-4xl mx-auto p-6 pt-32">
      <h1 className="text-2xl font-bold mb-6">제품 수정</h1>
      <ProductForm mode="edit" id={params.id} initial={initial} />
    </div>
  );
}
