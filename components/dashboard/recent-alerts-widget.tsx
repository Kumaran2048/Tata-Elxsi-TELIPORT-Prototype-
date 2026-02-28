"use client"

import { useSyncExternalStore } from "react"
import Link from "next/link"
import { AlertTriangle, Info, XCircle, ArrowUpRight, BrainCircuit } from "lucide-react"
import { alertStore } from "@/lib/alert-store"
import { TimeAgo } from "./time-ago"
import { cn } from "@/lib/utils"
import { useAIInsights } from "@/hooks/use-ai-insights"
import { useSettings } from "@/hooks/use-settings"

const severityIcon = {
  critical: XCircle,
  warning: AlertTriangle,
  info: Info,
}

const severityColor = {
  critical: "text-destructive",
  warning: "text-warning",
  info: "text-primary",
}

export function RecentAlertsWidget() {
  const { insights, loading: insightsLoading } = useAIInsights()
  const { settings } = useSettings()
  const localAlerts = useSyncExternalStore(
    alertStore.subscribe,
    alertStore.getSnapshot,
    alertStore.getServerSnapshot
  )

  // Use DB insights if available, otherwise local alerts
  const displayAlerts = (insights.length > 0
    ? insights.map(ins => ({
      id: ins.id,
      timestamp: new Date(ins.created_at).getTime(),
      severity: (ins.alert_type.toLowerCase().includes('fault') ? 'critical' : 'warning') as 'critical' | 'warning',
      machine: ins.mname,
      title: ins.alert_type,
      description: ins.prediction_message,
      confidence: ins.confidence_score,
      acknowledged: false
    })) : localAlerts.map(a => ({ ...a, confidence: undefined })).slice(0, 4))
    .filter(alert => {
      if (alert.severity === 'critical') return settings.criticalAlerts
      if (alert.severity === 'warning') return settings.warningAlerts
      return true
    })

  return (
    <div className="glass rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <BrainCircuit className="h-4 w-4 text-accent" />
            Recent Insights
          </h3>
          <p className="text-xs text-muted-foreground">
            Predictive AI Feed
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
            {insights.length > 0 ? 'LIVE DB' : 'SIMULATED'}
          </span>
          <Link
            href="/alerts"
            className="flex items-center gap-1 text-xs text-primary font-medium hover:underline"
          >
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      <div className="space-y-2">
        {displayAlerts.length === 0 && insightsLoading && (
          <div className="flex items-center justify-center py-8 text-xs text-muted-foreground">
            Scanning for insights...
          </div>
        )}
        {displayAlerts.map((alert) => {
          const Icon = severityIcon[alert.severity] || Info
          return (
            <div
              key={alert.id}
              className={cn(
                "flex items-start gap-3 rounded-lg border p-3 transition-all hover:border-primary/30",
                alert.acknowledged
                  ? "border-border/30 bg-secondary/20 opacity-60"
                  : "border-border/50 bg-secondary/30"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 mt-0.5 shrink-0",
                  severityColor[alert.severity as keyof typeof severityColor] || "text-primary"
                )}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-foreground truncate">
                    {alert.title}
                  </span>
                  <TimeAgo
                    timestamp={alert.timestamp}
                    className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                  {alert.machine}
                  {alert.confidence && <span className="ml-2 px-1 bg-accent/10 text-accent rounded">{(alert.confidence * 100).toFixed(0)}% Conf.</span>}
                </p>

                {/* Action Triggers for Predictive Maintenance */}
                {alert.severity === 'critical' && !alert.acknowledged && (
                  <div className="mt-2 flex gap-2">
                    <button className="text-[9px] bg-primary/20 text-primary px-2 py-1 rounded border border-primary/30 hover:bg-primary/30 transition-colors">
                      Order Spare Part
                    </button>
                    <button className="text-[9px] bg-accent/20 text-accent px-2 py-1 rounded border border-accent/30 hover:bg-accent/30 transition-colors">
                      Schedule Tech
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
