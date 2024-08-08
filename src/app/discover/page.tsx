import SearchArea from "../../components/DiscoverPage/SearchArea";
import PhotographerResults from "../../components/DiscoverPage/PhotographerResults";

import { getAllPhotographers } from "@/src/utils/db";

type DiscoverPageProps = {
  searchParams: { photographyType?: string };
};

export default async function DiscoverPage({
  searchParams,
}: DiscoverPageProps) {
  const photographers = await getAllPhotographers(searchParams.photographyType);

  return (
    <div className="bg-[#f4f4f4]">
      <div className="w-full border-b border-gray-200 py-5 bg-white px-8 sm:px-20 shadow-sm">
        <SearchArea pgType={searchParams.photographyType} />
        <p className="pt-1 text-sm italic text-gray-600">
          Currently available in Boston, MA & Cambridge, MA areas
        </p>
      </div>
      <PhotographerResults
        className="mt-6 px-8 sm:px-20 pb-5"
        photographers={photographers}
        pgType={searchParams.photographyType as string}
      />
    </div>
  );
}
