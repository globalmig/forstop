// app/api/admin/products/route.ts
import { NextResponse } from "next/server";
import { categoryToTable } from "@/lib/productTables";
import {
  normalizeDescription,
  parseSpecs,
  uploadMainImageIfNeeded,
  uploadDetailImages,
  insertWithFallback,
} from "@/lib/productUtils";

export const runtime = "nodejs";

function json<T = unknown>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

// ✅ POST (Create)
export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const category = String(form.get("category") || "").trim();
    const table = categoryToTable(category);
    if (!table) return json({ error: "잘못된 category" }, 400);

    const slug = String(form.get("slug") || "").trim();
    const product_name = String(form.get("product_name") || "").trim();
    const product_code = String(form.get("product_code") || "").trim() || null;
    const description = String(form.get("description") || "");
    const model_name = String(form.get("model_name") || "").trim() || null;

    if (!slug || !product_name) return json({ error: "필수값 누락 (slug/product_name)" }, 400);

    const specs = parseSpecs(String(form.get("specs") || "{}"));

    const { imageUrl, error: imgErr } = await uploadMainImageIfNeeded(form, category);
    if (imgErr) return json({ error: "이미지 업로드 실패: " + imgErr }, 400);

    const { detail_images, error: detailErr } = await uploadDetailImages(form, category);
    if (detailErr) return json({ error: "상세 이미지 업로드 실패: " + detailErr }, 400);

    const payload: Record<string, unknown> = {
      slug,
      product_name,
      product_code,
      category,
      image: imageUrl,
      detail_images,
      description: normalizeDescription(description),
      model_name,
      ...specs,
    };

    const { data, error } = await insertWithFallback(table, payload);
    if (error) return json({ error: error.message }, 400);

    return json({ ok: true, id: data.id });
  } catch (e: unknown) {
    console.error("POST ERROR:", e);
    return json({ error: e instanceof Error ? e.message : "Server error" }, 500);
  }
}
