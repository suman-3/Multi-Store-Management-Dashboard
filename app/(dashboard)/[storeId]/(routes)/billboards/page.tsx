import { BillBoardClient } from "./_components/client";
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams } from "next/navigation";
import { Billboards } from "@/types-db";

const BillboardsPage = async ({ params }: { params: { storeId: string } }) => {
  const billboardsData = (
    await getDocs(collection(doc(db, "stores", params.storeId), "billboards"))
  ).docs.map((doc) => doc.data()) as Billboards[];

  console.log(billboardsData);
  
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillBoardClient />
      </div>
    </div>
  );
};

export default BillboardsPage;
