import { Button, Link } from "@nextui-org/react";

type CustomerLPInfo = {
  header: string;
  text: string;
  buttonTitle: string;
  buttonLink: string;
};

export default function LeftColumn({
  LPInfo,
}: {
  LPInfo: CustomerLPInfo;
}) {
  const { header, text, buttonTitle, buttonLink } = LPInfo;

  return (
    <div className="h-full flex flex-col justify-center">
      <p className="mb-3">
        <span className="bg-gradient-to-r from-[#FF9993] via-[#FC7674] to-[#FC4D74] bg-clip-text text-transparent font-bold">
          GoPhotos
        </span>
      </p>
      <h2 className="font-playfair lg:text-5xl text-4xl mb-7 leading-[1.2]">
        {header}
      </h2>
      <p className="text-xl text-gray-500 font-sans mb-7">{text}</p>
      <Button
        as={Link}
        href={buttonLink}
        className="w-1/2 h-10 rounded-md text-base text-white animated-gradient-button"
      >
        {buttonTitle}
      </Button>
    </div>
  );
}
