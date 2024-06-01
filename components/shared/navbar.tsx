import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { MainNav } from "./main-navbar";
import { StoreSwitcher } from "../dashboard/store-switcher";

const Navbar = () => {
  return (
    <div className="border-b shadow-sm">
      <div className="flex h-16 items-center px-4">
       
       <StoreSwitcher/>

        {/* routes */}
        <MainNav />

        {/* user profile */}
        <div className="ml-auto">
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
