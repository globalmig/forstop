// lib/productUtils.ts
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// ─── Description ────────────────────────────────────────────────────────────

export function normalizeDescription(desc: string): string | null {
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

// ─── File name helpers ────────────────────────────────────────────────────────

function safeExt(filename: string): string {
  const m = filename?.toLowerCase().match(/\.[a-z0-9]+$/);
  return m ? m[0] : "";
}

export function makeSafeFileName(folder: string, slug: string, originalName: string): string {
  const ext = safeExt(originalName);
  const rand = crypto.randomBytes(6).toString("hex");

  const safeFolder = (folder || "product").toLowerCase().replace(/[^a-z0-9-_]/g, "-") || "product";
  const safeSlug = (slug || "item").toLowerCase().replace(/[^a-z0-9-_]/g, "-") || "item";

  return `${safeFolder}/${safeSlug}/${Date.now()}-${rand}${ext}`;
}

// ─── JSON array parsing ───────────────────────────────────────────────────────

export function parseJsonArrayString(raw: unknown): string[] {
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

// ─── Specs parsing ────────────────────────────────────────────────────────────

export function parseSpecs(specsRaw: string): Record<string, unknown> {
  if (!specsRaw) return {};
  try {
    const v = JSON.parse(specsRaw);
    return v && typeof v === "object" ? v : {};
  } catch {
    return {};
  }
}

// ─── Image upload ─────────────────────────────────────────────────────────────

export async function uploadMainImageIfNeeded(
  form: FormData,
  category: string
): Promise<{ imageUrl: string | null; error: string | null }> {
  const current_image = String(form.get("current_image") || "") || null;
  const imageFile = form.get("image") as File | null;
  const slug = String(form.get("slug") || "");

  if (!imageFile || !imageFile.size) return { imageUrl: current_image, error: null };

  const key = makeSafeFileName(`${category}/main`, slug, imageFile.name);
  const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
    .from("products")
    .upload(key, imageFile, { contentType: imageFile.type, upsert: false });

  if (uploadError) return { imageUrl: null, error: uploadError.message };

  const { data: urlData } = supabaseAdmin.storage.from("products").getPublicUrl(uploadData.path);
  return { imageUrl: urlData.publicUrl, error: null };
}

export async function uploadDetailImages(
  form: FormData,
  category: string
): Promise<{ detail_images: string | null; error: string | null }> {
  const slug = String(form.get("slug") || "");
  const keepUrls = parseJsonArrayString(form.get("detail_keep_urls"));

  const files = form.getAll("detail_images").filter(Boolean) as File[];
  const uploadedUrls: string[] = [];

  for (const f of files) {
    if (!(f instanceof File) || !f.size) continue;

    const key = makeSafeFileName(`${category}/detail`, slug, f.name);
    const { data: up, error: upErr } = await supabaseAdmin.storage
      .from("products")
      .upload(key, f, { contentType: f.type, upsert: false });

    if (upErr) return { detail_images: null, error: upErr.message };

    const { data: urlData } = supabaseAdmin.storage.from("products").getPublicUrl(up.path);
    uploadedUrls.push(urlData.publicUrl);
  }

  const merged = [...keepUrls, ...uploadedUrls].filter(Boolean);
  return { detail_images: JSON.stringify(merged), error: null };
}

// ─── DB helpers (category 컬럼 없는 테이블 fallback) ──────────────────────────

export async function insertWithFallback(table: string, payload: Record<string, unknown>) {
  const first = await supabaseAdmin.from(table).insert(payload).select("id").single();
  if (!first.error) return first;

  if ((first.error as { code?: string })?.code === "42703" && "category" in payload) {
    const { category, ...rest } = payload;
    void category;
    return await supabaseAdmin.from(table).insert(rest).select("id").single();
  }

  return first;
}

export async function updateWithFallback(table: string, id: string, payload: Record<string, unknown>) {
  const first = await supabaseAdmin.from(table).update(payload).eq("id", id).select().maybeSingle();
  if (!first.error) return first;

  if ((first.error as { code?: string })?.code === "42703" && "category" in payload) {
    const { category, ...rest } = payload;
    void category;
    return await supabaseAdmin.from(table).update(rest).eq("id", id).select().maybeSingle();
  }

  return first;
}
