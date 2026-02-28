"use client"

import { useSyncExternalStore, useState, useMemo } from "react"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { alertStore, type TaaSAlert } from "@/lib/alert-store"
import { TimeAgo } from "@/components/dashboard/time-ago"
import { cn } from "@/lib/utils"
import {
  XCircle,
  AlertTriangle,
  Info,
  CheckCircle2,
  Filter,
  Trash2,
  Clock,
  Search,
} from "lucide-react"

type SeverityFilter = "all" | "critical" | "warning" | "info"

const severityConfig = {
  critical: {
    icon: XCircle,
    label: "Critical",
    color: "text-destructive",
    bg: "bg-destructive/10",
    border: "border-destructive/30",
    glow: "glow-red",
    badge: "bg-destructive/20 text-destructive",
  },
  warning: {
    icon: AlertTriangle,
    label: "Warning",
    color: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/30",
    glow: "glow-amber",
    badge: "bg-warning/20 text-warning",
  },
  info: {
    icon: Info,
    label: "Info",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/30",
    glow: "glow-cyan",
    badge: "bg-primary/20 text-primary",
  },
}

function AlertCard({
  alert,
  onAcknowledge,
  onClear,
}: {
  alert: TaaSAlert
  onAcknowledge: () => void
  onClear: () => void
}) {
  const config = severityConfig[alert.severity]
  const Icon = config.icon

  return (
    <div
      className={cn(
        "group relative rounded-xl border p-4 backdrop-blur-xl transition-all duration-300",
        alert.acknowledged
          ? "border-border/30 bg-secondary/20 opacity-60"
          : cn(config.border, config.bg, config.glow)
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn("mt-0.5 shrink-0 rounded-lg p-2", config.bg)}>
          <Icon className={cn("h-5 w-5", config.color)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                config.badge
              )}
            >
              {config.label}
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              {alert.machine}
            </span>
            <span className="text-xs text-muted-foreground">
              {alert.machineId}
            </span>
            {alert.acknowledged && (
              <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                <CheckCircle2 className="h-3 w-3" />
                Acknowledged
              </span>
            )}
          </div>
          <h3 className="mt-1.5 text-sm font-semibold text-foreground">
            {alert.title}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            {alert.description}
          </p>

          {alert.metric &&
            alert.value !== undefined &&
            alert.threshold !== undefined && (
              <div className="mt-3 flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className="text-muted-foreground">
                      {alert.metric}
                    </span>
                    <span className={cn("font-mono font-bold", config.color)}>
                      {alert.value} / {alert.threshold}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-secondary/50 overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all", {
                        "bg-destructive": alert.severity === "critical",
                        "bg-warning": alert.severity === "warning",
                        "bg-primary": alert.severity === "info",
                      })}
                      style={{
                        width: `${Math.min((alert.value / (alert.threshold * 1.5)) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

          <div className="mt-3 flex items-center gap-3">
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock className="h-3 w-3" />
              <TimeAgo
                timestamp={alert.timestamp}
                className="text-[10px] text-muted-foreground"
              />
            </div>
            <div className="flex-1" />
            {!alert.acknowledged && (
              <button
                onClick={onAcknowledge}
                className="rounded-lg bg-secondary/50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-foreground transition-colors hover:bg-secondary"
              >
                Acknowledge
              </button>
            )}
            <button
              onClick={onClear}
              className="rounded-lg bg-secondary/30 p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AlertsPage() {
  const alerts = useSyncExternalStore(
    alertStore.subscribe,
    alertStore.getSnapshot,
    alertStore.getServerSnapshot
  )
  const [filter, setFilter] = useState<SeverityFilter>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showAcknowledged, setShowAcknowledged] = useState(true)

  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => {
      if (filter !== "all" && a.severity !== filter) return false
      if (!showAcknowledged && a.acknowledged) return false
      if (
        searchQuery &&
        !a.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !a.machine.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !a.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false
      return true
    })
  }, [alerts, filter, searchQuery, showAcknowledged])

  const counts = useMemo(
    () => ({
      all: alerts.length,
      critical: alerts.filter((a) => a.severity === "critical").length,
      warning: alerts.filter((a) => a.severity === "warning").length,
      info: alerts.filter((a) => a.severity === "info").length,
      unacknowledged: alerts.filter((a) => !a.acknowledged).length,
    }),
    [alerts]
  )

  const filterTabs: {
    key: SeverityFilter
    label: string
    count: number
    color: string
  }[] = [
    { key: "all", label: "All", count: counts.all, color: "text-foreground" },
    {
      key: "critical",
      label: "Critical",
      count: counts.critical,
      color: "text-destructive",
    },
    {
      key: "warning",
      label: "Warning",
      count: counts.warning,
      color: "text-warning",
    },
    { key: "info", label: "Info", count: counts.info, color: "text-primary" },
  ]

  return (
    <DashboardShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground text-balance">
          Alert Center
        </h1>
        <p className="text-sm text-muted-foreground">
          {counts.unacknowledged} unacknowledged alerts across your factory
          cluster
        </p>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          {
            label: "Total Alerts",
            value: counts.all,
            color: "text-foreground",
            icon: Filter,
          },
          {
            label: "Critical",
            value: counts.critical,
            color: "text-destructive",
            icon: XCircle,
          },
          {
            label: "Warnings",
            value: counts.warning,
            color: "text-warning",
            icon: AlertTriangle,
          },
          {
            label: "Unacknowledged",
            value: counts.unacknowledged,
            color: "text-primary",
            icon: Info,
          },
        ].map((card) => (
          <div key={card.label} className="glass rounded-xl p-4">
            <div className="flex items-center gap-2">
              <card.icon className={cn("h-4 w-4", card.color)} />
              <span className="text-xs text-muted-foreground">
                {card.label}
              </span>
            </div>
            <p
              className={cn(
                "mt-1 text-2xl font-mono font-bold",
                card.color
              )}
            >
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-1 rounded-lg bg-secondary/30 p-1">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                filter === tab.key
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span>{tab.label}</span>
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                  filter === tab.key
                    ? "bg-primary/20 text-primary"
                    : "bg-secondary/50"
                )}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 lg:w-64 lg:flex-none">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search alerts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border/50 bg-secondary/30 py-2 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20"
            />
          </div>
          <button
            onClick={() => setShowAcknowledged(!showAcknowledged)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all",
              showAcknowledged
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-border/50 bg-secondary/30 text-muted-foreground"
            )}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            {showAcknowledged ? "Showing All" : "Hide Acknowledged"}
          </button>
        </div>
      </div>

      {/* Alert Feed */}
      <div className="flex flex-col gap-3">
        {filteredAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border/30 bg-secondary/10 py-16">
            <CheckCircle2 className="h-12 w-12 text-accent/40 mb-3" />
            <p className="text-sm font-medium text-foreground">All Clear</p>
            <p className="text-xs text-muted-foreground">
              No alerts match your current filters
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onAcknowledge={() => alertStore.acknowledgeAlert(alert.id)}
              onClear={() => alertStore.clearAlert(alert.id)}
            />
          ))
        )}
      </div>
    </DashboardShell>
  )
}
