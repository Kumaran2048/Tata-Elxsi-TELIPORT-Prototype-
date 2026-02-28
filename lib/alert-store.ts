// Global alert store using useSyncExternalStore pattern
export interface TaaSAlert {
  id: string
  timestamp: number // use number (ms since epoch) to avoid hydration issues
  severity: "critical" | "warning" | "info"
  machine: string
  machineId: string
  title: string
  description: string
  metric?: string
  value?: number
  threshold?: number
  acknowledged: boolean
}

type Listener = () => void

// Stable initial timestamps - fixed offsets from a reference point
const INIT_TIME = typeof window !== "undefined" ? Date.now() : 0

let alerts: TaaSAlert[] = []

const listeners = new Set<Listener>()

function emitChange() {
  listeners.forEach((listener) => listener())
}

function initAlerts() {
  const now = Date.now()
  alerts = [
    {
      id: "alert-001",
      timestamp: now - 1000 * 60 * 2,
      severity: "critical",
      machine: "CNC Lathe #3",
      machineId: "cnc-003",
      title: "Bearing Wear Detected",
      description:
        "Vibration amplitude exceeded 4.2mm/s on spindle bearing. Predicted failure in 72 hours.",
      metric: "Vibration",
      value: 4.2,
      threshold: 3.5,
      acknowledged: false,
    },
    {
      id: "alert-002",
      timestamp: now - 1000 * 60 * 15,
      severity: "warning",
      machine: "Hydraulic Press #1",
      machineId: "hp-001",
      title: "Temperature Rising",
      description:
        "Hydraulic fluid temperature trending above optimal range. Current: 78\u00b0C, Threshold: 75\u00b0C.",
      metric: "Temperature",
      value: 78,
      threshold: 75,
      acknowledged: false,
    },
    {
      id: "alert-003",
      timestamp: now - 1000 * 60 * 45,
      severity: "info",
      machine: "Milling Machine #2",
      machineId: "mm-002",
      title: "Maintenance Scheduled",
      description:
        "Routine lubrication cycle due in 48 hours. System auto-scheduled based on usage patterns.",
      acknowledged: true,
    },
    {
      id: "alert-004",
      timestamp: now - 1000 * 60 * 60,
      severity: "warning",
      machine: "Compressor Unit #4",
      machineId: "cu-004",
      title: "Pressure Fluctuation",
      description:
        "Output pressure variance detected. Oscillating between 5.8-6.4 bar (nominal: 6.0 bar).",
      metric: "Pressure",
      value: 6.4,
      threshold: 6.2,
      acknowledged: false,
    },
    {
      id: "alert-005",
      timestamp: now - 1000 * 60 * 120,
      severity: "critical",
      machine: "Welding Robot #2",
      machineId: "wr-002",
      title: "Arc Instability",
      description:
        "Welding arc voltage showing irregular patterns. Quality inspection recommended for last 50 welds.",
      metric: "Arc Voltage",
      value: 28.5,
      threshold: 26.0,
      acknowledged: true,
    },
  ]
}

let initialized = false

// MUST be a stable, referentially identical value to avoid infinite loop in useSyncExternalStore
const EMPTY_ALERTS: TaaSAlert[] = []

function ensureInitialized() {
  if (!initialized && typeof window !== "undefined") {
    initialized = true
    initAlerts()
  }
}

export const alertStore = {
  subscribe(listener: Listener) {
    // Initialize on first subscription (happens in useEffect, not during render)
    ensureInitialized()
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  getSnapshot(): TaaSAlert[] {
    // Never trigger side effects in getSnapshot - just return current state
    return initialized ? alerts : EMPTY_ALERTS
  },
  getServerSnapshot(): TaaSAlert[] {
    return EMPTY_ALERTS
  },
  addAlert(alert: Omit<TaaSAlert, "id" | "timestamp" | "acknowledged">) {
    const newAlert: TaaSAlert = {
      ...alert,
      id: `alert-${Date.now()}`,
      timestamp: Date.now(),
      acknowledged: false,
    }
    alerts = [newAlert, ...alerts]
    emitChange()
    return newAlert
  },
  acknowledgeAlert(id: string) {
    alerts = alerts.map((a) =>
      a.id === id ? { ...a, acknowledged: true } : a
    )
    emitChange()
  },
  clearAlert(id: string) {
    alerts = alerts.filter((a) => a.id !== id)
    emitChange()
  },
  getUnacknowledgedCount() {
    return alerts.filter((a) => !a.acknowledged).length
  },
}

// Simulated real-time alerts
const simulatedAlerts: Omit<TaaSAlert, "id" | "timestamp" | "acknowledged">[] =
  [
    {
      severity: "warning",
      machine: "CNC Lathe #1",
      machineId: "cnc-001",
      title: "Tool Wear Threshold",
      description:
        "Cutting tool #7 approaching end-of-life. 15% remaining. Schedule replacement.",
      metric: "Tool Life",
      value: 15,
      threshold: 20,
    },
    {
      severity: "critical",
      machine: "Grinding Station #3",
      machineId: "gs-003",
      title: "Coolant Level Critical",
      description:
        "Coolant reservoir at 12%. Machine will auto-stop at 5%.",
      metric: "Coolant Level",
      value: 12,
      threshold: 20,
    },
    {
      severity: "info",
      machine: "Assembly Line #1",
      machineId: "al-001",
      title: "Efficiency Optimized",
      description:
        "AI model adjusted cycle time by -2.3%. Throughput increased to 147 units/hr.",
    },
    {
      severity: "warning",
      machine: "Motor Drive #5",
      machineId: "md-005",
      title: "Power Consumption Spike",
      description:
        "Current draw 18% above baseline. Check for mechanical resistance.",
      metric: "Current",
      value: 24.5,
      threshold: 22.0,
    },
  ]

let simIndex = 0

export function startAlertSimulation() {
  const interval = setInterval(() => {
    const alert = simulatedAlerts[simIndex % simulatedAlerts.length]
    alertStore.addAlert(alert)
    simIndex++
  }, 15000)

  return () => clearInterval(interval)
}
