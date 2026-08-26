import "./globals.css";
import type { Metadata } from "next";
import Footer from "@/src/components/Layout/Footer";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ClerkProvider } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { Suspense } from "react";
import Loading from "../components/Layout/Loading";
import AdminShortcut from "@/src/components/AdminPage/AdminShortcut";
import { isPGClerk } from "@/src/utils/db";

import { Toaster } from "react-hot-toast";
import NavigationBar from "../components/Layout/NavBar";
import {
  playfairDisplay,
  questrial,
  fragmentMono,
  inter,
  spaceGrotesk,
} from "@/src/utils/fonts";
import { CSPostHogProvider } from "./providers";

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
        <CSPostHogProvider>
          <body className="flex flex-col min-h-full font-spaceGrotesk">
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-black focus:shadow-lg"
            >
              Skip to main content
            </a>
            <Suspense fallback={<Loading />}>
              <NavigationBar isPG={isPG} />
              <main id="main-content" className="flex-grow">
                {children}
              </main>
              <Footer />
            </Suspense>
            <AdminShortcut />
            <Analytics />
            <SpeedInsights />
            <Toaster />
          </body>
        </CSPostHogProvider>
      </html>
    </ClerkProvider>
  );
}
