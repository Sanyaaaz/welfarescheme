"use client"

import { useEffect, useState } from "react"
import { Bell, CheckCircle2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

type Role = "Beneficiary" | "DistrictOfficer" | "StateAdmin" | "CentralAdmin"

type Notification = {
  id: string
  title: string
  desc: string
  time: string
  read?: boolean
}

const seedFor = (role: Role): Notification[] => {
  if (role === "DistrictOfficer") {
    return [
      {
        id: "n1",
        title: "3 applications pending approval",
        desc: "Please review and mark Approved/Rejected.",
        time: "2h",
      },
    ]
  }
  return [
    {
      id: "n2",
      title: "Fund sanctioned",
      desc: "Application AP-10231 has been sanctioned.",
      time: "1d",
    },
    {
      id: "n3",
      title: "Grievance update",
      desc: "Ticket G-9812 is now In Review.",
      time: "3d",
      read: true,
    },
  ]
}

export function NotificationBell({ role }: { role: Role }) {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<Notification[]>([])

  useEffect(() => {
    setItems(seedFor(role))
  }, [role])

  const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })))

  return (
    <div className="relative">
      <Button variant="ghost" size="icon" aria-label="Notifications" onClick={() => setOpen((v) => !v)}>
        <Bell className="h-5 w-5" />
      </Button>
      {open && (
        <div role="dialog" aria-label="Notifications" className="absolute right-0 mt-2 w-80 z-50">
          <Card className="p-3 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Notifications</h3>
              <Button size="sm" variant="outline" onClick={markAllRead}>
                Mark all read
              </Button>
            </div>
            <ul className="space-y-2">
              {items.map((n) => (
                <li key={n.id} className="rounded border p-2 flex items-start gap-2">
                  {n.read ? (
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Clock className="h-4 w-4 text-primary" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{n.title}</p>
                    <p className="text-xs text-muted-foreground">{n.desc}</p>
                    <span className="text-xs text-muted-foreground">{n.time}</span>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </div>
  )
}
