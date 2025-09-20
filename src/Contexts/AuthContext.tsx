"use client";

import { getFirebaseErrorMessage } from "@/utils/firebaseErros";
import { FirebaseError } from "firebase/app";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import React from "react";
import { Client, Professional } from "@/Types/user";
import { doc, getDoc } from "firebase/firestore";

type AppUser = Professional | Client | null;

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
      if (fbUser) {
        const userDoc = await getDoc(doc(db, "users", fbUser.uid));

        if (userDoc.exists()) {
          const data = userDoc.data();

          if (data.role === "professional") {
            const professional: Professional = {
              uid: fbUser.uid,
              email: fbUser.email ?? "",
              firstName: data.firstName ?? "",
              lastName: data.lastName ?? "",
              role: "professional",
              patients: data.clients ?? [],
            };
            setUser(professional);
          } else if (data.role === "client") {
            const client: Client = {
              uid: fbUser.uid,
              email: fbUser.email ?? "",
              firstName: data.firstName ?? "",
              lastName: data.lastName ?? "",
              role: "client",
              nameResponsible: data.nameResponsible ?? "",
              thoughts: data.thoughts ?? [],
            };
            setUser(client);
          }
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
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
