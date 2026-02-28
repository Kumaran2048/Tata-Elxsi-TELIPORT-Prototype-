"use client"

import { useState } from "react"
import { SidebarNav } from "./sidebar-nav"
import { TopBar } from "./top-bar"
import { AlertToastSystem } from "./alert-toast"
import { cn } from "@/lib/utils"

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      <SidebarNav
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />
      <div
        className={cn(
          "flex flex-1 flex-col transition-all duration-300",
          collapsed ? "ml-[72px]" : "ml-[72px] lg:ml-[240px]"
        )}
      >
        <TopBar />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
      <AlertToastSystem />
    </div>
  )
}
