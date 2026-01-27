"use client";

import React from "react";

export default function DeleteProductForm({
  action,
  id,
  category,
}: {
  action: (formData: FormData) => void;
  id: string | number;
  category: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("정말 삭제할까요?")) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={String(id)} />
      <input type="hidden" name="category" value={category} />
      <button type="submit" className="px-3 py-1 rounded-lg border text-red-600">
        삭제
      </button>
    </form>
  );
}
