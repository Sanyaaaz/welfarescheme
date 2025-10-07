"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export function EligibilityChecker() {
  const [age, setAge] = useState("")
  const [caste, setCaste] = useState("")
  const [desc, setDesc] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  async function check() {
    setLoading(true)
    setResult(null)
    const res = await fetch("/api/eligibility", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ age, caste, description: desc }),
    })
    const json = await res.json()
    setResult(json.result)
    setLoading(false)
  }

  return (
    <div className="grid gap-3">
      <Input
        placeholder="Age"
        inputMode="numeric"
        value={age}
        onChange={(e) => setAge(e.target.value.replace(/\D/g, ""))}
      />
      <Input placeholder="Caste (e.g., SC/ST/OBC/General)" value={caste} onChange={(e) => setCaste(e.target.value)} />
      <Textarea placeholder="Briefly describe the situation" value={desc} onChange={(e) => setDesc(e.target.value)} />
      <Button onClick={check} disabled={loading}>
        {loading ? "Checking..." : "Check Eligibility"}
      </Button>
      {result && <div className="text-sm text-muted-foreground">{result}</div>}
    </div>
  )
}
