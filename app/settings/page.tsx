"use client"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { cn } from "@/lib/utils"
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Cpu,
  Wifi,
  Database,
  Globe,
  ToggleLeft,
  Loader2,
} from "lucide-react"
import { useSettings, SettingsState } from "@/hooks/use-settings"
import { useAIInsights } from "@/hooks/use-ai-insights"
import { useMachines } from "@/hooks/use-machines"
import { useTelemetry } from "@/hooks/use-telemetry"
import { generateAnalyticsReport } from "@/lib/export-utils"
import { toast } from "sonner"

export default function SettingsPage() {
  const { settings, updateSetting, initialized } = useSettings()
  const { machines } = useMachines()
  const { telemetry } = useTelemetry()

  const handleExportAnalytics = async () => {
    toast.promise(generateAnalyticsReport(machines, telemetry), {
      loading: 'Compiling cluster data...',
      success: 'Analytics Exported!',
      error: 'Export failed',
    })
  }

  const sections = [
    {
      title: "Alert Configuration",
      icon: Bell,
      items: [
        { key: "criticalAlerts", label: "Critical Alert Notifications", description: "Receive real-time alerts for critical machine events" },
        { key: "warningAlerts", label: "Warning Threshold Alerts", description: "Get notified when metrics approach warning thresholds" },
        { key: "maintenanceReminders", label: "Maintenance Reminders", description: "Automated reminders for scheduled maintenance tasks" },
        { key: "emailDigest", label: "Email Digest", description: "Daily summary of all alerts and events" },
      ],
    },
    {
      title: "Digital Twin Settings",
      icon: Cpu,
      items: [
        { key: "realTimeSync", label: "Real-time Sync", description: "Keep digital twin synchronized with physical machine state" },
        { key: "highFidelityRendering", label: "High-fidelity Rendering", description: "Enable advanced rendering features (higher GPU usage)" },
        { key: "predictiveOverlay", label: "Predictive Overlay", description: "Show AI-predicted future states on the digital twin" },
      ],
    },
    {
      title: "Federation & Privacy",
      icon: Shield,
      items: [
        { key: "federatedLearning", label: "Federated Learning", description: "Participate in privacy-preserving model training" },
        { key: "differentialPrivacy", label: "Differential Privacy", description: "Add noise to shared model updates for enhanced privacy" },
        { key: "dataSharingConsent", label: "Data Sharing Consent", description: "Allow anonymized aggregate data sharing with cluster" },
      ],
    },
  ]

  const handleToggle = (key: keyof SettingsState, label: string, current: boolean) => {
    updateSetting(key, !current)
    toast.success(`${label} ${!current ? 'Enabled' : 'Disabled'}`, {
      description: `Configuration updated successfully.`,
      duration: 2000,
    })
  }

  if (!initialized) {
    return (
      <DashboardShell>
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground text-balance">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Configure your TaaS command center preferences (Zero-Touch Config)
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-4">
          {sections.map((section) => (
            <div key={section.title} className="glass rounded-xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <section.icon className="h-4 w-4 text-primary" />
                {section.title}
              </h3>
              <div className="flex flex-col gap-3">
                {section.items.map((item) => {
                  const isEnabled = settings[item.key as keyof SettingsState]
                  return (
                    <div
                      key={item.key}
                      className="flex items-center justify-between rounded-lg bg-secondary/30 border border-border/30 px-4 py-3"
                    >
                      <div>
                        <p className="text-xs font-medium text-foreground">
                          {item.label}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {item.description}
                        </p>
                      </div>
                      <div
                        onClick={() => handleToggle(item.key as keyof SettingsState, item.label, !!isEnabled)}
                        className={cn(
                          "relative h-6 w-11 rounded-full transition-all duration-300 cursor-pointer shadow-inner",
                          isEnabled ? "bg-accent" : "bg-secondary"
                        )}
                      >
                        <div
                          className={cn(
                            "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all duration-300 shadow-md",
                            isEnabled ? "translate-x-5" : "translate-x-0.5"
                          )}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* System Info */}
        <div className="flex flex-col gap-4">
          <div className="glass rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <SettingsIcon className="h-4 w-4 text-primary" />
              System Information
            </h3>
            <div className="flex flex-col gap-3 text-xs">
              {[
                { icon: Globe, label: "Platform", value: "TaaS v2.4.1" },
                { icon: Cpu, label: "AI Engine", value: "TwinNet FL v3" },
                { icon: Database, label: "Data Store", value: "Edge + Cloud" },
                { icon: Wifi, label: "IoT Protocol", value: "MQTT / OPC-UA" },
                { icon: Shield, label: "Encryption", value: "AES-256" },
                { icon: ToggleLeft, label: "API Status", value: "Operational" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-lg bg-secondary/30 border border-border/30 px-3 py-2.5"
                >
                  <div className="flex items-center gap-2">
                    <item.icon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">{item.label}</span>
                  </div>
                  <span className="font-mono text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Quick Actions
            </h3>
            <div className="flex flex-col gap-2">
              {[
                { label: "Recalibrate Twin Model", action: () => toast.info("Recalibrating...", { description: "Instruction sent to Edge Gateway." }) },
                { label: "Export Analytics Report", action: handleExportAnalytics },
                { label: "Clear Alert History", action: () => toast.info("Clearing alerts...", { description: "Storage purged." }) },
                { label: "Sync Federation Nodes", action: () => toast.info("Syncing nodes...", { description: "Privacy-preserved weights propagated." }) },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="w-full rounded-lg border border-border/30 bg-secondary/20 px-4 py-2.5 text-xs font-medium text-foreground text-left transition-all hover:bg-secondary/50 hover:border-primary/50"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
