"use client"

import { useParams } from "next/navigation"
import { SidebarNav } from "@/components/sidebar-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, RefreshCw } from "lucide-react"
import { events, assets, aiActions, chainAnchors, measurements } from "@/lib/mock-data"

export default function EventDetailPage() {
  const params = useParams()
  const eventId = params.id as string

  const event = events.find((e) => e.id === eventId)
  const asset = assets.find((a) => a.id === event?.asset_id)
  const aiAction = aiActions.find((a) => a.event_id === eventId)
  const chainAnchor = chainAnchors.find((a) => a.event_id === eventId)

  const calculateDuration = (start: string, end: string | null) => {
    const startTime = new Date(start).getTime()
    const endTime = end ? new Date(end).getTime() : Date.now()
    return Math.round((endTime - startTime) / 60000)
  }

  const generateAIProposal = () => {
    if (!event || !asset) return null

    return {
      scope: aiAction?.proposal || `Assessment and resolution of ${event.kind} at ${asset.name}`,
      sla: `Response within 4 hours, on-site inspection within 24 hours, preliminary report within 48 hours.`,
      procedure: `1. Deploy certified engineer\n2. Conduct inspection\n3. Perform testing if required\n4. Document findings\n5. Provide safety recommendations`,
      deliverables: `- Detailed inspection report\n- Integrity assessment\n- Repair recommendations\n- Safety certification`,
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
  const relevantMeasurements = measurements.filter((m) => m.asset_id === event.asset_id).slice(0, 5)

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
                <CardTitle className="text-foreground">Measurements Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-64 rounded-lg border border-border bg-muted/20 p-4">
                    <p className="mb-2 text-sm font-medium text-foreground">Recent Measurements</p>
                    <div className="space-y-2">
                      {relevantMeasurements.map((m, i) => (
                        <div key={i} className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">{new Date(m.timestamp).toLocaleTimeString()}</span>
                          <span className="text-foreground">
                            {m.metric}: {m.value} {m.unit}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {m.asset_id}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Event Type</p>
                      <p className="font-semibold text-foreground">{event.kind}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Duration</p>
                      <p className="font-semibold text-foreground">
                        {calculateDuration(event.start_ts, event.end_ts)} min
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Severity</p>
                      <p className="font-semibold text-foreground">{event.severity}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Asset Type</p>
                      <p className="font-semibold text-foreground">{asset?.type || "N/A"}</p>
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
                      <div className="mt-4">
                        <h4 className="mb-1 text-sm font-semibold text-foreground">Description</h4>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="ai" className="space-y-4">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Confidence: {aiAction?.confidence ? (aiAction.confidence * 100).toFixed(0) : "N/A"}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Generated: {aiAction?.created_at ? new Date(aiAction.created_at).toLocaleString() : "N/A"}
                        </p>
                      </div>
                      <Badge>{aiAction ? "Available" : "Pending"}</Badge>
                    </div>

                    {proposal && (
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
                    )}

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
                            <p className="text-muted-foreground">Block Number</p>
                            <p className="font-mono text-foreground">{chainAnchor.block_number}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Transaction Hash</p>
                            <p className="break-all font-mono text-xs text-foreground">{chainAnchor.tx_hash}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Timestamp</p>
                            <p className="text-foreground">{new Date(chainAnchor.timestamp).toLocaleString()}</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="w-full bg-transparent">
                          Verify on Blockchain
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
