import { SidebarNav } from "@/components/sidebar-nav"
import { VirtualCityMap } from "@/components/virtual-city-map"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { assets, generateEvents, generateChainAnchors } from "@/lib/mock-data"
import { ActivityIcon, AlertTriangleIcon, Link2Icon } from "@/components/icons"
import Link from "next/link"

export const revalidate = 0
export const dynamic = "force-dynamic"

function formatTimeAgo(timestamp: string) {
  const now = new Date()
  const past = new Date(timestamp)
  const diffMs = now.getTime() - past.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)

  if (diffHours < 1) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${Math.floor(diffHours / 24)}d ago`
}

export default async function OverviewPage() {
  const events = generateEvents()
  const chainAnchors = generateChainAnchors()

  // Calculate 24h stats
  const now = new Date()
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  const recentEvents = events.filter((e: any) => new Date(e.start_ts) > last24h)
  const anomalies24h = recentEvents.filter((e: any) => e.kind === "anomaly").length
  const faults24h = recentEvents.filter((e: any) => e.kind === "fault").length
  const anchored24h = recentEvents.filter((e: any) => chainAnchors.some((a: any) => a.event_id === e.id)).length

  // Get latest 10 events
  const latestEvents = [...events]
    .sort((a: any, b: any) => new Date(b.start_ts).getTime() - new Date(a.start_ts).getTime())
    .slice(0, 10)

  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, "destructive" | "default" | "secondary"> = {
      critical: "destructive",
      high: "destructive",
      medium: "default",
      low: "secondary",
    }
    return variants[severity] || "default"
  }

  return (
    <div className="flex">
      <SidebarNav />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Overview</h1>
            <p className="text-muted-foreground">Infrastructure monitoring dashboard</p>
          </div>

          {/* Stats Cards */}
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Anomalies (24h)</CardTitle>
                <ActivityIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{anomalies24h}</div>
                <p className="text-xs text-muted-foreground">Detected anomalies</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Faults (24h)</CardTitle>
                <AlertTriangleIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{faults24h}</div>
                <p className="text-xs text-muted-foreground">Critical faults</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Anchored On-chain (24h)</CardTitle>
                <Link2Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{anchored24h}</div>
                <p className="text-xs text-muted-foreground">Blockchain verified</p>
              </CardContent>
            </Card>
          </div>

          {/* Virtual City Map */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-foreground">Virtual City Map</CardTitle>
              <p className="text-sm text-muted-foreground">Click markers to filter events by asset</p>
            </CardHeader>
            <CardContent>
              <VirtualCityMap assets={assets} events={events} />
            </CardContent>
          </Card>

          {/* Recent Events */}
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Recent Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {latestEvents.map((event: any) => {
                  const asset = assets.find((a: any) => a.id === event.asset_id)
                  return (
                    <Link
                      key={event.id}
                      href={`/events/${event.id}`}
                      className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-accent"
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-sm font-medium text-foreground">{asset?.name || event.asset_id}</p>
                          <p className="text-xs text-muted-foreground">{formatTimeAgo(event.start_ts)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={event.kind === "fault" ? "destructive" : "default"}>{event.kind}</Badge>
                        <Badge variant={getSeverityBadge(event.severity)}>{event.severity}</Badge>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
