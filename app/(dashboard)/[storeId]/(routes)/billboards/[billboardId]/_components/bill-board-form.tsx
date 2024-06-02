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
import { ImageUploader } from "@/components/shared/image-uploader";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "@/lib/firebase";

interface BillBoardFormProps {
  initialData: Billboards;
}

export const BillBoardForm = ({ initialData }: BillBoardFormProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const title = initialData ? "Edit Billboard" : "Create Billboard";
  const description = initialData
    ? "Edit your billboard"
    : "Create a new billboard";
  const toastMessage = initialData ? "Billboard updated" : "Billboard created";
  const toastErrorMessage = initialData
    ? "Billboard update failed"
    : "Billboard creation failed";
  const action = initialData ? "Update" : "Create Billboard";
  const actionLoadingText = initialData ? "Updating" : "Creating";

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
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/billboards/${params.billboardId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/billboards`, data);
      }
      toast(toastMessage);

      router.push(`/${params.storeId}/billboards`);
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
        const { imageUrl } = form.getValues();
        await deleteObject(ref(storage, imageUrl)).then(async () => {
          await axios.delete(
            `/api/${params.storeId}/billboards/${params.billboardId}`
          );
        });

        router.push(`/${params.storeId}/billboards`);
        router.refresh();
        toast("Billboard removed");
        setIsDeleting(false);
      } catch (error: any) {
        console.log(`Client Error: ${error.message}`);
        toast("An error occurred,while deleting the billboard");
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
            <Trash className="h-4 w-4 mr-2" />
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
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Billboard Image</FormLabel>
                <FormControl>
                  <ImageUploader
                    disabled={isLoading}
                    value={field.value ? [field.value] : []}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
              </FormItem>
            )}
          />

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
                      placeholder="your billboard name..."
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
