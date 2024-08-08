export default function PaymentConfirmedPhotographer({
  photographerName,
  customerName,
  event_title,
}: {
  photographerName: string;
  customerName: string;
  event_title: string;
}) {
  return (
    <>
      <p className="font-medium">Hi {photographerName.split(" ")[0]},</p>

      <p className="mt-2">
        Great news! {customerName} has completed their payment for the{" "}
        {event_title} event.
      </p>

      <p className="mt-2">
        You can now proceed with the photoshoot as planned. Remember to deliver
        the photos through the GoPhotos platform after the event.
      </p>

      <p className="font-bold mt-2">
        Please note that your payment will be released after you've delivered
        the photos to the customer.
      </p>

      <p className="mt-2 italic">
        If you have any questions or concerns, feel free to reply to this email
        for direct assistance from GoPhotos.
      </p>

      <p className="mt-2">Best regards,</p>
      <p>GoPhotos Team</p>
    </>
  );
}
