"use client"
import { useUser, useAuth} from "@clerk/nextjs"

export default function Temp() {
    const {user} = useUser()
    const {userId} = useAuth()
    console.log(user, 'hellooooooo')
    return (
        <div>random div element here</div>
    )
}