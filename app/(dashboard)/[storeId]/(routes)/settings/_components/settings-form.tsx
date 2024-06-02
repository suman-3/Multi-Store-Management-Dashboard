"use client";

import { Store } from "@/types-db";
import React, { useState } from "react";
import { Heading } from "../../_components/shared/heading";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { newStoreFromSchema } from "@/schemas/newStoreFromSchema";
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
import { ApiAlert } from "../../_components/shared/api-alert";
import { useOrigin } from "@/hooks/use-origin";

interface SettingsFormProps {
  initialData: Store;
}

export const SettingsForm = ({ initialData }: SettingsFormProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const origin = useOrigin();

  const [ConfirmDialogue, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete thsi store."
  );

  const form = useForm<z.infer<typeof newStoreFromSchema>>({
    resolver: zodResolver(newStoreFromSchema),
    defaultValues: initialData,
  });

  const params = useParams();
  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof newStoreFromSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.patch(`/api/${params.storeId}`, data);
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
        const response = await axios.delete(`/api/${params.storeId}`);
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
        <Heading title="Settings" description="Manage Store Preferance" />
        <Button
          variant={"destructive"}
          size={"icon"}
          disabled={isDeleting}
          onClick={() => onDelete()}
        >
          <Trash className="h-4 w-4" />
        </Button>
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
                  <FormLabel>Store Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Daily Food"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the name of your store
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
            loadingText="Updating"
            isLoading={isLoading}
          >
            Update Store
          </Button>
        </form>
      </Form>

      <Separator />
      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${params.storeId}`}
        variant="public"
      />
    </>
  );
};
