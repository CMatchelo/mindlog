"use client";

import { getFirebaseErrorMessage } from "@/utils/firebaseErros";
import { FirebaseError } from "firebase/app";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../../firebase";
import React from "react";
import { Client, Professional, Admin, UserType } from "@/Types/user";

type AppUser = Professional | Client | Admin | null;

interface AuthContextType {
  user: AppUser;
  loading: boolean;
  loginAcc: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  loginAcc: async () => {},
  signOut: async () => {},
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
        // pega o token para autenticar na API
        const token = await fbUser.getIdToken();

        const res = await fetch("/api/getUser", {
          method: "GET",
          headers: { 
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`
          },
        });

        console.log("Resposta da API:", res);

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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
