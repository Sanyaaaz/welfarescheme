import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const role = url.searchParams.get("role") || "district"
  const data = {
    role,
    received: 1240,
    verified: 910,
    disbursed: 720,
    pending: 330,
    avgDays: 9.6,
    regionBreakdown: [
      { region: "North", applications: 340, disbursed: 210 },
      { region: "South", applications: 280, disbursed: 190 },
      { region: "East", applications: 310, disbursed: 180 },
      { region: "West", applications: 310, disbursed: 140 },
    ],
  }
  return NextResponse.json(data)
}
