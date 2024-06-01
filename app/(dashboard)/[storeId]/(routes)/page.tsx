import { db } from "@/lib/firebase";
import { Store } from "@/types-db";
import { doc, getDoc } from "firebase/firestore";
import React from "react";

interface DashboardOverviewProps {
  params: { storeId: string };
}

const DashboardOverview = async ({ params }: DashboardOverviewProps) => {
  const store = (await getDoc(doc(db, "stores", params.storeId))).data() as Store;
  return (
    <div>
      Overview: {store?.name}
    </div>
  )
};

export default DashboardOverview;
