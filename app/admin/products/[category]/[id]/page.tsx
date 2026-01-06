// app/admin/products/[id]/page.tsx
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import ProductForm from "../../_components/ProductForm";

const TABLE_MAP: Record<string, string> = {
  cooling: "cooling_specs",
  etc: "etc_specs",
  heavy: "heavy_specs",
  speaker: "speaker_specs",
  toplight: "toplight_specs",
};

export default async function EditProductPage({ params }: { params: { id: string } }) {
  let product: any = null;
  let foundCategory: string | null = null;

  for (const [category, table] of Object.entries(TABLE_MAP)) {
    const { data } = await supabaseAdmin.from(table).select("*").eq("id", params.id).maybeSingle();
    if (data) {
      product = data;
      foundCategory = category;
      break;
    }
  }

  if (!product || !foundCategory) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-red-600">제품을 찾을 수 없습니다 (ID: {params.id})</h1>
      </div>
    );
  }

  // ✅ 핵심: 폼이 URL 만들 때 쓸 category를 무조건 주입
  const initial = { ...product, category: foundCategory };

  return (
    <div className="max-w-4xl mx-auto p-6 pt-32">
      <h1 className="text-2xl font-bold mb-6">제품 수정</h1>
      <ProductForm mode="edit" id={params.id} initial={initial} />
    </div>
  );
}
