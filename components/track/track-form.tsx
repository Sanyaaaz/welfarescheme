"use client"

import useSWR from "swr"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function TrackForm() {
  const [id, setId] = useState("")
  const { data, error, isLoading } = useSWR(id ? `/api/track/${id}` : null, fetcher)

  return (
    <div className="grid gap-4">
      <div className="flex gap-2">
        <Input placeholder="Enter Application ID" value={id} onChange={(e) => setId(e.target.value)} />
        <Button
          onClick={() => {
            /* SWR triggers via id state */
          }}
        >
          Track
        </Button>
      </div>
      {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
      {error && <p className="text-sm text-destructive">Not found.</p>}
      {data && (
        <Card>
          <CardHeader>
            <CardTitle>Status Timeline</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <ul className="list-disc pl-5">
              {data.timeline.map((t: any, i: number) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
            <div className="mt-4">
              <Button onClick={() => window.print()}>Download Payment Certificate (PDF)</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
