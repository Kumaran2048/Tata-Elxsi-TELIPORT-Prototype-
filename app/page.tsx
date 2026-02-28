"use client"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { VibrationChart } from "@/components/dashboard/vibration-chart"
import { TemperatureChart } from "@/components/dashboard/temperature-chart"
import { ImpactCounter } from "@/components/dashboard/impact-counter"
import { MachineStatusGrid } from "@/components/dashboard/machine-status"
import { MiniTwinPreview } from "@/components/dashboard/mini-twin-preview"
import { RecentAlertsWidget } from "@/components/dashboard/recent-alerts-widget"
import { SustainabilityCard } from "@/components/dashboard/sustainability-card"
import { LeaderboardWidget } from "@/components/dashboard/leaderboard-widget"
import { ConnectionStatus } from "@/components/dashboard/connection-status"

export default function DashboardPage() {
  return (
    <DashboardShell>
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground text-balance">Command Center</h1>
          <p className="text-sm text-muted-foreground">
            Real-time monitoring across your MSME factory cluster
          </p>
        </div>
        <ConnectionStatus />
      </div>

      {/* Bento Grid */}
      <div className="grid gap-4 lg:grid-cols-4">
        {/* Row 1: Real-time Analytics */}
        <div className="lg:col-span-1">
          <VibrationChart />
        </div>
        <div className="lg:col-span-2">
          <MiniTwinPreview />
        </div>
        <div className="lg:col-span-1">
          <TemperatureChart />
        </div>

        {/* Row 2: Fleet & Insights */}
        <div className="lg:col-span-3">
          <MachineStatusGrid />
        </div>
        <div className="lg:col-span-1">
          <RecentAlertsWidget />
        </div>

        {/* Row 3: Tata-MSME Specific Features */}
        <div className="lg:col-span-2">
          <SustainabilityCard />
        </div>
        <div className="lg:col-span-2">
          <LeaderboardWidget />
        </div>

        {/* Row 4: Impact */}
        <div className="lg:col-span-4">
          <ImpactCounter />
        </div>
      </div>
    </DashboardShell>
  )
}
