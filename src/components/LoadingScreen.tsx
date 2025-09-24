import { LoadIcon } from "@/utils/icons";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-40 h-40">
        <LoadIcon />
      </div>
    </div>
  );
}
