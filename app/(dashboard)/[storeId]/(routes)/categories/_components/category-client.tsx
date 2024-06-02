"use client";

import { useParams, useRouter } from "next/navigation";
import React from "react";
import { Heading } from "../../_components/shared/heading";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/shared/data-table";
import { CategoryColumns, columns } from "./column";
import { ApiList } from "../../_components/shared/api-list";

interface CategoryClientProps {
  data: CategoryColumns[];
}

export const CategoryClient = ({ data }: CategoryClientProps) => {
  const params = useParams();
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Cartegories (${data.length})`}
          description="Manage categories for your store"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/categories/new`)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="name" />

      <Heading title="API" description="API calls for categories" />
      <Separator />
      <ApiList entityName="categories" entityNameId="categoryId" />
    </>
  );
};
