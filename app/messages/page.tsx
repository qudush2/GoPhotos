import BookingCard from "@/components/booking-card";
import ChatInbox from './chat-inbox'

export default async function Messages() {
  return (
    <div className="px-20 mb-10 flex h-[80vh]">
      <div className="border-2 border-red-500 w-full">
        <ChatInbox/>
      </div>
      <BookingCard />
    </div>
  );
}
