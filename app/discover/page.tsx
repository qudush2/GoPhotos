import SearchArea from './search-area'
import FilterDropdown from './filter-dialog'
import PhotographerResults from './photographer-results'

export default function DiscoverPage() {
	return (
		<div className="bg-[#f4f4f4]">
			<div className="w-full border-b border-gray-200 bg-white px-20 pb-3 shadow-sm">
				<SearchArea />
				<p className="pt-3 text-sm italic text-gray-600">
					Currently available in Boston, MA & Cambridge, MA areas
				</p>
			</div>
			{/* <div className="mt-2 flex justify-end">
				<FilterDropdown />
			</div> */}
			<PhotographerResults className="mt-6 px-20 pb-5" />
		</div>
	)
}
