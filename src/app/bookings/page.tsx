import { currentUser } from "@clerk/nextjs/server";
import {
  getAllCustomerBookingsFiltered,
  getAccountByClerkId,
} from "@/src/utils/db";
import BookingsTable from "@/src/components/BookingsPage/BookingsTable";
import Link from "next/link";

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = await currentUser();

  if (!user) {
    return (
      <div className="px-20 py-7">
        <h1 className="text-2xl font-bold mb-4">Your Bookings</h1>
        <p>Please sign in to view your bookings.</p>
      </div>
    );
  }

  const searchTerm =
    typeof searchParams.search === "string" ? searchParams.search : "";
  const sortBy = searchParams.sort === "title" ? "title" : "date";
  const filterStatus =
    typeof searchParams.status === "string" ? searchParams.status : "all";

  const bookings = await getAllCustomerBookingsFiltered(
    user.id,
    searchTerm,
    sortBy,
    filterStatus
  );

  if (!bookings || bookings.length === 0) {
    return (
      <div className="px-20 py-7">
        <h1 className="text-2xl font-bold mb-4">Your Bookings</h1>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">
            You don't have any bookings yet. Find a photographer to get started!
          </p>
          <Link
            href="/discover"
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Find a Photographer
          </Link>
        </div>
      </div>
    );
  }

  // Add photographer names to bookings
  const bookingsWithPhotographers = await Promise.all(
    bookings.map(async (booking) => {
      const photographer = await getAccountByClerkId(booking.photographer_clerk_id);
      return {
        ...booking,
        photographer_name: photographer.full_name,
      };
    })
  );

  return (
    <div className="px-20 py-7">
      <h1 className="text-2xl font-bold mb-4">Your Bookings</h1>
      <BookingsTable
        bookings={bookingsWithPhotographers}
        initialSearchTerm={searchTerm}
        initialSortBy={sortBy}
        initialFilterStatus={filterStatus}
      />
    </div>
  );
}