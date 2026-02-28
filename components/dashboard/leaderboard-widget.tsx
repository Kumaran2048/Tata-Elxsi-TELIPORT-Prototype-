"use client"

import { Medal, Trophy, User } from "lucide-react"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"

export function LeaderboardWidget() {
    const [operators, setOperators] = useState<any[]>([])

    useEffect(() => {
        async function fetchLeaderboard() {
            const { data } = await supabase
                .from('operator_leaderboard')
                .select('*')
                .order('uptime_score', { ascending: false })

            if (data) setOperators(data)
        }
        fetchLeaderboard()
    }, [])

    return (
        <div className="glass rounded-xl p-5 border-primary/20 bg-primary/5">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-warning" />
                        Operator Leaderboard
                    </h3>
                    <p className="text-xs text-muted-foreground">Worker Safety & Gamification</p>
                </div>
            </div>

            <div className="space-y-3">
                {operators.map((op, index) => (
                    <div key={op.id} className="flex items-center gap-3 p-2 rounded-lg bg-secondary/20 border border-border/20">
                        <div className={cn(
                            "h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold",
                            index === 0 ? "bg-warning text-warning-foreground" : "bg-muted text-muted-foreground"
                        )}>
                            {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-foreground truncate">{op.operator_name}</span>
                                <span className="text-[10px] font-mono text-accent">{op.uptime_score}% Uptime</span>
                            </div>
                            <div className="flex gap-1 mt-1">
                                {op.badges?.map((badge: string) => (
                                    <span key={badge} className="text-[8px] bg-primary/20 text-primary px-1 rounded">
                                        {badge}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
