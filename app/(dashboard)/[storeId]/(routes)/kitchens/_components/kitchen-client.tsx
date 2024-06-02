"use client";

import { useParams, useRouter } from "next/navigation";
import React from "react";
import { Heading } from "../../_components/shared/heading";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/shared/data-table";
import { KitchenColumns, columns } from "./column";
import { ApiList } from "../../_components/shared/api-list";

interface KitchenClientProps {
  data: KitchenColumns[];
}

export const KitchenClient = ({ data }: KitchenClientProps) => {
  const params = useParams();
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Kitchens (${data.length})`}
          description="Manage kitchens for your store"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/kitchens/new`)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="name" />

      <Heading title="API" description="API calls for kitchens" />
      <Separator />
      <ApiList entityName="kitchens" entityNameId="kitchenId" />
    </>
  );
};
