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
]);

const ignoredRoutes = createRouteMatcher([
  '/api/webhooks/(.*)',
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
  } else if (!publicRoutes(req) && !ignoredRoutes(req)) {
    // Protect all other routes except public and ignored ones
    auth().protect();
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};