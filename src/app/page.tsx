'use client'

import { useAuth } from "@/Contexts/AuthContext";
import { redirect } from "next/navigation";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    redirect("/login");
  }

  redirect(`/psi`);
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      oi
    </div>
  );
}
