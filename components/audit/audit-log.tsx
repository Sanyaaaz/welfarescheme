"use client"

import { useEffect, useState } from "react"

export type AuditEvent = {
  id: string
  action:
    | "Application Submitted"
    | "Verified"
    | "Approved"
    | "Rejected"
    | "Fund Released"
    | "Fund Transferred"
    | "Delivered"
    | "Grievance Raised"
  actor: string
  ref?: string
  meta?: Record<string, any>
  ts: number
}

export function addAudit(ev: Omit<AuditEvent, "id" | "ts">) {
  try {
    const raw = window.localStorage.getItem("audit-log")
    const arr: AuditEvent[] = raw ? JSON.parse(raw) : []
    const item: AuditEvent = { id: crypto.randomUUID(), ts: Date.now(), ...ev }
    window.localStorage.setItem("audit-log", JSON.stringify([item, ...arr]))
    window.dispatchEvent(new Event("audit:updated"))
  } catch {}
}

export function AuditLog({ limit }: { limit?: number }) {
  const [items, setItems] = useState<AuditEvent[]>([])
  const load = () => {
    try {
      const raw = window.localStorage.getItem("audit-log")
      setItems(raw ? JSON.parse(raw) : [])
    } catch {}
  }
  useEffect(() => {
    load()
    const fn = () => load()
    window.addEventListener("audit:updated", fn)
    return () => window.removeEventListener("audit:updated", fn)
  }, [])
  const list = limit ? items.slice(0, limit) : items
  return list.length === 0 ? (
    <p className="text-sm text-muted-foreground">No activity yet.</p>
  ) : (
    <div className="space-y-2">
      {list.map((ev) => (
        <div key={ev.id} className="rounded border p-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{new Date(ev.ts).toLocaleString()}</span>
            <span>{ev.actor}</span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="rounded bg-muted px-2 py-0.5 text-xs">{ev.action}</span>
            {ev.ref && <span className="text-xs">Ref: {ev.ref}</span>}
          </div>
          {ev.meta && (
            <pre className="mt-1 overflow-auto rounded bg-muted p-2 text-xs">{JSON.stringify(ev.meta, null, 2)}</pre>
          )}
        </div>
      ))}
    </div>
  )
}
