"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { JobDetails, Customer, getJobStatus } from "@/src/utils/types";
import { format } from "date-fns";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "@nextui-org/react";
import { Dialog, DialogClose, DialogContent } from "@radix-ui/react-dialog";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useUser } from "@clerk/nextjs";

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
  const [isCreateJobDialogOpen, setIsCreateJobDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { user, isLoaded } = useUser();

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (sortBy !== "date") params.set("sort", sortBy);
    if (filterStatus !== "all") params.set("status", filterStatus);

    router.push(`/jobs?${params.toString()}`, { scroll: false });
  }, [searchTerm, sortBy, filterStatus, router]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please sign in to view jobs.</div>;
  }

  const userID = user.id;

  const handleCloseJob = async (convoID: string) => {
    setClosingJobs((prev) => new Set(prev).add(convoID));
    try {
      const response = await fetch("/api/database-updates/close-job", {
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
      case "#E5E7EB":
        return "bg-gray-200 text-gray-800";
      case "#FEF08A":
        return "bg-yellow-200 text-yellow-800";
      case "#FED7AA":
        return "bg-orange-200 text-orange-800";
      case "#BFDBFE":
        return "bg-blue-200 text-blue-800";
      case "#BBF7D0":
        return "bg-green-200 text-green-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const columns = [
    { key: "event_title", label: "Event Title" },
    { key: "event_date", label: "Date" },
    { key: "loc", label: "Location" },
    { key: "customer", label: "Customer" },
    { key: "job_price", label: "Price" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions" },
  ];

  const renderCell = (
    job: JobDetails & { customer: Customer },
    columnKey: React.Key
  ): React.ReactNode => {
    const status = getJobStatus(job);

    switch (columnKey) {
      case "event_title":
        return job.photographer_created ? (
          <span>{job.event_title}</span>
        ) : (
          <Link
            href={`/messages/${encodeURIComponent(job.conversation_id)}`}
            className="text-blue-600 hover:underline"
          >
            {job.event_title}
          </Link>
        );
      case "event_date":
        return formatDate(job.event_date);
      case "loc":
        return job.loc;
      case "customer":
        return job.customer.full_name;
      case "job_price":
        return job.job_price != null && job.job_price !== undefined
          ? `$${job.job_price}`
          : "N/A";
      case "status":
        return (
          <span
            className={`px-2 py-1 rounded-full text-sm font-semibold ${getStatusStyle(status.color)}`}
          >
            {status.text}
          </span>
        );
      case "actions":
        return status.text === "Awaiting Upload" ? (
          <Link href={`/gallery/${encodeURIComponent(job.conversation_id)}`}>
            <button className="bg-blue-500 text-white px-2 py-1 rounded text-sm">
              Upload Gallery
            </button>
          </Link>
        ) : status.text === "Completed" ? (
          job.picture_url ? (
            <Link
              href={job.picture_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <button className="bg-green-500 text-white px-2 py-1 rounded text-sm">
                View Images
              </button>
            </Link>
          ) : (
            <Link href={`/gallery/${encodeURIComponent(job.conversation_id)}`}>
              <button className="bg-green-500 text-white px-2 py-1 rounded text-sm">
                View Gallery
              </button>
            </Link>
          )
        ) : job.closed &&
          (!job.pictures_uploaded || job.pictures_uploaded === null) ? (
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
            {closingJobs.has(job.conversation_id) ? "Closing..." : "Close Job"}
          </button>
        ) : (
          <button
            disabled
            className="bg-gray-300 text-gray-600 px-2 py-1 rounded text-sm cursor-not-allowed"
          >
            No Actions
          </button>
        );
      default:
        return String(job[columnKey as keyof typeof job] || "");
    }
  };

  const handleCreateJob = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/database-updates/create-job", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create job");
      }

      router.refresh();
      setIsCreateJobDialogOpen(false);
    } catch (error) {
      console.error("Error creating job:", error);
      alert("Failed to create job. Please try again.");
    } finally {
      setIsLoading(false);
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
          <Button
            className="mr-2 rounded-md text-white animated-gradient-button"
            onClick={() => setIsCreateJobDialogOpen(true)}
          >
            Create a Job
          </Button>
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

      {isCreateJobDialogOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          aria-hidden="true"
        />
      )}

      <Dialog
        open={isCreateJobDialogOpen}
        onOpenChange={setIsCreateJobDialogOpen}
      >
        <DialogContent className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 max-w-md w-full bg-white rounded-lg shadow-xl p-6">
          <div className="my-4">
            <h2 className="text-xl font-medium mb-4">Create a New Job</h2>
            <form onSubmit={handleCreateJob} className="space-y-4">
              <div>
                <label
                  htmlFor="customerName"
                  className="block text-sm font-medium"
                >
                  Client Name
                </label>
                <input
                  id="customerName"
                  name="customerName"
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="customerEmail"
                  className="block text-sm font-medium"
                >
                  Client Email
                </label>
                <input
                  id="customerEmail"
                  name="customerEmail"
                  type="email"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="eventTitle"
                  className="block text-sm font-medium"
                >
                  Event Title
                </label>
                <input
                  id="eventTitle"
                  name="eventTitle"
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="eventDate"
                  className="block text-sm font-medium"
                >
                  Event Date
                </label>
                <input
                  id="eventDate"
                  name="eventDate"
                  type="date"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium">
                  Price (please enter as a whole number)
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="eventDescription"
                  className="block text-sm font-medium"
                >
                  Event Description
                </label>
                <textarea
                  id="eventDescription"
                  name="eventDescription"
                  required
                  rows={4}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Client's Payment Method
                </label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="mit_po"
                      name="mit_po"
                      value="true"
                      required
                      className="h-4 w-4 border-gray-300 text-black focus:ring-black"
                    />
                    <label htmlFor="mit_po" className="ml-2 text-sm">
                      MIT Purchase Order
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="credit_card"
                      name="mit_po"
                      value="false"
                      className="h-4 w-4 border-gray-300 text-black focus:ring-black"
                    />
                    <label htmlFor="credit_card" className="ml-2 text-sm">
                      Online Credit Card Payment
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex justify-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                >
                  {isLoading ? "Creating..." : "Create Job"}
                </button>
              </div>
            </form>
          </div>
          <DialogClose
            autoFocus={false}
            className="absolute right-4 top-4 rounded-sm focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          >
            <XMarkIcon className="w-6 h-6" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogContent>
      </Dialog>

      {jobs.length > 0 ? (
        <Table isStriped aria-label="Jobs table">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key} className="text-black">
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={jobs}>
            {(job) => (
              <TableRow key={job.conversation_id}>
                {(columnKey) => (
                  <TableCell>{renderCell(job, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">
            No jobs found matching your search criteria.
          </p>
        </div>
      )}
    </>
  );
}
