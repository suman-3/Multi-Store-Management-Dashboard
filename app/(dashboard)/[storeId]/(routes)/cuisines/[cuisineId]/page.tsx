import { db } from "@/lib/firebase";
import { Cuisines } from "@/types-db";

import { doc, getDoc } from "firebase/firestore";

import React from "react";
import { CuisineForm } from "./_components/cuisine-form";


const CreateCuisinePage = async ({
  params,
}: {
  params: { storeId: string; cuisineId: string };
}) => {
  const cuisine = (
    await getDoc(
      doc(db, "stores", params.storeId, "cuisines", params.cuisineId)
    )
  ).data() as Cuisines;

  return (
    <div className="flex flex-col ">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CuisineForm initialData={cuisine} />
      </div>
    </div>
  );
};

export default CreateCuisinePage;
