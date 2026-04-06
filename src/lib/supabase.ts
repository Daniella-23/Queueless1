
import { createClient } from '@supabase/supabase-js'

// Ces variables doivent être définies dans .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Vérification de sécurité lors du développement
if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
        '⚠️ Les variables d\'environnement Supabase sont manquantes. Vérifiez votre fichier .env.local.'
    )
}

// Création du client unique (Singleton)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
