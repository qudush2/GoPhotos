export default function PaymentEmailCustomer({
  customerName,
  photographerName,
  photographerURL,
  event_title,
}: {
  customerName: string;
  photographerName: string;
  photographerURL: string;
  event_title: string;
}) {
  return (
    <>
      <p className="font-medium">Hi {customerName.split(" ")[0]},</p>

      <p className="mt-2">
        Congrats, you are almost done booking {photographerName} for{" "}
        {event_title}. To confirm the booking, please log onto{" "}
        <a href="https://www.gophotos.us">GoPhotos</a> and complete the payment
        process.
      </p>

      <p>
        Visit{" "}
        <a
          href={`https://www.gophotos.us/discover/${encodeURIComponent(photographerURL)}`}
        >
          {photographerName}'s profile
        </a>
      </p>

      <p className="font-bold">
        {" "}
        Please note that the photographer will not receive thier payment until
        after your pictures have been returned.{" "}
      </p>

      <p className="mt-2 italic">
        If you have any questions or concerns, feel free to reply to this email
        to get direct help from GoPhotos.
      </p>

      <p className="mt-2">Sincerely,</p>
      <p>GoPhotos</p>
    </>
  );
}
