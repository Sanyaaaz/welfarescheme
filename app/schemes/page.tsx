import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const SCHEMES = [
  { name: "Relief to Victims under PoA", desc: "Monetary relief per schedule, linked to case milestones." },
  { name: "PCR Act Relief", desc: "Support for victims of untouchability offenses as per guidelines." },
  { name: "Inter-caste Marriage Incentive", desc: "One-time incentive supporting social harmony." },
]

export default function SchemesPage() {
  return (
    <div className="px-4 md:px-8">
      <section className="mx-auto max-w-5xl py-8 md:py-12">
        <h1 className="text-2xl md:text-3xl font-semibold text-primary">Schemes</h1>
        <p className="mt-2 text-muted-foreground">Explore available schemes and their eligibility criteria.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {SCHEMES.map((s) => (
            <Card key={s.name}>
              <CardHeader>
                <CardTitle>{s.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">{s.desc}</CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
