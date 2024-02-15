import './globals.css'
import type { Metadata } from 'next'
import Footer from '@/app/footer'
import { Space_Grotesk as SpaceGrotesk } from 'next/font/google'
import Head from 'next/head'

import { cn } from '@/utils/cn'

import { Toaster } from 'sonner'
import NavigationBar from './navigation-bar'

export const metadata: Metadata = {
	title: 'GoPhotos',
	description:
		'Finding a photographer has never been this easy. Start searching for a photographer near you now!',
}

const spaceGrotesk = SpaceGrotesk({
	style: 'normal',
	subsets: ['latin'],
	weight: ['300', '400', '500', '600', '700'],
})

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body
				className={cn(
					'max-w-screen overflow-x-hidden',
					spaceGrotesk.className
				)}
			>
				<NavigationBar />
				{children}
				<Toaster />
				<Footer />
			</body>
		</html>
	)
}
