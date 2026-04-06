'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AgentDashboard() {
    const [currentTicket, setCurrentTicket] = useState('A001')
    const [waitingCount, setWaitingCount] = useState(5)
    const [status, setStatus] = useState('En cours')
    const router = useRouter()

    const handleCallNext = () => {
        // Logique simulée : générer le prochain ticket
        const currentNum = parseInt(currentTicket.slice(1)) + 1
        setCurrentTicket(`A${String(currentNum).padStart(3, '0')}`)
        setWaitingCount(Math.max(0, waitingCount - 1))
        setStatus('En cours')
    }

    const handlePause = () => {
        setStatus('En pause')
    }

    const handleResume = () => {
        setStatus('En cours')
    }

    const handleComplete = () => {
        setStatus('Terminé')
        setTimeout(() => {
            setCurrentTicket('--')
            setStatus('En attente')
        }, 2000)
    }

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut()
            router.push('/login')
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error)
            router.push('/login') // Rediriger même en cas d'erreur
        }
    }

    const handleGoHome = () => {
        router.push('/')
    }

    return (
        <main className="min-h-screen bg-slate-100 p-6">
            <div className="max-w-md mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">

                {/* Header Agent */}
                <div className="bg-slate-900 text-white p-6 text-center">
                    <h1 className="text-xl font-bold uppercase tracking-wider">Dashboard Agent</h1>
                    <p className="text-slate-400 text-sm mt-1">Interface Agent</p>
                </div>

                {/* Corps du Dashboard */}
                <div className="p-8 flex flex-col gap-6">

                    {/* Section État Actuel */}
                    <div className="text-center">
                        <div className="bg-green-50 rounded-xl p-6 border-2 border-green-500">
                            <p className="text-green-800 font-semibold uppercase text-xs mb-2">Ticket actuel</p>
                            <div className="text-6xl font-black text-green-700">
                                #{currentTicket}
                            </div>
                        </div>
                    </div>

                    {/* Métriques */}
                    <div className="flex justify-between items-center text-sm text-slate-600 px-4">
                        <span>En attente : <strong>{waitingCount}</strong></span>
                        <span>Status : <span className={`font-bold ${status === 'En cours' ? 'text-green-600' : status === 'En pause' ? 'text-yellow-600' : 'text-slate-600'}`}>{status}</span></span>
                    </div>

                    {/* Zone d'Actions */}
                    <div className="flex flex-col gap-3 mt-4">
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={handleCallNext}
                                className="bg-blue-900 hover:bg-blue-800 text-white font-medium py-4 rounded-lg shadow-sm transition-colors"
                            >
                                Appeler
                            </button>

                            {status === 'En cours' ? (
                                <button
                                    onClick={handlePause}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-4 rounded-lg shadow-sm transition-colors"
                                >
                                    Pause
                                </button>
                            ) : (
                                <button
                                    onClick={handleResume}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-4 rounded-lg shadow-sm transition-colors"
                                >
                                    Reprendre
                                </button>
                            )}
                        </div>

                        <button
                            onClick={handleComplete}
                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-4 rounded-lg shadow-sm transition-colors"
                        >
                            Clôturer
                        </button>
                    </div>

                    {/* Navigation */}
                    <div className="mt-6 flex gap-3 justify-center">
                        <button
                            onClick={handleGoHome}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-lg shadow-sm transition-colors text-sm"
                        >
                            Retour à l'accueil
                        </button>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-medium rounded-lg shadow-sm transition-colors text-sm"
                        >
                            Se déconnecter
                        </button>
                    </div>

                </div>
            </div>
        </main>
    )
}
