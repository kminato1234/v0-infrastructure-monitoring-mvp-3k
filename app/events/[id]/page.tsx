"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { SidebarNav } from "@/components/sidebar-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, RefreshCw } from "lucide-react"

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

interface Measurement {
  ts: string
  sensor_id: string
  x_mm: string
  y_mm: string
  z_mm: string
  fix_type: string
  quality: string
}

export default function EventDetailPage() {
  const params = useParams()
  const eventId = params.id as string

  const [event, setEvent] = useState<Event | null>(null)
  const [asset, setAsset] = useState<any>(null)
  const [aiAction, setAIAction] = useState<any>(null)
  const [chainAnchor, setChainAnchor] = useState<any>(null)
  const [measurements, setMeasurements] = useState<Measurement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const baseUrl = window.location.origin
        const [eventsRes, assetsRes, aiRes, chainRes, measurementsRes] = await Promise.all([
          fetch(`${baseUrl}/mock/events.json`, { cache: "no-store" }),
          fetch(`${baseUrl}/mock/assets_virtual.json`, { cache: "no-store" }),
          fetch(`${baseUrl}/mock/ai_actions.json`, { cache: "no-store" }),
          fetch(`${baseUrl}/mock/chain_anchors.json`, { cache: "no-store" }),
          fetch(`${baseUrl}/mock/measurements.csv`, { cache: "no-store" }),
        ])

        const events = await eventsRes.json()
        const assets = await assetsRes.json()
        const aiActions = await aiRes.json()
        const chainAnchors = await chainRes.json()

        const csvText = await measurementsRes.text()
        const lines = csvText.trim().split("\n")
        const headers = lines[0].split(",")
        const parsedMeasurements = lines.slice(1).map((line) => {
          const values = line.split(",")
          return headers.reduce((obj, header, index) => {
            obj[header] = values[index]
            return obj
          }, {} as any)
        })

        const foundEvent = events.find((e: Event) => e.id === eventId)
        setEvent(foundEvent)
        setAsset(assets.find((a: any) => a.id === foundEvent?.asset_id))
        setAIAction(aiActions.find((a: any) => a.event_id === eventId))
        setChainAnchor(chainAnchors.find((a: any) => a.event_id === eventId))
        setMeasurements(parsedMeasurements.filter((m: Measurement) => m.sensor_id === foundEvent?.sensor_id))
      } catch (error) {
        console.error("[v0] Failed to load event data:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [eventId])

  const calculateDuration = (start: string, end: string | null) => {
    const startTime = new Date(start).getTime()
    const endTime = end ? new Date(end).getTime() : Date.now()
    return Math.round((endTime - startTime) / 60000)
  }

  const generateAIProposal = () => {
    return {
      scope: `Structural assessment and repair of ${asset?.name} following ${event?.kind} detection with ${event?.magnitude_mm}mm displacement.`,
      sla: `Response within 4 hours, on-site inspection within 24 hours, preliminary report within 48 hours.`,
      procedure: `1. Deploy certified structural engineer\n2. Conduct visual and instrumental inspection\n3. Perform load testing if required\n4. Document findings with photographic evidence\n5. Provide immediate safety recommendations`,
      deliverables: `- Detailed inspection report with CAD drawings\n- Structural integrity assessment\n- Repair recommendations with cost estimates\n- Safety certification upon completion`,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    }
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

  if (!event) {
    return (
      <div className="flex">
        <SidebarNav />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Event not found</p>
        </main>
      </div>
    )
  }

  const proposal = generateAIProposal()

  return (
    <div className="flex">
      <SidebarNav />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="mb-2 flex items-center gap-3">
              <h1 className="text-3xl font-bold text-foreground">{asset?.name || event.asset_id}</h1>
              <Badge variant={event.kind === "fault" ? "destructive" : "default"}>{event.kind}</Badge>
              <Badge variant={getSeverityBadge(event.severity)}>{event.severity}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {new Date(event.start_ts).toLocaleString()} -{" "}
              {event.end_ts ? new Date(event.end_ts).toLocaleString() : "Ongoing"}
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left: Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Time Series Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-64 rounded-lg border border-border bg-muted/20 p-4">
                    <p className="mb-2 text-sm font-medium text-foreground">ΔZ & ΔXY Measurements</p>
                    <div className="space-y-2">
                      {measurements.slice(0, 5).map((m, i) => (
                        <div key={i} className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">{new Date(m.ts).toLocaleTimeString()}</span>
                          <span className="text-foreground">
                            Z: {m.z_mm}mm | XY: {Math.sqrt(Number(m.x_mm) ** 2 + Number(m.y_mm) ** 2).toFixed(1)}mm
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {m.fix_type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Magnitude</p>
                      <p className="font-semibold text-foreground">{event.magnitude_mm} mm</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Duration</p>
                      <p className="font-semibold text-foreground">
                        {calculateDuration(event.start_ts, event.end_ts)} min
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Quality Gate</p>
                      <p className="font-semibold text-foreground">{event.quality_gate}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Sensor</p>
                      <p className="font-semibold text-foreground">{event.sensor_id}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Right: Tabs */}
            <Card>
              <CardContent className="pt-6">
                <Tabs defaultValue="details">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="ai">AI Proposal</TabsTrigger>
                    <TabsTrigger value="audit">Audit</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="space-y-4">
                    <div>
                      <h3 className="mb-2 font-semibold text-foreground">Event Metadata</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Event ID:</span>
                          <span className="font-mono text-foreground">{event.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Asset:</span>
                          <span className="text-foreground">{asset?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type:</span>
                          <span className="text-foreground">{asset?.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Severity:</span>
                          <Badge variant={getSeverityBadge(event.severity)}>{event.severity}</Badge>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="ai" className="space-y-4">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Confidence: {aiAction?.confidence ? (aiAction.confidence * 100).toFixed(0) : "N/A"}%
                        </p>
                        <p className="text-xs text-muted-foreground">Model: {aiAction?.model_ver || "N/A"}</p>
                      </div>
                      <Badge>{aiAction?.status || "N/A"}</Badge>
                    </div>

                    <div className="space-y-4 text-sm">
                      <div>
                        <h4 className="mb-1 font-semibold text-foreground">Scope</h4>
                        <p className="text-muted-foreground">{proposal.scope}</p>
                      </div>
                      <div>
                        <h4 className="mb-1 font-semibold text-foreground">SLA</h4>
                        <p className="text-muted-foreground">{proposal.sla}</p>
                      </div>
                      <div>
                        <h4 className="mb-1 font-semibold text-foreground">On-site Procedure</h4>
                        <p className="whitespace-pre-line text-muted-foreground">{proposal.procedure}</p>
                      </div>
                      <div>
                        <h4 className="mb-1 font-semibold text-foreground">Deliverables</h4>
                        <p className="whitespace-pre-line text-muted-foreground">{proposal.deliverables}</p>
                      </div>
                      <div>
                        <h4 className="mb-1 font-semibold text-foreground">Due Date</h4>
                        <p className="text-muted-foreground">{proposal.dueDate}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button size="sm" className="flex-1">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                      <Button size="sm" variant="outline">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="audit" className="space-y-4">
                    {chainAnchor ? (
                      <>
                        <div className="space-y-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">Chain</p>
                            <p className="font-mono text-foreground">{chainAnchor.chain}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Transaction Hash</p>
                            <p className="break-all font-mono text-xs text-foreground">{chainAnchor.tx_hash}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Digest</p>
                            <p className="break-all font-mono text-xs text-foreground">{chainAnchor.digest}</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="w-full bg-transparent">
                          Verify Hash
                        </Button>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">No blockchain anchor found for this event.</p>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
