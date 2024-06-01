import { db } from "@/lib/firebase";
import { Store } from "@/types-db";
import { auth } from "@clerk/nextjs/server";
import { collection, getDocs, query, where } from "firebase/firestore";
import { redirect } from "next/navigation";
import React from "react";

interface SetupLayoutProps {
  children: React.ReactNode;
}

const SetupLayout = async ({ children }: SetupLayoutProps) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }
  const storeSnap = await getDocs(
    query(collection(db, "stores"), where("userId", "==", userId))
  );

  let store = null as any;

  storeSnap.forEach((doc) => {
    store = doc.data() as Store;
    return;
  });

  if (store) {
    redirect(`/${store?.id}`);
  }

  return <div>{children}</div>;
};

export default SetupLayout;
