// app/api/admin/products/[category]/[id]/route.ts
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

export const runtime = "nodejs"; // ✅ crypto 안정성

const SPEC_TABLE_MAP: Record<string, string> = {
  cooling: "cooling_specs",
  etc: "etc_specs",
  heavy: "heavy_specs",
  speaker: "speaker_specs",
  toplight: "toplight_specs",
};

/** -----------------------------
 *  Utils
 * ----------------------------- */
function normalizeDescription(desc: string) {
  const raw = (desc || "").trim();
  if (!raw) return null;

  // 이미 JSON 배열 문자열로 넘어올 수도 있음
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

// ✅ category 컬럼이 테이블에 없으면 42703(undefined_column)로 터질 수 있음 → fallback
async function updateWithCategoryFallback(table: string, id: string, payload: Record<string, any>) {
  const first = await supabaseAdmin.from(table).update(payload).eq("id", id).select().maybeSingle();
  if (!first.error) return first;

  if ((first.error as any)?.code === "42703" && "category" in payload) {
    const { category, ...rest } = payload;
    return await supabaseAdmin.from(table).update(rest).eq("id", id).select().maybeSingle();
  }

  return first;
}

/** -----------------------------
 *  Upload: detail images
 *  - keep URLs + new file uploads => merged JSON string
 *  - DB 컬럼(detail_images)이 text라면 JSON.stringify로 저장
 * ----------------------------- */
async function uploadDetailImages(options: { formData: FormData; category: string; slug: string; bucket?: string }) {
  const { formData, category, slug, bucket = "products" } = options;

  const keepRaw = formData.get("detail_keep_urls");
  const keepUrls = parseJsonArrayString(keepRaw);

  const files = formData.getAll("detail_images").filter(Boolean) as File[];
  const uploadedUrls: string[] = [];

  for (const f of files) {
    if (!(f instanceof File) || !f.size) continue;

    const key = makeSafeFileName(`${category}/detail`, slug, f.name);

    const { data: up, error: upErr } = await supabaseAdmin.storage.from(bucket).upload(key, f, {
      contentType: f.type,
      upsert: false,
    });

    if (upErr) {
      return { error: upErr.message, detail_images: null as string | null };
    }

    const { data: urlData } = supabaseAdmin.storage.from(bucket).getPublicUrl(up.path);
    uploadedUrls.push(urlData.publicUrl);
  }

  const merged = [...keepUrls, ...uploadedUrls].filter(Boolean);
  return { error: null as string | null, detail_images: JSON.stringify(merged) };
}

export async function PUT(req: Request, { params }: { params: { category: string; id: string } }) {
  try {
    const formData = await req.formData();

    const table = SPEC_TABLE_MAP[params.category];
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

    const specsJson = String(formData.get("specs") || "{}");
    let specs: Record<string, any> = {};
    try {
      const parsed = JSON.parse(specsJson);
      specs = parsed && typeof parsed === "object" ? parsed : {};
    } catch {}

    // ✅ 대표 이미지 업로드
    const current_image = String(formData.get("current_image") || "") || null;
    const imageFile = formData.get("image") as File | null;

    let imageUrl = current_image;

    if (imageFile && imageFile.size > 0) {
      const fileName = makeSafeFileName(params.category, slug, imageFile.name);
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage.from("products").upload(fileName, imageFile, { contentType: imageFile.type, upsert: false });

      if (uploadError) {
        return NextResponse.json({ error: "이미지 업로드 실패: " + uploadError.message, key: fileName }, { status: 400 });
      }

      const { data: urlData } = supabaseAdmin.storage.from("products").getPublicUrl(uploadData.path);
      imageUrl = urlData.publicUrl;
    }

    // ✅ 상세 이미지 업로드 + 유지/병합
    const { error: detailErr, detail_images } = await uploadDetailImages({
      formData,
      category: params.category,
      slug,
    });

    if (detailErr) {
      return NextResponse.json({ error: "상세 이미지 업로드 실패: " + detailErr }, { status: 400 });
    }

    const payload: Record<string, any> = {
      slug,
      product_name,
      product_code,
      category: params.category,
      image: imageUrl,
      description: normalizeDescription(description),
      model_name,
      detail_images, // ✅ 여기!
      ...specs,
    };

    const { data, error } = await updateWithCategoryFallback(table, params.id, payload);
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
