"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface AIInsight {
    id: string
    machine_id: string
    alert_type: string
    prediction_message: string
    confidence_score: number
    created_at: string
    mname?: string // Joined machine name
}

export function useAIInsights() {
    const [insights, setInsights] = useState<AIInsight[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchInsights() {
            try {
                setLoading(true)
                const { data, error } = await supabase
                    .from('ai_insights')
                    .select(`
            *,
            machines (name)
          `)
                    .order('created_at', { ascending: false })
                    .limit(10)

                if (error) throw error

                const formatted = (data || []).map((ins: any) => ({
                    ...ins,
                    mname: ins.machines?.name || 'Unknown Machine'
                }))

                setInsights(formatted)
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchInsights()

        const channel = supabase
            .channel('ai-insights-changes')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'ai_insights' },
                (payload) => {
                    fetchInsights() // Refetch to get the machine join
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    return { insights, loading, error }
}
