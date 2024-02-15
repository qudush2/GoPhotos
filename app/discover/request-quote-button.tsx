'use client'

import { cn } from '@/utils/cn'
import { useFormStatus } from 'react-dom'

export default function RequestQuoteButton() {
	const { pending } = useFormStatus()

	return (
		<div className="relative mt-2">
			<button
				type="submit"
				className={cn(
					'w-full rounded-md bg-black px-3 py-2 text-sm font-medium text-white'
				)}
			>
				Send request
			</button>
			{pending && (
				<>
					<div className="absolute top-0 z-10 h-full w-full rounded-md bg-gray-800/60" />
					<div className="absolute left-1/2 top-1/2 z-20 -m-2.5 h-5 w-5 animate-spin rounded-full border-4 border-b-transparent border-l-white border-r-white border-t-white" />
				</>
			)}
		</div>
	)
}
