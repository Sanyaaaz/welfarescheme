"use client"

import { useState } from "react"
import { MessageCircle, X, HelpCircle, FileWarning, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const FAQ: Record<string, string> = {
  "How to apply?":
    "Go to Apply, complete Aadhaar verification, fill details, upload FIR/Caste Certificate, and submit with eSign.",
  "Check fund status":
    "Open Track, enter your Application ID. You will see a step-wise journey from Received to Delivered.",
  "File grievance": "Open Grievances, fill name, issue and application ID (optional). Submit to generate a ticket.",
}

export function ChatbotWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [response, setResponse] = useState<string | null>(null)

  function ask(q?: string) {
    const key = q || input
    const canned =
      Object.keys(FAQ).find((k) => k.toLowerCase() === key.toLowerCase()) ||
      (key.toLowerCase().includes("apply")
        ? "How to apply?"
        : key.toLowerCase().includes("grievance")
          ? "File grievance"
          : key.toLowerCase().includes("status")
            ? "Check fund status"
            : "")
    setResponse(canned ? FAQ[canned] : "For this demo, try: How to apply?, Check fund status, or File grievance.")
  }

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        {!open ? (
          <Button size="lg" className="rounded-full shadow" onClick={() => setOpen(true)} aria-haspopup="dialog">
            <MessageCircle className="mr-2 h-5 w-5" /> Help
          </Button>
        ) : (
          <Card className="w-[320px] shadow-lg" role="dialog" aria-label="Help chatbot">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">Assistant</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close">
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" size="sm" onClick={() => ask("How to apply?")}>
                  <HelpCircle className="mr-1 h-4 w-4" /> How to apply?
                </Button>
                <Button variant="secondary" size="sm" onClick={() => ask("Check fund status")}>
                  <Search className="mr-1 h-4 w-4" /> Check fund status
                </Button>
                <Button variant="secondary" size="sm" onClick={() => ask("File grievance")}>
                  <FileWarning className="mr-1 h-4 w-4" /> File grievance
                </Button>
              </div>
              <div className="flex gap-2">
                <Input placeholder="Ask a question..." value={input} onChange={(e) => setInput(e.target.value)} />
                <Button onClick={() => ask()} aria-label="Ask">
                  Ask
                </Button>
              </div>
              {response && <p className="text-sm text-muted-foreground">{response}</p>}
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}
