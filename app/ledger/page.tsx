"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download } from "lucide-react"
import { addAudit } from "@/components/audit/audit-log"
import { RoleGate } from "@/components/providers/auth-provider"

type Entry = {
  id: string
  name: string
  amount: number
  date: string
  status: "Sanctioned" | "Transferred" | "Delivered"
}

const initial: Entry[] = [
  { id: "AP-1001", name: "Riya Sharma", amount: 25000, date: "2025-10-01", status: "Sanctioned" },
  { id: "AP-1002", name: "Amit Kumar", amount: 18000, date: "2025-10-02", status: "Transferred" },
  { id: "AP-1003", name: "Neha Gupta", amount: 30000, date: "2025-10-04", status: "Delivered" },
]

function nextStatus(s: Entry["status"]): Entry["status"] {
  return s === "Sanctioned" ? "Transferred" : "Delivered"
}

function exportCSV(rows: Entry[]) {
  const head = ["Application ID", "Beneficiary Name", "Amount", "Date", "Status"]
  const body = rows.map((r) => [r.id, r.name, r.amount, r.date, r.status])
  const csv = [head, ...body].map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n")
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "fund-ledger.csv"
  a.click()
  URL.revokeObjectURL(url)
}

export default function LedgerPage() {
  const [rows, setRows] = useState<Entry[]>(initial)

  const triggerDBT = (id: string) =>
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r
        const to = nextStatus(r.status)
        addAudit({
          action: to === "Transferred" ? "Fund Released" : "Delivered",
          actor: "Officer",
          ref: r.id,
          meta: { from: r.status, to, amount: r.amount, name: r.name },
        })
        return { ...r, status: to }
      }),
    )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Fund Disbursement Ledger</h1>
        <Button variant="outline" onClick={() => exportCSV(rows)}>
          <Download className="h-4 w-4 mr-1" />
          Export CSV
        </Button>
      </div>
      <RoleGate
        allow={["DistrictOfficer", "StateAdmin", "CentralAdmin"]}
        fallback={<p className="text-sm text-muted-foreground">Login as an officer/admin to perform DBT actions.</p>}
      >
        <Card className="p-0 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left px-4 py-2">Application ID</th>
                <th className="text-left px-4 py-2">Beneficiary</th>
                <th className="text-left px-4 py-2">Amount</th>
                <th className="text-left px-4 py-2">Date</th>
                <th className="text-left px-4 py-2">Status</th>
                <th className="text-left px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-4 py-2">{r.id}</td>
                  <td className="px-4 py-2">{r.name}</td>
                  <td className="px-4 py-2">₹{r.amount.toLocaleString()}</td>
                  <td className="px-4 py-2">{r.date}</td>
                  <td className="px-4 py-2">
                    <Badge
                      className={
                        r.status === "Delivered"
                          ? "bg-green-600 text-white"
                          : r.status === "Transferred"
                            ? "bg-blue-600 text-white"
                            : "bg-yellow-600 text-white"
                      }
                    >
                      {r.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-2">
                    {r.status !== "Delivered" ? (
                      <Button size="sm" onClick={() => triggerDBT(r.id)}>
                        {r.status === "Sanctioned" ? "Trigger DBT" : "Mark Delivered"}
                      </Button>
                    ) : (
                      <span className="text-muted-foreground">Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </RoleGate>
    </div>
  )
}
