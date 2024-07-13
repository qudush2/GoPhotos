import {
  getAllAccounts,
  getJobDetails,
  getAccountByPhotographerId,
  getAllJobIDs,
} from "@/src/utils/db";
import { currentUser } from "@clerk/nextjs";
import { CopyEmailsButton } from "./copy-email";

export default async function AdminPage() {
  const user = await currentUser();

  if (!user?.publicMetadata.admin) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative py-20 px-8 sm:pb-7 sm:pt-7 sm:pl-20"
        role="alert"
      >
        <strong className="font-bold">Access Denied!</strong> <br />
        <span className="block sm:inline">
          Sorry, you can't access this page.
        </span>
      </div>
    );
  }

  const accounts = await getAllAccounts();
  const jobIDs = await getAllJobIDs();
  const jobDetails = await Promise.all(
    jobIDs.map((conversation_id) =>
      getJobDetails(conversation_id.conversation_id)
    )
  );

  const jobCountByPhotographerClerkID = jobDetails.reduce(
    (acc: { [key: string]: number }, job) => {
      const clerkID = job.photographer_clerk_id;
      acc[clerkID] = (acc[clerkID] || 0) + 1;
      return acc;
    },
    {}
  );

  const accountsWithPhotographer = await Promise.all(
    accounts.map(async (account) => {
      const photographer = await getAccountByPhotographerId(account.id);
      const jobCount = jobCountByPhotographerClerkID[account.clerk_id] || 0;
      return { ...account, photographer, jobCount };
    })
  );

  accountsWithPhotographer.sort((a, b) => b.jobCount - a.jobCount);

  return (
    <div className="bg-[#f4f4f4] py-20 px-8 sm:pb-7 sm:pt-7 sm:pl-20 ">
      This is the admin data page
      <div>
        here are the photographers:
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">
                <span className="inline-flex items-center">
                  Email
                  <CopyEmailsButton
                    emails={accountsWithPhotographer.map(
                      (account) => account.email
                    )}
                  />
                </span>
              </th>
              <th className="px-4 py-2">Clerk ID</th>
              <th className="px-4 py-2"># of Jobs Contacted For</th>
            </tr>
          </thead>
          <tbody>
            {accountsWithPhotographer.map((account, index) => (
              <tr key={index} className="bg-white">
                <td className="border px-4 py-2">{account.full_name}</td>
                <td className="border px-4 py-2">{account.email}</td>
                <td className="border px-4 py-2">
                  {account.clerk_id || "No Clerk ID set"}
                </td>
                <td className="border px-4 py-2">{account.jobCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
