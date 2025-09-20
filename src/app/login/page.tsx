"use client";

import { useAuth } from "@/Contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { redirectByRole } from "@/utils/redirectByRole";

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

  useEffect(() => {
    if (!loading && user) {
      redirectByRole(user, router);
    }
  }, [user, loading, router]);

  const handleLogin = async (data: LoginFormInputs) => {
    await loginAcc(data.email, data.password);
  };

  return (
    <div>
      <h1>Pagina de login</h1>
      <form onSubmit={handleSubmit(handleLogin)}>
        <input
          type="email"
          id="email"
          {...register("email", { required: "Digite o email" })}
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        <input
          type="password"
          id="password"
          {...register("password", { required: "Digite o password" })}
        />
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
