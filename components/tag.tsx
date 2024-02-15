import { ReactNode } from 'react'

type TagProps = {
	children?: ReactNode
}

export default function Tag({ children }: TagProps) {
	return (
		<div className="whitespace-nowrap rounded-md border border-gray-300 px-2 py-1 text-xs font-medium">
			{children ?? 'Tag'}
		</div>
	)
}
