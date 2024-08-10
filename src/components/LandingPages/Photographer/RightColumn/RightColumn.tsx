import ImageCarousel from "@/src/components/LandingPages/Customer/ImageCarousel";
import { LandingPageImage } from "@/src/utils/types";
import {
  Steps,
  GoPhotosSteps,
} from "@/src/components/LandingPages/Photographer/RightColumn/Steps";

export default function RightColumn({
  LPImages,
}: {
  LPImages: LandingPageImage[];
}) {
  return (
    <div className="space-y-[15vh] pb-20">
      <div className="py-14">
        <ImageCarousel LPImages={LPImages} />
      </div>
      <div className="space-y-[15vh]">
        {GoPhotosSteps.map((step, index) => (
          <Steps key={index} {...step} />
        ))}
      </div>
    </div>
  );
}
