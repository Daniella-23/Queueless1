'use server'

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

// ... (fonctions précédentes createTicket et getTicketDetails inchangées) ...
// Pour éviter d'écraser, je réécris tout le fichier proprement ou j'utilise replace, 
// mais write_to_file est plus sûr si je remets tout le contenu.
// Vu la taille, je vais append à la fin via append n'existe pas, donc je remplace tout en incluant le nouveau.

// Note: Dans une vraie app, on utiliserait un ID de queue dynamique.
// Pour le MVP, on cible la première file disponible de l'organisation.

export async function createTicket() {
    const { data: queue, error: queueError } = await supabase
        .from('queues')
        .select('id, last_number')
        .eq('status', 'open')
        .limit(1)
        .single()

    if (queueError || !queue) {
        return { success: false, message: "Aucune file d'attente ouverte n'a été trouvée." }
    }

    const newNumber = (queue.last_number || 0) + 1

    const { error: updateError } = await supabase
        .from('queues')
        .update({ last_number: newNumber })
        .eq('id', queue.id)

    if (updateError) {
        return { success: false, message: "Erreur lors de la mise à jour de la file." }
    }

    const { data: ticket, error: ticketError } = await supabase
        .from('tickets')
        .insert([
            {
                queue_id: queue.id,
                ticket_number: newNumber,
                status: 'waiting',
            },
        ])
        .select()
        .single()

    if (ticketError) {
        return { success: false, message: "Erreur lors de la création du ticket." }
    }

    revalidatePath('/')
    return { success: true, ticketNumber: newNumber, ticketId: ticket.id }
}

export async function getTicketDetails(ticketId: string) {
    const { data: ticket } = await supabase
        .from('tickets')
        .select('id, ticket_number, status, created_at, queue_id')
        .eq('id', ticketId)
        .single()

    if (!ticket) return null

    const { count } = await supabase
        .from('tickets')
        .select('*', { count: 'exact', head: true })
        .eq('queue_id', ticket.queue_id)
        .eq('status', 'waiting')
        .lt('created_at', ticket.created_at)

    return {
        ...ticket,
        position: count || 0
    }
}

export async function cancelTicket(ticketId: string) {
    const { error } = await supabase
        .from('tickets')
        .update({ status: 'cancelled' })
        .eq('id', ticketId)

    if (error) {
        return { success: false, message: "Erreur lors de l'annulation." }
    }

    revalidatePath('/')
    return { success: true }
}
