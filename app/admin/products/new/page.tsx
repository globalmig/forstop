import ProductForm from "../_components/ProductForm";

export default function NewProductPage() {
  return (
    <div className="max-w-[1200px] mx-auto p-6 py-32">
      <h1 className="text-2xl font-bold mb-6">상품 등록</h1>
      <ProductForm mode="create" />
    </div>
  );
}
