import { currentUser } from "@clerk/nextjs/server";
import {
  getAllPhotographerJobsFiltered,
  getCustomerInfo,
  isPGClerk,
} from "@/src/utils/db";
import JobsTable from "@/src/components/JobsTable";
import { notFound } from "next/navigation";

export default async function Jobs({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = await currentUser();

  if (!(await isPGClerk(user!.id))) {
    notFound();
  }

  const searchTerm =
    typeof searchParams.search === "string" ? searchParams.search : "";
  const sortBy = searchParams.sort === "title" ? "title" : "date";
  const filterStatus =
    typeof searchParams.status === "string" ? searchParams.status : "all";

  const jobs = await getAllPhotographerJobsFiltered(
    user!.id,
    searchTerm,
    sortBy,
    filterStatus
  );

  if (!jobs) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">
          You don't have any jobs yet. Create a new job to get started!
        </p>
      </div>
    );
  }

  const jobsWithCustomers = await Promise.all(
    jobs.map(async (job) => {
      const customer = await getCustomerInfo(job.customer_clerk_id);
      return { ...job, customer };
    })
  );

  return (
    <div className="px-20 py-7">
      <h1 className="text-2xl font-bold mb-4">Your Jobs</h1>
      <JobsTable
        jobs={jobsWithCustomers}
        initialSearchTerm={searchTerm}
        initialSortBy={sortBy}
        initialFilterStatus={filterStatus}
      />
    </div>
  );
}
