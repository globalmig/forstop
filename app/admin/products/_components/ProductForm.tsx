"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type CategoryOption = { label: string; value: string };
// ✅ 삭제: use client 컴포넌트에서 dynamic export 하면 빌드/세그먼트 옵션 꼬일 수 있음
// export const dynamic = "force-dynamic";

type ProductPayload = {
  slug: string;
  product_name: string;
  product_code: string;
  category: string;
  image: string;
  description: string;
  model_name: string;
  specs: Record<string, string>;
  detail_images: string;
};

const CATEGORY_OPTIONS: readonly CategoryOption[] = [
  { label: "지게차 / 중장비", value: "heavy" },
  { label: "탑라이트 / 표시기", value: "toplight" },
  { label: "음성경보장치 / 스피커", value: "speaker" },
  { label: "이동식 에어컨 / 냉각팬", value: "cooling" },
  { label: "카메라 외 기타", value: "etc" },
] as const;

type SpecField = { label: string; key: string; placeholder?: string };

const SPEC_FIELDS: Record<string, SpecField[]> = {
  toplight: [
    { label: "정격전압", key: "voltage" },
    { label: "방수등급", key: "waterproof" },
    { label: "밝기", key: "brightness" },
    { label: "인증", key: "certification" },
    { label: "유효거리", key: "effective_range" },
    { label: "제품크기", key: "size" },
    { label: "제품무게", key: "weight" },
    { label: "작동전류", key: "operating_current" },
    { label: "제품수명", key: "lifespan" },
    { label: "제품출력", key: "productOutput" },
  ],
  speaker: [
    { label: "사용범위", key: "range" },
    { label: "동작전원", key: "power" },
    { label: "제품크기", key: "size" },
    { label: "센서", key: "sensor" },
    { label: "탐지거리", key: "detection_distance" },
    { label: "동작시간", key: "operating_time" },
    { label: "배터리", key: "battery" },
    { label: "음량", key: "volume" },
    { label: "방수등급", key: "waterproof" },
  ],
  etc: [
    { label: "사용범위", key: "range" },
    { label: "동작전원", key: "power" },
    { label: "소모전류", key: "current_consumption" },
    { label: "인식범위", key: "recognition_range" },
    { label: "추가기능1", key: "extra_feature_1" },
    { label: "추가기능2", key: "extra_feature_2" },
    { label: "추가기능3", key: "extra_feature_3" },
    { label: "비고", key: "note" },
    { label: "디스플레이", key: "display" },
    { label: "해상도 및 화각", key: "resolution_fov" },
    { label: "충전시간", key: "charging_time" },
    { label: "촬영가능시간", key: "recording_time" },
    { label: "배터리", key: "battery" },
    { label: "각도", key: "angle" },
  ],
  heavy: [
    { label: "입력전원", key: "input_power" },
    { label: "소비전력", key: "power_consumption" },
    { label: "출력방식", key: "output_method" },
    { label: "방수·방진 등급", key: "ip_rating" },
    { label: "하우징 소재", key: "housing_material" },
    { label: "브라켓 소재", key: "bracket_material" },
    { label: "렌즈 소재", key: "lens_material" },
    { label: "사용온도 범위", key: "operating_temperature" },
    { label: "수명", key: "lifespan" },
    { label: "적용 차량", key: "applicable_vehicles" },
  ],
  cooling: [
    { label: "냉방능력", key: "cooling_capacity" },
    { label: "소비전력", key: "power_consumption" },
    { label: "정격전압", key: "rated_voltage" },
    { label: "정격전류", key: "rated_current" },
    { label: "사용냉매", key: "refrigerant" },
    { label: "토출구", key: "outlet" },
    { label: "제품무게", key: "weight" },
    { label: "제품크기", key: "size" },
    { label: "냉품범위", key: "cooling_range" },
    { label: "물탱크용량", key: "water_tank_capacity" },
    { label: "연속가동", key: "continuous_operation" },
    { label: "추가기능", key: "extra_features" },
    { label: "풍량", key: "airflow" },
    { label: "최대RPM", key: "max_rpm" },
    { label: "방수등급", key: "waterproof" },
    { label: "소음레벨", key: "noise_level" },
    { label: "송풍거리", key: "air_distance" },
    { label: "주파수", key: "frequency_hz" },
  ],
};

