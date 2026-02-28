"use client"

import { useEffect, useState } from "react"
import { IndianRupee, Leaf, TrendingDown, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

function AnimatedNumber({ target, prefix = "", suffix = "", decimals = 0 }: { target: number; prefix?: string; suffix?: string; decimals?: number }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const duration = 2000
    const start = performance.now()

    function animate(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCurrent(target * eased)
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [target])

  return (
    <span className="font-mono font-bold tabular-nums">
      {prefix}
      {current.toFixed(decimals)}
      {suffix}
    </span>
  )
}

export function ImpactCounter() {
  return (
    <div className="glass rounded-xl p-5 glow-amber">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">Impact Dashboard</h3>
        <p className="text-xs text-muted-foreground">TaaS Platform ROI - FY 2025-26</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Annual Savings */}
        <div className="rounded-lg bg-warning/5 border border-warning/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <IndianRupee className="h-4 w-4 text-warning" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-warning">Annual Savings</span>
          </div>
          <div className="text-2xl text-warning">
            <AnimatedNumber target={115.87} prefix="" suffix="" decimals={2} />
          </div>
          <span className="text-xs text-muted-foreground">Lakh INR</span>
        </div>

        {/* Carbon Reduction */}
        <div className="rounded-lg bg-accent/5 border border-accent/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Leaf className="h-4 w-4 text-accent" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-accent">Carbon Reduced</span>
          </div>
          <div className="text-2xl text-accent">
            <AnimatedNumber target={23.4} suffix="" decimals={1} />
          </div>
          <span className="text-xs text-muted-foreground">Tonnes CO2/yr</span>
        </div>

        {/* Downtime Prevented */}
        <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Downtime Cut</span>
          </div>
          <div className="text-2xl text-primary">
            <AnimatedNumber target={67} suffix="" decimals={0} />
            <span className="text-lg">%</span>
          </div>
          <span className="text-xs text-muted-foreground">vs. Baseline</span>
        </div>

        {/* Energy Saved */}
        <div className="rounded-lg bg-chart-5/5 border border-chart-5/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-chart-5" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-chart-5">Energy Saved</span>
          </div>
          <div className="text-2xl text-chart-5">
            <AnimatedNumber target={18.2} suffix="" decimals={1} />
          </div>
          <span className="text-xs text-muted-foreground">MWh/month</span>
        </div>
      </div>
    </div>
  )
}
