import ImageCarousel from "@/src/components/LandingPages/Customer/ImageCarousel";
import { LandingPageImage } from "@/src/utils/types";

export default function RightColumn({
  LPImages,
}: {
  LPImages: LandingPageImage[];
}) {
  return (
    <div className="min-h-[200vh]">
      <ImageCarousel LPImages={LPImages} />
    </div>
  );
}
