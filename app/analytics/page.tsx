"use client"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  Wrench,
  Zap,
  Factory,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  RadialBarChart,
  RadialBar,
  Legend,
} from "recharts"

const oeeData = [
  { month: "Jul", oee: 72, target: 85 },
  { month: "Aug", oee: 75, target: 85 },
  { month: "Sep", oee: 78, target: 85 },
  { month: "Oct", oee: 74, target: 85 },
  { month: "Nov", oee: 82, target: 85 },
  { month: "Dec", oee: 81, target: 85 },
  { month: "Jan", oee: 86, target: 85 },
  { month: "Feb", oee: 89, target: 85 },
]

const downtimeData = [
  { machine: "CNC #1", planned: 4, unplanned: 2 },
  { machine: "CNC #3", planned: 3, unplanned: 8 },
  { machine: "Press #1", planned: 5, unplanned: 1 },
  { machine: "Mill #2", planned: 6, unplanned: 3 },
  { machine: "Weld #2", planned: 2, unplanned: 5 },
]

const savingsRadial = [
  { name: "Downtime Saved", value: 78, fill: "hsl(187, 92%, 55%)" },
  { name: "Energy Saved", value: 65, fill: "hsl(78, 70%, 55%)" },
  { name: "Parts Saved", value: 42, fill: "hsl(40, 96%, 56%)" },
]

const kpis = [
  {
    label: "Cost Saved",
    value: "$124K",
    change: "+23%",
    trend: "up" as const,
    icon: DollarSign,
    color: "text-accent",
  },
  {
    label: "Downtime Reduced",
    value: "340h",
    change: "-42%",
    trend: "down" as const,
    icon: Clock,
    color: "text-primary",
  },
  {
    label: "Predictions Made",
    value: "2,847",
    change: "+18%",
    trend: "up" as const,
    icon: Zap,
    color: "text-warning",
  },
  {
    label: "Avg MTBF",
    value: "847h",
    change: "+31%",
    trend: "up" as const,
    icon: Wrench,
    color: "text-primary",
  },
]

