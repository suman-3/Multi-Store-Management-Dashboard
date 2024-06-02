import {
  authMiddleware,
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";

// const isProtectedRoutes = createRouteMatcher(["/(.*)"]);

// export default clerkMiddleware((auth, req) => {
//   if (isProtectedRoutes(req)) auth().protect();
// });

export default authMiddleware({
  publicRoutes: ["/api/:path*"],
});


export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
