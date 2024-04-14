import BookingCardDefault from "@/components/booking-card-default";
import ChatInbox from "./chat-inbox";

export default async function Messages() {
  return (
    <div className="flex h-[80vh] overflow-auto px-7 sm:px-20 sm:mb-10">
      <div
        className="grid grid-cols-3 w-full h-full
        xl:grid-cols-7"
      >
        <div
          className="col-span-3 
          xl:col-span-5"
        >
          <ChatInbox />
        </div>

        <div
          className="hidden 
          xl:block xl:col-span-2"
        >
          <BookingCardDefault className="h-full" />
        </div>
      </div>
    </div>
  );
}
