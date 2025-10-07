"use client"

import { BeneficiaryForm } from "@/components/apply/beneficiary-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EligibilityChecker } from "@/components/apply/eligibility-checker"

export default function ApplyPage() {
  return (
    <div className="px-4 md:px-8">
      <section className="mx-auto max-w-5xl py-8 md:py-12">
        <h1 className="text-2xl md:text-3xl font-semibold text-primary text-pretty">Apply for Relief or Incentive</h1>
        <p className="mt-2 text-muted-foreground">
          Complete Aadhaar-based eKYC, upload documents, and submit digitally with eSign.
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Step-by-step Application</CardTitle>
            </CardHeader>
            <CardContent>
              <BeneficiaryForm />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Eligibility Checker</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Get guidance on suitable schemes before you apply.
              <div className="mt-4">
                <EligibilityChecker />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
