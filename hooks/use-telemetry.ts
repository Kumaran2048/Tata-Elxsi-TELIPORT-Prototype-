"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface Telemetry {
    id: number
    machine_id: string
    timestamp: string
    vibration: number
    temperature: number
    energy_kwh: number
}

export function useTelemetry(machineId?: string) {
    const [telemetry, setTelemetry] = useState<Telemetry[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchTelemetry() {
            try {
                setLoading(true)
                let query = supabase
                    .from('telemetry')
                    .select('*')
                    .order('timestamp', { ascending: false })
                    .limit(50)

                if (machineId) {
                    query = query.eq('machine_id', machineId)
                }

                const { data, error } = await query

                if (error) throw error
                setTelemetry(data || [])
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchTelemetry()

        // Subscribe to real-time updates for telemetry
        const channel = supabase
            .channel('telemetry-changes')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'telemetry' },
                (payload) => {
                    if (!machineId || payload.new.machine_id === machineId) {
                        setTelemetry((prev) => [payload.new as Telemetry, ...prev].slice(0, 50))
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [machineId])

    return { telemetry, loading, error }
}
