import React from 'react'
import { cn } from '@/utils/cn'

import { Switch } from '@/components/switch'
import { Playfair_Display as PlayfairDisplay } from 'next/font/google'
import Image from 'next/image'
import Footer from '@/app/footer'
import { redirect } from 'next/navigation'

const playfairDisplay = PlayfairDisplay({
	subsets: ['latin'],
	style: ['normal', 'italic'],
	preload: true,
})

export default function LandingPage() {
	const redirectOnSwitch = async () => {
		'use server'

		console.log('test')
		redirect('/')
	}

	return (
		<div className="relative h-screen bg-white">
			<div className="mb-7 mt-10 flex items-center justify-center space-x-2">
				<label htmlFor="hiring" className="text-lg text-black">
					For Hiring
				</label>
				<Switch
					onCheckedChange={redirectOnSwitch}
					checked
					id="landing-page"
					className="bg-black"
				/>
				<label htmlFor="photographers" className="text-lg text-black">
					For Photographers
				</label>
			</div>
			<div className="flex items-center justify-center">
				<div className="w-1/2 pl-10">
					<div className="ml-9 text-black">
						<p
							className={cn(
								playfairDisplay.className,
								'text-6xl font-medium'
							)}
						>
							More Bookings, <br />
							<span className="inline-block pt-3">
								Less Hassle.
							</span>
						</p>
						<p className="mb-10 mt-6 font-serif text-2xl italic text-black">
							The All-In-One Booking Platform for Photographers
						</p>
					</div>
					<div className="flex justify-center">
						<button className="w-1/2 rounded-md bg-black px-3 py-2 text-sm font-medium text-white">
							Join Now
						</button>
					</div>
				</div>
				<div className="flex w-1/2 items-center justify-center">
					<Image
						src="/images/photographer.JPG"
						alt="Photographer taking a picture"
						width={650}
						height={100}
						className="rounded-2xl"
					/>
				</div>
			</div>
			<Footer />
		</div>
	)
}
