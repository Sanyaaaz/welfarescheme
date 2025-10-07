import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    items: [
      { text: "Update: Revised relief slabs effective this quarter." },
      { text: "Reminder: Submit missing documents within 7 days of intimation." },
      { text: "New: Inter-caste marriage incentive portal enhancements." },
    ],
  })
}
