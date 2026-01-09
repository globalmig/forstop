// app/api/admin/products/[category]/[id]/route.ts
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

export const runtime = "nodejs";

const SPEC_TABLE_MAP: Record<string, string> = {
  cooling: "cooling_specs",
  etc: "etc_specs",
  heavy: "heavy_specs",
  speaker: "speaker_specs",
  toplight: "toplight_specs",
};

function normalizeDescription(desc: string) {
  const raw = (desc || "").trim();
  if (!raw) return null;

  if (raw.startsWith("[") && raw.endsWith("]")) {
    try {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        const clean = arr.map((x) => String(x).trim()).filter(Boolean);
        return clean.length ? JSON.stringify(clean) : null;
      }
    } catch {}
  }

  const lines = raw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  return lines.length ? JSON.stringify(lines) : null;
}

function safeExt(filename: string) {
  const m = filename?.toLowerCase().match(/\.[a-z0-9]+$/);
  return m ? m[0] : "";
}

function makeSafeFileName(category: string, slug: string, originalName: string) {
  const ext = safeExt(originalName);
  const rand = crypto.randomBytes(6).toString("hex");

  const safeCategory = (category || "product").toLowerCase().replace(/[^a-z0-9-_]/g, "-") || "product";
  const safeSlug = (slug || "item").toLowerCase().replace(/[^a-z0-9-_]/g, "-") || "item";

  return `${safeCategory}/${safeSlug}/${Date.now()}-${rand}${ext}`;
}

function parseJsonArrayString(raw: any): string[] {
  if (!raw) return [];
  if (Array.isArray(raw))
    return raw
      .map(String)
      .map((s) => s.trim())
      .filter(Boolean);

  if (typeof raw === "string") {
    const t = raw.trim();
    if (!t) return [];
    if (t.startsWith("[") && t.endsWith("]")) {
      try {
        const arr = JSON.parse(t);
        if (Array.isArray(arr))
          return arr
            .map(String)
            .map((s) => s.trim())
            .filter(Boolean);
      } catch {}
    }
  }
  return [];
}

async function updateWithCategoryFallback(table: string, id: string, payload: Record<string, any>) {
  const first = await supabaseAdmin.from(table).update(payload).eq("id", id).select().maybeSingle();
  if (!first.error) return first;

  if ((first.error as any)?.code === "42703" && "category" in payload) {
    const { category, ...rest } = payload;
    return await supabaseAdmin.from(table).update(rest).eq("id", id).select().maybeSingle();
  }

  return first;
}

async function uploadDetailImages(options: { formData: FormData; category: string; slug: string; bucket?: string }) {
  const { formData, category, slug, bucket = "products" } = options;

  const keepRaw = formData.get("detail_keep_urls");
  const keepUrls = parseJsonArrayString(keepRaw);

  console.log("📦 uploadDetailImages - keepUrls:", keepUrls);

  const files = formData.getAll("detail_images").filter(Boolean) as File[];
  console.log("📦 uploadDetailImages - files count:", files.length);

  const uploadedUrls: string[] = [];

  for (const f of files) {
    if (!(f instanceof File) || !f.size) continue;

    const key = makeSafeFileName(`${category}/detail`, slug, f.name);
    console.log("📤 Uploading file:", f.name, "to key:", key);

    const { data: up, error: upErr } = await supabaseAdmin.storage.from(bucket).upload(key, f, {
      contentType: f.type,
      upsert: false,
    });

    if (upErr) {
      console.error("❌ Upload error:", upErr);
      return { error: upErr.message, detail_images: null as string | null };
    }

    const { data: urlData } = supabaseAdmin.storage.from(bucket).getPublicUrl(up.path);
    uploadedUrls.push(urlData.publicUrl);
    console.log("✅ Uploaded:", urlData.publicUrl);
  }

  const merged = [...keepUrls, ...uploadedUrls].filter(Boolean);
  console.log("🔗 Merged detail_images:", merged);

  return { error: null as string | null, detail_images: JSON.stringify(merged) };
}

// ✅ PUT 함수 (params를 Promise로 받아야 함)
export async function PUT(req: NextRequest, context: { params: Promise<{ category: string; id: string }> }) {
  const params = await context.params;

  console.log("📝 PUT Request - category:", params.category, "id:", params.id);

  try {
    const formData = await req.formData();

    console.log(
      "📦 FormData entries:",
      Array.from(formData.entries()).map(([k, v]) => (v instanceof File ? [k, `File: ${v.name} (${v.size} bytes)`] : [k, typeof v === "string" ? v.substring(0, 100) : v]))
    );

    const table = SPEC_TABLE_MAP[params.category];
    if (!table) {
      console.error("❌ Unknown category:", params.category);
      return NextResponse.json({ error: `Unknown category: ${params.category}` }, { status: 400 });
    }
    if (!params.id) {
      console.error("❌ Missing id");
      return NextResponse.json({ error: "id 없음" }, { status: 400 });
    }

    const slug = String(formData.get("slug") || "").trim();
    const product_name = String(formData.get("product_name") || "").trim();
    const product_code = String(formData.get("product_code") || "").trim() || null;
    const description = String(formData.get("description") || "");
    const model_name = String(formData.get("model_name") || "").trim() || null;

    if (!slug || !product_name) {
      console.error("❌ Missing required fields");
      return NextResponse.json({ error: "필수값 누락 (slug/product_name)" }, { status: 400 });
    }

    const specsJson = String(formData.get("specs") || "{}");
    let specs: Record<string, any> = {};
    try {
      const parsed = JSON.parse(specsJson);
      specs = parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      console.error("❌ Invalid specs JSON");
    }

    // ✅ 대표 이미지
    const current_image = String(formData.get("current_image") || "") || null;
    const imageFile = formData.get("image") as File | null;

    let imageUrl = current_image;

    if (imageFile && imageFile.size > 0) {
      const fileName = makeSafeFileName(params.category, slug, imageFile.name);
      console.log("📤 Uploading main image:", fileName);

      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage.from("products").upload(fileName, imageFile, { contentType: imageFile.type, upsert: false });

      if (uploadError) {
        console.error("❌ Main image upload error:", uploadError);
        return NextResponse.json({ error: "이미지 업로드 실패: " + uploadError.message }, { status: 400 });
      }

      const { data: urlData } = supabaseAdmin.storage.from("products").getPublicUrl(uploadData.path);
      imageUrl = urlData.publicUrl;
      console.log("✅ Main image uploaded:", imageUrl);
    }

    // ✅ 상세 이미지
    const { error: detailErr, detail_images } = await uploadDetailImages({
      formData,
      category: params.category,
      slug,
    });

    if (detailErr) {
      console.error("❌ Detail images error:", detailErr);
      return NextResponse.json({ error: "상세 이미지 업로드 실패: " + detailErr }, { status: 400 });
    }

    console.log("✅ Detail images result:", detail_images);

    const payload: Record<string, any> = {
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

    console.log("💾 Updating DB with payload keys:", Object.keys(payload));

    const { data, error } = await updateWithCategoryFallback(table, params.id, payload);

    if (error) {
      console.error("❌ DB update error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log("✅ DB updated successfully");

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");

    return NextResponse.json({ ok: true, data });
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}

// ✅ DELETE 함수
export async function DELETE(req: NextRequest, context: { params: Promise<{ category: string; id: string }> }) {
  const params = await context.params;

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