function slugify(input: string) {
  return (input || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^0-9a-z-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseJsonArray(raw: any): string[] {
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
    if (t.includes(","))
      return t
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    return [t];
  }
  return [];
}

const VIDEO_EXTS = [".mp4", ".webm", ".ogg", ".mov", ".m4v", ".avi"];

function isVideoUrl(url: string) {
  const clean = (url || "").split("?")[0].toLowerCase();
  return VIDEO_EXTS.some((ext) => clean.endsWith(ext));
}

export default function ProductForm({ mode, id, initial }: { mode: "create" | "edit"; id?: string | number; initial?: any }) {
  const router = useRouter();

  const initialDesc = useMemo(() => {
    const raw = initial?.description ?? "";
    if (Array.isArray(raw)) return raw.join("\n");
    if (typeof raw === "string") {
      const t = raw.trim();
      if (t.startsWith("[") && t.endsWith("]")) {
        try {
          const arr = JSON.parse(t);
          if (Array.isArray(arr)) return arr.join("\n");
        } catch {}
      }
      return raw;
    }
    return "";
  }, [initial?.description]);

  const initialSpecs = useMemo(() => {
    const cat = String(initial?.category || "");
    const fields = SPEC_FIELDS[cat] || [];
    if (!fields.length) return {} as Record<string, string>;

    const cleaned: Record<string, string> = {};
    fields.forEach((f) => {
      const v = initial?.[f.key];
      cleaned[f.key] = v == null ? "" : String(v);
    });

    return cleaned;
  }, [initial]);

  // ✅ 기존 상세이미지 URL들 (edit)
  const initialDetailUrls = useMemo(() => {
    const urls = parseJsonArray(initial?.detail_images);
    console.log("🔍 initialDetailUrls parsed:", urls);
    return urls;
  }, [initial?.detail_images]);

  const [form, setForm] = useState<ProductPayload>({
    slug: initial?.slug || "",
    product_name: initial?.product_name || "",
    product_code: initial?.product_code || "",
    category: initial?.category || "",
    image: initial?.image || "",
    description: initialDesc,
    model_name: initial?.model_name || "",
    specs: initialSpecs,
    detail_images: typeof initial?.detail_images === "string" ? initial.detail_images : JSON.stringify(initialDetailUrls),
  });

  // ✅ 대표 이미지(단일)
  const [imageFile, setImageFile] = useState<File | null>(null);
  const previewUrl = useMemo(() => (imageFile ? URL.createObjectURL(imageFile) : ""), [imageFile]);
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // ✅ 상세 이미지(다중)
  const [detailKeepUrls, setDetailKeepUrls] = useState<string[]>(initialDetailUrls);
  const [detailFiles, setDetailFiles] = useState<File[]>([]);

  const detailPreviewUrls = useMemo(() => detailFiles.map((f) => URL.createObjectURL(f)), [detailFiles]);
  const detailPreviewTypes = useMemo(() => detailFiles.map((f) => f.type), [detailFiles]);
  useEffect(() => {
    return () => {
      detailPreviewUrls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [detailPreviewUrls]);

  function removeKeepUrl(idx: number) {
    setDetailKeepUrls((prev) => prev.filter((_, i) => i !== idx));
  }
  function removeDetailFile(idx: number) {
    setDetailFiles((prev) => prev.filter((_, i) => i !== idx));
  }

  // ✅ initial 변경 감지 (edit 모드에서만 동작하도록 개선)
  useEffect(() => {
    if (!initial || mode !== "edit") return;

    const urls = parseJsonArray(initial?.detail_images);
    console.log("🔄 Syncing initial data, detail_images:", urls);

    setDetailKeepUrls(urls);
    setDetailFiles([]);

    setForm({
      slug: initial?.slug || "",
      product_name: initial?.product_name || "",
      product_code: initial?.product_code || "",
      category: initial?.category || "",
      image: initial?.image || "",
      description: initialDesc,
      model_name: initial?.model_name || "",
      specs: initialSpecs,
      detail_images: typeof initial?.detail_images === "string" ? initial.detail_images : JSON.stringify(urls),
    });
    // ✅ 핵심: id만 감지하면 detail_images만 바뀐 경우 “캐시처럼” 안 바뀜
  }, [mode, initial?.id, initial?.detail_images, initialDesc, initialSpecs]);

  // ✅ slug 자동 생성
  useEffect(() => {
    const categoryPart = form.category ? slugify(form.category) : "";
    const codePart = form.product_code ? slugify(form.product_code) : "";
    const combined = [categoryPart, codePart].filter(Boolean).join("-");
    if (!combined) return;
    setForm((p) => (p.slug === combined ? p : { ...p, slug: combined }));
  }, [form.category, form.product_code]);

  const onChange = (k: keyof Omit<ProductPayload, "specs">) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const onChangeSpec = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((p) => ({ ...p, specs: { ...p.specs, [key]: e.target.value } }));

  // ✅ 카테고리 변경 시 스펙 초기화
  useEffect(() => {
    const fields = SPEC_FIELDS[form.category] || [];
    if (!fields.length) return;

    setForm((p) => {
      const next: Record<string, string> = {};
      fields.forEach((f) => (next[f.key] = p.specs?.[f.key] ?? ""));
      return { ...p, specs: next };
    });
  }, [form.category]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const fd = new FormData();
    fd.append("slug", form.slug);
    fd.append("product_name", form.product_name);
    fd.append("product_code", form.product_code);
    fd.append("category", form.category);
    fd.append("description", form.description);
    fd.append("model_name", form.model_name);
    fd.append("specs", JSON.stringify(form.specs || {}));
    fd.append("current_image", form.image || "");

    // ✅ 대표 이미지
    if (imageFile) fd.append("image", imageFile);

    // ✅ 상세 이미지
    console.log("📤 Submitting - keep URLs:", detailKeepUrls);
    console.log(
      "📤 Submitting - new files:",
      detailFiles.map((f) => f.name)
    );

    fd.append("detail_keep_urls", JSON.stringify(detailKeepUrls));
    detailFiles.forEach((f) => fd.append("detail_images", f));

    try {
      if (mode === "edit") {
        const url = `/api/admin/products/${form.category}/${id}`;
        const res = await fetch(url, { method: "PUT", body: fd });

        if (!res.ok) {
          const j = await res.json().catch(() => null);
          console.error("❌ Error response:", j);
          alert(j?.error || "저장 실패");
          return;
        }

        const result = await res.json();
        console.log("✅ Update success:", result);

        // ✅ 수정 성공 시 현재 페이지 새로고침 (상태 업데이트)
        router.refresh();

        // ✅ 업로드한 파일 목록 초기화
        setDetailFiles([]);
        setImageFile(null);

        alert("수정되었습니다.");
        router.replace("/admin/products");
        router.refresh();
        return;
      } else {
        const url = "/api/admin/products";
        const res = await fetch(url, { method: "POST", body: fd });

        if (!res.ok) {
          const j = await res.json().catch(() => null);
          console.error("❌ Error response:", j);
          alert(j?.error || "저장 실패");
          return;
        }

        const result = await res.json();
        console.log("✅ Create success:", result);

        // ✅ 생성 성공 시 목록 페이지로 이동
        router.replace("/admin/products");
        router.refresh();
      }
    } catch (error) {
      console.error("❌ Submit error:", error);
      alert("요청 중 오류가 발생했습니다.");
    }
  }

  const specFields = SPEC_FIELDS[form.category] || [];

  console.log("🎨 Render - detailKeepUrls:", detailKeepUrls.length, "detailFiles:", detailFiles.length);

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-600">
            카테고리 <span className="text-red-500">*</span>
          </label>
          <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="w-full border rounded-xl px-3 py-2 mt-1 bg-white" required>
            <option value="" disabled>
              선택하세요
            </option>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <Field label="상품코드" value={form.product_code} onChange={onChange("product_code")} />
        <Field label="상품명" value={form.product_name} onChange={onChange("product_name")} required />

        {/* 대표 이미지 */}
        <div className="md:col-span-2">
          <label className="text-sm text-gray-600">대표 이미지 업로드</label>
          <input type="file" name="image" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />

          <div className="mt-3 flex items-start gap-4">
            <div className="w-28 h-28 rounded-xl border bg-white overflow-hidden flex items-center justify-center">
              {previewUrl ? (
                <img src={previewUrl} alt="preview" className="w-full h-full object-contain" />
              ) : form.image ? (
                <img src={form.image} alt="current" className="w-full h-full object-contain" />
              ) : (
                <span className="text-xs text-gray-400">No Image</span>
              )}
            </div>

            <div className="text-xs text-gray-500">
              {imageFile ? <>선택됨: {imageFile.name}</> : form.image ? <>현재 이미지 URL: {form.image}</> : <>이미지 없음</>}
              <div className="mt-1 text-gray-400">* 새 이미지를 선택하지 않으면 기존 이미지가 유지됩니다.</div>
            </div>
          </div>
        </div>

        {/* 상세 이미지 */}
        <div className="md:col-span-2">
          <label className="text-sm text-gray-600">상세 이미지 업로드 (여러 장 가능)</label>
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files ?? []);
              if (!files.length) return;
              console.log(
                "📁 New files selected:",
                files.map((f) => f.name)
              );
              setDetailFiles((prev) => [...prev, ...files]);
              e.currentTarget.value = "";
            }}
          />

          <div className="mt-3 text-xs text-gray-500">
            유지 중인 상세 이미지: <b>{detailKeepUrls.length}</b>장 / 새로 추가: <b>{detailFiles.length}</b>장
            <div className="mt-1 text-gray-400">* 수정 시: "유지 중"에서 X 누르면 해당 이미지는 저장 시 제거됩니다.</div>
          </div>

          {detailKeepUrls.length > 0 && (
            <div className="mt-4">
              <p className="text-xs text-gray-600 mb-2">유지 중인 상세 이미지</p>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
                {detailKeepUrls.map((url, idx) => (
                  <div key={`keep-${idx}-${url.slice(-10)}`} className="relative w-full aspect-square rounded-xl border bg-white overflow-hidden">
                    {isVideoUrl(url) ? (
                      <video src={url} className="w-full h-full object-contain" controls />
                    ) : (
                      <img src={url} alt={`keep-${idx}`} className="w-full h-full object-contain" />
                    )}
                    <button
                      type="button"
                      onClick={() => removeKeepUrl(idx)}
                      className="absolute top-2 right-2 rounded-full bg-black/70 text-white w-6 h-6 text-xs flex items-center justify-center hover:bg-red-600"
                      title="제거"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {detailFiles.length > 0 && (
            <div className="mt-5">
              <p className="text-xs text-gray-600 mb-2">새로 추가한 상세 이미지(업로드 예정)</p>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
                {detailPreviewUrls.map((url, idx) => (
                  <div key={`new-${idx}-${detailFiles[idx].name}`} className="relative w-full aspect-square rounded-xl border bg-white overflow-hidden">
                    {detailPreviewTypes[idx]?.startsWith("video/") ? (
                      <video src={url} className="w-full h-full object-contain" controls />
                    ) : (
                      <img src={url} alt={`new-${idx}`} className="w-full h-full object-contain" />
                    )}
                    <button
                      type="button"
                      onClick={() => removeDetailFile(idx)}
                      className="absolute top-2 right-2 rounded-full bg-black/70 text-white w-6 h-6 text-xs flex items-center justify-center hover:bg-red-600"
                      title="제거"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <Field label="모델명" value={form.model_name} onChange={onChange("model_name")} />
      </div>

      <p className="text-xs text-gray-400">
        자동 생성 슬러그: <span className="font-mono">{form.slug || "-"}</span>
      </p>

      <div>
        <label className="text-sm text-gray-600">설명(줄바꿈 = 한 줄씩)</label>
        <textarea value={form.description} onChange={onChange("description")} className="w-full border rounded-xl px-3 py-2 mt-1 min-h-[140px]" />
      </div>

      <div className="border rounded-2xl p-5 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold">제품 사양</h2>
          <span className="text-xs text-gray-500">카테고리 선택에 따라 입력 항목이 바뀝니다.</span>
        </div>

        {!form.category ? (
          <p className="text-sm text-gray-500">카테고리를 먼저 선택해 주세요.</p>
        ) : specFields.length === 0 ? (
          <p className="text-sm text-gray-500">이 카테고리에 대한 사양 정의가 없습니다.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {specFields.map((f) => (
              <Field key={f.key} label={f.label} value={form.specs?.[f.key] ?? ""} onChange={onChangeSpec(f.key)} />
            ))}
          </div>
        )}
      </div>

      <button type="submit" className="bg-black text-white px-5 py-2 rounded-xl hover:bg-gray-800">
        {mode === "create" ? "등록" : "수정 저장"}
      </button>
    </form>
  );
}

function Field({ label, value, onChange, required }: { label: string; value: string; onChange: (e: any) => void; required?: boolean }) {
  return (
    <div>
      <label className="text-sm text-gray-600">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </label>
      <input value={value} onChange={onChange} className="w-full border rounded-xl px-3 py-2 mt-1" required={required} />
    </div>
  );
}
