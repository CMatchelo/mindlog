import { Thought } from "@/Types/thoughts";
import { useState } from "react";
import { Button } from "./Button";

interface ThoughtProps {
  thought: Thought;
}

export const ThoughtCard = ({ thought }: ThoughtProps) => {
  const [open, setOpen] = useState(false);

  const creationDate =
  thought.createdAt instanceof Date
    ? thought.createdAt
    : new Date(thought.createdAt);

  return (
    <div className="flex flex-col justify-between p-4 bg-white/70 rounded-lg shadow-sm hover:shadow-md hover:bg-white transition">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="font-semibold">{thought.situation}</div>
        <Button classname="self-end" onClick={() => setOpen(!open)}>
          Ver detalhes
        </Button>
      </div>
      {open && (
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-[250px_1fr] sm:gap-2 gap-1">
          <div className="font-semibold">Emoção</div>
          <div>{thought.emotion || "-"}</div>

          <div className="font-semibold">Pensamento automático</div>
          <div>{thought.automaticThought}</div>

          <div className="font-semibold">Evidências a favor</div>
          <div>{thought.evidenceFor || "-"}</div>

          <div className="font-semibold">Evidências contrárias</div>
          <div>{thought.evidenceAgainst}</div>

          <div className="font-semibold">Pensamento alternativo</div>
          <div>{thought.alternativeThought}</div>

          <div className="font-semibold">Data do registro</div>
          <div>{creationDate.toLocaleDateString("pt-BR")}</div>
        </div>
      )}
    </div>
  );
};
