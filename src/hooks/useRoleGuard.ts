"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/Contexts/AuthContext";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

type Role = "professional" | "client" | "admin";

export const useRoleGuard = (expectedRole: Role) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const verify = async () => {
      if (loading) return;

      if (!user) {
        router.push("/login");
        return;
      }

      const snap = await getDoc(doc(db, "users", user.uid));
      if (!snap.exists()) {
        router.push("/login");
        return;
      }

      const data = snap.data();
      if (data.role !== expectedRole) {
        switch (data.role) {
          case "professional":
            router.push(`/psi`);
            break;
          case "client":
            router.push(`/pacient`);
            break;
          case "admin":
            router.push("/admin");
            break;
          default:
            router.push("/login");
        }
      } else {
        setChecking(false);
      }
    };

    verify();
  }, [user, loading, router, expectedRole]);

  return checking; // true enquanto verifica, false quando pode renderizar
};
