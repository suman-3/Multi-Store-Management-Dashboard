"use client";

import Image from "next/image";
import React from "react";

interface CellImageProps {
  data: string[];
}
export const CellImage = ({ data }: CellImageProps) => {
  return (
    <>
      {data.map((url, index) => (
        <div
          key={index}
          className="overflow-hidden min-h-16 min-w-16 w-full h-full aspect-square rounded-md flex items-center justify-center"
        >
          <Image
            src={url}
            alt="product image"
            className="object-contain"
            fill
          />
        </div>
      ))}
    </>
  );
};
