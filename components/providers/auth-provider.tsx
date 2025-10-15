"use client"

import type React from "react"
import { createContext, useContext, useEffect, useMemo, useState } from "react"

export type Role = "Beneficiary" | "DistrictOfficer" | "StateAdmin" | "CentralAdmin"

type AuthContextType = {
  role: Role
  setRole: (r: Role) => void
  is: (r: Role | Role[]) => boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>("Beneficiary")

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("rbac-role") : null
    if (saved) setRoleState(saved as Role)
  }, [])

  const setRole = (r: Role) => {
    setRoleState(r)
    try {
      window.localStorage.setItem("rbac-role", r)
    } catch {}
  }

  const value = useMemo<AuthContextType>(
    () => ({
      role,
      setRole,
      is: (r) => (Array.isArray(r) ? r.includes(role) : role === r),
    }),
    [role],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}

export function RoleGate({
  allow,
  children,
  fallback = null,
}: {
  allow: Role | Role[]
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  const { is } = useAuth()
  return is(allow) ? <>{children}</> : <>{fallback}</>
}
