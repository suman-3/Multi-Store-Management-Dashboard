import { db } from "@/lib/firebase";
import { Product } from "@/types-db";
import { auth } from "@clerk/nextjs/server";
import {
  addDoc,
  and,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
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
    // get the search params from the req.url
    const { searchParams } = new URL(req.url);

    const productRef = collection(
      doc(db, "stores", params.storeId),
      "products"
    );

    let productsQuery;

    let queryConstraints = [];

    // Construct the query based on search parameters
    if (searchParams.has("size")) {
      queryConstraints.push(where("size", "==", searchParams.get("size")));
    }

    if (searchParams.has("category")) {
      queryConstraints.push(
        where("category", "==", searchParams.get("category"))
      );
    }

    if (searchParams.has("kitchen")) {
      queryConstraints.push(
        where("kitchen", "==", searchParams.get("kitchen"))
      );
    }

    if (searchParams.has("cuisine")) {
      queryConstraints.push(
        where("cuisine", "==", searchParams.get("cuisine"))
      );
    }

    if (searchParams.has("isFeatured")) {
      queryConstraints.push(
        where(
          "isFeatured",
          "==",
          searchParams.get("isFeatured") === "true" ? true : false
        )
      );
    }

    if (searchParams.has("isArchived")) {
      queryConstraints.push(
        where(
          "isArchived",
          "==",
          searchParams.get("isArchived") === "true" ? true : false
        )
      );
    }

    if (queryConstraints.length > 0) {
      productsQuery = query(productRef, and(...queryConstraints));
    } else {
      productsQuery = query(productRef);
    }

    // execute the query

    const querySnapshot = await getDocs(productsQuery);

    const productData: Product[] = querySnapshot.docs.map(
      (doc) => doc.data() as Product
    );

    return NextResponse.json(productData);
  } catch (error: any) {
    console.log(`PRODUCTS_GET Error: ${error.message}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
