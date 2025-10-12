"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Gavel, Landmark, HandCoins, Info } from "lucide-react"
import { Button } from "@/components/ui/button"

const items = [
  {
    title: "Know Your Rights",
    icon: Gavel,
    desc: "Understand protections under PCR (1955) and SC/ST PoA (1989).",
    href: "/schemes",
  },
  {
    title: "Apply for Relief",
    icon: HandCoins,
    desc: "Step-by-step guide to submit a relief application.",
    href: "/apply",
  },
  {
    title: "Incentives for Inter-Caste Marriages",
    icon: Landmark,
    desc: "Learn eligibility and documentation for ICM incentives.",
    href: "/schemes",
  },
  {
    title: "How this portal works",
    icon: Info,
    desc: "Transparent, time-bound processing with DBT.",
    href: "/",
  },
] as const

export function AwarenessHub() {
  return (
    <section className="mt-12">
      <h2 className="text-pretty text-xl md:text-2xl font-semibold text-primary">Awareness Hub</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {items.map(({ title, icon: Icon, desc, href }) => (
          <Card key={title} className="h-full">
            <CardHeader className="flex flex-row items-center gap-2">
              <Icon className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">{title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground grid gap-3">
              <p>{desc}</p>
              <Button asChild variant="secondary" size="sm" className="w-fit">
                <Link href={href}>Learn more</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
