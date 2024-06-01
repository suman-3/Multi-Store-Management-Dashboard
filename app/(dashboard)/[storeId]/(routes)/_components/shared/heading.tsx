"use client";

import React from "react";
interface HeadingProps {
  title: string;
  description: string;
}

export const Heading = ({ title, description }: HeadingProps) => {
  return (
    <div className="w-full">
      <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
      <p className="text-md text-muted-foreground">{description}</p>
    </div>
  );
};
