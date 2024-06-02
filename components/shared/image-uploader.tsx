"use client";
import { storage } from "@/lib/firebase";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { CircleX, ImagePlus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { PuffLoader } from "react-spinners";
import { toast } from "sonner";
import { Progress } from "../ui/progress";
import Image from "next/image";
import { Button } from "../ui/button";
interface ImageUploaderProps {
  disabled: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

export const ImageUploader = ({
  disabled,
  onChange,
  onRemove,
  value,
}: ImageUploaderProps) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const onUpload = async (e: any) => {
    const file = e.target.files[0];
    setIsLoading(true);
    const uploadTask = uploadBytesResumable(
      ref(storage, `Image/${Date.now()}-${file.name}`),
      file,
      { contentType: file.type }
    );

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        toast(`something went wrong, ${error.message}`);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          onChange(downloadURL);
          setIsLoading(false);
          toast("Image uploaded successfully");
        });
      }
    );
  };

  const onDelete = (url: string) => {
    onRemove(url);
    deleteObject(ref(storage, url)).then(() => {
      toast("Image deleted successfully");
    });
  };

  return (
    <div>
      {value && value.length > 0 ? (
        <>
          <div className="mb-4 flex items-center gap-4">
            {value.map((url) => (
              <div
                className="relative w-52 h-52 rounded-md overflow-hidden object-contain"
                key={url}
              >
                <Image src={url} alt={url} className="object-cover" fill />
                <div className="absolute z-10 top-2 right-2">
                  <Button
                    variant={"destructive"}
                    size={"icon"}
                    type="button"
                    onClick={() => onDelete(url)}
                  >
                    <CircleX className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="w-52 h-52 rounded-md overflow-hidden border border-dashed border-gray-200 flex items-center justify-center flex-col gap-3 object-contain bg-gray-100">
          {isLoading ? (
            <>
              <div className="flex flex-col items-center gap-y-2 justify-center w-full">
                <PuffLoader size={30} color="#555" className="" />
                <Progress value={progress} className="w-[80%] h-[7px] mt-3" />
              </div>
            </>
          ) : (
            <>
              <label>
                <div className="w-full h-full flex flex-col gap-2 items-center justify-center cursor-pointer">
                  <ImagePlus className="h-4 w-4" />
                  <p className="text-sm text-muted-foreground">
                    upload an image
                  </p>
                </div>
                <input
                  type="file"
                  onChange={onUpload}
                  accept="image/*"
                  className="w-0 h-0"
                />
              </label>
            </>
          )}
        </div>
      )}
    </div>
  );
};
