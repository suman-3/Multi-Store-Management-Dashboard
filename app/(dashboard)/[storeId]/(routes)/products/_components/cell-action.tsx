"use client";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useParams, useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/use-confirm";
import { Button } from "@/components/ui/button";
import { Copy, MoreVertical, PencilLine, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "@/lib/firebase";
import axios from "axios";
import { SizesColumns } from "./column";


interface CellActionProps {
  data: SizesColumns;
}

export const CellAction = ({ data }: CellActionProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [ConfirmDialogue, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this size."
  );

  const router = useRouter();
  const params = useParams();

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast("Size ID Copied");
  };

  const onDelete = async () => {
    setIsLoading(true);
    const ok = await confirm();

    if (ok) {
      try {
        await axios.delete(`/api/${params.storeId}/sizes/${data.id}`);
        router.refresh();
        toast("Size removed");
        setIsLoading(false);
      } catch (error: any) {
        console.log(`Client Error: ${error.message}`);
        toast("An error occurred,while deleting the size");
        setIsLoading(false);
      }
    }
    setIsLoading(false);
  };

  return (
    <>
      <ConfirmDialogue />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} className="h-8 w-8 p-0">
            <span className="sr-only">Open</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="text-sm">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => onCopy(data.id)}
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() =>
              router.push(`/${params.storeId}/sizes/${data.id}`)
            }
          >
            <PencilLine className="w-4 h-4 mr-2" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={onDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
