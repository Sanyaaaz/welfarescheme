import { NextResponse } from "next/server"

function genTicket() {
  return "TKT-" + Math.random().toString(36).slice(2, 8).toUpperCase()
}

export async function POST() {
  const ticketId = genTicket()
  return NextResponse.json({ ok: true, ticketId })
}
