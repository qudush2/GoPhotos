'use server'

import { sendEmail } from '@/utils/api'
import { Account } from '@/utils/types'

type State = {
	isSent: boolean
	hasError: boolean
}

export default async function sendQuoteRequestAction(
	photographer: Account,
	_state: State,
	formData: FormData
) {
	const {
		name,
		email,
		phoneNumber,
		eventDate,
		organization,
		eventDescription,
	} = Object.fromEntries(formData)

	return await sendEmail(
		{
			email: email.toString(),
			name: name.toString(),
			date: eventDate.toString(),
			eventDescription: eventDescription.toString(),
			phoneNumber: phoneNumber.toString(),
			organization: organization?.toString(),
		},
		{
			email: 'qudus@mit.edu',
			name: photographer.fullName,
		}
	)
}
