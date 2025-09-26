"use client";

import { Header } from "@/components/Header";
import { useAuth } from "@/Contexts/AuthContext";
import { useRoleGuard } from "@/hooks/useRoleGuard";
import { useRouter } from "next/navigation";
import { RegisterClient } from "./components/registerClient";
import LoadingScreen from "@/components/LoadingScreen";
import { Client, Professional } from "@/Types/user";
import { ClientsTable } from "./components/clientsTable";
import { useEffect, useState } from "react";
import { ThoughtTable } from "@/components/ThoughtTable";
import { Button } from "@/components/Button";

export default function Page() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [selecteClient, setSelectedClient] = useState<Client | null>();

  const checking = useRoleGuard("professional");

  useEffect(() => {
    if (!user && loading) {
      return;
    }

    if (!user && !loading) {
      router.push(`/login`);
    }
  }, [user, loading, router]);

  if (checking) return <LoadingScreen />;

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
  };

  const professional = user as Professional;
  if (user?.role !== "professional") return null;

  return (
    <div>
      <Header />
      <div className="p-4 flex flex-col gap-4">
        <div className="bg-secondary2 p-2 rounded-md shadow-md space-y-3 sm:space-y-2">
          <div className="flex flex-row sm:items-baseline flex-wrap gap-1 text-base sm:text-lg">
            <h2 className="">Olá </h2>
            <h2 className="font-bold">
              {" "}
              {professional?.firstName} {professional?.lastName}{" "}
            </h2>
          </div>
          <div className="flex flex-row sm:items-baseline flex-wrap gap-1 text-base sm:text-lg">
            <h2>CRP -</h2>
            <h2 className="font-bold">{professional?.crp}</h2>
          </div>
        </div>
        <RegisterClient />
        {selecteClient?.thoughts?.length &&
        selecteClient.thoughts.length > 0 ? (
          <div className="flex flex-col bg-secondary2 rounded-md">
            <div className="bg-secondary2 flex flex-row items-center rounded-md gap-4 p-4 justify-between">
              <span className="text-lg font-bold">
                Paciente: {selecteClient.firstName} {selecteClient.lastName}{" "}
              </span>
              <Button onClick={() => setSelectedClient(null)}>Voltar</Button>
            </div>
            <ThoughtTable thoughts={selecteClient.thoughts} />
          </div>
        ) : (
          <ClientsTable
            selectClient={handleSelectClient}
            clients={professional.clientsProfiles}
          />
        )}
      </div>
    </div>
  );
}
