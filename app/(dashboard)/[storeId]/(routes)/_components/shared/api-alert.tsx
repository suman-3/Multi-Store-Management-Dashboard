"use client";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Copy, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ApiAlertProps {
  title: string;
  description: string;
  variant: "public" | "admin";
}

const textMap: Record<ApiAlertProps["variant"], string> = {
  public: "Public",
  admin: "Admin",
};

const variantMap: Record<ApiAlertProps["variant"], BadgeProps["variant"]> = {
  public: "secondary",
  admin: "destructive",
};

export const ApiAlert = ({
  title,
  description,
  variant = "public",
}: ApiAlertProps) => {
  const onCopy = () => {
    navigator.clipboard.writeText(description);
    toast("API Endpoint Copied");
  };

  return (
    <Alert>
      <AlertTitle className="flex items-center gap-x-2 capitalize">
        <Server className="h-4 w-4 mr-1" />
        {title}
        <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
      </AlertTitle>
      <AlertDescription className="px-2 mt-3 flex items-center justify-between">
        <code className="relative rounded-md bg-muted px-[0.3rem] py-[0.2rem] font-mono font-semibold">
          {description}
        </code>
        <Button variant="outline" size={"icon"} onClick={onCopy}>
          <Copy className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  );
};
