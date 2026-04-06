import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    return NextResponse.json({ session })
  } catch (error) {
    console.error('Error checking session:', error)
    return NextResponse.json({ session: null }, { status: 500 })
  }
}
