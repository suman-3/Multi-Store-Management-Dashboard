import { db } from "@/lib/firebase";
import { Category, Cuisines, Kitchen, Product, Size } from "@/types-db";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

import React from "react";
import { ProductForm } from "./_components/product-form";

const CreateSizePage = async ({
  params,
}: {
  params: { storeId: string; productId: string };
}) => {
  const product = (
    await getDoc(doc(db, "stores", params.storeId, "sizes", params.productId))
  ).data() as Product;

  const categoriesData = (
    await getDocs(collection(db, "stores", params.storeId, "categories"))
  ).docs.map((doc) => doc.data()) as Category[];
  const sizesData = (
    await getDocs(collection(db, "stores", params.storeId, "sizes"))
  ).docs.map((doc) => doc.data()) as Size[];
  const kitchensData = (
    await getDocs(collection(db, "stores", params.storeId, "kitchens"))
  ).docs.map((doc) => doc.data()) as Kitchen[];
  const cuisinesData = (
    await getDocs(collection(db, "stores", params.storeId, "cuisines"))
  ).docs.map((doc) => doc.data()) as Cuisines[];

  return (
    <div className="flex flex-col ">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          initialData={product}
          categories={categoriesData}
          kitchens={kitchensData}
          sizes={sizesData}
          cuisines={cuisinesData}
        />
      </div>
    </div>
  );
};

export default CreateSizePage;
