'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// Simule un compteur global de tickets (en mémoire)
let ticketCounter = 1

export default function TicketPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleTakeTicket = async () => {
    setIsLoading(true)
    
    // Simuler une petite latence pour l'effet visuel
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Générer un numéro de ticket unique
    const ticketNumber = `A${String(ticketCounter).padStart(3, '0')}`
    ticketCounter++
    
    // Rediriger vers la page du ticket avec son ID
    router.push(`/ticket/${ticketNumber}`)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-50 text-slate-900">
      <header className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-blue-600 mb-4">
          Prendre un ticket
        </h1>
        <p className="text-lg text-slate-600">
          Obtenez votre numéro et attendez votre tour
        </p>
      </header>

      <div className="w-full max-w-sm">
        <button
          onClick={handleTakeTicket}
          disabled={isLoading}
          className="block w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 px-6 rounded-lg transition-colors text-center text-lg disabled:cursor-not-allowed"
        >
          {isLoading ? 'Création en cours...' : 'Prendre un ticket'}
        </button>

        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-slate-400 hover:text-slate-600 transition-colors text-sm"
          >
            ← Retour à l'accueil
          </button>
        </div>
      </div>
    </main>
  )
}
