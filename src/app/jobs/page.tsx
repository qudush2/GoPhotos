import {currentUser} from '@clerk/nextjs/server'
import {getAllPhotographerJobs} from '@/src/utils/db'

export default async function Jobs(){
    const user = await currentUser()
    const allJobs = await getAllPhotographerJobs(user!.id)

    return(
        <div className='px-20 py-7' >
            This is the jobs page
        </div>
    )
}