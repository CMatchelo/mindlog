import { Suspense } from "react";
import { ResetPasswordContent } from "./components/resetPasswordContent";

export default function Page() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100">
      <div
        className="block sm:hidden absolute w-full h-full inset-0
        bg-[url('/bg_login_mobile.png')] bg-contain bg-bottom bg-no-repeat opacity-60"
      ></div>

      <div
        className="hidden sm:block absolute w-full h-full inset-0
        bg-[url('/bg_login_desktop.png')] bg-cover bg-center opacity-70"
      ></div>

      <Suspense fallback={<div>Carregando...</div>}>
        <ResetPasswordContent />
      </Suspense>
    </div>
  );
}
