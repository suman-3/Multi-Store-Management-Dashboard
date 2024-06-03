"use client";

import { useParams, useRouter } from "next/navigation";
import React from "react";
import { Heading } from "../../_components/shared/heading";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/shared/data-table";
import { OrdersColumns, columns } from "./column";
import { ApiList } from "../../_components/shared/api-list";

interface OrderClientProps {
  data: OrdersColumns[];
}

export const OrdersClient = ({ data }: OrderClientProps) => {
  const params = useParams();
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Orders (${data.length})`}
          description="Manage orders for your store"
        />
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="name" />

    </>
  );
};
