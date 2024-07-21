import Link from 'next/link';

export default async function Admin() {
    return (
        <div className="px-20 py-7">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            <nav className="space-y-2">
                <Link href="/photographer-data" className="block text-blue-600 hover:text-blue-800 underline">
                    Photographer Data
                </Link>
                <Link href="/photographer-application" className="block text-blue-600 hover:text-blue-800 underline">
                    Photographer Application
                </Link>
            </nav>
        </div>
    )
}