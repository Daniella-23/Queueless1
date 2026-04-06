'use server'

import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

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

    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password
    })

    if (error) {
        console.error('Erreur login:', error)
        return { error: 'Email ou mot de passe incorrect' }
    }

    // ✅ redirect en dehors de try/catch
    redirect('/agent')
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

    const supabase = await createClient()

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/login`
        }
    })

    if (error) {
        console.error('Erreur inscription:', error)
        return { error: 'Cet email est déjà utilisé. Essayez de vous connecter.' }
    }

    return { 
        success: 'Compte créé avec succès ! Veuillez vérifier votre email pour activer votre compte.',
        needsEmailConfirmation: true
    }
}
