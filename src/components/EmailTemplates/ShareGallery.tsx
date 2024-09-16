export default function ShareGalleryEmail({
  customerName,
  event_title,
  picture_url,
}: {
  customerName: string;
  event_title: string;
  picture_url: string;
}) {
  return (
    <>
      <p className="font-medium">Hi,</p>

      <p className="mt-2">
        {customerName} is sharing photos from {event_title} with you.
      </p>

      <p>
        View the images here: <a href={picture_url}>{event_title}</a>
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
