"use client";

import Link from "next/link";
import {
  Navbar,
  NavbarContent,
  NavbarItem,
  Button,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/react";
import { GoPhotosLogo } from "@/src/components/Layout/Logo";
import { UserButton, useAuth, SignInButton } from "@clerk/nextjs";
import React, { ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/src/utils/cn";

export default function NavigationBar({ isPG }: { isPG: boolean | null }) {
  const { userId } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { href: "/discover", label: "Discover" },
    ...(userId
      ? [
          { href: "/gallery", label: "Gallery" },
          ...(isPG ? [{ href: "/jobs", label: "Jobs" }] : []),
          { href: "/messages", label: "Messages" },
        ]
      : []),
  ];

  return (
    <Navbar
      isBlurred
      shouldHideOnScroll
      maxWidth="xl"
      className="sticky z-20 py-1"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      <NavbarBrand>
        <Link href="/">
          <GoPhotosLogo />
        </Link>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menuItems.map((item) => (
          <NavbarItem key={item.href}>
            <NavigationLink
              href={item.href}
              linkPath={item.href}
              className="hover-gradient text-lg sm:text-base font-medium"
            >
              {item.label}
            </NavigationLink>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end" className="gap-4">
        <NavbarItem>
          {userId ? (
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "h-9 w-9",
                },
              }}
              userProfileMode="navigation"
              userProfileUrl="/user-profile"
            />
          ) : (
            <SignInButton>
              <Button className="font-medium hover-gradient">Sign In</Button>
            </SignInButton>
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.href}-${index}`}>
            <NavigationLink
              href={item.href}
              linkPath={item.href}
              className="w-full hover-gradient text-lg font-medium"
            >
              {item.label}
            </NavigationLink>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
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
