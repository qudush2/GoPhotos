import { Button } from "@nextui-org/react";

export default function LeftColumn() {
  return (
    <div className="h-full flex flex-col justify-center">
      <p className="mb-3">
        <span className="bg-gradient-to-r from-[#FF9993] via-[#FC7674] to-[#FC4D74] bg-clip-text text-transparent font-bold">
          GoPhotos
        </span>
      </p>
      <h2 className="font-playfair lg:text-5xl text-4xl mb-7 leading-[1.2]">
        Find your perfect <br />
        photographer
      </h2>
      <p className="text-xl text-gray-500 font-sans mb-7">
        From discovery to final delivery, manage the entire process in one
        seamless location.
      </p>
      <Button className="w-1/2 h-10 rounded-md text-base text-white animated-gradient-button">
        Discover
      </Button>
    </div>
  );
}
