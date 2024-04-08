import BookingCardDefault from "@/app/messages/booking-card-default";
import ChatInbox from "./chat-inbox";

export default async function Messages() {
  return (
    <div className="md:px-20 md:mb-10 flex h-[80vh] overflow-auto">
      <div className="w-full h-full">
        <div className="md:px-20 md:mb-10 grid grid-cols-3 md:grid-cols-7 h-[80vh]">
          <div className="w-full h-full  col-span-2 md:col-span-5">
            <ChatInbox />
          </div>
          <div className=" col-span-1 md:col-span-2 h-full">
            <BookingCardDefault className="h-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
