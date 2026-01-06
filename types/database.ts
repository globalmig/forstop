// types/database.ts
export interface ProductsLigt {
  id: number;
  category: string | null;
  product_name: string;
  product_code: string | null;
  image: string | null;
  description: string | null;
  model_name: string | null;
  voltage: string | null;
  waterproof: string | null;
  brightness: string | null;
  certification: string | null;
  effective_range: string | null;
  size: string | null;
  weight: string | null;
  slug: string;
  created_at: string;
  updated_at: string;
}
