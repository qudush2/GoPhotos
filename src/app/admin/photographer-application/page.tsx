import Link from "next/link";
import { getAllApplications } from "@/src/utils/db";

export default async function PhotographerApplications() {
  const applications = await getAllApplications();

  if (!applications || applications.length === 0) {
    return (
      <div className="px-20 py-7">
        <h1 className="text-2xl font-bold mb-6">Photographer Applications</h1>
        <p>There are no photographer applications to review</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Photographer Applications</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Location</th>
              <th className="px-4 py-2 text-left">Price Range</th>
              <th className="px-4 py-2 text-left">School</th>
              <th className="px-4 py-2 text-left">Skills</th>
              <th className="px-4 py-2 text-left">Hires</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.clerk_id} className="even:bg-gray-50 odd:bg-white">
                <td className="px-4 py-2">{`${app.full_name}`}</td>
                <td className="px-4 py-2">{app.email}</td>
                <td className="px-4 py-2">{app.location}</td>
                <td className="px-4 py-2">
                  ${app.price_low} - ${app.price_high}
                </td>
                <td className="px-4 py-2">{app.school}</td>
                <td className="px-4 py-2">{app.skills.join(", ")}</td>
                <td className="px-4 py-2">{app.hires}</td>
                <td className="px-4 py-2">
                  <Link
                    href={`/admin/photographer-application/${app.clerk_id}`}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 inline-block"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
