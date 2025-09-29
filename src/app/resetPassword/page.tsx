"use client";

import { useState, useEffect } from "react";
import { getAuth, verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";
import { useSearchParams, useRouter } from "next/navigation";

export default function Page() {
  const auth = getAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const oobCode = searchParams.get("oobCode");

  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState<"loading" | "valid" | "invalid" | "success" | "error">("loading");

  useEffect(() => {
    if (!oobCode) {
      setStatus("invalid");
      return;
    }

    verifyPasswordResetCode(auth, oobCode)
      .then(() => setStatus("valid"))
      .catch(() => setStatus("invalid"));
  }, [oobCode, auth]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!oobCode) return;

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setStatus("success");
      setTimeout(() => router.push("/login"), 2000); // redireciona pro login
    } catch (err) {
      setStatus("error");
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100">
      {/* BG mobile */}
      <div
        className="block sm:hidden absolute w-full h-full inset-0
        bg-[url('/bg_login_mobile.png')] bg-contain bg-bottom bg-no-repeat opacity-60"
      ></div>

      {/* BG desktop */}
      <div
        className="hidden sm:block absolute w-full h-full inset-0
        bg-[url('/bg_login_desktop.png')] bg-cover bg-center opacity-70"
      ></div>

      {/* Conteúdo */}
      <div className="relative z-10 w-full max-w-md p-6 bg-white/80 rounded-2xl shadow-lg backdrop-blur-md">
        <h1 className="text-2xl font-bold text-center mb-6">Redefinir Senha</h1>

        {status === "loading" && <p className="text-center">Verificando link...</p>}
        {status === "invalid" && <p className="text-center text-red-600">Link inválido ou expirado.</p>}
        {status === "success" && <p className="text-center text-green-600">Senha redefinida com sucesso! Redirecionando...</p>}

        {status === "valid" && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="Digite a nova senha"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary1"
            />
            <button
              type="submit"
              className="w-full bg-primary1 text-white py-3 rounded-lg font-medium hover:bg-primary1Light active:bg-primary1Dark transition"
            >
              Redefinir
            </button>
          </form>
        )}
        {status === "error" && (
          <p className="text-center text-red-600">Erro ao redefinir senha. Tente novamente.</p>
        )}
      </div>
    </div>
  );
}
