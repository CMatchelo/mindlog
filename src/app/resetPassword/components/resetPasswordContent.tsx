"use client";

import {
  confirmPasswordReset,
  getAuth,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
} from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const ResetPasswordContent = () => {
  const auth = getAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const oobCode = searchParams.get("oobCode");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [disableBtn, setDisableBtn] = useState(true);
  const [matchMsg, setMatchMsg] = useState(false);
  const [email, setEmail] = useState("");
  const [resendMsg, setResendMsg] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [status, setStatus] = useState<
    "loading" | "valid" | "invalid" | "success" | "error"
  >("loading");

  useEffect(() => {
    if (!oobCode) {
      setStatus("invalid");
      return;
    }

    verifyPasswordResetCode(auth, oobCode)
      .then(() => setStatus("valid"))
      .catch(() => setStatus("invalid"));
  }, [oobCode, auth]);

  useEffect(() => {
    if (!newPassword || !confirmPassword) {
      setDisableBtn(true);
      setMatchMsg(false);
      return;
    }

    setDisableBtn(false);
    setMatchMsg(false);
  }, [newPassword, confirmPassword]);

  async function handleSubmit(e: React.FormEvent) {
    setDisableBtn(true);
    e.preventDefault();
    if (confirmPassword != newPassword) {
      setMatchMsg(true);
      setDisableBtn(false);
      return;
    }

    if (!oobCode) return;

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setStatus("success");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  async function handleResend(e: React.FormEvent) {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setResendMsg("success");
    } catch (err) {
      console.error(err);
      setResendMsg("error");
    }
  }

  return (
    <div className="relative z-10 w-full max-w-md p-6 bg-white/80 rounded-2xl shadow-lg backdrop-blur-md">
      <h1 className="text-2xl font-bold text-center mb-6">Redefinir Senha</h1>

      {status === "loading" && (
        <p className="text-center">Verificando link...</p>
      )}
      {status === "invalid" && (
        <div className="flex flex-col gap-4">
          <p className="text-center text-red-600">
            Link inválido ou expirado. Solicite um novo link abaixo:
          </p>
          <form onSubmit={handleResend} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary1"
            />
            <button
              type="submit"
              className="w-full py-3 rounded-lg font-medium transition bg-primary1 text-white hover:bg-primary1Light active:bg-primary1Dark"
            >
              Reenviar link
            </button>
          </form>
          {resendMsg === "success" && (
            <p className="text-center text-green-600">
              E-mail enviado com sucesso! Verifique sua caixa de entrada.
            </p>
          )}
          {resendMsg === "error" && (
            <p className="text-center text-red-600">
              Erro ao enviar e-mail. Tente novamente.
            </p>
          )}
        </div>
      )}
      {status === "success" && (
        <p className="text-center text-green-600">
          Senha redefinida com sucesso! Redirecionando...
        </p>
      )}

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
          <input
            type="password"
            placeholder="Confirme a nova senha"
            value={confirmPassword}
            onChange={(e) => setconfirmPassword(e.target.value)}
            required
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary1"
          />
          {matchMsg && (
            <p className="text-center text-red-600">Senhas não coincidem</p>
          )}
          <button
            type="submit"
            disabled={disableBtn}
            className={`
              w-full py-3 rounded-lg font-medium transition
              ${
                disableBtn
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-primary1 text-white hover:bg-primary1Light active:bg-primary1Dark cursor-pointer"
              }
            `}
          >
            Redefinir
          </button>
        </form>
      )}

      {status === "error" && (
        <p className="text-center text-red-600">
          Erro ao redefinir senha. Tente novamente.
        </p>
      )}
    </div>
  );
};
