import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const publicRoutes = createRouteMatcher([
  '/',
  '(^/discover.*)',
  '/api/webhooks/(.*)',
]);

export default clerkMiddleware((auth, req) => {
  if (!publicRoutes(req)) {
    // Protect all routes except the public ones
    auth().protect();
  }
});

export const config = {
 matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};