"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type Lang = "en" | "hi"
type Ctx = { lang: Lang; setLang: (l: Lang) => void }
const I18nCtx = createContext<Ctx | null>(null)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en")
  useEffect(() => {
    const saved = localStorage.getItem("lang") as Lang | null
    if (saved) setLang(saved)
  }, [])
  useEffect(() => {
    localStorage.setItem("lang", lang)
    document.documentElement.lang = lang === "hi" ? "hi" : "en"
  }, [lang])
  return <I18nCtx.Provider value={{ lang, setLang }}>{children}</I18nCtx.Provider>
}
export function useI18n() {
  const v = useContext(I18nCtx)
  if (!v) throw new Error("useI18n must be used within I18nProvider")
  return v
}
