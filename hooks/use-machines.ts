"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface Machine {
    id: string
    factory_id: string
    name: string
    type: string
    status: 'Active' | 'Fault'
    created_at: string
}

export function useMachines() {
    const [machines, setMachines] = useState<Machine[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchMachines() {
            try {
                setLoading(true)
                const { data, error } = await supabase
                    .from('machines')
                    .select('*')

                if (error) throw error
                setMachines(data || [])
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchMachines()

        // Subscribe to real-time updates
        const channel = supabase
            .channel('schema-db-changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'machines' },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setMachines((prev) => [...prev, payload.new as Machine])
                    } else if (payload.eventType === 'UPDATE') {
                        setMachines((prev) =>
                            prev.map((m) => (m.id === payload.new.id ? (payload.new as Machine) : m))
                        )
                    } else if (payload.eventType === 'DELETE') {
                        setMachines((prev) => prev.filter((m) => m.id !== payload.old.id))
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    return { machines, loading, error }
}
