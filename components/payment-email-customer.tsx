export default function PaymentEmailCustomer({
  customerName,
  photographerName,
  event_title,
  payment_url,
}: {
  customerName: string;
  photographerName: string;
  event_title: string;
  payment_url: string;
}) {
  return (
    <>
      <p className="font-medium">
				Hi {customerName},
			</p>
      
      <p className='mt-2'>
        Congrats, you are almost done booking {photographerName} for {event_title}. To confirm the booking, please complete the payment process <a href={`https://www.gophotos.us/discover/${encodeURIComponent(photographerName)}`}>here</a> or log into <a href='https://www.gophotos.us'>GoPhotos.</a>
      </p>

      <p>Visit <a href={`https://www.gophotos.us/discover/${encodeURIComponent(photographerName)}`}>{photographerName}'s profile</a></p>
      <p> <a href={payment_url}>Pay Now </a> to confirm your booking</p>
      
      <p className='mt-2 italic'>
        If you have any questions or concerns, feel free to reply to this email to get help from GoPhotos.
      </p>
      
      <p className="mt-2">Sincerely,</p>
      <p>GoPhotos</p>
    </>
  );
}