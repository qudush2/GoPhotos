import { PlusIcon, XMarkIcon } from '@heroicons/react/20/solid'

import Tag from '@/components/tag'
import { ScrollArea, ScrollBar } from '@/components/scroll-area'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogOverlay,
	DialogTrigger,
} from '@/components/dialog'

import PhotographerProfile from './photographer-profile'
import Image from 'next/image'
import { Account, Photographer } from '@/utils/types'
import { getAccount, getAssets } from '@/utils/api'

type PhotographerPreviewCardProps = {
	photographer: Photographer
}

export default async function PhotographerPreviewCard({
	photographer,
}: PhotographerPreviewCardProps) {
	const account = await getAccount(photographer.accountId)
	const assets = await getAssets(photographer.accountId)

	return (
		<div className="my-2 grid gap-5 rounded-md bg-white py-5 md:grid-cols-[21rem_1fr] md:gap-0">
			<ScrollArea className="h-full w-full rounded-md md:col-start-2">
				<div className="flex w-max gap-1">
					{assets.slice(0, 7).map((asset, idx) => (
						<div
							key={idx}
							className="relative mr-1 aspect-[3/2] h-full w-48 flex-shrink-0 overflow-hidden rounded-md border border-black shadow-sm sm:w-60 md:w-80 lg:w-[28rem]"
							style={{
								position: 'relative',
							}}
						>
							<div
								className="absolute left-0 top-0 h-full w-full bg-cover bg-center"
								style={{
									backgroundImage: `url(${asset.cdnPath})`,
									filter: 'blur(20px)',
									zIndex: 0,
								}}
							/>
							<Image
								alt=""
								src={asset.cdnPath}
								placeholder="blur"
								blurDataURL={asset.placeholderBase64}
								fill
								style={{ objectFit: 'contain', zIndex: 1 }}
							/>
						</div>
					))}
					{assets.length > 7 && (
						<div className="relative mr-1 aspect-[3/2] h-full w-48 flex-shrink-0 overflow-hidden rounded-md border border-black shadow-sm sm:w-60 md:w-80 lg:w-[28rem]">
							<button className="text-md absolute left-1/2 top-1/2 z-20 m-2 -translate-x-1/2 -translate-y-1/2 transform rounded bg-white px-3 py-1 font-medium text-black shadow-md">
								View All
							</button>
							<div
								className="absolute left-0 top-0 h-full w-full bg-cover bg-center"
								style={{
									backgroundImage: `url(${assets[7].cdnPath})`,
									filter: 'blur(5px)', // Adjust the blur intensity as needed
								}}
							/>
						</div>
					)}
				</div>
				<ScrollBar orientation="horizontal" />
			</ScrollArea>

			{/* brief pg info section */}
			<div className="flex flex-col justify-between gap-2 rounded-md border border-gray-200 p-2 shadow-sm md:row-start-1">
				<div>
					<div className="flex items-center justify-between">
						<div className="flex w-full items-center gap-2">
							<div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300" />
							<div>
								<p className="text-sm font-medium">
									{account.fullName}
								</p>
								<p className="text-xs text-gray-600">
									{photographer.location}
								</p>
							</div>
						</div>
						<div className="whitespace-nowrap pt-2 text-right">
							<p className="text-xs text-gray-600">
								Est. Hourly Price
							</p>
							<p className="text-lg font-semibold">
								${photographer.estimatedHourlyPriceRange[0]} - $
								{photographer.estimatedHourlyPriceRange[1]}
							</p>
						</div>
					</div>
					<div className="mt-1 grid gap-1 sm:grid-cols-2 sm:grid-rows-1 md:grid-cols-1 md:grid-rows-[auto_auto]">
						<div className="sm:col-start-1 sm:row-start-1">
							<p className="mt-2 text-xs uppercase text-gray-600">
								About
							</p>
							<p className="line-clamp-2 text-sm md:line-clamp-3">
								{photographer.about}
							</p>
						</div>
						<div className="md:row-start-2">
							<p className="mt-2 text-xs uppercase text-gray-600">
								School
							</p>
							<p className="text-sm">{photographer.school}</p>
						</div>
						<div className="sm:col-start-2 sm:row-start-1 md:col-start-1 md:row-start-3">
							<p className="mt-2 text-xs uppercase text-gray-600">
								Skills
							</p>
							<div className="mt-0.5 flex flex-wrap gap-1">
								{photographer.skills.slice(0, 3).map(skill => (
									<Tag key={skill}>{skill}</Tag>
								))}
								{photographer.skills.length - 3 > 0 && (
									<Tag key={photographer.skills[0]}>
										<span className="flex items-center font-medium">
											<PlusIcon className="h-3 w-3" />
											{photographer.skills.length - 3}
										</span>
									</Tag>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Book Now button */}
				<div>
					<Dialog>
						<DialogTrigger className="mt-2 w-full rounded-md border border-gray-600 px-2 py-1 text-sm font-medium text-black">
							Book Now
						</DialogTrigger>
						<DialogOverlay>
							<div className="fixed left-0 top-0 z-10 h-screen w-screen bg-black opacity-20" />
							<DialogContent className="fixed left-0 top-0 z-30 h-full w-full overflow-y-auto bg-white p-4 sm:left-1/2 sm:top-1/2 sm:h-[90%] sm:w-[90%] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-md lg:w-2/3">
								<div className="mt-7">
									<PhotographerProfile
										photographer={photographer}
										account={account}
										assets={assets}
									/>
								</div>
								<DialogClose
									autoFocus={false}
									className="absolute right-4 top-4 rounded-sm focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
								>
									<XMarkIcon className="h-5 w-5" />
									<span className="sr-only">Close</span>
								</DialogClose>
							</DialogContent>
						</DialogOverlay>
					</Dialog>
				</div>
			</div>
		</div>
	)
}
