import { Suspense } from "react";
import LoginPageClient from "./loginPageClient/page";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center p-10 text-gray-600">Loading...</div>}>
      <LoginPageClient />
    </Suspense>
  );
}
