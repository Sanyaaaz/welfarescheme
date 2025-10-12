"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

export default function GrievancesPage() {
  const [ticketId, setTicketId] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    setLoading(true)
    const res = await fetch("/api/grievances", { method: "POST", body: formData })
    const data = await res.json()
    setTicketId(data.ticketId)
    setOpen(true)
    setLoading(false)
    form.reset()
  }

  return (
    <div className="px-4 md:px-8">
      <section className="mx-auto max-w-3xl py-8 md:py-12">
        <h1 className="text-2xl md:text-3xl font-semibold text-primary">Grievance Redressal</h1>
        <p className="mt-2 text-muted-foreground">
          Raise complaints or report delays. Track via auto-generated ticket.
        </p>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Submit Grievance</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={submit}>
              <Input name="name" placeholder="Your Name" required />
              <Input name="applicationId" placeholder="Application ID (if any)" />
              <Input name="phone" placeholder="Phone" required />
              <Input name="email" placeholder="Email" type="email" />
              <Textarea name="message" placeholder="Describe your issue" required />
              <Button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </form>
            {ticketId && (
              <>
                <p className="mt-4 text-sm text-muted-foreground">
                  Ticket generated: <span className="font-medium">{ticketId}</span>
                </p>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Grievance Submitted</DialogTitle>
                      <DialogDescription>Save your ticket details for future reference.</DialogDescription>
                    </DialogHeader>
                    <div className="text-sm grid gap-2">
                      <div>
                        Ticket ID: <span className="font-medium">{ticketId}</span>
                      </div>
                      <div>
                        Status: <span className="font-medium text-yellow-700">Pending</span>
                      </div>
                      <p className="text-muted-foreground">
                        Our team will review and respond. You can track this via your Application ID or this ticket.
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
