import GigEmailTemplate from '@/components/gig-email-template'
import { Account, Asset, Photographer } from './types'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function getPhotographers(): Promise<Photographer[]> {
	const { data } = await fetch(
		`${process.env.NEXT_PUBLIC_SERVER_HOST}/v1/photographers`,
		{
			headers: {
				Authorization: `Bearer ${process.env.SERVER_SECRET}`,
			},
			cache: 'no-cache'
		}
	).then(res => res.json())

	return data
}

export async function getAccount(accountId: string): Promise<Account> {
	const { data } = await fetch(
		`${process.env.NEXT_PUBLIC_SERVER_HOST}/v1/accounts/${accountId}`,
		{
			headers: {
				Authorization: `Bearer ${process.env.SERVER_SECRET}`,
			},
		}
	).then(res => res.json())

	return data
}

export async function getAssets(accountId: string): Promise<Asset[]> {
	const { data } = await fetch(
		`${process.env.NEXT_PUBLIC_SERVER_HOST}/v1/assets?accountId=${accountId}`,
		{
			headers: {
				Authorization: `Bearer ${process.env.SERVER_SECRET}`,
			},
		}
	).then(res => res.json())

	return data
}

export async function sendEmail(
	client: {
		email: string
		name: string
		date: string
		phoneNumber: string
		eventDescription: string
		organization?: string
	},
	photographer: { email: string; name: string }
) {
	const { error } = await resend.emails.send({
		from: 'gigs@gophotos.us',
		to: photographer.email,
		cc: client.email,
		subject: 'GoPhotos - Photography Gig Request',
		react: GigEmailTemplate({ client, photographer }),
	})

	console.log(error)
	return {
		isSent: error === null,
		hasError: error !== null,
	}
}
