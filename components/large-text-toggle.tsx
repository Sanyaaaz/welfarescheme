"use client"

import { useAccessibility } from "./providers/accessibility-provider"
import { Button } from "@/components/ui/button"

export function LargeTextToggle() {
  const { largeText, toggleLargeText } = useAccessibility()
  return (
    <Button variant={largeText ? "default" : "outline"} size="sm" aria-pressed={largeText} onClick={toggleLargeText}>
      A+
    </Button>
  )
}
