import { NextResponse } from "next/server"

const APPLICATIONS: Record<string, { id: string; timeline: string[] }> = {}

function genId() {
  return "APP" + Math.random().toString(36).slice(2, 8).toUpperCase()
}

export async function POST(req: Request) {
  // In a real app, parse FormData, validate, virus-scan, store securely, trigger workflows
  const id = genId()
  APPLICATIONS[id] = {
    id,
    timeline: [`Application ${id} submitted`, "Verification initiated", "Officer review pending"],
  }
  return NextResponse.json({ ok: true, applicationId: id })
}

export async function GET() {
  return NextResponse.json({ count: Object.keys(APPLICATIONS).length })
}
