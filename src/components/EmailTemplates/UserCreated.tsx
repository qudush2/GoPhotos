export default function UserCreated({
  customerName,
  photographerName,
  event_title,
  password,
}: {
  customerName: string;
  photographerName: string;
  event_title: string;
  password: string;
}) {
  return (
    <>
      <p className="font-medium">Hi {customerName},</p>

      <p className="mt-2">
        {photographerName} has invited you to use GoPhotos to manage{" "}
        {event_title}'s booking process, which includes payment and photo
        delivery.
      </p>

      <p className="mt-2">
        You will receive a seperate email with instructions on how to access the
        job, payment, and your pictures.
      </p>

      <p className="mt-2">
        As you do not have a GoPhotos account, use this password to log-in for
        the first time, then immediately change your password.
      </p>

      <p className="mt-2 italic">{password}</p>

      <p className="mt-2">Sincerely,</p>
      <p>GoPhotos</p>
    </>
  );
}
