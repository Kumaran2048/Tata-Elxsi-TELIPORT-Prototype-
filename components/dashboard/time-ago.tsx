"use client"

import { useEffect, useState } from "react"

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const mins = Math.floor(seconds / 60)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export function TimeAgo({
  timestamp,
  className,
}: {
  timestamp: number
  className?: string
}) {
  const [text, setText] = useState("")

  useEffect(() => {
    setText(formatTimeAgo(timestamp))
    const interval = setInterval(() => {
      setText(formatTimeAgo(timestamp))
    }, 10000)
    return () => clearInterval(interval)
  }, [timestamp])

  if (!text) return null

  return <span className={className}>{text}</span>
}
