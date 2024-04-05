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

export default function BookingCard() {
  return (
    <Card className="border border-blue-500">
      <CardHeader className="flex gap-3">
        <Image
          alt="GoPhotos logo"
          height={30}
          radius="sm"
          src="./GoPhotos_logo_small.png"
          width={30}
        />
        <div className="flex ml-2">
          <p className="text-lg">Details</p>
          {/* <p className="text-small text-default-500">nextui.org</p> */}
        </div>
      </CardHeader>
      <Divider className="h-[1px] bg-black my-2" />
      <CardBody>
        <p>Make beautiful websites regardless of your design experience.</p>
        {/* <Image src='./images/photographer.JPG' height={30} className='w-full'/> */}
      </CardBody>
    </Card>
  );
}
