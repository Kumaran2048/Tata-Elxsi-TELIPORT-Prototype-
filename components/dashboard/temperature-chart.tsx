"use client"

import { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"
import { useTelemetry } from "@/hooks/use-telemetry"
import { useSettings } from "@/hooks/use-settings"

export function TemperatureChart() {
  const { telemetry, loading } = useTelemetry()
  const { settings } = useSettings()
  const [chartData, setChartData] = useState<any[]>([])

  // Generate dynamic data based on real-time sync setting
  const displayData = settings.realTimeSync ? telemetry : telemetry.slice(0, 5)

  useEffect(() => {
    if (displayData.length > 0) {
      const formatted = [...displayData].reverse().map(t => ({
        time: new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        temp: t.temperature
      }))
      setChartData(formatted)
    } else if (!loading) {
      // Fallback to simulation
      const interval = setInterval(() => {
        setChartData(prev => {
          const nextPoint = {
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            temp: 65 + Math.sin(Date.now() * 0.0005) * 8 + Math.random() * 3
          }
          return [...prev.slice(-14), nextPoint]
        })
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [telemetry, loading])

  const isElevated = chartData.length > 0 && chartData[chartData.length - 1].temp > 75

  return (
    <div className="glass rounded-xl p-5 glow-amber">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Thermal Monitoring
          </h3>
          <p className="text-xs text-muted-foreground">
            Active Thermal Sensors
          </p>
        </div>
        <div className={cn("rounded-md px-2 py-0.5", isElevated ? "bg-warning/10" : "bg-accent/10")}>
          <span className={cn("text-[10px] font-bold", isElevated ? "text-warning" : "text-accent")}>
            {isElevated ? 'ELEVATED' : 'STABLE'}
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(217, 33%, 18%)"
          />
          <XAxis
            dataKey="time"
            tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 8 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            domain={[40, 100]}
            unit={"\u00b0C"}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(222, 47%, 14%)",
              border: "1px solid hsl(217, 33%, 20%)",
              borderRadius: "8px",
              color: "hsl(210, 40%, 96%)",
              fontSize: 12,
            }}
          />
          <ReferenceLine
            y={75}
            stroke="hsl(0, 72%, 51%)"
            strokeDasharray="5 5"
            label={{
              value: "Threshold",
              fill: "hsl(0, 72%, 51%)",
              fontSize: 10,
              position: "insideTopRight",
            }}
          />
          <Line
            type="monotone"
            dataKey="temp"
            stroke="hsl(40, 96%, 56%)"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
            style={{
              filter: "drop-shadow(0 0 6px hsl(40, 96%, 56%, 0.5))",
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
