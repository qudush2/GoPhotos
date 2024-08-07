import AccountProfile from "./AccountProfile";
import { currentUser } from "@clerk/nextjs/server";
import { isPGClerk, getAccountByClerkId } from "@/src/utils/db";
import { PhotographerAccount } from "@/src/utils/types";

export default async function Page() {
  const user = await currentUser();
  const isPhotographer = await isPGClerk(user!.id);
  let photographerAccount: PhotographerAccount | null = null;

  if (isPhotographer) {
    photographerAccount = await getAccountByClerkId(user!.id);
  }

  return (
    <div className="px-20 pt-5 pb-10 flex justify-center">
      <AccountProfile
        photographerAccount={photographerAccount}
        isPhotographer={isPhotographer}
      />
    </div>
  );
}
