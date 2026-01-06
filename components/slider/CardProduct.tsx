//components/slider CardProduct.tsx
import Link from "next/link";
import Image from "next/image";

export type ProductCardItem = {
  id: string | number;
  slug: string; // ✅ 필수
  image: string | null;
  product_name: string | null;
  product_code: string | null;
  category: string;
};

export default function CardProduct({ slug, image, product_name, product_code }: ProductCardItem) {
  return (
    <Link href={`/products/${slug}`} className="block group">
      <div className="border border-gray-300 rounded-2xl overflow-hidden bg-white hover:shadow-lg transition">
        <div className="relative h-[180px]">
          <Image src={image || "/image/common/no-image.png"} alt={product_name ?? "product"} fill className="object-contain" unoptimized />
        </div>

        <div className="p-4">
          <p className="font-medium group-hover:text-blue-600 transition">{product_name}</p>
          <p className="text-sm text-gray-500">{product_code}</p>
        </div>
      </div>
    </Link>
  );
}
