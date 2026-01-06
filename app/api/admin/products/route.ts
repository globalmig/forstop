// app/api/admin/products/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs"; // ✅ crypto 사용 안정성 (edge 방지)

const SPEC_TABLE: Record<string, string> = {
  toplight: "toplight_specs",
  speaker: "speaker_specs",
  etc: "etc_specs",
  heavy: "heavy_specs",
  cooling: "cooling_specs",
};

/** -----------------------------
 *  Utils
 * ----------------------------- */
function json<T = any>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

function safeExt(filename: string) {
  const m = filename?.toLowerCase().match(/\.[a-z0-9]+$/);
  return m ? m[0] : "";
}

function makeSafeFileName(folder: string, slug: string, originalName: string) {
  const ext = safeExt(originalName);
  const rand = crypto.randomBytes(6).toString("hex");

  const safeFolder = (folder || "product").toLowerCase().replace(/[^a-z0-9-_]/g, "-") || "product";
  const safeSlug = (slug || "item").toLowerCase().replace(/[^a-z0-9-_]/g, "-") || "item";

  return `${safeFolder}/${safeSlug}/${Date.now()}-${rand}${ext}`;
}

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

function parseSpecs(specsRaw: string) {
  if (!specsRaw) return {};
  try {
    const v = JSON.parse(specsRaw);
    return v && typeof v === "object" ? v : {};
  } catch {
    return {};
  }
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

/**
 * category 컬럼이 스펙 테이블에 없으면 42703(undefined_column)로 터질 수 있음
 * → 자동으로 category 제거 후 재시도하는 fallback
 */
async function insertWithFallback(table: string, payload: Record<string, any>) {
  const first = await supabaseAdmin.from(table).insert(payload).select("id").single();
  if (!first.error) return first;

  if ((first.error as any)?.code === "42703" && "category" in payload) {
    const { category, ...rest } = payload;
    return await supabaseAdmin.from(table).insert(rest).select("id").single();
  }

  return first;
}

async function updateWithFallback(table: string, id: string, payload: Record<string, any>) {
  const first = await supabaseAdmin.from(table).update(payload).eq("id", id);
  if (!first.error) return first;

  if ((first.error as any)?.code === "42703" && "category" in payload) {
    const { category, ...rest } = payload;
    return await supabaseAdmin.from(table).update(rest).eq("id", id);
  }

  return first;
}

/** -----------------------------
 *  Upload: 대표 이미지
 * ----------------------------- */
async function uploadMainImageIfNeeded(form: FormData, category: string) {
  const current_image = String(form.get("current_image") || "") || null;
  const imageFile = form.get("image") as File | null;
  const slug = String(form.get("slug") || "");

  let imageUrl = current_image;

  if (imageFile && imageFile.size > 0) {
    const key = makeSafeFileName(`${category}/main`, slug, imageFile.name);

    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage.from("products").upload(key, imageFile, {
      contentType: imageFile.type,
      upsert: false,
    });

    if (uploadError) return { error: uploadError.message, imageUrl: null as string | null };

    const { data: urlData } = supabaseAdmin.storage.from("products").getPublicUrl(uploadData.path);
    imageUrl = urlData.publicUrl;
  }

  return { imageUrl, error: null as string | null };
}

/** -----------------------------
 *  Upload: 상세 이미지(여러 장)
 *  - keep URLs + new file uploads => merged JSON string
 * ----------------------------- */
async function uploadDetailImages(form: FormData, category: string) {
  const slug = String(form.get("slug") || "");
  const keepRaw = form.get("detail_keep_urls");
  const keepUrls = parseJsonArrayString(keepRaw);

  const files = form.getAll("detail_images").filter(Boolean) as File[];
  const uploadedUrls: string[] = [];

  for (const f of files) {
    if (!(f instanceof File) || !f.size) continue;

    const key = makeSafeFileName(`${category}/detail`, slug, f.name);

    const { data: up, error: upErr } = await supabaseAdmin.storage.from("products").upload(key, f, {
      contentType: f.type,
      upsert: false,
    });

    if (upErr) return { error: upErr.message, detail_images: null as string | null };

    const { data: urlData } = supabaseAdmin.storage.from("products").getPublicUrl(up.path);
    uploadedUrls.push(urlData.publicUrl);
  }

  const merged = [...keepUrls, ...uploadedUrls].filter(Boolean);
  return { error: null as string | null, detail_images: JSON.stringify(merged) };
}

/** -----------------------------
 *  POST (Create)
 * ----------------------------- */
export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const category = String(form.get("category") || "").trim();
    const table = SPEC_TABLE[category];
    if (!table) return json({ error: "잘못된 category" }, 400);

    const slug = String(form.get("slug") || "").trim();
    const product_name = String(form.get("product_name") || "").trim();
    const product_code = String(form.get("product_code") || "").trim() || null;
    const description = String(form.get("description") || "");
    const model_name = String(form.get("model_name") || "").trim() || null;

    if (!slug || !product_name) return json({ error: "필수값 누락 (slug/product_name)" }, 400);

    const specs = parseSpecs(String(form.get("specs") || "{}"));

    // ✅ 대표 이미지
    const { imageUrl, error: imgErr } = await uploadMainImageIfNeeded(form, category);
    if (imgErr) return json({ error: "이미지 업로드 실패: " + imgErr }, 400);

    // ✅ 상세 이미지
    const { detail_images, error: detailErr } = await uploadDetailImages(form, category);
    if (detailErr) return json({ error: "상세 이미지 업로드 실패: " + detailErr }, 400);

    const payload: Record<string, any> = {
      slug,
      product_name,
      product_code,
      category, // 컬럼 없으면 fallback에서 제거됨
      image: imageUrl,
      detail_images, // ✅ 추가
      description: normalizeDescription(description),
      model_name,
      ...specs,
    };

    const { data, error } = await insertWithFallback(table, payload);
    if (error) return json({ error: error.message }, 400);

    return json({ ok: true, id: data.id });
  } catch (e: any) {
    console.error("❌ POST ERROR:", e);
    return json({ error: e?.message || "Server error" }, 500);
  }
}

