// lib/productTables.ts
export const PRODUCT_TABLES = {
  heavy: "heavy_specs",
  toplight: "toplight_specs",
  speaker: "speaker_specs",
  cooling: "cooling_specs",
  etc: "etc_specs",
} as const;

export type ProductCategory = keyof typeof PRODUCT_TABLES;

export function categoryToTable(category: string) {
  const key = category as ProductCategory;
  return PRODUCT_TABLES[key] ?? null;
}

export const ALL_TABLES = Object.entries(PRODUCT_TABLES) as Array<[ProductCategory, string]>;
