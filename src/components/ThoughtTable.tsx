import { Thought } from "@/Types/thoughts";
import { ThoughtCard } from "./ThoughtCard";

interface ThoughtTableProps {
  thoughts: Thought[];
}

export const ThoughtTable = ({ thoughts }: ThoughtTableProps) => {
  return (
    <div className="bg-secondary2 p-4 rounded-lg shadow-lg space-y-4">
      <h1 className="mt-4 mb-2 font-bold text-lg sm:text-xl">
        Pensamentos registrados
      </h1>
      {thoughts.map((thought) => (
        <ThoughtCard key={thought.id} thought={thought} />
      ))}
    </div>
  );
};
