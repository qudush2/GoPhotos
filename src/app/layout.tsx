import "./globals.css";
import type { Metadata } from "next";
import Footer from "@/src/app/footer";
import { Space_Grotesk as SpaceGrotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ClerkProvider } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { Suspense } from "react";
import Loading from "./loading";
import AdminShortcut from "@/src/components/AdminShortcut";
import { isPGClerk } from "@/src/utils/db";

import { cn } from "@/src/utils/cn";

import { Toaster } from "sonner";
import NavigationBar from "./navigation-bar";

export const metadata: Metadata = {
  title: "GoPhotos",
  description:
    "Finding a photographer has never been this easy. Start searching for a photographer near you now!",
  icons: {
    icon: {
      url: "/favicon.ico",
    },
  },
};

const spaceGrotesk = SpaceGrotesk({
  style: "normal",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  let isPG = null;
  if (user) {
    isPG = await isPGClerk(user.id);
  }

  return (
    <ClerkProvider>
      <html lang="en" className="h-full">
        <body
          className={cn("flex flex-col min-h-full", spaceGrotesk.className)}
        >
          <Suspense fallback={<Loading />}>
            <NavigationBar isPG={isPG} />
            <main className="flex-grow">{children}</main>
            <Footer />
          </Suspense>
          <AdminShortcut />
          <Analytics />
          <SpeedInsights />
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
