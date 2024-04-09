"use client";
import Link from "next/link";
import {
  Navbar,
  NavbarContent,
  NavbarItem,
  Button,
  NavbarBrand,
} from "@nextui-org/react";
import gpLogo from "../public/GoPhotos_logo.png";
import Image from "next/image";
import { UserButton, useAuth } from "@clerk/nextjs";
import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";

export default function NavigationBar() {
  const { userId } = useAuth();

  return (
    <Navbar isBlurred className="sticky z-20 bg-white px-8 sm:px-20 py-7">
      <NavbarContent>
        <NavbarBrand>
          <Link href="/" className="cursor-pointer">
            <Image src={gpLogo} alt="" width={150} height={800} />
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden md:flex gap-4" justify="center">
        <NavbarItem>
          <NavigationLink
            href={`/discover?photographyType=${"Portrait"}`}
            linkPath="/discover"
            className="hover-gradient text-lg sm:text-base font-medium"
          >
            Discover
          </NavigationLink>
        </NavbarItem>
        {userId && (
          <NavbarItem>
            <NavigationLink
              href={`/messages`}
              linkPath="/messages"
              className="hover-gradient text-lg sm:text-base font-medium"
            >
              Messages
            </NavigationLink>
          </NavbarItem>
        )}
      </NavbarContent>

      <NavbarContent justify="end" className="gap-4">
        <NavbarItem className="flex md:hidden">
          <NavigationLink
            href={`/discover?photographyType=${"Portrait"}`}
            linkPath="/discover"
            className="hover-gradient sm:text-base font-medium"
          >
            Discover
          </NavigationLink>
        </NavbarItem>
        {userId && (
        <NavbarItem className="flex md:hidden">
          <NavigationLink
            href={`/messages`}
            linkPath="/messages"
            className="hover-gradient sm:text-base font-medium"
          >
            Messages
          </NavigationLink>
        </NavbarItem>
          )}
        <NavbarItem>
          {userId ? (
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonAvatarBox: "h-9 w-9",
                },
              }}
              userProfileMode="navigation"
              userProfileUrl="/user-profile"
            />
          ) : (
            <Button
              href="/sign-in"
              as={Link}
              color="primary"
              variant="flat"
              className="font-medium hover-gradient"
            >
              Sign In{" "}
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}

function NavigationLink({
  children,
  href,
  linkPath,
  className,
}: {
  children: ReactNode;
  href: string;
  linkPath: string;
  className?: string;
}) {
  const currentPath = usePathname();
  const isActive = currentPath.startsWith(linkPath);

  return (
    <Link href={href}>
      <div className={cn("relative font-medium", className)}>
        {children}
        <div
          className={cn(
            "absolute w-full border-b-2",
            isActive ? "border-black" : "border-transparent"
          )}
        />
      </div>
    </Link>
  );
}
