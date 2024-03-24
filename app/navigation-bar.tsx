import Link from "next/link";
import { Navbar, NavbarContent, NavbarItem, Button } from "@nextui-org/react";
import gpLogo from "../public/GoPhotos_logo.png";
import Image from "next/image";
import { UserButton, auth } from "@clerk/nextjs";

export default function NavigationBar() {
  const { userId } = auth();

  return (
    <Navbar isBlurred className="sticky z-10 bg-white px-8 sm:px-20 py-7">
      <Link href="/" className="cursor-pointer">
        <Image src={gpLogo} alt="" width={150} height={800} />
      </Link>

      <NavbarContent className="sm:flex" justify="center">
        <NavbarItem>
          <Link
            href="/discover"
            className="hover-gradient text-lg sm:text-base font-medium mr-10 pr-10"
          >
            Discover
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        {/* <NavbarItem>
          {userId ? null : (
            <Button
              as={Link}
              color="primary"
              target="_blank"
              href="http://tinyurl.com/GP-Photographer"
              variant="flat"
              className="font-medium hover-gradient hidden sm:inline-block"
            >
              Become a Photographer
            </Button>
          )}
        </NavbarItem> */}
        <NavbarItem>
          {userId ? (
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonAvatarBox: "h-9 w-9",
                },
              }}
            />
          ) : (
            <Button
              href="/sign-in"
              as={Link}
              color="primary"
              variant="flat"
              className="font-medium hover-gradient hidden sm:inline-block"
            >
              Sign In{" "}
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
