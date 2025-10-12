"use client"

import { Button } from "@/components/ui/button"
import { Headphones } from "lucide-react"

export function VoiceAssistButton({
  message = "Welcome to the Welfare Portal. Use Apply to start, Track to see your status, and Grievances to raise complaints.",
}: {
  message?: string
}) {
  function speak() {
    try {
      const synth = window.speechSynthesis
      if (!synth) return
      const utter = new SpeechSynthesisUtterance(message)
      utter.lang = "en-IN"
      synth.speak(utter)
    } catch {
      // no-op if speech synthesis unavailable
      const audio = new Audio("/placeholder.svg") // harmless fallback
      audio.play().catch(() => {})
    }
  }
  return (
    <Button variant="outline" size="sm" aria-label="Voice assist" onClick={speak}>
      <Headphones className="mr-2 h-4 w-4" />
      Voice assist
    </Button>
  )
}
