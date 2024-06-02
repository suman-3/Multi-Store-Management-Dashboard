"use client";

import Image from "next/image";
import React from "react";

interface CellImageProps {
  imageUrl: string;
}
export const CellImage = ({ imageUrl }: CellImageProps) => {
  return (
    <div className="overflow-hidden w-32 min-h-16 h-full min-w-32 relative shadow-md rounded-md">
      <Image
        src={imageUrl}
        fill
        alt="bill board image"
        className="object-cover"
      />
    </div>
  );
};
