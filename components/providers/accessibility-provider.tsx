"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type Ctx = { largeText: boolean; toggleLargeText: () => void; highContrast: boolean; toggleHighContrast: () => void }
const AccCtx = createContext<Ctx | null>(null)

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [largeText, setLargeText] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  useEffect(() => {
    const saved = localStorage.getItem("largeText")
    if (saved) setLargeText(saved === "1")
    const savedHC = localStorage.getItem("highContrast")
    if (savedHC) setHighContrast(savedHC === "1")
  }, [])
  useEffect(() => {
    localStorage.setItem("largeText", largeText ? "1" : "0")
    document.body.classList.toggle("text-lg", largeText)
    document.body.classList.toggle("leading-relaxed", largeText)
  }, [largeText])
  useEffect(() => {
    localStorage.setItem("highContrast", highContrast ? "1" : "0")
    document.documentElement.classList.toggle("high-contrast", highContrast)
  }, [highContrast])
  return (
    <AccCtx.Provider
      value={{
        largeText,
        toggleLargeText: () => setLargeText((v) => !v),
        highContrast,
        toggleHighContrast: () => setHighContrast((v) => !v),
      }}
    >
      {children}
    </AccCtx.Provider>
  )
}
export function useAccessibility() {
  const v = useContext(AccCtx)
  if (!v) throw new Error("useAccessibility must be used within AccessibilityProvider")
  return v
}
