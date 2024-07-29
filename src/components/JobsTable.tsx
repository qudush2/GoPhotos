"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { JobDetails, Customer, getJobStatus } from "@/src/utils/types";
import { format } from "date-fns";

type JobsTableProps = {
  jobs: (JobDetails & { customer: Customer })[];
  initialSearchTerm: string;
  initialSortBy: "date" | "title";
  initialFilterStatus: string;
};

export default function JobsTable({
  jobs,
  initialSearchTerm,
  initialSortBy,
  initialFilterStatus,
}: JobsTableProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [filterStatus, setFilterStatus] = useState(initialFilterStatus);
  const router = useRouter();
  const [closingJobs, setClosingJobs] = useState<Set<string>>(new Set());

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (sortBy !== "date") params.set("sort", sortBy);
    if (filterStatus !== "all") params.set("status", filterStatus);

    router.push(`/jobs?${params.toString()}`, { scroll: false });
  }, [searchTerm, sortBy, filterStatus, router]);

  const handleCloseJob = async (convoID: string) => {
    setClosingJobs((prev) => new Set(prev).add(convoID));
    try {
      const response = await fetch("/api/jobs/close", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ convoID }),
      });

      if (!response.ok) {
        throw new Error("Failed to close job");
      }

      // Refresh the page to show updated job status
      router.refresh();
    } catch (error) {
      console.error("Error closing job:", error);
      alert("Failed to close job. Please try again.");
    } finally {
      setClosingJobs((prev) => {
        const newSet = new Set(prev);
        newSet.delete(convoID);
        return newSet;
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM. d, yyyy");
  };

  const getStatusStyle = (color: string) => {
    switch (color) {
      case "#E5E7EB": return "bg-gray-200 text-gray-800";
      case "#FEF08A": return "bg-yellow-200 text-yellow-800";
      case "#FED7AA": return "bg-orange-200 text-orange-800";
      case "#BFDBFE": return "bg-blue-200 text-blue-800";
      case "#BBF7D0": return "bg-green-200 text-green-800";
      default: return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search jobs..."
          className="p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div>
          <select
            className="p-2 border rounded mr-2 w-40"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "date" | "title")}
          >
            <option value="date">Sort by Date</option>
            <option value="title">Sort by Title</option>
          </select>
          <select
            className="p-2 border rounded"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="awaiting price">Awaiting Price</option>
            <option value="awaiting payment">Awaiting Payment</option>
            <option value="awaiting upload">Awaiting Upload</option>
            <option value="completed">Completed</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="border border-black rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left border-b">Event Title</th>
              <th className="p-2 text-left border-b">Date</th>
              <th className="p-2 text-left border-b">Location</th>
              <th className="p-2 text-left border-b">Customer</th>
              <th className="p-2 text-left border-b">Price</th>
              <th className="p-2 text-left border-b">Status</th>
              <th className="p-2 text-left border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => {
              const status = getJobStatus(job);
              const statusStyle = getStatusStyle(status.color);
              return (
                <tr
                  key={job.conversation_id}
                  className="border-b last:border-b-0"
                >
                  <td className="p-2">
                    <Link
                      href={`/messages/${encodeURIComponent(job.conversation_id)}`}
                      className="text-blue-600 hover:underline"
                    >
                      {job.event_title}
                    </Link>
                  </td>
                  <td className="p-2">{formatDate(job.event_date)}</td>
                  <td className="p-2">{job.loc}</td>
                  <td className="p-2">{job.customer.full_name}</td>
                  <td className="p-2">
                    {job.job_price != null && job.job_price !== undefined
                      ? `$${job.job_price}`
                      : "N/A"}
                  </td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-semibold ${statusStyle}`}
                    >
                      {status.text}
                    </span>
                  </td>
                  <td className="p-2">
                    {status.text === "Awaiting Upload" ? (
                      <Link
                        href={`/gallery/${encodeURIComponent(job.conversation_id)}`}
                      >
                        <button className="bg-blue-500 text-white px-2 py-1 rounded text-sm">
                          Upload Gallery
                        </button>
                      </Link>
                    ) : status.text === "Completed" ? (
                      <Link
                        href={`/gallery/${encodeURIComponent(job.conversation_id)}`}
                      >
                        <button className="bg-green-500 text-white px-2 py-1 rounded text-sm">
                          View Gallery
                        </button>
                      </Link>
                    ) : job.closed &&
                      (!job.pictures_uploaded ||
                        job.pictures_uploaded === null) ? (
                      <button
                        disabled
                        className="bg-gray-500 text-white px-2 py-1 rounded text-sm opacity-50 cursor-not-allowed"
                      >
                        Job Closed
                      </button>
                    ) : !job.price_finalized ? (
                      <button
                        onClick={() => handleCloseJob(job.conversation_id)}
                        disabled={closingJobs.has(job.conversation_id)}
                        className={`bg-red-500 text-white px-2 py-1 rounded text-sm ${
                          closingJobs.has(job.conversation_id)
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-red-600"
                        }`}
                      >
                        {closingJobs.has(job.conversation_id)
                          ? "Closing..."
                          : "Close Job"}
                      </button>
                    ) : (
                      <button
                        disabled
                        className="bg-gray-300 text-gray-600 px-2 py-1 rounded text-sm cursor-not-allowed"
                      >
                        No Actions
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}