/** -----------------------------
 *  PUT (Update)
 * ----------------------------- */
export async function PUT(req: Request) {
  try {
    const form = await req.formData();

    const id = String(form.get("id") || "").trim();
    const category = String(form.get("category") || "").trim();
    const table = SPEC_TABLE[category];

    if (!id || !table) return json({ error: "ID 또는 category 누락" }, 400);

    const slug = String(form.get("slug") || "").trim();
    const product_name = String(form.get("product_name") || "").trim();
    const product_code = String(form.get("product_code") || "").trim() || null;
    const description = String(form.get("description") || "");
    const model_name = String(form.get("model_name") || "").trim() || null;

    if (!slug || !product_name) return json({ error: "필수값 누락 (slug/product_name)" }, 400);

    const specs = parseSpecs(String(form.get("specs") || "{}"));

    // ✅ 대표 이미지
    const { imageUrl, error: imgErr } = await uploadMainImageIfNeeded(form, category);
    if (imgErr) return json({ error: "이미지 업로드 실패: " + imgErr }, 400);

    // ✅ 상세 이미지
    const { detail_images, error: detailErr } = await uploadDetailImages(form, category);
    if (detailErr) return json({ error: "상세 이미지 업로드 실패: " + detailErr }, 400);

    const payload: Record<string, any> = {
      slug,
      product_name,
      product_code,
      category, // 컬럼 없으면 fallback에서 제거됨
      image: imageUrl,
      detail_images, // ✅ 추가
      description: normalizeDescription(description),
      model_name,
      ...specs,
    };

    const { error } = await updateWithFallback(table, id, payload);
    if (error) return json({ error: error.message }, 400);

    return json({ ok: true, id });
  } catch (e: any) {
    console.error("❌ PUT ERROR:", e);
    return json({ error: e?.message || "Server error" }, 500);
  }
}

/** -----------------------------
 *  DELETE
 * ----------------------------- */
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id")?.trim();
    const category = searchParams.get("category")?.trim();
    const table = category ? SPEC_TABLE[category] : null;

    if (!id || !table) return json({ error: "ID 또는 category 누락" }, 400);

    const { error } = await supabaseAdmin.from(table).delete().eq("id", id);
    if (error) return json({ error: error.message }, 400);

    return json({ ok: true });
  } catch (e: any) {
    console.error("❌ DELETE ERROR:", e);
    return json({ error: e?.message || "Server error" }, 500);
  }
}
