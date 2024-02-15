import React from 'react'

const Footer = () => {
	return (
		<footer className="flex w-full items-center justify-between border-t border-gray-300 px-20 py-3">
			<p>© 2024 GoPhotos, Inc.</p>
			<div>
				<a href="/Terms-of-Service.pdf" target='_blank' className=" pr-4">
					Terms of Service
				</a>
				<a href="/Privacy-Policy.pdf" target='_blank'>
					Privacy Policy
				</a>
			</div>
		</footer>
	)
}

export default Footer
