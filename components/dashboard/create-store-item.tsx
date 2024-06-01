"use client";
import { PlusCircle } from "lucide-react";
import React from "react";

interface CreateNewStoreItemProps {
  onClick: () => void;
}

export const CreateNewStoreItem = ({ onClick }: CreateNewStoreItemProps) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center bg-gray-50 px-2 py-1 cursor-pointer text-muted-foreground hover:text-primary text-sm"
    >
      <PlusCircle className="mr-2 h-4 w-4" />
      Create Store
    </div>
  );
};
