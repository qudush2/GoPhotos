export default function PaymentConfirmedCustomer({
  customerName,
  photographerName,
  event_title,
}: {
  customerName: string;
  photographerName: string;
  event_title: string;
}) {
  return (
    <>
      <p className="font-medium">Hi {customerName.split(" ")[0]},</p>

      <p className="mt-2">
        Great news! Your payment for the {event_title} event with{" "}
        {photographerName} has been successfully processed and confirmed.
      </p>

      <p className="mt-2">
        Your booking is now officially confirmed. {photographerName} has been
        notified and will be ready for your event.
      </p>

      <p className="font-bold mt-2">
        Remember: The photographer will receive their payment after they've
        delivered your photos through the GoPhotos platform.
      </p>

      <p className="mt-2">
        You can view your booking details and communicate with your photographer
        through your{" "}
        <a href="https://www.gophotos.us/messages">GoPhotos dashboard</a>.
      </p>

      <p className="mt-2 italic">
        If you have any questions or need any assistance, please don't hesitate
        to reply to this email. We're here to help!
      </p>

      <p className="mt-2">Thank you for choosing GoPhotos!</p>
      <p>Best regards,</p>
      <p>The GoPhotos Team</p>
    </>
  );
}
