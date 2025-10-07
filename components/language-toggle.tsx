"use client"

import { useI18n } from "./providers/i18n-provider"
import { Button } from "@/components/ui/button"

export function LanguageToggle() {
  const { lang, setLang } = useI18n()
  return (
    <Button
      variant="outline"
      size="sm"
      aria-label="Toggle language"
      onClick={() => setLang(lang === "en" ? "hi" : "en")}
    >
      {lang === "en" ? "हिंदी" : "English"}
    </Button>
  )
}
