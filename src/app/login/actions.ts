'use server'

import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { isRedirectError } from 'next/dist/client/components/redirect'

export async function login(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // Validation basique
    if (!email || !password) {
        return { error: 'Veuillez remplir tous les champs' }
    }

    // Vérification des variables d'environnement
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        return { error: 'Configuration Supabase manquante. Contactez l\'administrateur.' }
    }

    try {
        const supabase = await createClient()

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            // Gestion spécifique des erreurs courantes
            if (error.message.includes('Invalid login credentials')) {
                return { error: 'Email ou mot de passe incorrect' }
            }
            if (error.message.includes('Email not confirmed')) {
                return { error: 'Veuillez confirmer votre email avant de vous connecter' }
            }
            if (error.message.includes('fetch failed')) {
                return { error: 'Erreur de connexion au serveur. Vérifiez votre connexion internet.' }
            }
            return { error: error.message }
        }

        // Si succès, redirection vers l'interface Agent
        redirect('/agent')
    } catch (err) {
        if (isRedirectError(err)) {
            throw err  // Laisser la redirection se produire
        }
        console.error('Erreur lors de la connexion:', err)
        return { error: 'Une erreur technique est survenue. Veuillez réessayer.' }
    }
}

export async function signUp(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        return { error: 'Veuillez remplir tous les champs' }
    }

    if (password.length < 6) {
        return { error: 'Le mot de passe doit contenir au moins 6 caractères' }
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        return { error: 'Configuration Supabase manquante. Contactez l\'administrateur.' }
    }

    try {
        const supabase = await createClient()

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/login`
            }
        })

        if (error) {
            if (error.message.includes('User already registered')) {
                return { error: 'Cet email est déjà utilisé. Essayez de vous connecter.' }
            }
            return { error: error.message }
        }

        return { 
            success: 'Compte créé avec succès ! Veuillez vérifier votre email pour activer votre compte.',
            needsEmailConfirmation: true
        }
    } catch (err) {
        if (isRedirectError(err)) {
            throw err  // Laisser la redirection se produire
        }
        console.error('Erreur lors de l\'inscription:', err)
        return { error: 'Une erreur technique est survenue. Veuillez réessayer.' }
    }
}
