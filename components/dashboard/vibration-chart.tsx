"use client"

import { useEffect, useState } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { useTelemetry } from "@/hooks/use-telemetry"
import { useSettings } from "@/hooks/use-settings"

export function VibrationChart() {
  const { telemetry, loading } = useTelemetry()
  const { settings } = useSettings()

  // Generate dynamic data based on real-time sync setting
  const displayData = settings.realTimeSync ? telemetry : telemetry.slice(0, 5)
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    if (displayData.length > 0) {
      const formatted = [...displayData].reverse().map(t => ({
        time: new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        vibration: t.vibration,
        threshold: 3.5
      }))
      setChartData(formatted)
    } else if (!loading) {
      // Fallback to simulation if DB is empty
      const interval = setInterval(() => {
        setChartData(prev => {
          const nextPoint = {
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            vibration: 2.0 + Math.sin(Date.now() * 0.001) * 1.2 + Math.random() * 0.4,
            threshold: 3.5
          }
          return [...prev.slice(-19), nextPoint]
        })
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [telemetry, loading])

  return (
    <div className="glass rounded-xl p-5 glow-cyan">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Vibration Analysis
          </h3>
          <p className="text-xs text-muted-foreground">
            Live Stream - All Sensors
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-medium uppercase tracking-wider text-primary">
            {telemetry.length > 0 ? 'Live DB' : 'Simulating'}
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="vibGradient" x1="0" y1="0" x2="0" y2="1">
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
            stroke="hsl(217, 33%, 18%)"
          />
          <XAxis
            dataKey="time"
            tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 8 }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            domain={[0, 6]}
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
          <Area
            type="monotone"
            dataKey="threshold"
            stroke="hsl(0, 72%, 51%)"
            strokeDasharray="5 5"
            fill="none"
            strokeWidth={1}
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="vibration"
            stroke="hsl(187, 92%, 55%)"
            fill="url(#vibGradient)"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
            style={{
              filter: "drop-shadow(0 0 6px hsl(187, 92%, 55%, 0.5))",
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