export default function AnalyticsPage() {
  return (
    <DashboardShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground text-balance">
          Analytics
        </h1>
        <p className="text-sm text-muted-foreground">
          Predictive maintenance performance and factory impact metrics
        </p>
      </div>

      {/* KPI Cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="glass rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <kpi.icon className={cn("h-4 w-4", kpi.color)} />
                <span className="text-xs text-muted-foreground">
                  {kpi.label}
                </span>
              </div>
              <div
                className={cn(
                  "flex items-center gap-0.5 text-[10px] font-bold",
                  kpi.trend === "up" && kpi.label !== "Downtime Reduced"
                    ? "text-accent"
                    : kpi.label === "Downtime Reduced"
                    ? "text-accent"
                    : "text-destructive"
                )}
              >
                {kpi.trend === "up" ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {kpi.change}
              </div>
            </div>
            <p className={cn("mt-1 text-2xl font-mono font-bold", kpi.color)}>
              {kpi.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* OEE Trend */}
        <div className="lg:col-span-2 glass rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                OEE Trend
              </h3>
              <p className="text-xs text-muted-foreground">
                Overall Equipment Effectiveness vs target
              </p>
            </div>
            <div className="flex items-center gap-3 text-[10px]">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-muted-foreground">OEE</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-warning" />
                <span className="text-muted-foreground">Target</span>
              </div>
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={oeeData}>
                <defs>
                  <linearGradient id="oeeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="hsl(187, 92%, 55%)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(187, 92%, 55%)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(217, 33%, 20%)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  stroke="hsl(215, 20%, 45%)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(215, 20%, 45%)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  domain={[60, 100]}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(222, 47%, 14%)",
                    border: "1px solid hsl(217, 33%, 20%)",
                    borderRadius: "8px",
                    fontSize: "11px",
                    color: "hsl(210, 40%, 96%)",
                  }}
                  formatter={(value: number) => [`${value}%`]}
                />
                <Area
                  type="monotone"
                  dataKey="target"
                  stroke="hsl(40, 96%, 56%)"
                  strokeDasharray="5 5"
                  strokeWidth={1.5}
                  fill="none"
                />
                <Area
                  type="monotone"
                  dataKey="oee"
                  stroke="hsl(187, 92%, 55%)"
                  strokeWidth={2}
                  fill="url(#oeeGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Savings Radial */}
        <div className="glass rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-accent" />
            Savings Breakdown
          </h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="30%"
                outerRadius="90%"
                barSize={12}
                data={savingsRadial}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar
                  dataKey="value"
                  cornerRadius={6}
                  background={{ fill: "hsl(217, 33%, 18%)" }}
                />
                <Legend
                  iconType="circle"
                  iconSize={6}
                  wrapperStyle={{ fontSize: "10px" }}
                  formatter={(value) => (
                    <span style={{ color: "hsl(215, 20%, 55%)" }}>{value}</span>
                  )}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-col gap-2 text-xs">
            {savingsRadial.map((s) => (
              <div key={s.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: s.fill }}
                  />
                  <span className="text-muted-foreground">{s.name}</span>
                </div>
                <span className="font-mono font-bold text-foreground">
                  {s.value}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Downtime Breakdown */}
        <div className="lg:col-span-2 glass rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-warning" />
                Downtime Breakdown
              </h3>
              <p className="text-xs text-muted-foreground">
                Planned vs unplanned downtime by machine (hours)
              </p>
            </div>
          </div>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={downtimeData} barGap={4}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(217, 33%, 20%)"
                  vertical={false}
                />
                <XAxis
                  dataKey="machine"
                  stroke="hsl(215, 20%, 45%)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(215, 20%, 45%)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v}h`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(222, 47%, 14%)",
                    border: "1px solid hsl(217, 33%, 20%)",
                    borderRadius: "8px",
                    fontSize: "11px",
                    color: "hsl(210, 40%, 96%)",
                  }}
                  formatter={(value: number) => [`${value}h`]}
                />
                <Bar
                  dataKey="planned"
                  fill="hsl(187, 92%, 55%)"
                  radius={[4, 4, 0, 0]}
                  name="Planned"
                />
                <Bar
                  dataKey="unplanned"
                  fill="hsl(0, 72%, 51%)"
                  radius={[4, 4, 0, 0]}
                  name="Unplanned"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Predictions Accuracy */}
        <div className="glass rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Factory className="h-4 w-4 text-primary" />
            Factory Performance
          </h3>
          <div className="flex flex-col gap-3">
            {[
              { name: "Unit A - Turning", efficiency: 94, status: "Optimal" },
              { name: "Unit B - Milling", efficiency: 87, status: "Good" },
              { name: "Unit C - Welding", efficiency: 72, status: "Needs Attention" },
              { name: "Unit D - Assembly", efficiency: 91, status: "Good" },
              { name: "Unit E - QC", efficiency: 96, status: "Optimal" },
            ].map((unit) => (
              <div
                key={unit.name}
                className="rounded-lg bg-secondary/30 border border-border/30 p-3"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-foreground">
                    {unit.name}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] font-bold",
                      unit.efficiency >= 90
                        ? "text-accent"
                        : unit.efficiency >= 80
                        ? "text-primary"
                        : "text-warning"
                    )}
                  >
                    {unit.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 flex-1 rounded-full bg-secondary/50 overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all", {
                        "bg-accent": unit.efficiency >= 90,
                        "bg-primary": unit.efficiency >= 80 && unit.efficiency < 90,
                        "bg-warning": unit.efficiency < 80,
                      })}
                      style={{ width: `${unit.efficiency}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono font-bold text-foreground w-8 text-right">
                    {unit.efficiency}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
