'use client'

import {useState} from 'react'
import {useRouter} from 'next/navigation'
import {JobDetails, Customer} from '@/src/utils/types'


export default function NotifyCustomerButton({jobDetails, customerInfo}: {jobDetails: JobDetails, customerInfo: Customer}) {
    const router = useRouter()
    const firstName = customerInfo.full_name.split(' ')[0]
    const [isLoading, setIsLoading] = useState(false)

    const handleNotify = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/emails/picture-uploaded-email', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify({
                    jobDetails: jobDetails
                })
            })
            if (response.ok) {
                alert('Customer notified successfully!')
                router.refresh()
            } else {
                throw new Error('Failed to notify customer')
            }
        } catch (error) {
            console.error('Error notifying customer:', error)
            alert('Failed to notify customer. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    if (jobDetails.pictures_uploaded) {
        return (
            <button disabled className="bg-gray-400 text-white font-bold py-2 px-4 rounded cursor-not-allowed">
                Customer Notified
            </button>
        )
    }

    return (
        <button onClick={handleNotify} disabled={isLoading} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          {isLoading ? 'Notifying...' : `Notify ${firstName}`}

        </button>
    )
}