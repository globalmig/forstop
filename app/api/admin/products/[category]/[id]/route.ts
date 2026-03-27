// app/api/admin/products/[category]/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { categoryToTable } from "@/lib/productTables";
import {
  normalizeDescription,
  parseSpecs,
  uploadMainImageIfNeeded,
  uploadDetailImages,
  updateWithFallback,
} from "@/lib/productUtils";

export const runtime = "nodejs";

// ✅ PUT (Update)
export async function PUT(req: NextRequest, context: { params: Promise<{ category: string; id: string }> }) {
  const params = await context.params;

  try {
    const formData = await req.formData();

    const table = categoryToTable(params.category);
    if (!table) return NextResponse.json({ error: `Unknown category: ${params.category}` }, { status: 400 });
    if (!params.id) return NextResponse.json({ error: "id 없음" }, { status: 400 });

    const slug = String(formData.get("slug") || "").trim();
    const product_name = String(formData.get("product_name") || "").trim();
    const product_code = String(formData.get("product_code") || "").trim() || null;
    const description = String(formData.get("description") || "");
    const model_name = String(formData.get("model_name") || "").trim() || null;

    if (!slug || !product_name) {
      return NextResponse.json({ error: "필수값 누락 (slug/product_name)" }, { status: 400 });
    }

    const specs = parseSpecs(String(formData.get("specs") || "{}"));

    const { imageUrl, error: imgErr } = await uploadMainImageIfNeeded(formData, params.category);
    if (imgErr) return NextResponse.json({ error: "이미지 업로드 실패: " + imgErr }, { status: 400 });

    const { detail_images, error: detailErr } = await uploadDetailImages(formData, params.category);
    if (detailErr) return NextResponse.json({ error: "상세 이미지 업로드 실패: " + detailErr }, { status: 400 });

    const payload: Record<string, unknown> = {
      slug,
      product_name,
      product_code,
      category: params.category,
      image: imageUrl,
      description: normalizeDescription(description),
      model_name,
      detail_images,
      ...specs,
    };

    const { data, error } = await updateWithFallback(table, params.id, payload);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");

    return NextResponse.json({ ok: true, data });
  } catch (error) {
    console.error("PUT ERROR:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}

// ✅ DELETE
export async function DELETE(_req: NextRequest, context: { params: Promise<{ category: string; id: string }> }) {
  const params = await context.params;

  try {
    const table = categoryToTable(params.category);
    if (!table) return NextResponse.json({ error: `Unknown category: ${params.category}` }, { status: 400 });
    if (!params.id) return NextResponse.json({ error: "id 없음" }, { status: 400 });

    const { error } = await supabaseAdmin.from(table).delete().eq("id", params.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
