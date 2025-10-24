"use client"

import { useRouter } from "next/navigation"

interface Asset {
  id: string
  name: string
  type: string
  x: number
  y: number
}

interface VirtualCityMapProps {
  assets: Asset[]
  events?: Array<{
    asset_id: string
    severity: string
  }>
}

export function VirtualCityMap({ assets, events = [] }: VirtualCityMapProps) {
  const router = useRouter()

  const getSeverityColor = (assetId: string) => {
    const assetEvents = events.filter((e) => e.asset_id === assetId)
    if (assetEvents.length === 0) return "#3b82f6" // blue - no events

    const hasCritical = assetEvents.some((e) => e.severity === "critical")
    const hasHigh = assetEvents.some((e) => e.severity === "high")

    if (hasCritical) return "#ef4444" // red
    if (hasHigh) return "#f59e0b" // amber
    return "#3b82f6" // blue
  }

  const handleMarkerClick = (assetId: string) => {
    router.push(`/events?asset=${assetId}`)
  }

  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-lg border border-border bg-card">
      <svg viewBox="0 0 100 100" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(100, 116, 139, 0.2)" strokeWidth="0.2" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />

        {/* Asset markers */}
        {assets.map((asset) => {
          const color = getSeverityColor(asset.id)
          return (
            <g
              key={asset.id}
              transform={`translate(${asset.x}, ${asset.y})`}
              onClick={() => handleMarkerClick(asset.id)}
              className="cursor-pointer transition-transform hover:scale-125"
            >
              <circle r="2" fill={color} stroke="#ffffff" strokeWidth="0.5" opacity="0.9" />
              <circle r="3" fill="none" stroke={color} strokeWidth="0.3" opacity="0.5" />
              <title>{asset.name}</title>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
