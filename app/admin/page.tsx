import { Suspense } from "react";
import AdminLoginClient from "./login/AdminLoginClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center px-4">로딩중...</div>}>
      <AdminLoginClient />
    </Suspense>
  );
}
