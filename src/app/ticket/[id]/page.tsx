'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

// Simule une file d'attente globale (en mémoire)
const globalQueue: string[] = []

export default function TicketDetailPage() {
  const params = useParams()
  const router = useRouter()
  const ticketId = params.id as string
  
  const [position, setPosition] = useState<number>(0)
  const [isCancelled, setIsCancelled] = useState(false)

  useEffect(() => {
    // Ajouter le ticket à la file s'il n'y est pas déjà
    if (!globalQueue.includes(ticketId)) {
      globalQueue.push(ticketId)
    }
    
    // Calculer la position dans la file
    const ticketPosition = globalQueue.indexOf(ticketId)
    setPosition(ticketPosition)
    
    // Simuler des mises à jour de position
    const interval = setInterval(() => {
      const currentPosition = globalQueue.indexOf(ticketId)
      if (currentPosition >= 0) {
        setPosition(currentPosition)
      }
    }, 3000)
    
    return () => clearInterval(interval)
  }, [ticketId])

  const handleCancel = () => {
    // Retirer le ticket de la file
    const index = globalQueue.indexOf(ticketId)
    if (index > -1) {
      globalQueue.splice(index, 1)
    }
    setIsCancelled(true)
  }

  const handleBackHome = () => {
    // Nettoyer le ticket de la file avant de retourner à l'accueil
    const index = globalQueue.indexOf(ticketId)
    if (index > -1) {
      globalQueue.splice(index, 1)
    }
    router.push('/')
  }

  if (isCancelled) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-50 text-slate-900">
        <div className="p-8 bg-white rounded-xl shadow-lg text-center max-w-sm w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Ticket annulé</h2>
          <p className="text-slate-600 mb-6">Votre ticket a bien été annulé.</p>
          <button
            onClick={handleBackHome}
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-50 text-slate-900">
      <div className="p-8 bg-white rounded-xl shadow-lg text-center max-w-sm w-full">
        <p className="text-slate-500 text-sm uppercase tracking-wider font-semibold mb-2">Votre Ticket</p>
        <div className="text-6xl font-black text-slate-800 mb-6">
          #{ticketId}
        </div>

        {position === 0 ? (
          <div className="bg-green-100 py-6 px-6 rounded-lg text-green-800 border-2 border-green-400 animate-pulse mb-6">
            <p className="text-2xl font-bold mb-1">C'est votre tour !</p>
            <p className="">Veuillez vous présenter au guichet.</p>
          </div>
        ) : (
          <div className="bg-blue-50 py-4 px-6 rounded-lg text-blue-800 mb-6">
            <p className="text-lg font-bold mb-1">En attente</p>
            <p className="text-sm opacity-80">
              {position} personne(s) avant vous
            </p>
          </div>
        )}

        <div className="flex gap-3">
          {position > 0 && (
            <button
              onClick={handleCancel}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors"
            >
              Annuler
            </button>
          )}
          <button
            onClick={handleBackHome}
            className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-3 rounded-lg transition-colors"
          >
            Accueil
          </button>
        </div>

        {position > 0 && (
          <p className="mt-6 text-xs text-slate-400">Gardez cette page ouverte.</p>
        )}
      </div>
    </main>
  )
}
