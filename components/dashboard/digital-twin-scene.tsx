"use client"

import { useEffect, useRef, useState } from "react"

/* ─── Isometric CNC Machine rendered on Canvas2D ─── */
/* No Three.js needed — works with React 19, zero loading, instant render */

interface DataPoint {
  x: number
  y: number
  label: string
  value: string
  color: string
  pulsePhase: number
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
}

export function DigitalTwinScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>(0)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = container.clientWidth
    let height = container.clientHeight

    const resize = () => {
      width = container.clientWidth
      height = container.clientHeight
      const dpr = window.devicePixelRatio || 1
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener("resize", resize)

    // Data overlay points
    const dataPoints: DataPoint[] = [
      { x: 0, y: -80, label: "RPM", value: "2,400", color: "#22d3ee", pulsePhase: 0 },
      { x: 120, y: -40, label: "TEMP", value: "78\u00b0C", color: "#facc15", pulsePhase: 1.5 },
      { x: -130, y: -20, label: "VIB", value: "4.2mm/s", color: "#ef4444", pulsePhase: 3 },
      { x: 80, y: 50, label: "LOAD", value: "67%", color: "#a3e635", pulsePhase: 4.5 },
    ]

    // Particles
    const particles: Particle[] = []
    const spawnParticle = (t: number) => {
      if (particles.length > 60) return
      const angle = Math.random() * Math.PI * 2
      const dist = 60 + Math.random() * 40
      particles.push({
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist * 0.5 - 20,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -0.3 - Math.random() * 0.5,
        life: 0,
        maxLife: 60 + Math.random() * 60,
        color: ["#22d3ee", "#a3e635", "#22d3ee"][Math.floor(Math.random() * 3)],
      })
    }

    // Scanline
    let scanY = 0

    const drawGrid = (cx: number, cy: number, t: number) => {
      ctx.save()
      ctx.translate(cx, cy + 80)
      ctx.globalAlpha = 0.15

      // Isometric grid
      const gridSize = 30
      const rows = 12
      const cols = 12
      ctx.strokeStyle = "#22d3ee"
      ctx.lineWidth = 0.5

      for (let i = -rows; i <= rows; i++) {
        ctx.beginPath()
        ctx.moveTo(-cols * gridSize * 0.866, i * gridSize * 0.5 - cols * gridSize * 0.25)
        ctx.lineTo(cols * gridSize * 0.866, i * gridSize * 0.5 + cols * gridSize * 0.25)
        ctx.stroke()
      }
      for (let i = -cols; i <= cols; i++) {
        ctx.beginPath()
        ctx.moveTo(i * gridSize * 0.866, -rows * gridSize * 0.5 + i * gridSize * 0.25)
        ctx.lineTo(i * gridSize * 0.866, rows * gridSize * 0.5 + i * gridSize * 0.25)
        ctx.stroke()
      }

      ctx.restore()
    }

    // Draw isometric box
    const drawIsoBox = (
      cx: number,
      cy: number,
      w: number,
      h: number,
      d: number,
      topColor: string,
      leftColor: string,
      rightColor: string,
      glow?: string
    ) => {
      const isoW = w * 0.866
      const isoD = d * 0.866
      const halfW = isoW / 2
      const halfD = isoD / 2

      // Shadow / glow
      if (glow) {
        ctx.save()
        ctx.shadowColor = glow
        ctx.shadowBlur = 15
        ctx.fillStyle = glow
        ctx.globalAlpha = 0.1
        ctx.beginPath()
        ctx.moveTo(cx, cy - h)
        ctx.lineTo(cx + halfW, cy - h + w * 0.25)
        ctx.lineTo(cx + halfW, cy + w * 0.25)
        ctx.lineTo(cx, cy + w * 0.5)
        ctx.lineTo(cx - halfD, cy + d * 0.25)
        ctx.lineTo(cx - halfD, cy - h + d * 0.25)
        ctx.closePath()
        ctx.fill()
        ctx.restore()
      }

      // Top face
      ctx.fillStyle = topColor
      ctx.beginPath()
      ctx.moveTo(cx, cy - h - w * 0.25 - d * 0.25 + w * 0.25)
      // Simplified top face
      const topY = cy - h
      ctx.moveTo(cx, topY - w * 0.25)
      ctx.lineTo(cx + halfW, topY)
      ctx.lineTo(cx, topY + d * 0.25)
      ctx.lineTo(cx - halfD, topY - w * 0.25 + d * 0.25)
      ctx.closePath()
      ctx.fill()

      // Right face
      ctx.fillStyle = rightColor
      ctx.beginPath()
      ctx.moveTo(cx + halfW, topY)
      ctx.lineTo(cx + halfW, topY + h)
      ctx.lineTo(cx, topY + h + d * 0.25)
      ctx.lineTo(cx, topY + d * 0.25)
      ctx.closePath()
      ctx.fill()

      // Left face
      ctx.fillStyle = leftColor
      ctx.beginPath()
      ctx.moveTo(cx - halfD, topY - w * 0.25 + d * 0.25)
      ctx.lineTo(cx, topY + d * 0.25)
      ctx.lineTo(cx, topY + h + d * 0.25)
      ctx.lineTo(cx - halfD, topY + h - w * 0.25 + d * 0.25)
      ctx.closePath()
      ctx.fill()

      // Edges
      ctx.strokeStyle = "rgba(34,211,238,0.2)"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(cx, topY - w * 0.25)
      ctx.lineTo(cx + halfW, topY)
      ctx.lineTo(cx + halfW, topY + h)
      ctx.lineTo(cx, topY + h + d * 0.25)
      ctx.lineTo(cx - halfD, topY + h - w * 0.25 + d * 0.25)
      ctx.lineTo(cx - halfD, topY - w * 0.25 + d * 0.25)
      ctx.closePath()
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(cx, topY + d * 0.25)
      ctx.lineTo(cx + halfW, topY)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(cx, topY + d * 0.25)
      ctx.lineTo(cx - halfD, topY - w * 0.25 + d * 0.25)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(cx, topY + d * 0.25)
      ctx.lineTo(cx, topY + h + d * 0.25)
      ctx.stroke()
    }

    // Rotating spindle
    const drawSpindle = (cx: number, cy: number, t: number) => {
      const spindleX = cx + 15
      const spindleY = cy - 100
      const angle = t * 3

      ctx.save()
      ctx.translate(spindleX, spindleY)

      // Housing
      const grad = ctx.createLinearGradient(-15, -25, 15, 25)
      grad.addColorStop(0, "#2a3f5f")
      grad.addColorStop(1, "#1a2744")
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.ellipse(0, -15, 18, 10, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillRect(-18, -15, 36, 30)
      ctx.beginPath()
      ctx.ellipse(0, 15, 18, 10, 0, 0, Math.PI * 2)
      ctx.fill()

      // Spinning chuck lines
      ctx.strokeStyle = "#22d3ee"
      ctx.lineWidth = 2
      ctx.globalAlpha = 0.6
      for (let i = 0; i < 3; i++) {
        const a = angle + (i * Math.PI * 2) / 3
        ctx.beginPath()
        ctx.moveTo(Math.cos(a) * 8, 15 + Math.sin(a) * 4)
        ctx.lineTo(Math.cos(a) * 16, 15 + Math.sin(a) * 8)
        ctx.stroke()
      }
      ctx.globalAlpha = 1

      // Tool bit spark
      const sparkAlpha = 0.4 + Math.sin(t * 10) * 0.3
      ctx.fillStyle = `rgba(34, 211, 238, ${sparkAlpha})`
      ctx.beginPath()
      ctx.arc(0, 28, 3, 0, Math.PI * 2)
      ctx.fill()

      ctx.restore()
    }

    const drawDataPoints = (cx: number, cy: number, t: number) => {
      dataPoints.forEach((dp) => {
        const px = cx + dp.x
        const py = cy + dp.y
        const pulse = 0.5 + Math.sin(t * 2 + dp.pulsePhase) * 0.5

        // Connection line
        ctx.strokeStyle = `rgba(${dp.color === "#22d3ee" ? "34,211,238" : dp.color === "#facc15" ? "250,204,21" : dp.color === "#ef4444" ? "239,68,68" : "163,230,53"}, ${0.15 + pulse * 0.15})`
        ctx.lineWidth = 1
        ctx.setLineDash([4, 4])
        ctx.beginPath()
        ctx.moveTo(cx, cy - 30)
        ctx.lineTo(px, py)
        ctx.stroke()
        ctx.setLineDash([])

        // Pulse ring
        ctx.strokeStyle = dp.color
        ctx.lineWidth = 1.5
        ctx.globalAlpha = 0.3 + pulse * 0.3
        ctx.beginPath()
        ctx.arc(px, py, 6 + pulse * 6, 0, Math.PI * 2)
        ctx.stroke()
        ctx.globalAlpha = 1

        // Dot
        ctx.fillStyle = dp.color
        ctx.beginPath()
        ctx.arc(px, py, 3, 0, Math.PI * 2)
        ctx.fill()

        // Label background
        ctx.fillStyle = "rgba(5,15,30,0.85)"
        ctx.strokeStyle = `${dp.color}44`
        ctx.lineWidth = 1
        const textW = 70
        const textH = 32
        const tx = px - textW / 2
        const ty = py - textH - 12
        ctx.beginPath()
        ctx.roundRect(tx, ty, textW, textH, 4)
        ctx.fill()
        ctx.stroke()

        // Label text
        ctx.fillStyle = dp.color
        ctx.font = "bold 9px monospace"
        ctx.textAlign = "center"
        ctx.fillText(dp.label, px, ty + 12)
        ctx.fillStyle = "#e2e8f0"
        ctx.font = "bold 11px monospace"
        ctx.fillText(dp.value, px, ty + 26)
      })
    }

    const drawParticles = (cx: number, cy: number) => {
      particles.forEach((p) => {
        const alpha = 1 - p.life / p.maxLife
        ctx.fillStyle = p.color
        ctx.globalAlpha = alpha * 0.5
        ctx.beginPath()
        ctx.arc(cx + p.x, cy + p.y, 1.5, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1
    }

    const drawScanLine = (cx: number, cy: number, t: number) => {
      scanY = (Math.sin(t * 0.8) * 0.5 + 0.5) * height
      const grad = ctx.createLinearGradient(0, scanY - 2, 0, scanY + 2)
      grad.addColorStop(0, "rgba(34,211,238,0)")
      grad.addColorStop(0.5, "rgba(34,211,238,0.12)")
      grad.addColorStop(1, "rgba(34,211,238,0)")
      ctx.fillStyle = grad
      ctx.fillRect(0, scanY - 20, width, 40)
    }

    const drawCornerBrackets = () => {
      ctx.strokeStyle = "rgba(34,211,238,0.3)"
      ctx.lineWidth = 2
      const m = 16
      const s = 24

      // Top-left
      ctx.beginPath()
      ctx.moveTo(m, m + s)
      ctx.lineTo(m, m)
      ctx.lineTo(m + s, m)
      ctx.stroke()

      // Top-right
      ctx.beginPath()
      ctx.moveTo(width - m - s, m)
      ctx.lineTo(width - m, m)
      ctx.lineTo(width - m, m + s)
      ctx.stroke()

      // Bottom-left
      ctx.beginPath()
      ctx.moveTo(m, height - m - s)
      ctx.lineTo(m, height - m)
      ctx.lineTo(m + s, height - m)
      ctx.stroke()

      // Bottom-right
      ctx.beginPath()
      ctx.moveTo(width - m - s, height - m)
      ctx.lineTo(width - m, height - m)
      ctx.lineTo(width - m, height - m - s)
      ctx.stroke()
    }

    let time = 0

    const animate = () => {
      time += 0.016
      ctx.clearRect(0, 0, width, height)

      const cx = width / 2
      const cy = height / 2

      // Background gradient
      const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, width * 0.6)
      bgGrad.addColorStop(0, "rgba(34,211,238,0.03)")
      bgGrad.addColorStop(1, "transparent")
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, width, height)

      // Grid
      drawGrid(cx, cy, time)

      // Scanline
      drawScanLine(cx, cy, time)

      // Machine base (bed)
      drawIsoBox(cx, cy + 20, 140, 20, 100, "#1a2744", "#0f1f3a", "#152240", "#22d3ee")

      // Left column
      drawIsoBox(cx - 50, cy - 10, 40, 90, 70, "#1e3050", "#142540", "#182d48", "#22d3ee")

      // Control panel (right side)
      drawIsoBox(cx + 55, cy, 30, 60, 25, "#1e3050", "#142540", "#182d48")

      // Screen glow on control panel
      ctx.fillStyle = "#22d3ee"
      ctx.globalAlpha = 0.3 + Math.sin(time * 2) * 0.1
      ctx.fillRect(cx + 60, cy - 45, 18, 14)
      ctx.globalAlpha = 1

      // Status LEDs
      const ledColors = ["#22d3ee", "#a3e635", "#facc15"]
      ledColors.forEach((c, i) => {
        ctx.fillStyle = c
        ctx.globalAlpha = 0.7 + Math.sin(time * 3 + i) * 0.3
        ctx.beginPath()
        ctx.arc(cx + 65 + i * 6, cy - 25, 2, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1

      // Workpiece (center cylinder visual)
      const wGrad = ctx.createLinearGradient(cx - 15, cy - 20, cx + 15, cy)
      wGrad.addColorStop(0, "#475569")
      wGrad.addColorStop(1, "#334155")
      ctx.fillStyle = wGrad
      ctx.beginPath()
      ctx.ellipse(cx + 10, cy - 15, 22, 12, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = "rgba(34,211,238,0.15)"
      ctx.lineWidth = 1
      ctx.stroke()

      // Spindle
      drawSpindle(cx, cy, time)

      // Particles
      if (Math.random() < 0.3) spawnParticle(time)
      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].x += particles[i].vx
        particles[i].y += particles[i].vy
        particles[i].life++
        if (particles[i].life > particles[i].maxLife) {
          particles.splice(i, 1)
        }
      }
      drawParticles(cx, cy)

      // Data overlays
      drawDataPoints(cx, cy, time)

      // Wireframe bounding box
      ctx.strokeStyle = "rgba(34,211,238,0.06)"
      ctx.lineWidth = 1
      ctx.strokeRect(cx - 100, cy - 130, 200, 200)

      // Corner brackets
      drawCornerBrackets()

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full min-h-[500px]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{ background: "transparent" }}
      />

      {/* Corner HUD overlays */}
      <div className="pointer-events-none absolute left-4 top-4">
        <div className="rounded-lg border border-border/40 bg-background/80 backdrop-blur-md px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary font-mono">
              Digital Twin Active
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground font-mono">CNC Lathe #3 &middot; Real-time Sync</p>
        </div>
      </div>

      <div className="pointer-events-none absolute right-4 bottom-4">
        <div className="rounded-lg border border-border/40 bg-background/80 backdrop-blur-md px-3 py-2">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <span className="text-[9px] text-muted-foreground block font-mono">Latency</span>
              <span className="text-xs font-mono text-primary">12ms</span>
            </div>
            <div>
              <span className="text-[9px] text-muted-foreground block font-mono">Sync Rate</span>
              <span className="text-xs font-mono text-accent">60fps</span>
            </div>
            <div>
              <span className="text-[9px] text-muted-foreground block font-mono">Model</span>
              <span className="text-xs font-mono text-foreground">v2.4</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
