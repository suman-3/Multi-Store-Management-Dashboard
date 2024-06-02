import { db } from "@/lib/firebase";
import { Billboards } from "@/types-db";
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

    const { label, imageUrl } = body;

    if (!label) {
      return new NextResponse("billboard name is required/missing", {
        status: 400,
      });
    }

    if (!imageUrl) {
      return new NextResponse("billboard image is required/missing", {
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

    const billboardData = {
      label,
      imageUrl,
      createdAt: serverTimestamp(),
    };

    // Add the data to the firestore database and retrive its reference id
    const billboardRef = await addDoc(
      collection(db, "stores", params.storeId, "billboards"),
      billboardData
    );

    // Get the reference id
    const id = billboardRef.id;

    await updateDoc(doc(db, "stores", params.storeId, "billboards", id), {
      ...billboardData,
      id,
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ id, ...billboardData });
  } catch (error: any) {
    console.log(`BILLBOARD_POST Error: ${error.message}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const GET = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    if (!params.storeId) {
      return new NextResponse("Store ID is required/missing", { status: 400 });
    }

    const billboardsData = (
      await getDocs(collection(doc(db, "stores", params.storeId), "billboards"))
    ).docs.map((doc) => doc.data()) as Billboards[];

    return NextResponse.json(billboardsData);
  } catch (error: any) {
    console.log(`BILLBOARD_GET Error: ${error.message}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
