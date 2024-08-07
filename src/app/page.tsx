"use client";

import { cn } from "@/src/utils/cn";
import { Playfair_Display as PlayfairDisplay } from "next/font/google";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getPGinfo } from "../utils/db";
import { Questrial } from "next/font/google";
import { Fragment_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import "@/src/app/globals.css"; // for css styles

const playfairDisplay = PlayfairDisplay({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["600", "700"], // Use an array to specify multiple weights
  preload: true,
});

export default async function LandingPage() {
  const { userId } = auth();
  const user = await currentUser();
  const questrial = Questrial({
    subsets: ["latin"],
    style: ["normal"],
    weight: "400",
    preload: true,
  });

  const fragmentMono = Fragment_Mono({
    subsets: ["latin"],
    style: ["normal"],
    weight: "400",
    preload: true,
  });

  const inter = Inter({
    subsets: ["latin"],
    style: ["normal"],
    weight: ["400", "500"], // Use an array to specify multiple weights
    preload: true,
  });

  if (userId && user && user.publicMetadata.isPhotographer == null) {
    const email = user.emailAddresses[0].emailAddress;
    const fullName = user.firstName + " " + user.lastName;
    const info = await getPGinfo(email);

    const LandingPageCustomer = () => (
      <div className="relative h-auto bg-[#fefefe] py-20 sm:pb-7 sm:pt-5 flex justify-center items-center">
        <div className="w-full max-w-7xl mx-auto">
          <div className="flex justify-center gap-3">
            <p>Hire a Photographer</p>
            {/* <button onClick={() => setView('photographers')} className="text-blue-500 text-center" > */}
            <button disabled className="text-blue-500 text-center">
              View
            </button>
            <p>I'm a Photographer</p>
          </div>
          <div className="flex items-center justify-center space-x-7">
            <div className="md:1/2 px-8 sm:pl-20">
              <div className="text-black text-center">
                <p
                  className={cn(
                    playfairDisplay.className,
                    "text-5xl mt-5 sm:text-7xl font-medium"
                  )}
                >
                  Creative Hiring <br />
                  <span className="inline-block bg-gradient-to-r from-[#FF9993] via-[#FC7674] to-[#FC4D74] bg-clip-text pl-0.5 italic leading-snug text-transparent">
                    Simplified.
                  </span>
                </p>
                <p
                  className={cn(
                    inter.className,
                    "mb-5 sm:mb-10 mt-4 text-1xl  font-bold text-black"
                  )}
                >
                  Hiring for local photography talent done right
                </p>
              </div>
              <div className="mt-10 flex justify-center gap-20">
                <button className="button1">Book Today</button>
                <button className="button2">Explore</button>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden md:flex w-1/2 items-center justify-end pr-16">
          <Image
            src="https://res.cloudinary.com/dklvhnniq/image/upload/f_auto,q_auto/kymcdxwxu270hpjh8gfz"
            alt="Photographer taking a picture"
            width={700}
            height={100}
            className="rounded-md"
          />
        </div>
      </div>
    );

    // return view === 'customer' ? <LandingPageCustomer /> : <LandingPagePhotographers />;
  }
}
{
  /* <input class="switch" type="checkbox" checked="true"></input> */
}

//  use fixed images that change rea

{
  /* <div style={{left: 666.50, top: 178.77, position: 'absolute', justifyContent: 'center', alignItems: 'center', gap: 8, display: 'inline-flex'}}>
        <div style={{color: 'black', fontSize: 18, fontFamily: 'Helvetica Neue', fontWeight: '500', lineHeight: 14, wordWrap: 'break-word'}}>Hire a Photographer</div>
        <div style={{width: 50, height: 27.27, position: 'relative'}}>
            <div style={{width: 50, height: 27.27, left: 0, top: 0, position: 'absolute', background: '#FF9993', borderRadius: 50}} />
            <div style={{width: 22.73, height: 22.73, left: 2.27, top: 2.27, position: 'absolute', background: 'white', borderRadius: 9999}} />
        </div>
        <div style={{color: 'black', fontSize: 18, fontFamily: 'Helvetica Neue', fontWeight: '500', lineHeight: 14, wordWrap: 'break-word'}}>I'm a Photographer</div>
    </div> */
}
