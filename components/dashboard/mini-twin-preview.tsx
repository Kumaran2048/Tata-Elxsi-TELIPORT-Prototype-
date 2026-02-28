"use client"

import Link from "next/link"
import { Box, ArrowUpRight } from "lucide-react"
import { useSettings } from "@/hooks/use-settings"
import { cn } from "@/lib/utils"

export function MiniTwinPreview() {
  const { settings } = useSettings()

  return (
    <Link
      href="/digital-twin"
      className={cn(
        "block glass rounded-xl p-5 group transition-all hover:scale-[1.01]",
        settings.highFidelityRendering ? "glow-cyan" : ""
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Digital Twin</h3>
          <p className="text-xs text-muted-foreground">3D Virtual Mirror</p>
        </div>
        <div className="flex items-center gap-1 text-primary text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          <span>Open</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </div>
      </div>

      {/* Animated preview placeholder */}
      <div className="relative h-[180px] rounded-lg bg-secondary/30 border border-border/30 overflow-hidden flex items-center justify-center">
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: "linear-gradient(hsl(187, 92%, 55%, 0.15) 1px, transparent 1px), linear-gradient(90deg, hsl(187, 92%, 55%, 0.15) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }} />
        </div>

        {/* Scan line overlay - Only in high fidelity */}
        {settings.highFidelityRendering && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent animate-scan-line" />
          </div>
        )}

        {/* Machine icon */}
        <div className={cn("relative z-10", settings.highFidelityRendering ? "animate-float" : "")}>
          <div className="relative">
            <Box className="h-16 w-16 text-primary/40" strokeWidth={1} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={cn("h-4 w-4 rounded-full bg-primary/20", settings.highFidelityRendering ? "animate-pulse" : "")} />
            </div>
          </div>
        </div>

        {/* Corner accents */}
        <div className="absolute left-2 top-2 h-4 w-4 border-l border-t border-primary/30" />
        <div className="absolute right-2 top-2 h-4 w-4 border-r border-t border-primary/30" />
        <div className="absolute left-2 bottom-2 h-4 w-4 border-l border-b border-primary/30" />
        <div className="absolute right-2 bottom-2 h-4 w-4 border-r border-b border-primary/30" />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={cn("h-2 w-2 rounded-full bg-primary", settings.realTimeSync ? "animate-pulse" : "")} />
          <span className="text-[10px] font-medium uppercase tracking-wider text-primary">
            {settings.realTimeSync ? 'Live Model' : 'Cached Model'}
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground font-mono">CNC Lathe #3</span>
      </div>
    </Link>
  )
}
