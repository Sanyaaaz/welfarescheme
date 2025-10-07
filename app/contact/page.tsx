import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const contacts = [
  { district: "Bhopal", officer: "District Welfare Officer", phone: "01234-567890", email: "dwo.bhopal@example.gov" },
  { district: "Jaipur", officer: "District Welfare Officer", phone: "01345-678901", email: "dwo.jaipur@example.gov" },
]

export default function ContactPage() {
  return (
    <div className="px-4 md:px-8">
      <section className="mx-auto max-w-4xl py-8 md:py-12">
        <h1 className="text-2xl md:text-3xl font-semibold text-primary">Contact</h1>
        <p className="mt-2 text-muted-foreground">District-level welfare officers for assistance.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {contacts.map((c) => (
            <Card key={c.district}>
              <CardHeader>
                <CardTitle>{c.district}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <div>{c.officer}</div>
                <div>{c.phone}</div>
                <div>{c.email}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
