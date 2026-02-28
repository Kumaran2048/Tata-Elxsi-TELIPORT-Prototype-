"use client"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import dynamic from "next/dynamic"
import { Activity, Cpu, Thermometer, Gauge, RotateCcw, Zap } from "lucide-react"

const DigitalTwinScene = dynamic(
  () =>
    import("@/components/dashboard/digital-twin-scene").then(
      (mod) => mod.DigitalTwinScene
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[500px] items-center justify-center rounded-xl border border-border/30 bg-secondary/20">
        <div className="flex flex-col items-center gap-3">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
          </div>
          <p className="text-xs text-muted-foreground font-mono">
            Initializing 3D Engine...
          </p>
        </div>
      </div>
    ),
  }
)

const telemetryData = [
  { label: "Spindle RPM", value: "2,400", unit: "rpm", icon: RotateCcw, color: "text-primary", status: "normal" },
  { label: "Temperature", value: "78", unit: "\u00b0C", icon: Thermometer, color: "text-warning", status: "elevated" },
  { label: "Vibration", value: "4.2", unit: "mm/s", icon: Activity, color: "text-destructive", status: "critical" },
  { label: "Power Draw", value: "12.4", unit: "kW", icon: Zap, color: "text-accent", status: "normal" },
  { label: "Feed Rate", value: "250", unit: "mm/min", icon: Gauge, color: "text-primary", status: "normal" },
  { label: "Load", value: "67", unit: "%", icon: Cpu, color: "text-accent", status: "normal" },
]

export default function DigitalTwinPage() {
  return (
    <DashboardShell>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground text-balance">
            Digital Twin
          </h1>
          <p className="text-sm text-muted-foreground">
            Interactive 3D mirror of CNC Lathe #3 with real-time telemetry
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-mono text-primary">LIVE SYNC</span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        {/* 3D Scene - takes up 3 cols */}
        <div className="lg:col-span-3 glass rounded-xl overflow-hidden" style={{ minHeight: "560px" }}>
          <DigitalTwinScene />
        </div>

        {/* Telemetry sidebar */}
        <div className="flex flex-col gap-3">
          <div className="glass rounded-xl p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
              Live Telemetry
            </h3>
            <div className="flex flex-col gap-2.5">
              {telemetryData.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-lg bg-secondary/30 border border-border/30 px-3 py-2.5"
                >
                  <item.icon className={`h-4 w-4 shrink-0 ${item.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      {item.label}
                    </p>
                    <p className={`text-lg font-mono font-bold leading-tight ${item.color}`}>
                      {item.value}
                      <span className="text-xs font-normal text-muted-foreground ml-1">
                        {item.unit}
                      </span>
                    </p>
                  </div>
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      item.status === "critical"
                        ? "bg-destructive animate-pulse"
                        : item.status === "elevated"
                        ? "bg-warning animate-pulse"
                        : "bg-accent"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Model Info */}
          <div className="glass rounded-xl p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
              Model Info
            </h3>
            <div className="flex flex-col gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Machine</span>
                <span className="font-mono text-foreground">CNC Lathe #3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Twin Version</span>
                <span className="font-mono text-primary">v2.4.1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Calibrated</span>
                <span className="font-mono text-foreground">2h ago</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sync Latency</span>
                <span className="font-mono text-accent">12ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Data Points</span>
                <span className="font-mono text-foreground">1,247/s</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
