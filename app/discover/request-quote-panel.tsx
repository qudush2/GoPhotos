'use client'

import { useFormState } from 'react-dom'
import RequestQuoteButton from './request-quote-button'
import sendQuoteRequestAction from '@/actions/send-quote-request'
import { useEffect } from 'react'
import { Account } from '@/utils/types'
import { toast } from 'sonner'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/20/solid'
import { useAuth, useUser } from "@clerk/nextjs"

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

	const { user, isLoaded, isSignedIn } = useUser()

	if (!isLoaded || !isSignedIn) {
		return null
	}

	return (
		<div>
			<p className="text-xl font-medium mb-2">Request a Quote</p>
			<p className="text-sm text-gray-600">
				Great! There is some information that we need before sending a
				quote request.
			</p>
			<p className="text-sm text-gray-600">
				After submitting your request, an email chain will be created between yourself and the photographer.
			</p>
			<form className="mt-3 space-y-3" action={formAction}>
				<div className="">
					<label htmlFor="name" className="sm text-sm font-medium">
						Name
					</label>
					<input
						id="name"
						name="name"
						required
						className="w-full rounded-md border border-gray-200 text-sm outline-none placeholder-black"
						placeholder = {user.firstName + ' ' + user.lastName}
						readOnly
					/>
				</div>
				<div className="">
					<label htmlFor="email" className="sm text-sm font-medium">
						Email
					</label>
					<input
						id="email"
						name="email"
						type="email"
						required
						className="w-full rounded-md border border-gray-200 text-sm outline-none placeholder-black"
						placeholder= {user.emailAddresses[0].emailAddress}
						readOnly
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
						className="w-full rounded-md border border-gray-200 text-sm outline-none"
						placeholder= {user.phoneNumbers[0]?.phoneNumber || '123-456-7890'}
						readOnly = {user.phoneNumbers[0]?.phoneNumber ? true : false}
					/>
				</div>
				<div className="">
					<label
						htmlFor="location"
						className="sm text-sm font-medium"
					>
						Location <i>(please be as specific as possible OR put exact address )</i>
					</label>
					<input
						id="location"
						name="location"
						required
						className="w-full rounded-md border border-gray-200 text-sm outline-none"
						placeholder= 'MIT Media Lab'
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
						type="date"
						id="eventDate"
						name="eventDate"
						required
						className="w-full rounded-md border border-gray-200 text-sm outline-none"
						min={new Date().toISOString().split('T')[0]}
					/>
				</div>
				<div className="">
					<label
						htmlFor="startTime"
						className="sm text-sm font-medium"
					>
						Start Time <i>(if known)</i>
					</label>
					<input
						type="time"
						id="startTime"
						name="startTime"
						className="w-full rounded-md border border-gray-200 text-sm outline-none"
					/>
				</div>
				<div className="">
					<label
						htmlFor="endTime"
						className="sm text-sm font-medium"
					>
						End Time <i>(if known)</i>
					</label>
					<input
						type="time"
						id="endTime"
						name="endTime"
						className="w-full rounded-md border border-gray-200 text-sm outline-none"
					/>
				</div>
				<div className="">
					<label
						htmlFor="organization"
						className="sm text-sm font-medium"
					>
						Organization <i>(if applicable)</i>
					</label>
					<input
						id="organization"
						name="organization"
						className="w-full rounded-md border border-gray-200 text-sm outline-none"
						placeholder= 'GoPhotos'
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
						placeholder= 'Please be sure to include an overall description of the event, types of photos you expect, & any other necessary information.'
					/>
				</div>
				<RequestQuoteButton />
			</form>
		</div>
	)
}
