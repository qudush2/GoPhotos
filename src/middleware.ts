import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "(^/discover.*)"],
  ignoredRoutes: ["/api/clerk-webhooks", "/api/stripe-webhooks"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/(api|trpc)(.*)"],
};
