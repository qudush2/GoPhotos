import GigEmailTemplate from '@/components/gig-email-template'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail(client: {
    email: string;
    name: string;
    date: string;
    location: string;
    startTime?: string;
    endTime?: string;
    phoneNumber: string;
    eventDescription: string;
    organization?: string;
}, photographer: { email: string; name: string }) {
    const formattedDate = new Date(client.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    const { error } = await resend.emails.send({
        from: 'gigs@gophotos.us',
        to: photographer.email,
        cc: client.email,
        bcc: 'gigs@gophotos.us',
        subject: `GoPhotos - Photography Gig Request [${formattedDate}]`,
        react: GigEmailTemplate({ client, photographer }),
    })

    console.log(error)
    return {
        isSent: error === null,
        hasError: error !== null,
    }
}