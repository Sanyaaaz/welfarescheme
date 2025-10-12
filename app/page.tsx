import { AnnouncementBar } from "@/components/announcement-bar"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AwarenessHub } from "@/components/awareness-hub"

export default function HomePage() {
  return (
    <div className="px-4 md:px-8">
      <AnnouncementBar />
      <section className="mx-auto max-w-6xl py-8 md:py-12">
        <header className="mb-8 md:mb-12">
          <h1 className="text-pretty text-3xl md:text-4xl font-semibold text-primary">
            Protection of Civil Rights (1955) and SC/ST PoA (1989) Direct Benefit Transfer Portal
          </h1>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Ensuring timely, transparent, and inclusive monetary relief to victims and incentives for inter-caste
            marriages.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Fast DBT</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Digitized workflow from application to fund transfer.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Transparent</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">Real-time tracking with clear milestones.</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Secure</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Data privacy by design with strong access controls.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Inclusive</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">Multi-language, large text, and voice assist.</CardContent>
          </Card>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button asChild size="lg">
            <Link href="/apply">Apply Now</Link>
          </Button>
          <Button variant="secondary" asChild size="lg">
            <Link href="/track">Track Application</Link>
          </Button>
          <Button variant="outline" asChild size="lg">
            <Link href="/dashboard">Login as District Officer</Link>
          </Button>
          <Button variant="outline" asChild size="lg">
            <Link href="/dashboard">Login as Admin</Link>
          </Button>
        </div>

        <section className="mt-12 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>About PCR & PoA Acts</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              The PCR Act, 1955 abolishes untouchability and penalizes its practice. The SC/ST (Prevention of
              Atrocities) Act, 1989 provides for special courts and relief to victims of caste-based atrocities. This
              portal supports timely relief and incentives under these frameworks.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Resources & Awareness</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Explore eligibility, rights, and processes. View success stories and find district-level officer contacts.
              <div className="mt-3">
                <Button asChild>
                  <Link href="/schemes">View Schemes</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <AwarenessHub />
      </section>
    </div>
  )
}
