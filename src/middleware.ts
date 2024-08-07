import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

type SessionClaims = {
  metadata?: {
    admin?: boolean;
  };
};

// if gophotos.us/qudus --> change the public route to include /.*
const publicRoutes = createRouteMatcher([
  '/',
  '(^/discover.*)',
  '/api/webhooks/(.*)'
]);

const adminRoutes = createRouteMatcher([
  '/admin(.*)',
]);

export default clerkMiddleware((auth, req) => {
  if (adminRoutes(req)) {
    // Protect admin routes and check for admin metadata
    auth().protect();
    const { sessionClaims } = auth();
    if (!(sessionClaims as SessionClaims)?.metadata?.admin) {
      return new Response("Access denied", { status: 403 });
    }
  } else if (!publicRoutes(req)) {
    // Protect all other routes except public
    auth().protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};