import { Timestamp } from "firebase/firestore";

export interface Store {
  id: string;
  name: string;
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Billboards {
  id: string;
  label: string;
  imageUrl: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Category {
  id: string;
  billboardId: string;
  billboardLabel: string;
  name: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Size {
  id: string;
  categoryId: string;
  name: string;
  value: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
