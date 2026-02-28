"use client"

import { useSyncExternalStore, useEffect, useState } from "react"
import { Activity, Bell, Wifi } from "lucide-react"
import { alertStore, startAlertSimulation } from "@/lib/alert-store"
import { cn } from "@/lib/utils"

export function TopBar() {
  const alerts = useSyncExternalStore(
    alertStore.subscribe,
    alertStore.getSnapshot,
    alertStore.getServerSnapshot
  )
  const unacknowledgedCount = alerts.filter((a) => !a.acknowledged).length
  const criticalCount = alerts.filter(
    (a) => a.severity === "critical" && !a.acknowledged
  ).length

  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    const cleanup = startAlertSimulation()
    return cleanup
  }, [])

  useEffect(() => {
    if (criticalCount > 0) {
      setPulse(true)
      const t = setTimeout(() => setPulse(false), 1000)
      return () => clearTimeout(t)
    }
  }, [criticalCount])

  return (
    <header className="flex h-14 items-center justify-between border-b border-border/50 px-6 glass">
      {/* Factory Heartbeat */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className={cn("relative flex h-3 w-3 items-center justify-center")}>
            <span
              className={cn(
                "absolute inline-flex h-full w-full rounded-full opacity-75",
                criticalCount > 0
                  ? "animate-ping bg-destructive"
                  : "animate-ping bg-accent"
              )}
            />
            <span
              className={cn(
                "relative inline-flex h-2 w-2 rounded-full",
                criticalCount > 0 ? "bg-destructive" : "bg-accent"
              )}
            />
          </div>
          <span className="text-xs font-medium text-muted-foreground">
            Factory Cluster
          </span>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
              criticalCount > 0
                ? "bg-destructive/10 text-destructive"
                : "bg-accent/10 text-accent"
            )}
          >
            {criticalCount > 0 ? "Alert" : "Healthy"}
          </span>
        </div>

        <div className="h-4 w-px bg-border/50" />

        <div className="flex items-center gap-1.5">
          <Activity className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs text-muted-foreground">
            <span className="font-mono text-primary">98.7%</span> Uptime
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Wifi className="h-3.5 w-3.5 text-accent" />
          <span className="text-xs text-muted-foreground">
            <span className="font-mono text-accent">24</span> Nodes Online
          </span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "relative flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs transition-all",
            unacknowledgedCount > 0
              ? "bg-destructive/10"
              : "bg-secondary/50",
            pulse && "glow-red"
          )}
        >
          <Bell
            className={cn(
              "h-4 w-4",
              unacknowledgedCount > 0
                ? "text-destructive"
                : "text-muted-foreground"
            )}
          />
          <span
            className={cn(
              "font-mono font-bold",
              unacknowledgedCount > 0
                ? "text-destructive"
                : "text-muted-foreground"
            )}
          >
            {unacknowledgedCount}
          </span>
          <span className="text-muted-foreground">Active</span>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-1.5 text-xs">
          <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-[10px] font-bold text-primary">OP</span>
          </div>
          <span className="text-muted-foreground">Operator</span>
        </div>
      </div>
    </header>
  )
}
