import { auth, currentUser } from "@clerk/nextjs"

export default async function Temp() {
    const {userId} = auth()
    const user = await currentUser()

    if (!userId || !user) {
        return (
            <div>
                You are not logged in
            </div>
        )}
    
    console.log(user)

    return (
    <div className="sm:px-20 sm:py-5 text-2xl">
        Hi {user.firstName} {user.lastName} <br/>
        this is your email {user.emailAddresses[0].emailAddress}
    </div>
    )}