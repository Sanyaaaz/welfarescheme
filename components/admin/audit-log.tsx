"use client"

import { Card } from "@/components/ui/card"

type Log = {
  ts: string
  action: string
  ref?: string
}

export function AuditLog({ items }: { items: Log[] }) {
  return (
    <Card className="p-3">
      <h3 className="font-medium mb-2">Activity Log</h3>
      <ul className="space-y-2">
        {items.map((l, i) => (
          <li key={i} className="text-sm border-l-2 pl-2">
            <span className="text-muted-foreground">{l.ts} • </span>
            <span>{l.action}</span>
            {l.ref ? <span className="text-muted-foreground"> ({l.ref})</span> : null}
          </li>
        ))}
      </ul>
    </Card>
  )
}
