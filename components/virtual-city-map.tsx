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
        {/* North zone - top half */}
        <rect x="0" y="0" width="100" height="50" fill="rgba(59, 130, 246, 0.05)" />
        {/* South zone - bottom half */}
        <rect x="0" y="50" width="100" height="50" fill="rgba(249, 115, 22, 0.05)" />
        {/* West zone overlay - left half */}
        <rect x="0" y="0" width="50" height="100" fill="rgba(168, 85, 247, 0.03)" />
        {/* East zone overlay - right half */}
        <rect x="50" y="0" width="50" height="100" fill="rgba(34, 197, 94, 0.03)" />

        {/* North - top center */}
        <text x="50" y="8" fontSize="3" fill="rgba(148, 163, 184, 0.6)" textAnchor="middle" fontWeight="600">
          NORTH
        </text>
        {/* East - right center */}
        <text x="92" y="52" fontSize="3" fill="rgba(148, 163, 184, 0.6)" textAnchor="middle" fontWeight="600">
          EAST
        </text>
        {/* West - left center */}
        <text x="8" y="52" fontSize="3" fill="rgba(148, 163, 184, 0.6)" textAnchor="middle" fontWeight="600">
          WEST
        </text>
        {/* South - bottom center */}
        <text x="50" y="97" fontSize="3" fill="rgba(148, 163, 184, 0.6)" textAnchor="middle" fontWeight="600">
          SOUTH
        </text>

        {/* Main roads */}
        <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(148, 163, 184, 0.3)" strokeWidth="1.5" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(148, 163, 184, 0.3)" strokeWidth="1.5" />

        {/* Secondary roads */}
        <line x1="25" y1="0" x2="25" y2="100" stroke="rgba(148, 163, 184, 0.2)" strokeWidth="0.8" />
        <line x1="75" y1="0" x2="75" y2="100" stroke="rgba(148, 163, 184, 0.2)" strokeWidth="0.8" />
        <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(148, 163, 184, 0.2)" strokeWidth="0.8" />
        <line x1="0" y1="75" x2="100" y2="75" stroke="rgba(148, 163, 184, 0.2)" strokeWidth="0.8" />

        {/* Buildings/blocks */}
        <rect
          x="10"
          y="15"
          width="8"
          height="6"
          fill="rgba(100, 116, 139, 0.15)"
          stroke="rgba(148, 163, 184, 0.3)"
          strokeWidth="0.3"
        />
        <rect
          x="30"
          y="12"
          width="10"
          height="8"
          fill="rgba(100, 116, 139, 0.15)"
          stroke="rgba(148, 163, 184, 0.3)"
          strokeWidth="0.3"
        />
        <rect
          x="15"
          y="30"
          width="7"
          height="10"
          fill="rgba(100, 116, 139, 0.15)"
          stroke="rgba(148, 163, 184, 0.3)"
          strokeWidth="0.3"
        />
        <rect
          x="32"
          y="32"
          width="9"
          height="7"
          fill="rgba(100, 116, 139, 0.15)"
          stroke="rgba(148, 163, 184, 0.3)"
          strokeWidth="0.3"
        />

        <rect
          x="60"
          y="18"
          width="12"
          height="9"
          fill="rgba(100, 116, 139, 0.15)"
          stroke="rgba(148, 163, 184, 0.3)"
          strokeWidth="0.3"
        />
        <rect
          x="80"
          y="15"
          width="8"
          height="12"
          fill="rgba(100, 116, 139, 0.15)"
          stroke="rgba(148, 163, 184, 0.3)"
          strokeWidth="0.3"
        />
        <rect
          x="65"
          y="35"
          width="10"
          height="8"
          fill="rgba(100, 116, 139, 0.15)"
          stroke="rgba(148, 163, 184, 0.3)"
          strokeWidth="0.3"
        />
        <rect
          x="82"
          y="32"
          width="7"
          height="10"
          fill="rgba(100, 116, 139, 0.15)"
          stroke="rgba(148, 163, 184, 0.3)"
          strokeWidth="0.3"
        />

        <rect
          x="12"
          y="60"
          width="9"
          height="11"
          fill="rgba(100, 116, 139, 0.15)"
          stroke="rgba(148, 163, 184, 0.3)"
          strokeWidth="0.3"
        />
        <rect
          x="28"
          y="58"
          width="11"
          height="8"
          fill="rgba(100, 116, 139, 0.15)"
          stroke="rgba(148, 163, 184, 0.3)"
          strokeWidth="0.3"
        />
        <rect
          x="15"
          y="78"
          width="8"
          height="9"
          fill="rgba(100, 116, 139, 0.15)"
          stroke="rgba(148, 163, 184, 0.3)"
          strokeWidth="0.3"
        />
        <rect
          x="32"
          y="80"
          width="10"
          height="7"
          fill="rgba(100, 116, 139, 0.15)"
          stroke="rgba(148, 163, 184, 0.3)"
          strokeWidth="0.3"
        />

        <rect
          x="58"
          y="62"
          width="10"
          height="10"
          fill="rgba(100, 116, 139, 0.15)"
          stroke="rgba(148, 163, 184, 0.3)"
          strokeWidth="0.3"
        />
        <rect
          x="75"
          y="60"
          width="12"
          height="8"
          fill="rgba(100, 116, 139, 0.15)"
          stroke="rgba(148, 163, 184, 0.3)"
          strokeWidth="0.3"
        />
        <rect
          x="62"
          y="78"
          width="8"
          height="11"
          fill="rgba(100, 116, 139, 0.15)"
          stroke="rgba(148, 163, 184, 0.3)"
          strokeWidth="0.3"
        />
        <rect
          x="78"
          y="82"
          width="11"
          height="7"
          fill="rgba(100, 116, 139, 0.15)"
          stroke="rgba(148, 163, 184, 0.3)"
          strokeWidth="0.3"
        />

        {/* Fine grid */}
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(100, 116, 139, 0.1)" strokeWidth="0.2" />
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
