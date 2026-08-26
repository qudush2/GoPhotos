import ViewSwitch from "@/src/components/LandingPages/ViewSwitch";
import { getAccountsByClerkIds, getLandingPageImages } from "@/src/utils/db";
import { LandingPageImage, PhotographerAccount } from "@/src/utils/types";

export default async function LandingPage() {
  const LPImages = await getLandingPageImages();

  // Resolve every photographer in one query. Looking each one up individually
  // cost 1 + N queries (and 1 + N pool connections, which the pool caps at 10),
  // so the landing page could not start streaming until all of them returned.
  const clerkIds = Array.from(
    new Set(LPImages.map((image: LandingPageImage) => image.clerk_id))
  );
  const accounts = await getAccountsByClerkIds(clerkIds);
  const accountsByClerkId = new Map<string, PhotographerAccount>(
    accounts.map((account) => [account.clerk_id, account])
  );

  const LPImagesWithAccount: LandingPageImage[] = LPImages.map(
    (image: LandingPageImage) => ({
      ...image,
      // A clerk_id with no photographer_account row yields no account here,
      // matching what getAccountByClerkId returned for the same case.
      account: accountsByClerkId.get(image.clerk_id)!,
    })
  );

  return (
    <div>
      <ViewSwitch LPImages={LPImagesWithAccount} />
    </div>
  );
}
