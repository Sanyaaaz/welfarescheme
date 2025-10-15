"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle } from "lucide-react"

type Conn = { name: string; connected: boolean }

export function IntegrationPanel() {
  const [items, setItems] = useState<Conn[]>([
    { name: "Aadhaar", connected: true },
    { name: "DigiLocker", connected: true },
    { name: "eCourts", connected: false },
    { name: "CCTNS", connected: false },
    { name: "PFMS/Bank DBT API", connected: true },
  ])

  const toggle = (name: string) =>
    setItems((prev) => prev.map((x) => (x.name === name ? { ...x, connected: !x.connected } : x)))

  return (
    <Card className="p-3">
      <h3 className="font-medium mb-2">Integration Status</h3>
      <ul className="space-y-2">
        {items.map((i) => (
          <li key={i.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {i.connected ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <span>{i.name}</span>
            </div>
            <Button size="sm" variant="outline" onClick={() => toggle(i.name)}>
              {i.connected ? "Connected" : "Disconnected"}
            </Button>
          </li>
        ))}
      </ul>
    </Card>
  )
}
