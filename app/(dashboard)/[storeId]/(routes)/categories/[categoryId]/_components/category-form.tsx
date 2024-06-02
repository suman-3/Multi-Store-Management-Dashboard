"use client";
import { useConfirm } from "@/hooks/use-confirm";
import { CategoryFormSchema } from "@/schemas/CategoryFormSchema";
import { Billboards, Category } from "@/types-db";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from "sonner";

interface CategoryFormProps {
  initialData: Category;
  billboards: Billboards[];
}

export const CategoryForm = ({
  initialData,
  billboards,
}: CategoryFormProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const title = initialData ? "Edit Category" : "Create Category";
  const description = initialData
    ? "Edit your category"
    : "Create a new category";
  const toastMessage = initialData ? "Category updated" : "Category created";
  const toastErrorMessage = initialData
    ? "Category update failed"
    : "Category creation failed";
  const action = initialData ? "Update" : "Create Category";
  const actionLoadingText = initialData ? "Updating" : "Creating";

  const [ConfirmDialogue, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete thsi category."
  );

  const form = useForm<z.infer<typeof CategoryFormSchema>>({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: initialData,
  });

  const params = useParams();
  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof CategoryFormSchema>) => {
    setIsLoading(true);
    try {
      const { billboardId: formBillId } = form.getValues();

      const matchingBillboard = billboards.find(
        (item) => item.id === formBillId
      );

      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/categories/${params.categoryId}`,
          {
            ...data,
            billboardLabel: matchingBillboard?.label,
          }
        );
      } else {
        await axios.post(`/api/${params.storeId}/categories`, {
          ...data,
          billboardLabel: matchingBillboard?.label,
        });
      }
      toast(toastMessage);

      router.push(`/${params.storeId}/categories`);
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
        await axios.delete(
          `/api/${params.storeId}/categories/${params.categoryId}`
        );
        router.push(`/${params.storeId}/categories`);
        router.refresh();
        toast("Category removed");
        setIsDeleting(false);
      } catch (error: any) {
        console.log(`Client Error: ${error.message}`);
        toast("An error occurred,while deleting the category");
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
                  <FormLabel>Category Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="your category name..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <FormControl>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select a billboard"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {billboards.map((billboard) => (
                          <SelectItem key={billboard.id} value={billboard.id}>
                            {billboard.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
