import ViewSwitch from "@/src/components/LandingPages/ViewSwitch";
import { getAccountByClerkId, getLandingPageImages } from "@/src/utils/db";
import { LandingPageImage } from "@/src/utils/types";

export default async function LandingPage() {
  const LPImages = await getLandingPageImages();

  const LPImagesWithAccount: LandingPageImage[] = await Promise.all(
    LPImages.map(async (image: LandingPageImage) => {
      const account = await getAccountByClerkId(image.clerk_id);
      return { ...image, account };
    })
  );

  return (
    <div>
      <ViewSwitch LPImages={LPImagesWithAccount} />
    </div>
  );
}
