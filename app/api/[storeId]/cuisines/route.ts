import { db } from "@/lib/firebase";
import { Size } from "@/types-db";
import { auth } from "@clerk/nextjs/server";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export const POST = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    const { name, value } = body;

    if (!name) {
      return new NextResponse("Cuisine name is required/missing", {
        status: 400,
      });
    }

    if (!value) {
      return new NextResponse("Cuisine value  is required/missing", {
        status: 400,
      });
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is required/missing", { status: 400 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));

    if (store.exists()) {
      let storeData = store.data();
      if (storeData?.userId !== userId) {
        return new NextResponse("Unauthorized", { status: 400 });
      }
    }

    const cuisinesData = {
      name,
      value,
      createdAt: serverTimestamp(),
    };

    // Add the data to the firestore database and retrive its reference id
    const cuisinesRef = await addDoc(
      collection(db, "stores", params.storeId, "cuisines"),
      cuisinesData
    );

    // Get the reference id
    const id = cuisinesRef.id;

    await updateDoc(doc(db, "stores", params.storeId, "cuisines", id), {
      ...cuisinesData,
      id,
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ id, ...cuisinesData });
  } catch (error: any) {
    console.log(`CUISINES_POST Error: ${error.message}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const GET = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    if (!params.storeId) {
      return new NextResponse("Cuisine ID is required/missing", {
        status: 400,
      });
    }

    const cuisinesData = (
      await getDocs(collection(doc(db, "stores", params.storeId), "cuisines"))
    ).docs.map((doc) => doc.data()) as Size[];

    return NextResponse.json(cuisinesData);
  } catch (error: any) {
    console.log(`CUISINES_GET Error: ${error.message}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
