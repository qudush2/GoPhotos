import BookingCard from "@/app/messages/booking-card";
import ChatInbox from "./chat-inbox";

export default async function Messages() {
  return (
    <div className="px-20 mb-10 flex h-[80vh]">
      <div className="border-2 border-red-500 w-full h-full">
        <ChatInbox />
      </div>
    </div>
  );
}
// add a toast notification that says click conversation in messages panel to open full photographer access
