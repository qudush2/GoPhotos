"use client";

import { useState, useEffect } from "react";
import {Link, Button} from "@nextui-org/react";
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
} from "@nextui-org/react";
import PayNowButton from "@/src/components/PayNowButton";
import { useUser } from "@clerk/nextjs";

type BookingsTableProps = {
  bookings: JobDetails[];
  initialSearchTerm: string;
  initialSortBy: "date" | "title";
  initialFilterStatus: string;
};

export default function BookingsTable({
  bookings,
  initialSearchTerm,
  initialSortBy,
  initialFilterStatus,
}: BookingsTableProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [filterStatus, setFilterStatus] = useState(initialFilterStatus);
  const router = useRouter();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (sortBy !== "date") params.set("sort", sortBy);
    if (filterStatus !== "all") params.set("status", filterStatus);

    router.push(`/bookings?${params.toString()}`, { scroll: false });
  }, [searchTerm, sortBy, filterStatus, router]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please sign in to view your bookings.</div>;
  }

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
    { key: "photographer", label: "Photographer" },
    { key: "job_price", label: "Price" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions" },
  ];

  const renderCell = (
    booking: JobDetails,
    columnKey: React.Key
  ): React.ReactNode => {
    const status = getJobStatus(booking);

    switch (columnKey) {
      case "event_title":
        return booking.photographer_created ? (
          <span>{booking.event_title}</span>
        ) : (
          <Link
            href={`/messages/${encodeURIComponent(booking.conversation_id)}`}
            className="text-blue-600 hover:underline"
          >
            {booking.event_title}
          </Link>
        );
      case "event_date":
        return formatDate(booking.event_date);
      case "loc":
        return booking.loc;
      case "photographer":
        console.log(booking);
        return booking.photographer_name;
      case "job_price":
        return booking.job_price ? `$${booking.job_price}` : "Pending";
      case "status":
        return (
          <span
            className={`px-2 py-1 rounded-full text-sm font-semibold ${getStatusStyle(
              status.color
            )}`}
          >
            {status.text}
          </span>
        );
      case "actions":
        if (booking.closed) {
          return booking.pictures_uploaded ? (
            <Link
              href={
                booking.picture_url || `/gallery/${booking.conversation_id}`
              }
              className="bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600"
            >
              View Gallery
            </Link>
          ) : (
            <span className="text-sm text-gray-600">Job Closed</span>
          );
        }
        return booking.pictures_uploaded ? (
          <Button
            href={booking.picture_url || `/gallery/${booking.conversation_id}`}
            className="bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600"
          >
            View Gallery
          </Button>
        ) : booking.paid ? (
          <span className="text-sm text-gray-600">Awaiting Photos</span>
        ) : booking.price_finalized ? (
          booking.mit_po ? (
            <Button
              onClick={async () => {
                const response = await fetch('/api/invoice', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ jobId: booking.conversation_id }),
                });

                if (response.ok) {
                  const blob = await response.blob();
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${booking.event_title}-invoice.pdf`;
                  a.click();
                  window.URL.revokeObjectURL(url);
                } else {
                  console.error('Failed to generate invoice');
                }
              }}
              className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
            >
              Download Invoice
            </Button>
          ) : (
            <PayNowButton
              jobDetails={booking}
              className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
            />
          )
        ) : (
          <span className="text-sm text-gray-600">Awaiting Quote</span>
        );
      default:
        return String(booking[columnKey as keyof typeof booking] || "");
    }
  };

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search bookings..."
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
            <option value="awaiting price">Awaiting Quote</option>
            <option value="awaiting payment">Awaiting Payment</option>
            <option value="awaiting upload">Awaiting Photos</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {bookings.length > 0 ? (
        <Table isStriped aria-label="Bookings table">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key} className="text-black">
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={bookings}>
            {(booking) => (
              <TableRow key={booking.conversation_id}>
                {(columnKey) => (
                  <TableCell>{renderCell(booking, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">
            No bookings found matching your search criteria.
          </p>
        </div>
      )}
    </>
  );
}
