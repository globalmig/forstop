import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // 읽기만이면 anon으로 충분
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  // 옵션 쿼리 파라미터
  const category = searchParams.get("category"); // ?category=...
  const slug = searchParams.get("slug"); // ?slug=...
  const code = searchParams.get("code"); // ?code=...

  let query = supabase.from("products_ligt").select("*");

  if (category) query = query.eq("category", category);
  if (slug) query = query.eq("slug", slug);
  if (code) query = query.eq("product_code", code);

  // 단일 조회(슬러그/코드)면 1개만 리턴
  const isSingle = Boolean(slug || code);

  const { data, error } = isSingle ? await query.single() : await query.order("id", { ascending: false });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, data }, { status: 200 });
}
