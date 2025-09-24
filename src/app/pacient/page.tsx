"use client";

import { Header } from "@/components/Header";
import { useAuth } from "@/Contexts/AuthContext";
import { useRoleGuard } from "@/hooks/useRoleGuard";
import { useRouter } from "next/navigation";
import { RegisterTought } from "./components/registerThought";
import { ThoughtTable } from "@/components/ThoughtTable";
import { Client } from "@/Types/user";

export default function Page() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const checking = useRoleGuard("client");
  if (checking) return <p>Verificando permissões...</p>;

  if (!user && loading) {
    return <div>Carregando...</div>;
  }

  if (!user && !loading) {
    router.push(`/login`);
  }

  const client = user as Client;
  if (user?.role !== "client") return null;

  return (
    <div>
      <Header />
      <div className="p-4">
        <div className="bg-secondary2 p-4 rounded-md shadow-md space-y-3 sm:space-y-2">
          {/* Saudação */}
          <div className="flex flex-row sm:items-baseline flex-wrap gap-1 text-base sm:text-lg">
            <span>Olá</span>
            <span className="font-bold">
              {client?.firstName} {client?.lastName}
            </span>
            <span className="hidden sm:block">, seja bem-vindo(a)!</span>
          </div>

          {/* Responsável */}
          <div className="flex flex-row sm:items-center flex-wrap gap-1 text-sm sm:text-base">
            <span className="font-semibold">Responsável:</span>
            <span>{client?.nameResponsible}</span>
          </div>

          {/* CRP */}
          <div className="flex flex-row sm:items-center flex-wrap gap-1 text-sm sm:text-base">
            <span className="font-semibold">CRP:</span>
            <span>{client?.crpResponsible}</span>
          </div>
        </div>

        <RegisterTought />
        <ThoughtTable thoughts={client.thoughts} />
      </div>
    </div>
  );
}
