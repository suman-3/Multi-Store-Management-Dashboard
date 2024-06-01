import { db } from "@/lib/firebase";
import { auth } from "@clerk/nextjs/server";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    const { name } = body;

    if (!name) {
      return new NextResponse("Name is required/missing", { status: 400 });
    }

    const storeData = {
      name,
      userId,
      createdAt: serverTimestamp(),
    };

    // Add the data to the firestore database and retrive its reference id
    const storeRefe = await addDoc(collection(db, "stores"), storeData);

    //Get the reference id
    const id = storeRefe.id;

    await updateDoc(doc(db, "stores", id), {
      ...storeData,
      id,
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ id, ...storeData });
  } catch (error: any) {
    console.log(`STORE_POST Error: ${error.message}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
