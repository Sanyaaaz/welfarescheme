import { NextResponse } from "next/server"

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = params.id
  // Look up mock store in sibling module
  const { default: store } = await import("../../applications/route")
  // Not directly accessible; fallback to simulated response
  const mock = [
    `Application ${id} submitted`,
    "Verification → Sanction → Fund Disbursement → Completion",
    "Sanction order generated",
    "DBT transfer initiated",
    "Completion certificate available",
  ]
  return NextResponse.json({ id, timeline: mock })
}
