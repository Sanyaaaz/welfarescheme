"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type Ctx = { largeText: boolean; toggleLargeText: () => void }
const AccCtx = createContext<Ctx | null>(null)

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [largeText, setLargeText] = useState(false)
  useEffect(() => {
    const saved = localStorage.getItem("largeText")
    if (saved) setLargeText(saved === "1")
  }, [])
  useEffect(() => {
    localStorage.setItem("largeText", largeText ? "1" : "0")
    document.body.classList.toggle("text-lg", largeText)
    document.body.classList.toggle("leading-relaxed", largeText)
  }, [largeText])
  return (
    <AccCtx.Provider value={{ largeText, toggleLargeText: () => setLargeText((v) => !v) }}>{children}</AccCtx.Provider>
  )
}
export function useAccessibility() {
  const v = useContext(AccCtx)
  if (!v) throw new Error("useAccessibility must be used within AccessibilityProvider")
  return v
}
