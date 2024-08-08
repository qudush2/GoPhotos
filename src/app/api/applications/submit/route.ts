import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { createApplication } from "@/src/utils/db";
import { Resend } from "resend";
import NewApplication from "@/src/components/EmailTemplates/NewApplication";

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const email = user.emailAddresses[0].emailAddress;
    const firstName = formData.get("first_name") as string;
    const lastName = formData.get("last_name") as string;
    const full_name = `${firstName} ${lastName}`.trim();

    const clerk_id = user.id;
    const location = formData.get("location") as string;
    const price_low = parseInt(formData.get("price_low") as string);
    const price_high = parseInt(formData.get("price_high") as string);
    const school = formData.get("school") as string;
    const skills = formData.getAll("skills") as string[];
    const about = formData.get("about") as string;
    const hires = parseInt(formData.get("hires") as string);
    const other = (formData.get("other") as string) || null;

    await createApplication(
      email,
      full_name,
      clerk_id,
      location,
      price_low,
      price_high,
      school,
      skills,
      about,
      hires,
      other
    );

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "gigs@gophotos.us",
      to: email,
      bcc: "gigs@gophotos.us",
      subject: `GoPhotos - Photographer Application Received`,
      react: NewApplication({
        full_name,
        email,
        location,
        price_low,
        price_high,
        school,
        skills,
        about,
        hires,
        other,
      }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error submitting application:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}
