"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SidebarNav } from "@/components/sidebar-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export const dynamic = "force-dynamic"

interface Event {
  id: string
  asset_id: string
  sensor_id: string
  kind: string
  start_ts: string
  end_ts: string | null
  magnitude_mm: number
  severity: string
  quality_gate: string
}

interface Asset {
  id: string
  name: string
}

interface AIAction {
  event_id: string
  status: string
}

interface ChainAnchor {
  event_id: string
  tx_hash: string
}

export default function EventsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [events, setEvents] = useState<Event[]>([])
  const [assets, setAssets] = useState<Asset[]>([])
  const [aiActions, setAIActions] = useState<AIAction[]>([])
  const [chainAnchors, setChainAnchors] = useState<ChainAnchor[]>([])
  const [loading, setLoading] = useState(true)

  const assetFilter = searchParams.get("asset")

  useEffect(() => {
    async function loadData() {
      try {
        const baseUrl = window.location.origin
        const [eventsRes, assetsRes, aiRes, chainRes] = await Promise.all([
          fetch(`${baseUrl}/mock/events.json`, { cache: "no-store" }),
          fetch(`${baseUrl}/mock/assets_virtual.json`, { cache: "no-store" }),
          fetch(`${baseUrl}/mock/ai_actions.json`, { cache: "no-store" }),
          fetch(`${baseUrl}/mock/chain_anchors.json`, { cache: "no-store" }),
        ])

        setEvents(await eventsRes.json())
        setAssets(await assetsRes.json())
        setAIActions(await aiRes.json())
        setChainAnchors(await chainRes.json())
      } catch (error) {
        console.error("[v0] Failed to load data:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const filteredEvents = assetFilter ? events.filter((e) => e.asset_id === assetFilter) : events

  const calculateDuration = (start: string, end: string | null) => {
    const startTime = new Date(start).getTime()
    const endTime = end ? new Date(end).getTime() : Date.now()
    return Math.round((endTime - startTime) / 60000) // minutes
  }

  const getAssetName = (assetId: string) => {
    return assets.find((a) => a.id === assetId)?.name || assetId
  }

  const getAIStatus = (eventId: string) => {
    return aiActions.find((a) => a.event_id === eventId)?.status || "-"
  }

  const isAnchored = (eventId: string) => {
    return chainAnchors.some((a) => a.event_id === eventId)
  }

  const exportCSV = () => {
    const headers = [
      "Time",
      "Asset",
      "Kind",
      "ΔZ(mm)",
      "Duration(min)",
      "Quality Gate",
      "Severity",
      "AI Status",
      "On-chain",
    ]
    const rows = filteredEvents.map((e) => [
      e.start_ts,
      getAssetName(e.asset_id),
      e.kind,
      e.magnitude_mm,
      calculateDuration(e.start_ts, e.end_ts),
      e.quality_gate,
      e.severity,
      getAIStatus(e.id),
      isAnchored(e.id) ? "Yes" : "No",
    ])

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "events.csv"
    a.click()
  }

  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, "destructive" | "default" | "secondary"> = {
      critical: "destructive",
      high: "destructive",
      medium: "default",
      low: "secondary",
    }
    return variants[severity] || "default"
  }

  if (loading) {
    return (
      <div className="flex">
        <SidebarNav />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="flex">
      <SidebarNav />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Events</h1>
              {assetFilter && <p className="text-sm text-muted-foreground">Filtered by: {getAssetName(assetFilter)}</p>}
            </div>
            <Button onClick={exportCSV} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">All Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border text-left text-sm text-muted-foreground">
                      <th className="pb-3 font-medium">Time</th>
                      <th className="pb-3 font-medium">Asset</th>
                      <th className="pb-3 font-medium">Kind</th>
                      <th className="pb-3 font-medium">ΔZ(mm)</th>
                      <th className="pb-3 font-medium">Duration(min)</th>
                      <th className="pb-3 font-medium">Quality Gate</th>
                      <th className="pb-3 font-medium">Severity</th>
                      <th className="pb-3 font-medium">AI Status</th>
                      <th className="pb-3 font-medium">On-chain</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEvents.map((event) => (
                      <tr
                        key={event.id}
                        onClick={() => router.push(`/events/${event.id}`)}
                        className="cursor-pointer border-b border-border transition-colors hover:bg-accent"
                      >
                        <td className="py-3 text-sm text-foreground">{new Date(event.start_ts).toLocaleString()}</td>
                        <td className="py-3 text-sm text-foreground">{getAssetName(event.asset_id)}</td>
                        <td className="py-3">
                          <Badge variant={event.kind === "fault" ? "destructive" : "default"}>{event.kind}</Badge>
                        </td>
                        <td className="py-3 text-sm text-foreground">{event.magnitude_mm}</td>
                        <td className="py-3 text-sm text-foreground">
                          {calculateDuration(event.start_ts, event.end_ts)}
                        </td>
                        <td className="py-3 text-sm text-foreground">{event.quality_gate}</td>
                        <td className="py-3">
                          <Badge variant={getSeverityBadge(event.severity)}>{event.severity}</Badge>
                        </td>
                        <td className="py-3 text-sm text-foreground">{getAIStatus(event.id)}</td>
                        <td className="py-3 text-sm text-foreground">{isAnchored(event.id) ? "✓" : "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
