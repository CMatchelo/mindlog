import { Thought } from "@/Types/thoughts";
import { Admin, Client, Professional } from "@/Types/user";
import { decryptThought } from "@/utils/crypto";
import admin from "firebase-admin";
import { NextResponse } from "next/server";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const decryptData = (data: Record<string, unknown>) => {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      typeof value === "string" ? decryptThought(value) : value,
    ])
  );
};

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Token not found" }, { status: 401 });
    }
    const idToken = authHeader.split("Bearer ")[1];
    const decoded = await admin.auth().verifyIdToken(idToken);

    const userSnap = await admin
      .firestore()
      .collection("users")
      .doc(decoded.uid)
      .get();
    if (!userSnap.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = userSnap.data();

    if (userData?.role === "admin") {
      const admin: Admin = {
        uid: decoded.uid,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: "admin",
      };
      return NextResponse.json(admin, { status: 200 });
    }

    if (userData?.role === "client") {
      const thoughtsSnap = await admin
        .firestore()
        .collection(`users/${decoded.uid}/thoughts`)
        .get();

      const thoughts = thoughtsSnap.docs.map((doc) => ({
        id: doc.id,
        ...decryptData(doc.data()),
      })) as Thought[];

      const orderedThoughts = thoughts.sort(
        (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()
      );

      const client: Client = {
        uid: decoded.uid,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: "client",
        nameResponsible: userData.nameResponsible,
        crpResponsible: userData.crpResponsible,
        thoughts: orderedThoughts,
      };
      return NextResponse.json(client, { status: 200 });
    }

    if (userData?.role === "professional") {
      const clientIds: string[] = userData.clients || [];
      const clientRefs = clientIds.map((id) =>
        admin.firestore().doc(`users/${id}`)
      );
      const clientSnaps = await Promise.all(clientRefs.map((ref) => ref.get()));
      const clients: Client[] = await Promise.all(
        clientSnaps.map(async (snap) => {
          if (!snap.exists) return null;
          const data = snap.data();

          const thoughtsSnap = await admin
            .firestore()
            .collection(`users/${snap.id}/thoughts`)
            .get();

          const thoughts: Thought[] = thoughtsSnap.docs.map((doc) => ({
            id: doc.id,
            ...decryptData(doc.data()),
          })) as Thought[];

          const orderedThoughts = thoughts.sort(
            (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()
          );

          return {
            uid: snap.id,
            firstName: data?.firstName,
            lastName: data?.lastName,
            email: data?.email,
            role: "client" as const,
            nameResponsible: data?.nameResponsible,
            crpResponsible: data?.crpResponsible,
            thoughts: orderedThoughts,
          };
        })
      ).then((res) => res.filter(Boolean) as Client[]);

      const professional: Professional = {
        uid: decoded.uid,
        firstName: userData.firstName,
        lastName: userData.lastName,
        crp: userData.crp,
        email: userData.email || "",
        role: "professional",
        clients: clientIds,
        clientsProfiles: clients,
      };

      return NextResponse.json(professional, { status: 200 });
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
