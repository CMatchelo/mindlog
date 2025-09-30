"use client";

import { useAuth } from "@/Contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { redirectByRole } from "@/utils/redirectByRole";
import { Bebas_Neue } from "next/font/google";
import LoadingScreen from "@/components/LoadingScreen";

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400", // Bebas Neue normalmente tem apenas weight 400
  variable: "--font-bebas-neue", // Cria uma CSS variable
});

interface LoginFormInputs {
  email: string;
  password: string;
}

export default function Page() {
  const { loginAcc, user, loading } = useAuth();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const [checking, setChecking] = useState(false);
  const [loginError, setLoginError] = useState(false)

  useEffect(() => {
    if (!loading && user) {
      redirectByRole(user, router);
    }
  }, [user, loading, router]);

  const handleLogin = async (data: LoginFormInputs) => {
    setChecking(true);
    setLoginError(false)
    try {
      await loginAcc(data.email, data.password);
    } catch (err) {
      console.log(err);
      setLoginError(true)
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center flex-col bg-gradient-to-br from-secondary1 to-secondary2">
      {checking && (
        <LoadingScreen />
      )}
      <div
        className="hidden sm:block absolute w-full sm:w-2/3 max-w-[700px] h-auto inset-0
      bg-[url('/bg_login_desk.png')] bg-contain bg-center bg-no-repeat mx-auto left-0 right-1/3
      opacity-60"
      ></div>

      <div
        className="block sm:hidden absolute 
        w-2/4 mx-auto left-0 right-0 h-auto 
        inset-0
      bg-[url('/bg_login_mobile.png')] bg-contain bg-bottom bg-no-repeat
      opacity-60"
      ></div>
      <div
        className={`${bebasNeue.className} text-center text-primary1 text-2xl sm:text-2xl 
        font-semibold font-poppins 
        absolute top-10 mr-0 sm:mr-[33%]
        max-w-11/12 p-3
        border-b-1 border-primary1`}
      >
        <h1
          className={`${bebasNeue.className} text-primary1 text-3xl sm:text-4xl font-bold mb-4`}
        >
          Reorganizar
        </h1>
        <p className="text-primary1/90 text-lg sm:text-xl leading-relaxed">
          Registre e acompanhe pensamentos de forma simples e segura.
        </p>
      </div>
      <div
        className="bg-white/80 backdrop-blur-sm
      w-full max-w-11/12 mx-4
      sm:mx-0 sm:h-screen sm:max-w-1/3
      sm:fixed sm:top-0 sm:right-0
      flex flex-col justify-center
      rounded-2xl shadow-lg p-8"
      >
        <h1 className="text-2xl font-bold text-center text-primary1 mb-6">
          Acesse sua conta
        </h1>

        <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-primary1/80"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register("email", { required: "Digite o email" })}
              className="mt-1 w-full rounded-lg border border-primary1/30 bg-white/70 px-4 py-2 text-primary1 focus:border-primary1 focus:ring-2 focus:ring-primary1/40 outline-none"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-primary1/80"
            >
              Senha
            </label>
            <input
              type="password"
              id="password"
              {...register("password", { required: "Digite a senha" })}
              className="mt-1 w-full rounded-lg border border-primary1/30 bg-white/70 px-4 py-2 text-primary1 focus:border-primary1 focus:ring-2 focus:ring-primary1/40 outline-none"
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
            {loginError && (
            <p className="text-sm text-red-500 mt-1">
                Verifique suas credenciais e tente novamente
            </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 rounded-lg
            bg-primary1 hover:bg-[#5c3725] text-white 
            font-semibold shadow transition cursor-pointer"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
