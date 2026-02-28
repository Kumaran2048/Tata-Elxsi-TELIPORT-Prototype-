"use client"

import { useEffect, useRef, useSyncExternalStore, useState } from "react"
import { AlertTriangle, Info, XCircle, X } from "lucide-react"
import { alertStore, type TaaSAlert } from "@/lib/alert-store"
import { cn } from "@/lib/utils"

function AlertToastItem({ alert, onDismiss }: { alert: TaaSAlert; onDismiss: () => void }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const t = requestAnimationFrame(() => setIsVisible(true))
    return () => cancelAnimationFrame(t)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onDismiss, 300)
    }, 6000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  const severityConfig = {
    critical: {
      icon: XCircle,
      className: "border-destructive/30 bg-destructive/5 glow-red",
      iconColor: "text-destructive",
      label: "Critical",
    },
    warning: {
      icon: AlertTriangle,
      className: "border-warning/30 bg-warning/5 glow-amber",
      iconColor: "text-warning",
      label: "Warning",
    },
    info: {
      icon: Info,
      className: "border-primary/30 bg-primary/5 glow-cyan",
      iconColor: "text-primary",
      label: "Info",
    },
  }

  const config = severityConfig[alert.severity]
  const Icon = config.icon

  return (
    <div
      className={cn(
        "pointer-events-auto w-[380px] rounded-xl border backdrop-blur-xl p-4 transition-all duration-300",
        config.className,
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn("mt-0.5 shrink-0", config.iconColor)}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn("text-[10px] font-bold uppercase tracking-wider", config.iconColor)}>
              {config.label}
            </span>
            <span className="text-[10px] text-muted-foreground">{alert.machine}</span>
          </div>
          <p className="mt-0.5 text-sm font-medium text-foreground">{alert.title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{alert.description}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(onDismiss, 300)
          }}
          className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export function AlertToastSystem() {
  const alerts = useSyncExternalStore(
    alertStore.subscribe,
    alertStore.getSnapshot,
    alertStore.getServerSnapshot
  )
  const [toasts, setToasts] = useState<TaaSAlert[]>([])
  const prevCountRef = useRef(alerts.length)

  useEffect(() => {
    if (alerts.length > prevCountRef.current) {
      const newAlerts = alerts.slice(0, alerts.length - prevCountRef.current)
      setToasts((prev) => [...newAlerts, ...prev].slice(0, 3))
    }
    prevCountRef.current = alerts.length
  }, [alerts])

  return (
    <div className="pointer-events-none fixed right-4 top-20 z-[100] flex flex-col gap-3">
      {toasts.map((toast) => (
        <AlertToastItem
          key={toast.id}
          alert={toast}
          onDismiss={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
        />
      ))}
    </div>
  )
}
