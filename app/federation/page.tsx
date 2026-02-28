"use client"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { cn } from "@/lib/utils"
import {
  Network,
  Shield,
  Cpu,
  ArrowRightLeft,
  Lock,
  Layers,
  TrendingUp,
  Globe,
} from "lucide-react"

const nodes = [
  {
    id: "node-1",
    name: "TaaS Hub - Mumbai",
    role: "Aggregator",
    status: "active" as const,
    factories: 12,
    models: 34,
    accuracy: 94.2,
    lastSync: "2s ago",
  },
  {
    id: "node-2",
    name: "TaaS Node - Pune",
    role: "Contributor",
    status: "active" as const,
    factories: 8,
    models: 22,
    accuracy: 91.8,
    lastSync: "5s ago",
  },
  {
    id: "node-3",
    name: "TaaS Node - Chennai",
    role: "Contributor",
    status: "active" as const,
    factories: 6,
    models: 18,
    accuracy: 93.1,
    lastSync: "3s ago",
  },
  {
    id: "node-4",
    name: "TaaS Node - Bangalore",
    role: "Contributor",
    status: "syncing" as const,
    factories: 10,
    models: 28,
    accuracy: 92.5,
    lastSync: "12s ago",
  },
  {
    id: "node-5",
    name: "TaaS Node - Ahmedabad",
    role: "Contributor",
    status: "active" as const,
    factories: 4,
    models: 11,
    accuracy: 90.3,
    lastSync: "8s ago",
  },
]

const metrics = [
  { label: "Global Model Accuracy", value: "94.2%", icon: TrendingUp, color: "text-accent" },
  { label: "FL Rounds Completed", value: "1,247", icon: ArrowRightLeft, color: "text-primary" },
  { label: "Active Nodes", value: "5 / 5", icon: Globe, color: "text-accent" },
  { label: "Data Privacy Score", value: "100%", icon: Shield, color: "text-primary" },
]

export default function FederationPage() {
  return (
    <DashboardShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground text-balance">
          Federated Intelligence
        </h1>
        <p className="text-sm text-muted-foreground">
          Privacy-preserving AI training across MSME factory clusters
        </p>
      </div>

      {/* Metrics */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="glass rounded-xl p-4">
            <div className="flex items-center gap-2">
              <m.icon className={cn("h-4 w-4", m.color)} />
              <span className="text-xs text-muted-foreground">{m.label}</span>
            </div>
            <p className={cn("mt-1 text-2xl font-mono font-bold", m.color)}>
              {m.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Network Visualization */}
        <div className="lg:col-span-2 glass rounded-xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Network className="h-4 w-4 text-primary" />
            Federation Network
          </h3>

          {/* Stylized network diagram */}
          <div className="relative h-[360px] rounded-lg bg-secondary/20 border border-border/30 overflow-hidden">
            {/* Grid background */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(circle, hsl(187 92% 55% / 0.15) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />

            {/* Central Hub */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <div className="absolute -inset-8 animate-spin rounded-full border border-dashed border-primary/20" style={{ animationDuration: "20s" }} />
                <div className="absolute -inset-16 rounded-full border border-dashed border-primary/10 animate-spin" style={{ animationDuration: "30s", animationDirection: "reverse" }} />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 border border-primary/30 glow-cyan">
                  <div className="text-center">
                    <Cpu className="h-6 w-6 text-primary mx-auto" />
                    <span className="text-[8px] font-bold text-primary mt-1 block">
                      HUB
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Satellite Nodes */}
            {nodes.slice(1).map((node, i) => {
              const angle = (i / 4) * Math.PI * 2 - Math.PI / 2
              const x = 50 + Math.cos(angle) * 32
              const y = 50 + Math.sin(angle) * 35
              return (
                <div
                  key={node.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  <div
                    className={cn(
                      "flex h-14 w-14 items-center justify-center rounded-xl border backdrop-blur-sm",
                      node.status === "active"
                        ? "border-accent/30 bg-accent/10"
                        : "border-warning/30 bg-warning/10"
                    )}
                  >
                    <div className="text-center">
                      <Layers className={cn("h-4 w-4 mx-auto", node.status === "active" ? "text-accent" : "text-warning")} />
                      <span className={cn("text-[7px] font-bold mt-0.5 block", node.status === "active" ? "text-accent" : "text-warning")}>
                        {node.name.split(" - ")[1]}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Data flow indicators */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-lg bg-card/80 backdrop-blur-xl px-3 py-1.5">
              <ArrowRightLeft className="h-3 w-3 text-primary animate-pulse" />
              <span className="text-[10px] text-muted-foreground">
                <span className="font-mono text-primary">FL Round #1,247</span>{" "}
                in progress
              </span>
            </div>

            <div className="absolute top-3 right-3 flex items-center gap-2 rounded-lg bg-card/80 backdrop-blur-xl px-3 py-1.5">
              <Lock className="h-3 w-3 text-accent" />
              <span className="text-[10px] font-mono text-accent">
                Differential Privacy ON
              </span>
            </div>
          </div>
        </div>

        {/* Node List */}
        <div className="glass rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">
            Cluster Nodes
          </h3>
          <div className="flex flex-col gap-3">
            {nodes.map((node) => (
              <div
                key={node.id}
                className="rounded-lg bg-secondary/30 border border-border/30 p-3"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full",
                        node.status === "active"
                          ? "bg-accent"
                          : "bg-warning animate-pulse"
                      )}
                    />
                    <span className="text-xs font-medium text-foreground">
                      {node.name}
                    </span>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider",
                      node.role === "Aggregator"
                        ? "bg-primary/10 text-primary"
                        : "bg-secondary text-muted-foreground"
                    )}
                  >
                    {node.role}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[10px]">
                  <div>
                    <span className="text-muted-foreground block">
                      Factories
                    </span>
                    <span className="font-mono text-foreground font-bold">
                      {node.factories}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">
                      Accuracy
                    </span>
                    <span className="font-mono text-accent font-bold">
                      {node.accuracy}%
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Sync</span>
                    <span className="font-mono text-primary font-bold">
                      {node.lastSync}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
