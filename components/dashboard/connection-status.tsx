"use client"

import { Wifi, Cpu, ShieldCheck, Activity } from "lucide-react"
import { useEffect, useState } from "react"

export function ConnectionStatus() {
    const [dataRate, setDataRate] = useState(124)
    const [latency, setLatency] = useState(12)

    useEffect(() => {
        const interval = setInterval(() => {
            setDataRate(120 + Math.floor(Math.random() * 15))
            setLatency(10 + Math.floor(Math.random() * 5))
        }, 3000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="flex flex-wrap gap-4 mb-6">
            <div className="glass-sm px-4 py-2 rounded-full flex items-center gap-2 border-accent/20 bg-accent/5">
                <Wifi className="h-3.5 w-3.5 text-accent animate-pulse" />
                <span className="text-[10px] uppercase tracking-wider font-bold text-accent">Edge Gateway: <span className="text-white">ONLINE</span></span>
            </div>

            <div className="glass-sm px-4 py-2 rounded-full flex items-center gap-2 border-primary/20 bg-primary/5">
                <Activity className="h-3.5 w-3.5 text-primary" />
                <span className="text-[10px] uppercase tracking-wider font-bold text-primary">Data Stream: <span className="text-white">{dataRate} kb/s</span></span>
            </div>

            <div className="glass-sm px-4 py-2 rounded-full flex items-center gap-2 border-foreground/10 bg-foreground/5">
                <Cpu className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Latency: <span className="text-white">{latency}ms</span></span>
            </div>

            <div className="glass-sm px-4 py-2 rounded-full flex items-center gap-2 border-accent/20 bg-accent/5">
                <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                <span className="text-[10px] uppercase tracking-wider font-bold text-accent">Identity: <span className="text-white font-mono">UUID:f0e1-hardware-linked</span></span>
            </div>
        </div>
    )
}
