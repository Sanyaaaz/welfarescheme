"use client"

import { useState } from "react"
import { useAuth } from "../providers/auth-provider"
import { addAudit } from "../audit/audit-log"

type Stage = "Received" | "Under Review" | "Approved" | "Rejected"
type Role = "DistrictOfficer" | "StateAdmin" | "CentralAdmin"

const NEXT: Record<Role, Role | null> = {
  DistrictOfficer: "StateAdmin",
  StateAdmin: "CentralAdmin",
  CentralAdmin: null,
}

export function ApprovalPanel({
  applicationId,
  beneficiaryName,
  onChanged,
}: {
  applicationId: string
  beneficiaryName: string
  onChanged?: (s: Stage) => void
}) {
  const { role } = useAuth()
  const [stage, setStage] = useState<Stage>("Received")
  const [comment, setComment] = useState("")
  const [attachment, setAttachment] = useState<File | null>(null)
  const canAct = role === "DistrictOfficer" || role === "StateAdmin" || role === "CentralAdmin"

  const transition = (next: Stage) => {
    setStage(next)
    onChanged?.(next)
    const actor = role
    addAudit({
      action: next === "Approved" ? "Approved" : next === "Rejected" ? "Rejected" : "Verified",
      actor,
      ref: applicationId,
      meta: { comment, hasAttachment: !!attachment, beneficiaryName },
    })
  }

  const approve = () => {
    transition("Approved")
    const escalateTo = NEXT[role as Role]
    if (escalateTo) {
      // indicate escalation in audit
      addAudit({
        action: "Verified",
        actor: role,
        ref: applicationId,
        meta: { escalatedTo: escalateTo },
      })
    }
  }
  const reject = () => transition("Rejected")
  const moveToReview = () => transition("Under Review")

  return (
    <div className="rounded-lg border p-4">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-semibold">Approval Workflow</h4>
        <span className="rounded bg-muted px-2 py-0.5 text-xs">Stage: {stage}</span>
      </div>

      <div className="grid gap-2">
        <textarea
          className="min-h-20 rounded border bg-background p-2 text-sm"
          placeholder="Add comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <label className="text-sm">
          Attach document
          <input
            type="file"
            className="mt-1 block w-full text-sm"
            onChange={(e) => setAttachment(e.target.files?.[0] || null)}
          />
        </label>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button className="rounded bg-secondary px-3 py-1 text-sm" onClick={moveToReview} disabled={!canAct}>
          Move to Review
        </button>
        <button className="rounded bg-green-600 px-3 py-1 text-sm text-white" onClick={approve} disabled={!canAct}>
          Approve
        </button>
        <button className="rounded bg-red-600 px-3 py-1 text-sm text-white" onClick={reject} disabled={!canAct}>
          Reject
        </button>
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        Escalation path: District → State → Central (auto after Approve).
      </p>
    </div>
  )
}
