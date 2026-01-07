import { Suspense } from "react";
import AdminLoginClient from "./AdminLoginClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center">로딩중...</div>}>
      <AdminLoginClient />
    </Suspense>
  );
}
