"use client";
import { UserProfile, useUser, useAuth } from "@clerk/nextjs";

export default function AccountProfile() {
  const { user } = useUser();
  const isPhotographer: boolean = user?.publicMetadata.isPhotographer as boolean;

  return (
    <UserProfile path="/user-profile" routing="path">
      {/* <UserProfile.Page label="About" labelIcon={<DotIcon />} url="about">
        <div>
          <h1>Update your about section</h1>
          <button type="submit">Submit</button>
          {isPhotographer && <PhotographerSection />}

          {!isPhotographer && <CustomerSection />}
        </div>
      </UserProfile.Page> */}
    </UserProfile>
  );
}

const DotIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="currentColor"
    >
      <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" />
    </svg>
  );
};

// export function PhotographerSection() {
//   return (
//     <div>
//       <h1>Photographer Section</h1>
//       this is a section only visible by photographers
//     </div>
//   );
// }

// export function CustomerSection() {
//   return (
//     <div>
//       <h1>Customer Section</h1>
//       this is a section only visible by customers
//     </div>
//   );
// }
