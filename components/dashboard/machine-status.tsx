"use client"

import { cn } from "@/lib/utils"
import { Activity, Thermometer, Gauge, Vibrate, Loader2 } from "lucide-react"
import { useMachines } from "@/hooks/use-machines"

const statusConfig = {
  healthy: { color: "text-accent", bg: "bg-accent/10", border: "border-accent/20", label: "Healthy" },
  warning: { color: "text-warning", bg: "bg-warning/10", border: "border-warning/20", label: "Warning" },
  critical: { color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20", label: "Critical" },
}

export function MachineStatusGrid() {
  const { machines, loading, error } = useMachines()

  if (loading) {
    return (
      <div className="glass rounded-xl p-5 flex flex-col items-center justify-center min-h-[300px]">
        <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
        <p className="text-sm text-muted-foreground">Syncing with industrial edge...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass rounded-xl p-5 border-destructive/50">
        <p className="text-sm text-destructive">Error connecting to fleet: {error}</p>
      </div>
    )
  }

  return (
    <div className="glass rounded-xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Machine Fleet Status</h3>
          <p className="text-xs text-muted-foreground">Real-time health overview ({machines.length} units)</p>
        </div>
        <div className="flex items-center gap-3">
          {(["healthy", "warning", "critical"] as const).map((s) => (
            <div key={s} className="flex items-center gap-1.5">
              <span className={cn("h-2 w-2 rounded-full", statusConfig[s].bg, statusConfig[s].color.replace("text-", "bg-"))} />
              <span className="text-[10px] text-muted-foreground">{statusConfig[s].label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {machines.map((machine) => {
          // Map DB status to UI status
          const uiStatus = machine.status === 'Active' ? 'healthy' : 'critical'
          const health = machine.status === 'Active' ? 95 : 32
          const cfg = statusConfig[uiStatus]

          return (
            <div
              key={machine.id}
              className={cn(
                "group rounded-lg border p-3 transition-all duration-200 hover:scale-[1.02]",
                cfg.border,
                cfg.bg
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-foreground truncate max-w-[100px]" title={machine.name}>
                    {machine.name}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                    <span className="text-[8px] text-accent uppercase font-bold tracking-tighter">Sensor Linked</span>
                  </div>
                </div>
                <span className={cn("text-[10px] font-bold uppercase tracking-wider", cfg.color)}>
                  {cfg.label}
                </span>
              </div>

              {/* Health bar */}
              <div className="mb-2 h-1.5 rounded-full bg-secondary/50 overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all duration-1000", cfg.color.replace("text-", "bg-"))}
                  style={{ width: `${health}%` }}
                />
              </div>
              <div className="flex justify-between items-center">
                <span className={cn("text-[10px] font-mono", cfg.color)}>{health}% Health</span>
                <span className="text-[9px] text-muted-foreground">{machine.type}</span>
              </div>

              {/* Static Metrics (In real app, these would come from the telemetry hook) */}
              <div className="mt-2 grid grid-cols-3 gap-1 opacity-60">
                <div className="flex items-center gap-1">
                  <Vibrate className="h-2.5 w-2.5 text-muted-foreground" />
                  <span className="text-[9px] font-mono text-muted-foreground">--</span>
                </div>
                <div className="flex items-center gap-1">
                  <Thermometer className="h-2.5 w-2.5 text-muted-foreground" />
                  <span className="text-[9px] font-mono text-muted-foreground">--</span>
                </div>
                <div className="flex items-center gap-1">
                  <Gauge className="h-2.5 w-2.5 text-muted-foreground" />
                  <span className="text-[9px] font-mono text-muted-foreground">--</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      {machines.length === 0 && (
        <div className="mt-10 text-center py-10 border border-dashed rounded-lg">
          <p className="text-xs text-muted-foreground">No machines found. Please run seed_data.sql in Supabase.</p>
        </div>
      )}
    </div>
  )
}
