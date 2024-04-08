import BookingCardDefault from "@/app/messages/booking-card-default";
import ChatInbox from "./chat-inbox";

export default async function Messages() {
  return (
    <div className="px-20 mb-10 flex h-[80vh]">
      <div className="border-2 border-red-500 w-full h-full">
        <div className="px-20 mb-10 grid grid-cols-7 h-[80vh]">
          <div className="border-2 border-red-500 w-full h-full col-span-5">
            <ChatInbox />
          </div>
          <div className="col-span-2 h-full">
            <BookingCardDefault className="border border-blue-500 h-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
