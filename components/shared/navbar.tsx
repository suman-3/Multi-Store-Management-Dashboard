import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { MainNav } from "./main-navbar";
import { StoreSwitcher } from "../dashboard/store-switcher";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Store } from "@/types-db";
import Image from "next/image";
import Link from "next/link";
import GithubStarCount from "./git-star-count";

const Navbar = async () => {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const storeSnap = await getDocs(
    query(collection(db, "stores"), where("userId", "==", userId))
  );

  let stores = [] as Store[];

  storeSnap.forEach((doc) => {
    stores.push(doc.data() as Store);
  });

  return (
    <div className="border-b shadow-sm">
      <div className="flex h-16 items-center px-4">
        <Link href="/">
          <Image
            src="/logo.svg"
            width={40}
            height={40}
            alt="logo"
            className="mr-4"
          />
        </Link>
        <StoreSwitcher items={stores} />

        {/* routes */}
        <MainNav />

        {/* user profile */}
        <div className="ml-auto flex items-center justify-between gap-5">
          <GithubStarCount repoUrl={`${process.env.GIHUB_REPO_LINK}`} />
  
          <ClerkLoading>
            <Skeleton className="w-9 h-9 rounded-full bg-gray-300" />
          </ClerkLoading>
          <ClerkLoaded>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9",
                },
              }}
            />
          </ClerkLoaded>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
