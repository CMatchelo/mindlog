"use client";

import { Header } from "@/components/Header";
import { useAuth } from "@/Contexts/AuthContext";
import { useRoleGuard } from "@/hooks/useRoleGuard";
import { useRouter } from "next/navigation";
import { RegisterPsi } from "./components/registerPsi";

export default function Page() {

  const { user, loading } = useAuth();
  const router = useRouter();

  const checking = useRoleGuard("admin");
    if (checking) return <p>Verificando permissões...</p>;

  if (!user && loading) {
    return <div>Carregando...</div>;
  }

  if (!user && !loading) {
    router.push(`/login`);
  }

  return (
    <div>
      <Header />
      <h1>Admin: {user?.email}</h1>
      <RegisterPsi />
    </div>
  );
}
