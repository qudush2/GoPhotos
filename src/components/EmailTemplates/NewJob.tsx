import React from "react";
import { Customer, JobDetails } from "@/src/utils/types";

export default function NewJob({
  customer,
  pgName,
  jobDetails,
}: {
  customer: Customer;
  pgName: string;
  jobDetails: JobDetails;
}) {
  return (
    <div className="font-sans">
      <h1 className="text-2xl font-bold mb-4">
        A new job has been requested on GoPhotos by {customer.full_name} for{" "}
        {pgName}
      </h1>
      <p className="mb-4">
        Job Information <br />
        <ul>
          <li>{jobDetails.event_title}</li>
          <li>{jobDetails.event_date}</li>
          <li>{jobDetails.description}</li>
        </ul>
      </p>
      <a href="https://www.gophotos.us/user-profile">Login Here</a>
    </div>
  );
}
