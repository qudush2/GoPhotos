export default function PicturesUploadedEmail({
  customerName,
  photographerName,
  event_title,
  picture_url,
}: {
  customerName: string;
  photographerName: string;
  event_title: string;
  picture_url: string;
}) {
  return (
    <>
      <p className="font-medium">Hi {customerName.split(" ")[0]},</p>

      <p className="mt-2">
        Your photos from {event_title} with {photographerName} have been
        uploaded.
      </p>

      <p>
        View your images here: <a href={picture_url}>{event_title}</a>
      </p>

      <p className="font-bold">
        {" "}
        Please reply to this email confirming you have received your images as
        expected. This will allow us to begin the payout process for{" "}
        {photographerName}. If we do not hear back within days, we will assume
        all images have been well recieved and close this job.
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
