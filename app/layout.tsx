import './globals.css'
import type { Metadata } from 'next'
import Footer from '@/app/footer'
import { Space_Grotesk as SpaceGrotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react';

import { cn } from '@/utils/cn'

import { Toaster } from 'sonner'
import NavigationBar from './navigation-bar'

export const metadata: Metadata = {
	title: 'GoPhotos',
	description:
		'Finding a photographer has never been this easy. Start searching for a photographer near you now!',
	icons: {
		icon: {
			url: '/favicon.ico',
		}
	},
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
				<Analytics />
				<Toaster />
				<Footer />
			</body>
		</html>
	)
}
