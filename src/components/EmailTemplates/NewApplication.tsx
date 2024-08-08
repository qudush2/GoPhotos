import React from "react";

interface NewApplicationProps {
  full_name: string;
  email: string;
  location: string;
  price_low: number;
  price_high: number;
  school: string;
  skills: string[];
  about: string;
  hires: number;
  other: string | null;
}

export default function NewApplication({
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
}: NewApplicationProps) {
  return (
    <div className="font-sans">
      <h1 className="text-2xl font-bold mb-4">New Photographer Application</h1>
      <p className="mb-4">Your photographer application: {full_name}</p>
      <ul className="space-y-2">
        <li>
          <strong>Email:</strong> {email}
        </li>
        <li>
          <strong>Location:</strong> {location}
        </li>
        <li>
          <strong>Price Range:</strong> ${price_low} - ${price_high}
        </li>
        <li>
          <strong>School:</strong> {school}
        </li>
        <li>
          <strong>Skills:</strong> {skills.join(", ")}
        </li>
        <li>
          <strong>About:</strong> {about}
        </li>
        <li>
          <strong>Number of Hires:</strong> {hires}
        </li>
        <li>
          <strong>Other:</strong> {other}
        </li>
      </ul>
    </div>
  );
}
