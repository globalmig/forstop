// CardProduct.tsx
import Link from "next/link";
import Image from "next/image";

interface Product {
  slug: string; // slug 사용
  img: string;
  title: string;
  desc: string;
  id: string;
}

export default function CardProduct({ slug, img, title, desc, id }: Product) {
  return (
    <Link href={`/products/${slug}`} className="block group">
      <div className="border border-gray-300 rounded-2xl overflow-hidden bg-white hover:shadow-lg transition">
        <div className="relative h-[180px] bg-black">
          <Image src={img} alt={title} fill className="object-contain" />
        </div>

        <div className="p-4">
          <p className="font-medium group-hover:text-blue-600 transition">{title}</p>
          <p className="text-sm text-gray-500">{desc}</p>
        </div>
      </div>
    </Link>
  );
}
