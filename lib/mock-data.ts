import { getRandomElement, generateTimestamp } from "./utils" // Assuming utils.ts contains the helper functions

export const assets = [
  {
    id: "asset-001",
    name: "Water Pump Station A",
    type: "pump",
    x: 25,
    y: 30,
    status: "operational",
  },
  {
    id: "asset-002",
    name: "Power Grid Node B",
    type: "power",
    x: 60,
    y: 45,
    status: "operational",
  },
  {
    id: "asset-003",
    name: "Traffic Control C",
    type: "traffic",
    x: 40,
    y: 70,
    status: "warning",
  },
  {
    id: "asset-004",
    name: "Sensor Array D",
    type: "sensor",
    x: 75,
    y: 25,
    status: "operational",
  },
  {
    id: "asset-005",
    name: "Communication Hub E",
    type: "comm",
    x: 50,
    y: 50,
    status: "critical",
  },
]

export function generateEvents() {
  const assetIds = assets.map((a) => a.id)
  const kinds = ["anomaly", "fault"]
  const severities = ["low", "medium", "high", "critical"]
  const descriptions = {
    anomaly: [
      "Unusual vibration pattern detected",
      "Temperature spike detected",
      "Flow rate fluctuation outside normal range",
      "Unexpected traffic congestion pattern",
      "Power consumption anomaly - potential overload",
      "Intermittent signal degradation",
      "Minor sensor deviation",
      "Pressure variance detected",
    ],
    fault: [
      "Power fluctuation exceeded threshold",
      "Communication link failure",
      "Pump pressure drop",
      "Signal timing malfunction",
      "System overload detected",
      "Hardware failure reported",
    ],
  }

  const events = []

  // Generate 6-8 events in last 24 hours (mostly anomalies)
  const recentCount = 6 + Math.floor(Math.random() * 3)
  for (let i = 0; i < recentCount; i++) {
    const kind = Math.random() > 0.3 ? "anomaly" : "fault"
    const hoursAgo = Math.random() * 24
    const isOngoing = Math.random() > 0.4

    events.push({
      id: `evt-${String(i + 1).padStart(3, "0")}`,
      asset_id: getRandomElement(assetIds),
      kind,
      severity: getRandomElement(severities),
      start_ts: generateTimestamp(hoursAgo, 30),
      end_ts: isOngoing ? null : generateTimestamp(hoursAgo - 0.5 - Math.random(), 15),
      description: getRandomElement(descriptions[kind as keyof typeof descriptions]),
    })
  }

  // Generate 4-6 older events (24h - 7 days ago)
  const olderCount = 4 + Math.floor(Math.random() * 3)
  for (let i = 0; i < olderCount; i++) {
    const kind = getRandomElement(kinds)
    const hoursAgo = 24 + Math.random() * (7 * 24 - 24)

    events.push({
      id: `evt-${String(recentCount + i + 1).padStart(3, "0")}`,
      asset_id: getRandomElement(assetIds),
      kind,
      severity: getRandomElement(severities),
      start_ts: generateTimestamp(hoursAgo, 60),
      end_ts: generateTimestamp(hoursAgo - 1 - Math.random() * 2, 30),
      description: getRandomElement(descriptions[kind as keyof typeof descriptions]),
    })
  }

  return events.sort((a, b) => new Date(b.start_ts).getTime() - new Date(a.start_ts).getTime())
}

export const events = generateEvents()

export function generateAiActions() {
  const proposals = [
    "Increase maintenance frequency for affected components",
    "Install voltage regulator on affected circuit",
    "Switch to backup channel and inspect primary link",
    "Replace component and check for blockages",
    "Activate cooling system and inspect thermal management",
    "Adjust timing parameters and optimize flow",
    "Reduce load on affected circuit and schedule capacity upgrade",
    "Perform diagnostic check and recalibrate sensors",
  ]

  const recentEvents = events.filter((e) => {
    const hoursSince = (Date.now() - new Date(e.start_ts).getTime()) / (1000 * 60 * 60)
    return hoursSince < 48 && (e.severity === "high" || e.severity === "critical" || Math.random() > 0.5)
  })

  return recentEvents.slice(0, 5 + Math.floor(Math.random() * 3)).map((event, i) => ({
    id: `ai-${String(i + 1).padStart(3, "0")}`,
    event_id: event.id,
    proposal: getRandomElement(proposals),
    confidence: 0.82 + Math.random() * 0.15,
    created_at: new Date(new Date(event.start_ts).getTime() + 5 * 60 * 1000).toISOString(),
  }))
}

export const aiActions = generateAiActions()

export function generateChainAnchors() {
  const criticalEvents = events
    .filter((e) => e.severity === "critical" || e.severity === "high")
    .slice(0, 3 + Math.floor(Math.random() * 2))

  return criticalEvents.map((event, i) => ({
    id: `anchor-${String(i + 1).padStart(3, "0")}`,
    event_id: event.id,
    tx_hash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
    block_number: 18234567 + Math.floor(Math.random() * 1000),
    timestamp: new Date(new Date(event.start_ts).getTime() + 15 * 60 * 1000).toISOString(),
  }))
}

export const chainAnchors = generateChainAnchors()

export function generateMeasurements() {
  const measurements = []
  const metrics = {
    "asset-001": [
      { metric: "pressure", unit: "psi", base: 45, variance: 2 },
      { metric: "flow_rate", unit: "gpm", base: 120, variance: 5 },
    ],
    "asset-002": [
      { metric: "voltage", unit: "V", base: 240, variance: 3 },
      { metric: "current", unit: "A", base: 15, variance: 2 },
    ],
    "asset-003": [{ metric: "vehicle_count", unit: "vehicles/hour", base: 340, variance: 50 }],
    "asset-004": [
      { metric: "temperature", unit: "°C", base: 22, variance: 3 },
      { metric: "humidity", unit: "%", base: 55, variance: 10 },
    ],
    "asset-005": [{ metric: "signal_strength", unit: "dBm", base: -45, variance: 5 }],
  }

  // Generate measurements for last 6 hours
  for (let hour = 0; hour < 6; hour++) {
    const timestamp = generateTimestamp(hour, 0)

    Object.entries(metrics).forEach(([assetId, metricList]) => {
      metricList.forEach(({ metric, unit, base, variance }) => {
        measurements.push({
          timestamp,
          asset_id: assetId,
          metric,
          value: (base + (Math.random() - 0.5) * variance).toFixed(1),
          unit,
        })
      })
    })
  }

  return measurements.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export const measurements = generateMeasurements()
