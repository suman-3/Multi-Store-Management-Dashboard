import { db } from "@/lib/firebase";
import { Billboards } from "@/types-db";
import { doc, getDoc } from "firebase/firestore";
import React from "react";
import { BillBoardForm } from "./_components/bill-board-form";

const CreateBillBoardPage = async ({
  params,
}: {
  params: { storeId: string; billboardId: string };
}) => {
  const billboard = (
    await getDoc(
      doc(db, "stores", params.storeId, "billboards", params.billboardId)
    )
  ).data() as Billboards;

  return (
    <div className="flex flex-col ">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillBoardForm initialData={billboard} />
      </div>
    </div>
  );
};

export default CreateBillBoardPage;
