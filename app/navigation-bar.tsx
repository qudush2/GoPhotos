'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	Button,
} from '@nextui-org/react'
import gpLogo from '../public/GoPhotos_logo.png'
import Image from 'next/image'

import { cn } from '@/utils/cn'

export default function NavigationBar() {
	return (
		<Navbar isBlurred className="sticky z-10 bg-white px-20 py-5">
			<Link href="/" className="cursor-pointer">
				<Image src={gpLogo} alt="" width={150} height={800} />
			</Link>

			<NavbarContent className="hidden gap-4 sm:flex" justify="center">
				<NavbarItem>
					<NavigationLink href="/discover" linkPath="/discover">
						Discover
					</NavigationLink>
				</NavbarItem>
			</NavbarContent>

			<NavbarContent justify="end">
				<NavbarItem>
					<Button
						as={Link}
						color="primary"
						target="_blank"
						href="http://tinyurl.com/GP-Photographer"
						variant="flat"
						className="font-medium"
					>
						Become a Photographer
					</Button>
				</NavbarItem>
			</NavbarContent>
		</Navbar>
	)
}

function NavigationLink({
	children,
	href,
	linkPath,
	className,
}: {
	children: ReactNode
	href: string
	linkPath: string
	className?: string
}) {
	const currentPath = usePathname()
	const isActive = currentPath.startsWith(linkPath)

	return (
		<Link href={href}>
			<div className={cn('relative font-medium', className)}>
				{children}
				<div
					className={cn(
						'absolute w-full border-b-2',
						isActive ? 'border-black' : 'border-transparent'
					)}
				/>
			</div>
		</Link>
	)
}
