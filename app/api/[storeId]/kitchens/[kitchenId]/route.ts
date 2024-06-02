import { db } from "@/lib/firebase";
import { Size } from "@/types-db";
import { auth } from "@clerk/nextjs/server";
import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string; kitchenId: string } }
) => {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    const { name, value } = body;

    if (!name) {
      return new NextResponse("Kitchen name is required/missing", {
        status: 400,
      });
    }

    if (!value) {
      return new NextResponse("kitchen value is required/missing", {
        status: 400,
      });
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is required/missing", { status: 400 });
    }
    if (!params.kitchenId) {
      return new NextResponse("Kitchen ID is required/missing", {
        status: 400,
      });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));

    if (store.exists()) {
      let storeData = store.data();
      if (storeData?.userId !== userId) {
        return new NextResponse("Unauthorized", { status: 400 });
      }
    }

    const kitchenRef = await getDoc(
      doc(db, "stores", params.storeId, "kitchens", params.kitchenId)
    );

    if (kitchenRef.exists()) {
      await updateDoc(
        doc(db, "stores", params.storeId, "kitchens", params.kitchenId),
        {
          ...kitchenRef.data(),
          name,
          value,
          updatedAt: serverTimestamp(),
        }
      );
    } else {
      return new NextResponse("Size not found", { status: 404 });
    }

    const kitchen = (
      await getDoc(
        doc(db, "stores", params.storeId, "kitchens", params.kitchenId)
      )
    ).data() as Size;

    return NextResponse.json(kitchen);
  } catch (error: any) {
    console.log(`KITCHENS_PATCH Error: ${error.message}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string; kitchenId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is required/missing", { status: 400 });
    }
    if (!params.kitchenId) {
      return new NextResponse("Kitchen ID is required/missing", {
        status: 400,
      });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));

    if (store.exists()) {
      let storeData = store.data();
      if (storeData?.userId !== userId) {
        return new NextResponse("Unauthorized", { status: 400 });
      }
    }

    const kitchenRef = doc(
      db,
      "stores",
      params.storeId,
      "kitchens",
      params.kitchenId
    );

    await deleteDoc(kitchenRef);
    return NextResponse.json({
      msg: "Kitchens deleted",
    });
  } catch (error: any) {
    console.log(`KITCHEN_DELETE Error: ${error.message}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
