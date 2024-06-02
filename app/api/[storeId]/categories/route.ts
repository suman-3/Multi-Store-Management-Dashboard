import { db } from "@/lib/firebase";
import { Category } from "@/types-db";
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

    const { name, billboardId, billboardLabel } = body;

    if (!name) {
      return new NextResponse("Category name is required/missing", {
        status: 400,
      });
    }

    if (!billboardId) {
      return new NextResponse("billboard  is required/missing", {
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

    const categoryData = {
      name,
      billboardId,
      billboardLabel,
      createdAt: serverTimestamp(),
    };

    // Add the data to the firestore database and retrive its reference id
    const categoryRef = await addDoc(
      collection(db, "stores", params.storeId, "categories"),
      categoryData
    );

    // Get the reference id
    const id = categoryRef.id;

    await updateDoc(doc(db, "stores", params.storeId, "categories", id), {
      ...categoryData,
      id,
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ id, ...categoryData });
  } catch (error: any) {
    console.log(`CATEGORIES_POST Error: ${error.message}`);
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

    const categoriesData = (
      await getDocs(collection(doc(db, "stores", params.storeId), "categories"))
    ).docs.map((doc) => doc.data()) as Category[];

    return NextResponse.json(categoriesData);
  } catch (error: any) {
    console.log(`CATEGORIES_GET Error: ${error.message}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
