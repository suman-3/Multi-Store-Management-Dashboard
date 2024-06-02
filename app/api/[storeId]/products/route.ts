import { db } from "@/lib/firebase";
import { Product } from "@/types-db";
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

    const {
      name,
      price,
      images,
      isFeatured,
      isArchived,
      category,
      kitchen,
      cuisine,
      size,
      qty,
    } = body;

    if (!name) {
      return new NextResponse("Size name is required/missing", {
        status: 400,
      });
    }

    if (!images || !images.length) {
      return new NextResponse("Product Image is required/missing", {
        status: 400,
      });
    }

    if (!price) {
      return new NextResponse("Product Price is required/missing", {
        status: 400,
      });
    }

    if (!category) {
      return new NextResponse("Product Category is required/missing", {
        status: 400,
      });
    }

    if (!kitchen) {
      return new NextResponse("Product Kitchen is required/missing", {
        status: 400,
      });
    }

    if (!cuisine) {
      return new NextResponse("Product Cuisine is required/missing", {
        status: 400,
      });
    }

    if (!size) {
      return new NextResponse("Product Size is required/missing", {
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

    const productsData = {
      name,
      price,
      images,
      isFeatured,
      isArchived,
      category,
      kitchen,
      cuisine,
      size,
      qty,
      createdAt: serverTimestamp(),
    };

    // Add the data to the firestore database and retrive its reference id
    const productRef = await addDoc(
      collection(db, "stores", params.storeId, "products"),
      productsData
    );

    // Get the reference id
    const id = productRef.id;

    await updateDoc(doc(db, "stores", params.storeId, "products", id), {
      ...productsData,
      id,
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ id, ...productsData });
  } catch (error: any) {
    console.log(`PRODUCTS_POST Error: ${error.message}`);
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

    const prouctsData = (
      await getDocs(collection(doc(db, "stores", params.storeId), "products"))
    ).docs.map((doc) => doc.data()) as Product[];

    return NextResponse.json(prouctsData);
  } catch (error: any) {
    console.log(`PRODUCTS_GET Error: ${error.message}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
