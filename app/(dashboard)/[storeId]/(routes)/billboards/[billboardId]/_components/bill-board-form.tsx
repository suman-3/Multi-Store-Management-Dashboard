"use client";

import { Billboards } from "@/types-db";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";

import { BillBoardFormSchema } from "@/schemas/BillBoardFormSchema";
import { Heading } from "../../../_components/shared/heading";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface BillBoardFormProps {
  initialData: Billboards;
}

export const BillBoardForm = ({ initialData }: BillBoardFormProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);


  const title = initialData ? "Edit Billboard" : "Create Billboard";
  const description = initialData ? "Edit your billboard" : "Create a new billboard";
  const toastMessage = initialData ? "Billboard updated" : "Billboard created";
  const action = initialData ? "Update Billboard" : "Create Billboard";

  const [ConfirmDialogue, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete thsi billboard."
  );

  const form = useForm<z.infer<typeof BillBoardFormSchema>>({
    resolver: zodResolver(BillBoardFormSchema),
    defaultValues: initialData,
  });

  const params = useParams();
  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof BillBoardFormSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.patch(`/api/stores/${params.storeId}`, data);
      const storeName = response.data.name;
      toast(`${storeName} updated`);
      router.refresh();
      setIsLoading(false);
    } catch (error: any) {
      console.log(`Client Error: ${error.message}`);
      toast("An error occurred,while updating the store");
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    setIsDeleting(true);
    const ok = await confirm();

    if (ok) {
      try {
        const response = await axios.delete(`/api/stores/${params.storeId}`);
        router.push("/");
        toast("Store removed");
        setIsDeleting(false);
      } catch (error: any) {
        console.log(`Client Error: ${error.message}`);
        toast("An error occurred,while deleting the store");
        setIsDeleting(false);
      }
    }
    setIsDeleting(false);
  };

  return (
    <>
      <ConfirmDialogue />
      <div className="flex items-center justify-center">
      <Heading
        title={title}
        description={description}
      />
      {initialData && (
        <Button
          onClick={onDelete}
          size="sm"
          variant="destructive"
          loadingText="Deleting..."
          isLoading={isDeleting}
        >
          <Trash className="h-4 w-4 mr-2" />
          Delete
        </Button>
      
      )}
      </div>
      <Separator/>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-5"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Daily Food"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the label of billboard
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            disabled={isLoading}
            type="submit"
            size="sm"
            loadingText="Updating..."
            isLoading={isLoading}
          >
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
