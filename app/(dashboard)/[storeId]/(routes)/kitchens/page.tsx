import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { format } from "date-fns";
import { Kitchen } from "@/types-db";

import { KitchenColumns } from "./_components/column";
import { KitchenClient } from "./_components/kitchen-client";

const KitchensPage = async ({ params }: { params: { storeId: string } }) => {
  const kitchensData = (
    await getDocs(collection(doc(db, "stores", params.storeId), "kitchens"))
  ).docs.map((doc) => doc.data()) as Kitchen[];

  const formattedKitchens: KitchenColumns[] = kitchensData.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt:
      item.createdAt && format(item.createdAt.toDate(), "MMMM do, yyyy"),
  }));

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <KitchenClient data={formattedKitchens} />
      </div>
    </div>
  );
};

export default KitchensPage;
