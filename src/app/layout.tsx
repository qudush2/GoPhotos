import "./globals.css";
import type { Metadata } from "next";
import Footer from "@/src/app/footer";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ClerkProvider } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { Suspense } from "react";
import Loading from "./loading";
import AdminShortcut from "@/src/components/AdminShortcut";
import { isPGClerk } from "@/src/utils/db";

import { Toaster } from "sonner";
import NavigationBar from "./navigation-bar";
import {
  playfairDisplay,
  questrial,
  fragmentMono,
  inter,
  spaceGrotesk,
} from "@/src/utils/fonts";

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
      <html
        lang="en"
        className={`h-full ${playfairDisplay.variable} ${questrial.variable} ${fragmentMono.variable} ${inter.variable} ${spaceGrotesk.variable}`}
      >
        <body className="flex flex-col min-h-full font-spaceGrotesk">
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
