"use client" //change here

import SearchArea from './search-area'
import FilterDropdown from './filter-dialog'
import PhotographerResults from './photographer-results'

// changes start here
import {getPhotographers} from '@/utils/api2'
import { useEffect, useState } from 'react'
import { Photographer } from '@/utils/types'
type DiscoverPageProps = {
	photographyType: string;
  };
// changes end here

export default function DiscoverPage({ photographyType }: DiscoverPageProps) {

	// changes start here
	const [photographers, setPhotographers] = useState<Photographer[]>([]);

	useEffect(() => {
		const fetchPhotographers = async () => {
		  const fetchedPhotographers = await getPhotographers(photographyType);
		  setPhotographers(fetchedPhotographers);
		};
	
		fetchPhotographers();
	  }, [photographyType]);
	// changes end here

	return (
		<div className="bg-[#f4f4f4]">
			<div className="w-full border-b border-t border-gray-200 py-5 bg-white px-8 sm:px-20 shadow-sm">
				<SearchArea />
				<p className="pt-3 text-sm italic text-gray-600">
					Currently available in Boston, MA & Cambridge, MA areas
				</p>
			</div>
			{/* <div className="mt-2 flex justify-end">
				<FilterDropdown />
			</div> */}
			<PhotographerResults className="mt-6 px-8 sm:px-20 pb-5" photographers={photographers}/>
		</div>
	)
}
