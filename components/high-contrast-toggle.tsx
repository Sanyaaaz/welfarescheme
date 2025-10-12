"use client"

import { useAccessibility } from "@/components/providers/accessibility-provider"
import { Button } from "@/components/ui/button"
import { Contrast } from "lucide-react"

export function HighContrastToggle() {
  const { highContrast, toggleHighContrast } = useAccessibility()
  return (
    <Button
      variant="outline"
      size="sm"
      aria-pressed={highContrast}
      aria-label="Toggle high contrast"
      onClick={toggleHighContrast}
    >
      <Contrast className="mr-2 h-4 w-4" />
      {highContrast ? "Default" : "High contrast"}
    </Button>
  )
}
