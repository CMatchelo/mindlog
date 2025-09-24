import { Button } from "@/components/Button";
import { Client } from "@/Types/user";

interface ClientsTableProps {
  clients: Client[] | undefined;
  selectClient: (client: Client) => void;
}

export const ClientsTable = ({ clients, selectClient }: ClientsTableProps) => {
  if (!clients || clients.length === 0)
    return <p>Nenhum paciente encontrado</p>;

  return (
    <div className="bg-secondary2 p-4 rounded-lg shadow-lg space-y-4">
      {clients.map((client) => (
        <div
          key={client.uid}
          className="flex items-center justify-between p-4 bg-white/70 rounded-lg shadow-sm hover:shadow-md hover:bg-white transition"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary1 text-white font-semibold">
              {client.firstName[0]}
            </div>
            <span className="font-medium text-gray-800">
              {client.firstName} {client.lastName}
            </span>
          </div>
          {client.thoughts.length > 0 && (
            <Button
              onClick={() => selectClient(client)}
              classname="text-sm text-primary1"
            >
              Ver detalhes
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};
