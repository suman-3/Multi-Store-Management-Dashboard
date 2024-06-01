"use client";

import Modal from "@/components/modal/modal";
import { useStoreModal } from "@/hooks/use-store-modal";

export const StoreModal = () => {
  const storeModal = useStoreModal();

  return (
    <Modal
      title="Create a new Store"
      description="Add a new store to manage the products and orders"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
        Form to create the store
    </Modal>
  );
};
