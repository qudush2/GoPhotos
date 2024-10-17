export default function CreateJob({
  customerName,
  photographerName,
  eventTitle,
}: {
  customerName: string;
  photographerName: string;
  eventTitle: string;
}) {
  return (
    <>
      <p className="font-medium">Hi {customerName},</p>

      <p className="mt-2">
        {photographerName} has opened a job on GoPhotos for {eventTitle}. Log-in
        and head to the "Jobs" tab to continue to navigate your photographer
        booking process.
      </p>

      <p>
        <a href="https://www.gophotos.us/jobs">GoPhotos</a>
      </p>

      <p className="mt-2">Sincerely,</p>
      <p>GoPhotos</p>
    </>
  );
}
