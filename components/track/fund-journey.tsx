"use client"

import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock } from "lucide-react"

const STAGES = ["Received", "Verified", "Sanctioned", "Transferred", "Delivered"] as const
export type Stage = (typeof STAGES)[number]

export function FundJourney({ current }: { current: Stage }) {
  const index = Math.max(0, STAGES.indexOf(current))
  const pct = (index / (STAGES.length - 1)) * 100
  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-5 gap-2 text-xs">
        {STAGES.map((s, i) => {
          const done = i <= index
          return (
            <div key={s} className="flex items-center gap-1">
              {done ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <Clock className="h-4 w-4 text-muted-foreground" />
              )}
              <span className={done ? "text-foreground" : "text-muted-foreground"}>{s}</span>
            </div>
          )
        })}
      </div>
      <Progress value={pct} />
      <div>
        <Badge variant="secondary">{STAGES[index]}</Badge>
      </div>
    </div>
  )
}
