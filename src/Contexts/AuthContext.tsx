"use client";

import { getFirebaseErrorMessage } from "@/utils/firebaseErros";
import { FirebaseError } from "firebase/app";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../../firebase";
import React from "react";
import { Client, Professional, Admin, UserType } from "@/Types/user";
import { Thought } from "@/Types/thoughts";

type AppUser = Professional | Client | Admin | null;

interface AuthContextType {
  user: AppUser;
  loading: boolean;
  loginAcc: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  addThought?: (thought: Thought) => void; // <-- nova função
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  loginAcc: async () => {},
  signOut: async () => {},
  addThought: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AppUser>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const token = await fbUser.getIdToken();

        const res = await fetch("/api/getUser", {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Erro ao buscar usuário");

        const fullUser: UserType = await res.json();
        setUser(fullUser);
      } catch (err) {
        console.error("Erro ao carregar usuário:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loginAcc = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      errorHandle(err);
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
    } catch (err) {
      errorHandle(err);
    }
  };

  const addThought = (thought: Thought) => {
    setUser((prev) => {
      if (!prev) return prev;
      if ("thoughts" in prev) {
        return {
          ...prev,
          thoughts: [thought, ...(prev.thoughts ?? [])],
        };
      }
      return prev;
    });
  };

  const errorHandle = (err: unknown) => {
    if (err instanceof FirebaseError) {
      const msg = getFirebaseErrorMessage(err.code);
      throw new Error(msg);
    }
    throw new Error("Erro desconhecido. Tente novamente.");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginAcc,
        signOut,
        addThought,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
