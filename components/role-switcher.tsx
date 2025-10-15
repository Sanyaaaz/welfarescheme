"use client"

import { useAuth } from "./providers/auth-provider"

const ROLES: Array<"Beneficiary" | "DistrictOfficer" | "StateAdmin" | "CentralAdmin"> = [
  "Beneficiary",
  "DistrictOfficer",
  "StateAdmin",
  "CentralAdmin",
]

export function RoleSwitcher() {
  const { role, setRole } = useAuth()
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-muted-foreground" htmlFor="role-select">
        Role
      </label>
      <select
        id="role-select"
        className="rounded-md border bg-background px-2 py-1 text-sm"
        value={role}
        onChange={(e) => setRole(e.target.value as any)}
        aria-label="Select role"
      >
        {ROLES.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
    </div>
  )
}
