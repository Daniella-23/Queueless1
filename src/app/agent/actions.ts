'use server'

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

// Pour le MVP, on cible toujours la première file 'open' trouvée.
async function getActiveQueue() {
    const { data: queue } = await supabase
        .from('queues')
        .select('id')
        .eq('status', 'open')
        .limit(1)
        .single()
    return queue
}

export async function callNextTicket() {
    const queue = await getActiveQueue()
    if (!queue) return { success: false, message: "Aucune file active." }

    // 1. Vérifier s'il y a déjà un ticket en cours (on ne peut pas en traiter 2 à la fois)
    const { data: currentTicket } = await supabase
        .from('tickets')
        .select('id, ticket_number')
        .eq('queue_id', queue.id)
        .eq('status', 'processing')
        .maybeSingle()

    if (currentTicket) {
        return { success: false, message: "Veuillez terminer le ticket actuel avant d'en appeler un autre." }
    }

    // 2. Trouver le prochain ticket (le plus vieux 'waiting')
    const { data: nextTicket } = await supabase
        .from('tickets')
        .select('id, ticket_number')
        .eq('queue_id', queue.id)
        .eq('status', 'waiting')
        .order('created_at', { ascending: true }) // FIFO
        .limit(1)
        .maybeSingle()

    if (!nextTicket) {
        return { success: false, message: "Aucun ticket en attente." }
    }

    // 3. Passer le ticket en 'processing'
    const { error: updateTicketError } = await supabase
        .from('tickets')
        .update({ status: 'processing' })
        .eq('id', nextTicket.id)

    if (updateTicketError) return { success: false, message: "Erreur lors de la mise à jour du ticket." }

    // 4. Mettre à jour la file (current_number) pour l'affichage public
    await supabase
        .from('queues')
        .update({ current_number: nextTicket.ticket_number })
        .eq('id', queue.id)

    revalidatePath('/agent')
    revalidatePath('/') // Pour mettre à jour l'écran usager aussi
    return { success: true }
}

export async function completeTicket(ticketId: string, status: 'done' | 'absent') {
    const { error } = await supabase
        .from('tickets')
        .update({ status: status })
        .eq('id', ticketId)

    if (error) return { success: false, message: "Erreur lors de la clôture du ticket." }

    revalidatePath('/agent')
    revalidatePath('/')
    return { success: true }
}
