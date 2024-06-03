import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { format } from "date-fns";
import {  Size } from "@/types-db";
import { SizesClient } from "./_components/sizes-client";
import { SizesColumns } from "./_components/column";


const SizesPage = async ({ params }: { params: { storeId: string } }) => {
  const sizesData = (
    await getDocs(collection(doc(db, "stores", params.storeId), "sizes"))
  ).docs.map((doc) => doc.data()) as Size[];

  const formattedSizes: SizesColumns[] = sizesData.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt:
      item.createdAt && format(item.createdAt.toDate(), "MMMM do, yyyy"),
  }));

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizesClient data={formattedSizes} />
      </div>
    </div>
  );
};

export default SizesPage;
