'use client'

import { useState } from 'react'
import { createTicket } from '@/app/actions'
import { useRouter } from 'next/navigation'

export default function TicketButton() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleTakeTicket = async () => {
        setLoading(true)
        setError(null)

        try {
            const result = await createTicket()

            if (result.success && result.ticketId) {
                // Redirection vers l'URL avec l'ID du ticket pour le suivi
                router.push(`/?ticketId=${result.ticketId}`)
            } else {
                console.error("Ticket error:", result.message)
                setError(result.message || "Une erreur inconnue est survenue.")
            }
        } catch (e) {
            setError("Erreur de connexion serveur.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-3">
            <button
                onClick={handleTakeTicket}
                disabled={loading}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed ${loading
                    ? 'bg-slate-400 text-white'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                    }`}
            >
                {loading ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Création...
                    </span>
                ) : (
                    "🎫 Prendre un ticket"
                )}
            </button>

            {error && (
                <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded border border-red-100">
                    ⚠️ {error}
                </div>
            )}
        </div>
    )
}
