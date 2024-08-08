import React from "react";

export default function ApplicationApproved() {
  return (
    <div className="font-sans">
      <h1 className="text-2xl font-bold mb-4">
        Your photographer application has been approved!
      </h1>
      <p className="mb-4">
        Login to your account now to complete setting up your profile.{" "}
      </p>
      <a href="https://www.gophotos.us/user-profile">Login Here</a>
    </div>
  );
}
