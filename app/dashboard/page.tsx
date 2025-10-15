"use client"

import { useMemo, useState } from "react"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuditLog } from "@/components/audit/audit-log"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function exportCSV(rows: any[], name = "report.csv") {
  const keys = rows.length ? Object.keys(rows[0]) : []
  const csv = [keys.join(","), ...rows.map((r) => keys.map((k) => JSON.stringify(r[k] ?? "")).join(","))].join("\n")
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = name
  a.click()
  URL.revokeObjectURL(url)
}

function IntegrationPanel() {
  const [status, setStatus] = useState<Record<string, boolean>>({
    Aadhaar: true,
    DigiLocker: true,
    eCourts: false,
    CCTNS: false,
    PFMS: true,
  })
  return (
    <div className="grid gap-3 md:grid-cols-5">
      {Object.entries(status).map(([k, v]) => (
        <div key={k} className="rounded border p-3 text-sm flex items-center justify-between">
          <span>{k}</span>
          <button
            className={`px-2 py-1 rounded ${v ? "bg-green-600 text-white" : "bg-destructive text-destructive-foreground"}`}
            onClick={() => setStatus((s) => ({ ...s, [k]: !s[k] }))}
            aria-pressed={v}
          >
            {v ? "Connected" : "Disconnected"}
          </button>
        </div>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const [role, setRole] = useState<"district" | "state" | "central" | null>(null)
  const [district, setDistrict] = useState<string>("All")
  const [date, setDate] = useState<string>("")
  const { data } = useSWR(role ? "/api/analytics?role=" + role : null, fetcher)
  const tableRows = useMemo(() => data?.table || [], [data])

  const utilization = [
    { name: "Utilized", value: 78 },
    { name: "Balance", value: 22 },
  ]
  const avgTime = [
    { month: "Jan", days: 18 },
    { month: "Feb", days: 16 },
    { month: "Mar", days: 14 },
    { month: "Apr", days: 13 },
    { month: "May", days: 12 },
  ]
  const COLORS = ["var(--color-chart-2)", "var(--color-chart-3)"]

  return (
    <div className="px-4 md:px-8">
      <section className="mx-auto max-w-6xl py-8 md:py-12">
        <h1 className="text-2xl md:text-3xl font-semibold text-primary">Officer / Admin Dashboard</h1>
        {!role ? (
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={() => setRole("district")}>Login as District Officer</Button>
            <Button variant="secondary" onClick={() => setRole("state")}>
              Login as State Dept
            </Button>
            <Button variant="outline" onClick={() => setRole("central")}>
              Login as Central Ministry
            </Button>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Applications Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data?.regionBreakdown || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="region" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="applications" fill="var(--color-chart-2)" />
                      <Bar dataKey="disbursed" fill="var(--color-chart-3)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground grid gap-2">
                <div>
                  Received: <span className="font-medium text-foreground">{data?.received ?? "-"}</span>
                </div>
                <div>
                  Verified: <span className="font-medium text-foreground">{data?.verified ?? "-"}</span>
                </div>
                <div>
                  Disbursed: <span className="font-medium text-foreground">{data?.disbursed ?? "-"}</span>
                </div>
                <div>
                  Pending: <span className="font-medium text-foreground">{data?.pending ?? "-"}</span>
                </div>
                <div>
                  Avg. Processing Time: <span className="font-medium text-foreground">{data?.avgDays ?? "-"} days</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fund Utilization</CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={utilization} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} label>
                      {utilization.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Average Disbursement Time (days)</CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={avgTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="days" stroke="var(--color-chart-5)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Verification Module</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-3">
                  <Input placeholder="Application ID" />
                  <Button>Verify with eCourts</Button>
                  <Button variant="secondary">Verify with CCTNS</Button>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">Simulated verification for prototype.</p>
              </CardContent>
            </Card>

            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Fund Disbursement</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-3">
                <Input placeholder="Sanction Order ID" />
                <Button>Generate Sanction Order</Button>
                <Button variant="secondary">Trigger DBT</Button>
                <p className="md:col-span-3 text-xs text-muted-foreground">
                  Connected to mock PFMS/DBT API in this prototype.
                </p>
              </CardContent>
            </Card>

            {role && (
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <Input
                  placeholder="Filter by district"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                />
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                <Button variant="outline" onClick={() => exportCSV(tableRows, `applications_${district || "all"}.csv`)}>
                  Download CSV
                </Button>
              </div>
            )}
          </div>
        )}

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Integration Status</CardTitle>
          </CardHeader>
          <CardContent>
            <IntegrationPanel />
            <p className="mt-2 text-xs text-muted-foreground">Mock connection toggles for prototype only.</p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Activity (Audit Log)</CardTitle>
          </CardHeader>
          <CardContent>
            <AuditLog limit={8} />
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
