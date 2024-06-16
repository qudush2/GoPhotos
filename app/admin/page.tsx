import {getPhotographers, getAccount} from '@/utils/api'

export default async function AdminPage() {

    const photographers = await getPhotographers()

    const photographersWithAccount = await Promise.all(photographers.map(async (photographer) => {
        const account = await getAccount(photographer.accountId);
        return { ...photographer, account };
    }));

  return (
    <div className="bg-[#f4f4f4] py-20 px-8 sm:pb-7 sm:pt-7 sm:pl-20 ">
      This is the admin page
        <div>
            here are the photographers:
            <table className="table-auto w-full">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="px-4 py-2">Photographer Name</th>
                        <th className="px-4 py-2">Photographer Account ID</th>
                    </tr>
                </thead>
                <tbody>
                    {photographersWithAccount.map((photographer, index) => (
                        <tr key={index} className="bg-white">
                            <td className="border px-4 py-2">{photographer.account.fullName}</td>
                            <td className="border px-4 py-2">{photographer.accountId}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
}
