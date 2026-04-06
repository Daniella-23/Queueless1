'use client'

import { useState } from 'react'
import { cancelTicket } from '@/app/actions'
import { useRouter } from 'next/navigation'

export default function CancelTicketButton({ ticketId }: { ticketId: string }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleCancel = async () => {
        if (!confirm("Voulez-vous vraiment annuler votre ticket ? Vous perdrez votre place.")) return

        setLoading(true)
        const result = await cancelTicket(ticketId)

        setLoading(false)
        if (result.success) {
            // Retour à l'accueil propre
            router.push('/')
        } else {
            alert("Erreur: " + result.message)
        }
    }

    return (
        <button
            onClick={handleCancel}
            disabled={loading}
            className="mt-4 text-sm text-red-500 hover:text-red-700 underline transition-colors disabled:opacity-50"
        >
            {loading ? "Annulation..." : "Annuler mon ticket"}
        </button>
    )
}
