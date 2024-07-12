import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { email, photographerName } = await request.json();

  try {
    const { data, error } = await resend.emails.send({
      from: "GoPhotos <noreply@gophotos.us>",
      to: email,
      bcc: "gigs@gophotos.us",
      subject: `Check out ${photographerName}'s profile on GoPhotos`,
      html: `
        <h1>Hello!</h1>
        <p>Someone has shared a photographer's profile with you on GoPhotos.</p>
        <p>Click the link below to view ${photographerName}'s profile:</p>
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/discover/${encodeURIComponent(photographerName)}">
          View ${photographerName}'s Profile
        </a>
      `,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}