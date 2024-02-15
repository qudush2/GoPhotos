'use client'

import { useFormState } from 'react-dom'
import RequestQuoteButton from './request-quote-button'
import sendQuoteRequestAction from '@/actions/send-quote-request'
import { useEffect } from 'react'
import { Account } from '@/utils/types'
import { toast } from 'sonner'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/20/solid'

type RequestQuotePanelProps = {
	photographer: Account
}

export default function RequestQuotePanel({
	photographer,
}: RequestQuotePanelProps) {
	const bindedAction = sendQuoteRequestAction.bind(null, photographer)
	const [state, formAction] = useFormState(bindedAction, {
		isSent: false,
		hasError: false,
	})

	useEffect(() => {
		if (state.isSent && !state.hasError) {
			toast(
				<p className="flex items-center justify-between gap-1">
					<CheckCircleIcon className="h-5 w-5 text-green-600" />
					<span className="text-sm font-medium">
						A quote request has been sent! Please check your email.
					</span>
				</p>
			)
		} else if (!state.isSent && state.hasError) {
			toast(
				<p className="flex items-center justify-between gap-1">
					<XCircleIcon className="h-5 w-5 text-red-600" />
					<span className="text-sm font-medium">
						An unknown error occurred.
					</span>
				</p>
			)
		}
	}, [state])

	return (
		<div>
			<p className="text-xl font-medium">Request a Quote</p>
			<p className="text-sm text-gray-600">
				Great! There is some information that we need before sending a
				quote request.
			</p>
			<form className="mt-3" action={formAction}>
				<div className="">
					<label htmlFor="name" className="sm text-sm font-medium">
						Name
					</label>
					<input
						id="name"
						name="name"
						required
						className="w-full rounded-md border border-gray-200 text-sm outline-none"
					/>
				</div>
				<div className="">
					<label htmlFor="email" className="sm text-sm font-medium">
						Email
					</label>
					<input
						id="email"
						name="email"
						required
						className="w-full rounded-md border border-gray-200 text-sm outline-none"
					/>
				</div>
				<div className="">
					<label
						htmlFor="phoneNumber"
						className="sm text-sm font-medium"
					>
						Phone Number
					</label>
					<input
						id="phoneNumber"
						name="phoneNumber"
						required
						className="w-full rounded-md border border-gray-200 text-sm outline-none"
					/>
				</div>
				<div className="">
					<label
						htmlFor="eventDate"
						className="sm text-sm font-medium"
					>
						Date
					</label>
					<input
						id="eventDate"
						name="eventDate"
						required
						className="w-full rounded-md border border-gray-200 text-sm outline-none"
					/>
				</div>
				<div className="">
					<label
						htmlFor="organization"
						className="sm text-sm font-medium"
					>
						Organization
					</label>
					<input
						id="organization"
						name="organization"
						className="w-full rounded-md border border-gray-200 text-sm outline-none"
					/>
				</div>
				<div className="">
					<label
						htmlFor="eventDescription"
						className="sm text-sm font-medium"
					>
						Event Description
					</label>
					<textarea
						id="eventDescription"
						name="eventDescription"
						required
						className="w-full rounded-md border border-gray-200 text-sm outline-none"
					/>
				</div>
				<RequestQuoteButton />
			</form>
		</div>
	)
}
