'use client'
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Image,
  Link,
  Button,
} from "@nextui-org/react";

export default function BookingCardDefault({
  className,
}: {
  className?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex gap-3">
        <div className="flex ml-2">
          <p className="text-lg">Booking Details</p>
        </div>
      </CardHeader>
      <Divider className="h-[1px] bg-black my-2" />
      <CardBody>
        <p>
          Select a conversation in the Messages panel to view your booking
          details. (If you can not see your booking details, try clicking the
          message again or reloading the page)
        </p>
        <br />
        <p>
          If you have not yet reached out to a photographer, go to the{" "}
          <Link
            href="/discover?photographyType=Portrait"
            className="text-blue-500 hover:underline"
          >
            discover page
          </Link>{" "}
          to find your next photographer!
        </p>
      </CardBody>
    </Card>
  );
}
