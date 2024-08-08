import { currentUser } from "@clerk/nextjs/server";
import { isPGClerk, applicationSubmitted } from "@/src/utils/db";
import { SKILLS } from "@/src/utils/fetchImages";
import { redirect } from "next/navigation";
import ApplicationForm from "../../components/ApplyPage/ApplicationForm";

export default async function Apply() {
  const user = await currentUser();

  if (await isPGClerk(user!.id)) {
    redirect("/user-profile");
  }

  if (await applicationSubmitted(user!.id)) {
    return (
      <div className="px-20 py-7">
        <h1 className="text-2xl font-bold mb-6">Application Status</h1>
        <p>
          Your application is currently under review and we will let you know
          soon.
        </p>
        <p>
          If you have any questions, please email{" "}
          <a
            href="mailto:gigs@gophotos.us"
            className="text-blue-500 hover:text-blue-700"
          >
            gigs@gophotos.us
          </a>
        </p>
      </div>
    );
  }

  const firstName = user!.firstName!;
  const lastName = user!.lastName!;
  const email = user!.emailAddresses[0].emailAddress;

  return (
    <div className="px-20 py-7">
      <h1 className="text-2xl font-bold mb-6">Photographer Application</h1>
      <ApplicationForm
        firstName={firstName}
        lastName={lastName}
        email={email}
        skills={SKILLS}
        clerkID={user!.id}
      />
    </div>
  );
}
