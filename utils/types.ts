export type Account = {
	id: string
	email: string
	fullName: string
}

export type Photographer = {
	id: string
	accountId: string
	location: string
	estimatedHourlyPriceRange: [number, number]
	school: string
	skills: string[]
	about: string
	hires: number
}

export type Asset = {
	id: string
	ownerAccountId: string
	cdnPath: string
	placeholderBase64: string
	dateUploaded: string
}