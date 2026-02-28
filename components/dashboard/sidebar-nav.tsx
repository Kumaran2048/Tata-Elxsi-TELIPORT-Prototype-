"use client"

import { useState, useSyncExternalStore } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Box,
  Bell,
  Network,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Cpu,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { alertStore } from "@/lib/alert-store"

const navItems = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/digital-twin", icon: Box, label: "Digital Twin" },
  { href: "/alerts", icon: Bell, label: "Alerts" },
  { href: "/federation", icon: Network, label: "Federation" },
  { href: "/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/settings", icon: Settings, label: "Settings" },
]

export function SidebarNav({
  collapsed,
  onToggle,
}: {
  collapsed: boolean
  onToggle: () => void
}) {
  const pathname = usePathname()
  const alerts = useSyncExternalStore(
    alertStore.subscribe,
    alertStore.getSnapshot,
    alertStore.getServerSnapshot
  )
  const unacknowledgedCount = alerts.filter((a) => !a.acknowledged).length

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-50 flex h-screen flex-col glass-strong transition-all duration-300",
        collapsed ? "w-[72px]" : "w-[240px]"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-border/50 px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 glow-cyan">
          <Cpu className="h-5 w-5 text-primary" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-wide text-foreground">
              TaaS
            </span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              Command Center
            </span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary glow-cyan"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-r bg-primary" />
              )}
              <item.icon
                className={cn("h-5 w-5 shrink-0", isActive && "text-primary")}
              />
              {!collapsed && <span>{item.label}</span>}
              {item.href === "/alerts" && unacknowledgedCount > 0 && (
                <span
                  className={cn(
                    "flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground",
                    collapsed ? "absolute -right-1 -top-1" : "ml-auto"
                  )}
                >
                  {unacknowledgedCount}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="border-t border-border/50 p-3">
        <button
          onClick={onToggle}
          className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  )
}
