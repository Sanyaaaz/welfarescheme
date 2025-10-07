"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function Chatbot() {
  const [q, setQ] = useState("")
  const [a, setA] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  async function ask() {
    setLoading(true)
    const res = await fetch("/api/eligibility", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ age: "", caste: "", description: q }),
    })
    const json = await res.json()
    setA(json.result)
    setLoading(false)
  }
  return (
    <div className="grid gap-2">
      <div className="flex gap-2">
        <Input placeholder="Ask about application process..." value={q} onChange={(e) => setQ(e.target.value)} />
        <Button onClick={ask} disabled={loading}>
          {loading ? "..." : "Ask"}
        </Button>
      </div>
      {a && <p className="text-sm text-muted-foreground">{a}</p>}
    </div>
  )
}
