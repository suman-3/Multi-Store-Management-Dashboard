import { db } from "@/lib/firebase";
import { Kitchen } from "@/types-db";
import { doc, getDoc } from "firebase/firestore";

import React from "react";
import { KitchenForm } from "./_components/kitchen-form";


const CreateKitchenPage = async ({
  params,
}: {
  params: { storeId: string; kitchenId: string };
}) => {
  const kitchen = (
    await getDoc(doc(db, "stores", params.storeId, "kitchens", params.kitchenId))
  ).data() as Kitchen;

  return (
    <div className="flex flex-col ">
      <div className="flex-1 space-y-4 p-8 pt-6">
      <KitchenForm initialData={kitchen} />
      </div>
    </div>
  );
};

export default CreateKitchenPage;
