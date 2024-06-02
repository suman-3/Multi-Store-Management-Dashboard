
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { format } from "date-fns";
import { Billboards } from "@/types-db";


const CategoriesPage = async ({ params }: { params: { storeId: string } }) => {
  const categoriesData = (
    await getDocs(collection(doc(db, "stores", params.storeId), "categories"))
  ).docs.map((doc) => doc.data()) as Billboards[];


  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
   
      </div>
    </div>
  );
};

export default CategoriesPage;
