"use client";
import { UserProfile, useUser } from "@clerk/nextjs";
import Tag from "@/src/components/Tag";

export default function AccountProfile() {
  const { user } = useUser();
  const isPhotographer: boolean = user?.publicMetadata
    .isPhotographer as boolean;
  const about = user?.publicMetadata.about as string;
  const location = user?.publicMetadata.location as string;
  const hourlyPriceLow = user?.publicMetadata.hourlyPriceLow as number;
  const hourlyPriceHigh = user?.publicMetadata.hourlyPriceHigh as number;
  const school = user?.publicMetadata.school as string;
  const skills = user?.publicMetadata.skills as Array<string>;
  const hires = user?.publicMetadata.hires as number;

  if (user && !isPhotographer) {
    return <UserProfile path="/user-profile" routing="path" />;
  }

  if (user && isPhotographer) {
    return (
      <UserProfile path="/user-profile" routing="path">
        <UserProfile.Page
          label="Profile Page"
          labelIcon={<DotIcon />}
          url="profile-page"
        >
          <div>
            <p className="text-xl">About</p>
            <hr className="my-2 border-gray-300" />
            <p className="text-sm">{about}</p>
          </div>
          <div>
            <p className="text-xl mt-10">Location</p>
            <hr className="my-2 border-gray-300" />
            <p className="text-sm">{location}</p>
          </div>
          <div>
            <p className="text-xl mt-10">School</p>
            <hr className="my-2 border-gray-300" />
            <p className="text-sm">{school}</p>
          </div>
          <div>
            <p className="text-xl mt-10">Hourly Price Range</p>
            <hr className="my-2 border-gray-300" />
            <p className="text-sm">
              ${hourlyPriceLow} - ${hourlyPriceHigh}
            </p>
          </div>
          <div>
            <p className="text-xl mt-10">Hires</p>
            <hr className="my-2 border-gray-300" />
            <p className="text-sm">{hires}</p>
          </div>
          <div>
            <p className="text-xl mt-10">Skills</p>
            <hr className="my-2 border-gray-300" />
            <div className="flex flex-wrap gap-1">
              {skills.map((skill) => (
                <Tag key={skill}>{skill}</Tag>
              ))}
            </div>
          </div>
        </UserProfile.Page>

        <UserProfile.Page
          label="Stripe Dashbord"
          labelIcon={<MoneyIcon />}
          url="stripe-dashboard"
        >
          {!user.publicMetadata.hasStripeID ? (
            <>
              hi, please complete the setup of your stripe account to begin
              receiving payments and manage your completed jobs
              <form
                action="/api/stripe/stripe-account-setup"
                className="border-2 border-black p-2 my-5 bg-[#FC7674] flex justify-center text-white"
                method="POST"
              >
                <button type="submit">Set up Stripe Account</button>
              </form>
            </>
          ) : (
            <>
              {" "}
              hi, you will be able to see your updated expected payout within a
              couple days of completing a job.
              <form
                action="/api/stripe/stripe-account-setup"
                className="border-2 border-black p-2 my-5 bg-[#FC7674] flex justify-center text-white"
                method="POST"
                target="_blank"
              >
                <button type="submit">Manage Account</button>
              </form>
            </>
          )}
          <p className="font-medium">
            {" "}
            Sorry for the appearance of this page, we will soon fix this!
          </p>
        </UserProfile.Page>
      </UserProfile>
    );
  }
}

const DotIcon = () => {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_1222_37671)">
        <path
          d="M5 12.2401L0.5 13.5001L1.76 9.00014L10 0.800143C10.0931 0.704897 10.2044 0.629218 10.3271 0.577551C10.4499 0.525883 10.5818 0.499268 10.715 0.499268C10.8482 0.499268 10.9801 0.525883 11.1029 0.577551C11.2256 0.629218 11.3369 0.704897 11.43 0.800143L13.2 2.58014C13.2937 2.6731 13.3681 2.78371 13.4189 2.90556C13.4697 3.02742 13.4958 3.15813 13.4958 3.29014C13.4958 3.42215 13.4697 3.55286 13.4189 3.67472C13.3681 3.79658 13.2937 3.90718 13.2 4.00014L5 12.2401Z"
          stroke="black"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_1222_37671">
          <rect width="14" height="14" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

const MoneyIcon = () => {
  return (
    <svg
      width="28"
      height="28"
      viewBox="13 10 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M37.7856 19.4069C33.0007 17.7976 22.5007 16.2849 21.7467 22.633C20.3446 34.4367 41.4303 26.8644 38.7803 37.6879C37.2883 43.7815 24.855 42.2282 21.0007 40.197"
        stroke="black"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M30.0006 12V18M30.0006 42V48"
        stroke="black"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
