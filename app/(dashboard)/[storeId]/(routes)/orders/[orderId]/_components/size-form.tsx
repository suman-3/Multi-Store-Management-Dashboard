"use client";
import { useConfirm } from "@/hooks/use-confirm";
import { Size } from "@/types-db";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Heading } from "../../../_components/shared/heading";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from "sonner";
import { SizeFormSchema } from "@/schemas/SizeFormSchema";

interface SizeFormProps {
  initialData: Size;
}

export const SizeForm = ({ initialData }: SizeFormProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const title = initialData ? "Edit Size" : "Create Size";
  const description = initialData ? "Edit your size" : "Create a new size";
  const toastMessage = initialData ? "Size updated" : "Size created";
  const toastErrorMessage = initialData
    ? "Size update failed"
    : "Size creation failed";
  const action = initialData ? "Update" : "Create Size";
  const actionLoadingText = initialData ? "Updating" : "Creating";

  const [ConfirmDialogue, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete thsi size."
  );

  const form = useForm<z.infer<typeof SizeFormSchema>>({
    resolver: zodResolver(SizeFormSchema),
    defaultValues: initialData,
  });

  const params = useParams();
  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof SizeFormSchema>) => {
    setIsLoading(true);
    try {
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/sizes/${params.sizeId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/sizes`, data);
      }
      toast(toastMessage);

      router.push(`/${params.storeId}/sizes`);
      router.refresh();
    } catch (error: any) {
      console.log(`Client Error: ${error.message}`);
      toast(toastErrorMessage);
    } finally {
      router.refresh();
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    setIsDeleting(true);
    const ok = await confirm();

    if (ok) {
      try {
        await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`);
        router.push(`/${params.storeId}/sizes`);
        router.refresh();
        toast("Size removed");
        setIsDeleting(false);
      } catch (error: any) {
        console.log(`Client Error: ${error.message}`);
        toast("An error occurred,while deleting the size");
        setIsDeleting(false);
      }
    }
    setIsDeleting(false);
  };

  return (
    <>
      <ConfirmDialogue />
      <div className="flex items-center justify-center">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            onClick={onDelete}
            size="sm"
            variant="destructive"
            loadingText="Deleting..."
            isLoading={isDeleting}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-5"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="your size name..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size Value</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="your size value..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            disabled={isLoading}
            type="submit"
            size="sm"
            loadingText={actionLoadingText}
            isLoading={isLoading}
          >
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
