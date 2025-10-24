export const revalidate = 0
export const dynamic = "force-dynamic"

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return window.location.origin
  }
  return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
}

export async function fetchAssets() {
  const url = `${getBaseUrl()}/mock/assets_virtual.json`
  const res = await fetch(url, { cache: "no-store" })
  if (!res.ok) throw new Error("Failed to fetch assets")
  return res.json()
}

export async function fetchEvents() {
  const url = `${getBaseUrl()}/mock/events.json`
  const res = await fetch(url, { cache: "no-store" })
  if (!res.ok) throw new Error("Failed to fetch events")
  return res.json()
}

export async function fetchAIActions() {
  const url = `${getBaseUrl()}/mock/ai_actions.json`
  const res = await fetch(url, { cache: "no-store" })
  if (!res.ok) throw new Error("Failed to fetch AI actions")
  return res.json()
}

export async function fetchChainAnchors() {
  const url = `${getBaseUrl()}/mock/chain_anchors.json`
  const res = await fetch(url, { cache: "no-store" })
  if (!res.ok) throw new Error("Failed to fetch chain anchors")
  return res.json()
}

export async function fetchMeasurements() {
  const url = `${getBaseUrl()}/mock/measurements.csv`
  const res = await fetch(url, { cache: "no-store" })
  if (!res.ok) throw new Error("Failed to fetch measurements")
  const text = await res.text()

  // Parse CSV
  const lines = text.trim().split("\n")
  const headers = lines[0].split(",")

  return lines.slice(1).map((line) => {
    const values = line.split(",")
    return headers.reduce(
      (obj, header, index) => {
        obj[header] = values[index]
        return obj
      },
      {} as Record<string, string>,
    )
  })
}
