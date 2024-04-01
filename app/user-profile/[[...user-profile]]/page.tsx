import AccountProfile from "./AccountProfile";
import { currentUser } from "@clerk/nextjs";

export default async function Page() {
  const user = await currentUser();

  // if (
  //   user &&
  //   user.publicMetadata.isPhotographer &&
  //   !user.publicMetadata.hasStripeID
  // ) {
  //   StripeAccountSetup();
  // }

  return (
    <div className="px-20 pt-5 pb-10 flex justify-center">
      <AccountProfile />
    </div>
  );
}
