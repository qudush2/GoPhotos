"use client";

import { useEffect } from "react";
import { UnauthorizedError } from '@/src/utils/errors'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    if (error instanceof UnauthorizedError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <h1 className="text-4xl font-bold text-red-600 mb-4">401 - Unauthorized</h1>
                <p className="text-xl text-gray-700 mb-8">Sorry, you don't have permission to access this page.</p>
                <button
                    onClick={() => reset()}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                    Try again
                </button>
            </div>
        )
    }

    // For other errors, you can either show a generic error message or rethrow the error
    throw error
}