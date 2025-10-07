"use client"

import { useState } from "react"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { Input } from "@/components/ui/input"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function DashboardPage() {
  const [role, setRole] = useState<"district" | "state" | "central" | null>(null)
  const { data } = useSWR(role ? "/api/analytics?role=" + role : null, fetcher)

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
          </div>
        )}
      </section>
    </div>
  )
}
