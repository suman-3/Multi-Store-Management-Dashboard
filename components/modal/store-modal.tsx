"use client";

import Modal from "@/components/modal/modal";
import { useStoreModal } from "@/hooks/use-store-modal";
import { newStoreFromSchema } from "@/schemas/newStoreFromSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const StoreModal = () => {
  const storeModal = useStoreModal();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof newStoreFromSchema>>({
    resolver: zodResolver(newStoreFromSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof newStoreFromSchema>) => {
    setIsLoading(true);

    try {
      const response = await axios.post("/api/stores", values);
      const storeName = response.data.name;
      toast(`${storeName} created successfully`);
      setIsLoading(false);
    } catch (error: any) {
      console.log(`STORE_POST Client Error: ${error.message}`);
      toast("An error occurred,while creating the store");
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Create Store"
      description="Add a new store to manage the products and orders"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
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
              <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button
                  disabled={isLoading}
                  variant="outline"
                  type="button"
                  size="sm"
                >
                  Cancel
                </Button>
                <Button
                  disabled={isLoading}
                  type="submit"
                  size="sm"
                  loadingText="Creating..."
                  isLoading={isLoading}
                >
                  Continue
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
};
