'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login, signUp } from './actions'
import type { AuthResult } from './types'

export default function LoginPage() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [isSignUp, setIsSignUp] = useState(false)
    const router = useRouter()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(null)

        // On doit reconstruire le FormData pour l'envoyer au Server Action
        const formData = new FormData(event.currentTarget)

        // Appel du Server Action approprié
        const result: AuthResult = isSignUp ? await signUp(formData) : await login(formData)

        console.log('Résultat auth:', result) // Debug

        if (result?.error) {
            console.log('Erreur auth:', result.error) // Debug
            setError(result.error)
            setLoading(false)
        }
        
        if (result?.success) {
            console.log('Succès auth:', result.success) // Debug
            setSuccess(result.success)
            setLoading(false)
            if (!result.needsEmailConfirmation) {
                // Rediriger vers login si inscription réussie sans confirmation email
                setTimeout(() => {
                    setIsSignUp(false)
                    setSuccess(null)
                }, 2000)
            }
        }

        // Si login réussi (pas d'erreur et pas de message success = login)
        if (!result?.error && !result?.success && !isSignUp) {
            console.log('Login réussi, redirection vers /agent') // Debug
            router.push('/agent')
        }
    }


    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
            <div className="w-full max-w-sm bg-white rounded-xl shadow-lg border border-slate-200 p-8">

                <header className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-800">QueueLess Pro</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        {isSignUp ? 'Créer un compte professionnel' : 'Accès réservé au personnel'}
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="agent@queueless.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Mot de passe</label>
                        <input
                            name="password"
                            type="password"
                            required
                            minLength={6}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded border border-red-200 text-center">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="p-3 bg-green-50 text-green-600 text-sm rounded border border-green-200 text-center">
                            {success}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-lg transition-colors mt-2 disabled:opacity-50"
                    >
                        {loading ? (isSignUp ? 'Création...' : 'Connexion...') : (isSignUp ? 'Créer un compte' : 'Se connecter')}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        type="button"
                        onClick={() => {
                            setIsSignUp(!isSignUp)
                            setError(null)
                            setSuccess(null)
                        }}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                        {isSignUp ? 'Déjà un compte ? Se connecter' : 'Pas de compte ? Créer un compte'}
                    </button>
                </div>

                <div className="mt-4 text-center">
                    <button
                        type="button"
                        onClick={() => router.push('/')}
                        className="text-slate-400 hover:text-slate-600 text-sm"
                    >
                        ← Retour à l'accueil
                    </button>
                </div>
            </div>
        </main>
    )
}
