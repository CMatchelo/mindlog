import { Thought } from "@/Types/thoughts";
import { useState } from "react";

interface ThoughtProps {
  thought: Thought;
}

export const ThoughtCard = ({ thought }: ThoughtProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="border rounded-md p-2 mb-2 cursor-pointer bg-white"
      onClick={() => setOpen(!open)}
    >
      {/* Sempre aparece: Situação */}
      <div className="font-semibold">{thought.situation}</div>

      {/* Expandido */}
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
        </div>
      )}
    </div>
  );
};
