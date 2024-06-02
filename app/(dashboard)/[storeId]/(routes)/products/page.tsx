import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { format } from "date-fns";
import { Product} from "@/types-db";
import { ProductsColumns } from "./_components/column";
import { priceFormatter } from "@/lib/utils";
import { ProductClient } from "./_components/product-client";
import { log } from "console";

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
  const productsData = (
    await getDocs(collection(doc(db, "stores", params.storeId), "products"))
  ).docs.map((doc) => doc.data()) as Product[];

  const formattedProducts: ProductsColumns[] = productsData.map((item) => ({
    id: item.id,
    name: item.name,
    price: priceFormatter.format(item.price),
    images: item.images,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    category: item.category,
    size: item.size,
    kitchen: item.kitchen,
    cuisine: item.cuisine,
    createdAt:
      item.createdAt && format(item.createdAt.toDate(), "MMMM do, yyyy"),
  }));

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
