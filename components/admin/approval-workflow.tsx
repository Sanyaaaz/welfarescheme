"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Paperclip } from "lucide-react"

type Stage = "Received" | "Under Review" | "Approved" | "Rejected"

const order: Stage[] = ["Received", "Under Review", "Approved", "Rejected"]

export function ApprovalWorkflow() {
  const [stage, setStage] = useState<Stage>("Received")
  const [comment, setComment] = useState("")
  const [attachment, setAttachment] = useState<File | null>(null)

  const advance = () => {
    if (stage === "Rejected" || stage === "Approved") return
    setStage(stage === "Received" ? "Under Review" : "Approved")
  }

  const reject = () => setStage("Rejected")

  return (
    <Card className="p-3 space-y-3">
      <h3 className="font-medium">Approval Workflow</h3>
      <div className="flex items-center gap-2 flex-wrap">
        {order.map((s) => (
          <div
            key={s}
            className={`px-3 py-1 rounded-full text-xs border ${
              s === stage ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}
            aria-current={s === stage ? "step" : undefined}
          >
            {s}
          </div>
        ))}
      </div>
      <div className="grid gap-2">
        <Textarea placeholder="Add comment" value={comment} onChange={(e) => setComment(e.target.value)} />
        <div className="flex items-center gap-2">
          <input id="attach" type="file" onChange={(e) => setAttachment(e.target.files?.[0] || null)} />
          <label htmlFor="attach" className="text-sm inline-flex items-center gap-1">
            <Paperclip className="h-4 w-4" /> Attach document
          </label>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={advance}>Advance</Button>
        <Button variant="destructive" onClick={reject}>
          Reject
        </Button>
      </div>
      {stage === "Approved" && (
        <p className="text-sm text-muted-foreground">Escalated to next role for finalization.</p>
      )}
    </Card>
  )
}
