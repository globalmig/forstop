// app/api/admin/products/[category]/[id]/route.ts
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

const SPEC_TABLE_MAP: Record<string, string> = {
  cooling: "cooling_specs",
  etc: "etc_specs",
  heavy: "heavy_specs",
  speaker: "speaker_specs",
  toplight: "toplight_specs",
};

function normalizeDescription(desc: string) {
  const lines = (desc || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  return lines.length ? JSON.stringify(lines) : null;
}

export async function PUT(req: Request, { params }: { params: { category: string; id: string } }) {
  try {
    const formData = await req.formData();

    const table = SPEC_TABLE_MAP[params.category];
    if (!table) return NextResponse.json({ error: `Unknown category: ${params.category}` }, { status: 400 });
    if (!params.id) return NextResponse.json({ error: "id 없음" }, { status: 400 });

    const slug = String(formData.get("slug") || "");
    const product_name = String(formData.get("product_name") || "");
    const product_code = String(formData.get("product_code") || "") || null;
    const description = String(formData.get("description") || "");
    const model_name = String(formData.get("model_name") || "") || null;

    const specsJson = String(formData.get("specs") || "{}");
    let specs: Record<string, any> = {};
    try {
      specs = JSON.parse(specsJson);
    } catch {}

    // 이미지 업로드 처리
    const current_image = String(formData.get("current_image") || "") || null;
    const imageFile = formData.get("image") as File | null;

    let imageUrl = current_image;
    if (imageFile && imageFile.size > 0) {
      const fileName = `${Date.now()}-${imageFile.name}`;
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage.from("products").upload(fileName, imageFile, { contentType: imageFile.type, upsert: false });

      if (uploadError) {
        return NextResponse.json({ error: "이미지 업로드 실패: " + uploadError.message }, { status: 400 });
      }

      const { data: urlData } = supabaseAdmin.storage.from("products").getPublicUrl(uploadData.path);
      imageUrl = urlData.publicUrl;
    }

    const payload = {
      slug,
      product_name,
      product_code,
      category: params.category, // ✅ category는 URL 기준으로 고정
      image: imageUrl,
      description: normalizeDescription(description),
      model_name,
      ...specs,
    };

    const { data, error } = await supabaseAdmin.from(table).update(payload).eq("id", params.id).select().maybeSingle();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");

    return NextResponse.json({ ok: true, data });
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { category: string; id: string } }) {
  try {
    const table = SPEC_TABLE_MAP[params.category];
    if (!table) return NextResponse.json({ error: `Unknown category: ${params.category}` }, { status: 400 });
    if (!params.id) return NextResponse.json({ error: "id 없음" }, { status: 400 });

    const { error } = await supabaseAdmin.from(table).delete().eq("id", params.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
