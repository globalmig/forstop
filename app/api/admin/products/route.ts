// app/api/admin/products/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const SPEC_TABLE: Record<string, string> = {
  toplight: "toplight_specs",
  speaker: "speaker_specs",
  etc: "etc_specs",
  heavy: "heavy_specs",
  cooling: "cooling_specs",
};

function normalizeDescription(desc: string) {
  const lines = (desc || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  // DB 컬럼이 text/jsontext 라는 전제에서 문자열 JSON으로 저장
  return lines.length ? JSON.stringify(lines) : null;
}

async function uploadImageIfNeeded(form: FormData) {
  const current_image = String(form.get("current_image") || "") || null;
  const imageFile = form.get("image") as File | null;

  let imageUrl = current_image;

  if (imageFile && imageFile.size > 0) {
    const fileName = `${Date.now()}-${imageFile.name}`;
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage.from("products").upload(fileName, imageFile, {
      contentType: imageFile.type,
      upsert: false,
    });

    if (uploadError) {
      return { error: uploadError.message, imageUrl: null };
    }

    const { data: urlData } = supabaseAdmin.storage.from("products").getPublicUrl(uploadData.path);

    imageUrl = urlData.publicUrl;
  }

  return { imageUrl, error: null };
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const category = String(form.get("category") || "");
    const table = SPEC_TABLE[category];
    if (!table) return NextResponse.json({ error: "잘못된 category" }, { status: 400 });

    const slug = String(form.get("slug") || "");
    const product_name = String(form.get("product_name") || "");
    const product_code = String(form.get("product_code") || "") || null;
    const description = String(form.get("description") || "");
    const model_name = String(form.get("model_name") || "") || null;

    if (!slug || !product_name) {
      return NextResponse.json({ error: "필수값 누락 (slug/product_name)" }, { status: 400 });
    }

    // specs JSON
    const specsRaw = String(form.get("specs") || "{}");
    let specs: Record<string, any> = {};
    try {
      specs = JSON.parse(specsRaw);
    } catch {}

    // 이미지 업로드(선택)
    const { imageUrl, error: imgErr } = await uploadImageIfNeeded(form);
    if (imgErr) return NextResponse.json({ error: "이미지 업로드 실패: " + imgErr }, { status: 400 });

    const payload = {
      slug,
      product_name,
      product_code,
      category, // ✅ 이 테이블 안에도 category 컬럼이 있다면 저장 (없으면 제거해도 됨)
      image: imageUrl,
      description: normalizeDescription(description),
      model_name,
      ...specs,
    };

    const { data, error } = await supabaseAdmin.from(table).insert(payload).select("id").single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ ok: true, id: data.id });
  } catch (e: any) {
    console.error("❌ POST ERROR:", e);
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const form = await req.formData();

    const id = String(form.get("id") || "");
    const category = String(form.get("category") || "");
    const table = SPEC_TABLE[category];

    if (!id || !table) {
      return NextResponse.json({ error: "ID 또는 category 누락" }, { status: 400 });
    }

    const slug = String(form.get("slug") || "");
    const product_name = String(form.get("product_name") || "");
    const product_code = String(form.get("product_code") || "") || null;
    const description = String(form.get("description") || "");
    const model_name = String(form.get("model_name") || "") || null;

    const specsRaw = String(form.get("specs") || "{}");
    let specs: Record<string, any> = {};
    try {
      specs = JSON.parse(specsRaw);
    } catch {}

    const { imageUrl, error: imgErr } = await uploadImageIfNeeded(form);
    if (imgErr) return NextResponse.json({ error: "이미지 업로드 실패: " + imgErr }, { status: 400 });

    const payload = {
      slug,
      product_name,
      product_code,
      category,
      image: imageUrl,
      description: normalizeDescription(description),
      model_name,
      ...specs,
    };

    const { error } = await supabaseAdmin.from(table).update(payload).eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ ok: true, id });
  } catch (e: any) {
    console.error("❌ PUT ERROR:", e);
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const category = searchParams.get("category");
    const table = category ? SPEC_TABLE[category] : null;

    if (!id || !table) {
      return NextResponse.json({ error: "ID 또는 category 누락" }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from(table).delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("❌ DELETE ERROR:", e);
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}
