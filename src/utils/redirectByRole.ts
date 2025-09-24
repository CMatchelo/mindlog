import { doc, getDoc } from "firebase/firestore";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { db } from "../../firebase";
import { Professional, Client, Admin } from "@/Types/user";

export const redirectByRole = async (user: Professional | Client | Admin, router: AppRouterInstance) => {
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

  switch (data.role) {
    case "professional":
      router.push(`/psi`);
      break;
    case "client":
      router.push(`/pacient/`);
      break;
    case "admin":
      router.push("/admin");
      break;
    default:
      router.push("/login");
  }
};
