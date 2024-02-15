'use client'

import { ReactNode, useEffect, useState } from 'react'

import { AdjustmentsVerticalIcon, XMarkIcon } from '@heroicons/react/24/outline'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogOverlay,
	DialogTitle,
	DialogTrigger,
} from '@radix-ui/react-dialog'
import { Drawer } from 'vaul'
import {
	Slider,
	SliderRange,
	SliderThumb,
	SliderTrack,
} from '@radix-ui/react-slider'
import { useMediaQuery } from '@/hooks/use-media-query'
import { cn } from '@/utils/cn'
import { ScrollArea, ScrollBar } from '@/components/scroll-area'

export default function FilterDialog() {
	const [isOpen, setIsOpen] = useState(false)
	const isDesktop = useMediaQuery('(min-width: 768px)')
	if (isDesktop) {
		return (
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogTrigger className="flex items-center gap-1 rounded-md border border-black px-2 py-1 text-sm font-medium">
					<AdjustmentsVerticalIcon className="h-4 w-4" />
					Filter
				</DialogTrigger>
				<DialogOverlay>
					<div className="fixed left-0 top-0 z-10 h-screen w-screen bg-black opacity-20" />
					<DialogContent className="fixed z-20 h-full w-full overflow-y-auto bg-white p-4 sm:left-1/2 sm:top-1/2 sm:h-min sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-md">
						<div className="mt-7">
							<FilterDialogContent />
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
		)
	}

	return (
		<Drawer.Root
			open={isOpen}
			onOpenChange={setIsOpen}
			shouldScaleBackground
		>
			<Drawer.Trigger className="flex items-center gap-1 rounded-md border border-black px-2 py-1 text-sm font-medium">
				<AdjustmentsVerticalIcon className="h-4 w-4" />
				Filter
			</Drawer.Trigger>
			<Drawer.Portal>
				<div className="fixed inset-0 z-10 bg-black/40" />
				<Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto w-full flex-col rounded-t-md border bg-white">
					<div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-gray-200" />
					<FilterDialogContent className="px-3" />
				</Drawer.Content>
			</Drawer.Portal>
		</Drawer.Root>
	)
}

function FilterDialogContent({ className }: { className?: string }) {
	const [priceRange, setPriceRange] = useState([0, 500])

	return (
		<div className={cn('mb-3', className)}>
			<DialogTitle className="text-lg font-medium">Filters</DialogTitle>
			<h3 className="text-sm font-medium">Schools</h3>
			<BadgeGroup
				className="w-full overflow-x-auto"
				items={[
					'Massachusetts Institute of Technology',
					'Boston University',
					'University of San Francisco',
					'University of Southern California',
				]}
			/>
			<h3 className="mt-2 text-sm font-medium">Skills</h3>
			<BadgeGroup
				className="w-full overflow-x-auto"
				items={[
					'Portrait',
					'Candid',
					'University / Corporate',
					'Sports',
					'Journalism',
					'Graduation',
					'Headshots',
					'Concert',
					'Fashion',
					'Outdoor',
					'Videography',
				]}
			/>
			<h3 className="mt-2 text-sm font-medium">Price</h3>
			<div>
				<Slider
					min={0}
					max={2000}
					step={25}
					minStepsBetweenThumbs={4}
					value={priceRange}
					onValueChange={([a, b]) => setPriceRange([a, b])}
					className="relative flex h-5 w-full items-center"
				>
					<SliderTrack className="relative h-0.5 w-full bg-gray-300">
						<SliderRange className="absolute h-full rounded-full" />
					</SliderTrack>
					<SliderThumb className="border-accent block h-4 w-4 rounded-full border-2 border-black bg-white focus:outline-none focus:ring-1 focus:ring-black" />
					<SliderThumb className="border-accent block h-4 w-4 rounded-full border-2 border-black bg-white focus:outline-none focus:ring-1 focus:ring-black" />
				</Slider>
				<div className="flex gap-2">
					<div className="flex items-center justify-between gap-3 rounded-md bg-gray-100 p-1">
						<p className="text-xs uppercase text-gray-700">from</p>
						<p className="text-sm">${priceRange[0]}</p>
					</div>
					<div className="flex items-center justify-between gap-3 rounded-md bg-gray-100 p-1">
						<p className="text-xs uppercase text-gray-700">to</p>
						<p className="text-sm">${priceRange[1]}</p>
					</div>
				</div>
			</div>
		</div>
	)
}

function BadgeGroup({
	items,
	onChange,
	className,
}: {
	items: string[]
	onChange?: (value: string[]) => void
	className?: string
}) {
	return (
		<ScrollArea className="w-full">
			<div className={cn('flex w-max gap-1', className)}>
				{items.map(item => (
					<Badge key={item}>{item}</Badge>
				))}
			</div>
			<ScrollBar orientation="horizontal" />
		</ScrollArea>
	)
}

function Badge({
	onChange,
	children,
}: {
	onChange?: (value: boolean) => void
	children?: ReactNode
}) {
	const [isSelected, setIsSelected] = useState(false)

	return (
		<button
			onClick={() =>
				setIsSelected(isCurrentlySelected => {
					const updatedValue = !isCurrentlySelected
					if (onChange) {
						onChange(updatedValue)
					}

					return updatedValue
				})
			}
			className={cn(
				'flex-shrink-0 rounded-md border px-2 py-1 text-xs font-medium',
				isSelected
					? 'border-black bg-black text-white hover:bg-black/80'
					: 'border-gray-400 bg-white text-black hover:bg-gray-100'
			)}
		>
			{children}
		</button>
	)
}
