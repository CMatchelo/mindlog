import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";
import { encryptThought } from "@/utils/crypto";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const SECRET_KEY = process.env.CRYPTHOUGHT_KEY;
if (!SECRET_KEY) throw new Error("Chave de criptografia não definida!");

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    const userSnap = await admin
      .firestore()
      .collection("users")
      .doc(decodedToken.uid)
      .get();
    if (!userSnap.exists || userSnap.data()?.role !== "client") {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const thoughtData = await req.json();
    const encryptedThought = Object.fromEntries(
      Object.entries(thoughtData).map(([key, value]) => [
        key,
        encryptThought(value as string),
      ])
    );

    await admin.firestore().collection("users").doc(decodedToken.uid).collection("thoughts").add({
        ...encryptedThought,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    })
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Erro ao processar a requisição:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
