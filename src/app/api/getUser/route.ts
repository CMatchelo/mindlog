import { Thought } from "@/Types/thoughts";
import { Client, Professional } from "@/Types/user";
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
    if (userData?.role === "client") {
      const thoughtsSnap = await admin
        .firestore()
        .collection(`users/${decoded.uid}/thoughts`)
        .get();
      const thoughts = thoughtsSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Thought[];

      const client: Client = {
        uid: decoded.uid,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: "client",
        nameResponsible: userData.nameResponsible,
        thoughts: thoughts,
      };
      return NextResponse.json(client, { status: 200 });
    }

    if (userData?.role === "professional") {
      const clientIds: string[] = userData.clients || [];
      console.log("Aqui1", clientIds);
      const clientRefs = clientIds.map((id) =>
        admin.firestore().doc(`users/${id}`)
      );
      console.log("Aqui2", clientRefs);
      const clientSnaps = await Promise.all(clientRefs.map((ref) => ref.get()));
      console.log("Aqui3");
      const clients: Client[] = await Promise.all(
        clientSnaps.map(async (snap) => {
          if (!snap.exists) return null;
          const data = snap.data();

          const thoughtsSnap = await admin
            .firestore()
            .collection(`users/${snap.id}/thoughts`)
            .get();

          const thoughts: Thought[] = thoughtsSnap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })) as Thought[];

          return {
            uid: snap.id,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            role: "client" as const,
            nameResponsible: data.nameResponsible,
            thoughts,
          };
        })
      ).then((res) => res.filter(Boolean) as Client[]);

      const professional: Professional = {
        uid: decoded.uid,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email || "",
        role: "professional",
        clients: clientIds,
        clientsProfiles: clients,
      };

      return NextResponse.json(professional);
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
