"use client";
import { UserProfile, useUser } from "@clerk/nextjs";
import Tag from "@/components/tag";

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
  console.log(user?.publicMetadata.hires)

  return (
    <UserProfile path="/user-profile" routing="path">
      {user && isPhotographer && (
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
      )}
    </UserProfile>
  );
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
      <g clip-path="url(#clip0_1222_37671)">
        <path
          d="M5 12.2401L0.5 13.5001L1.76 9.00014L10 0.800143C10.0931 0.704897 10.2044 0.629218 10.3271 0.577551C10.4499 0.525883 10.5818 0.499268 10.715 0.499268C10.8482 0.499268 10.9801 0.525883 11.1029 0.577551C11.2256 0.629218 11.3369 0.704897 11.43 0.800143L13.2 2.58014C13.2937 2.6731 13.3681 2.78371 13.4189 2.90556C13.4697 3.02742 13.4958 3.15813 13.4958 3.29014C13.4958 3.42215 13.4697 3.55286 13.4189 3.67472C13.3681 3.79658 13.2937 3.90718 13.2 4.00014L5 12.2401Z"
          stroke="black"
          stroke-linecap="round"
          stroke-linejoin="round"
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
