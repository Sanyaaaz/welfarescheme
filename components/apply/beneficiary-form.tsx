"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"

type Step = 1 | 2 | 3 | 4
type FormData = {
  aadhaar: string
  name: string
  dob: string
  address: string
  phone: string
  email?: string
  scheme: "relief" | "icm"
  fir?: File | null
  casteCert?: File | null
  notes?: string
}

const LOCAL_KEY = "applyDraft"

export function BeneficiaryForm() {
  const [step, setStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)
  const [ekycVerified, setEkycVerified] = useState(false)
  const [applicationId, setApplicationId] = useState<string | null>(null)
  const [data, setData] = useState<FormData>({
    aadhaar: "",
    name: "",
    dob: "",
    address: "",
    phone: "",
    email: "",
    scheme: "relief",
    fir: null,
    casteCert: null,
    notes: "",
  })

  // Offline save
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_KEY)
    if (saved) {
      try {
        setData({ ...data, ...JSON.parse(saved) })
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    const { fir, casteCert, ...rest } = data
    localStorage.setItem(LOCAL_KEY, JSON.stringify(rest))
  }, [data])

  const canNext = useMemo(() => {
    if (step === 1) return data.aadhaar.length === 12 && ekycVerified
    if (step === 2) return !!data.name && !!data.dob && !!data.address && !!data.phone
    if (step === 3) return !!data.fir && !!data.casteCert
    return true
  }, [step, data, ekycVerified])

  async function simulateEKYC() {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setEkycVerified(true)
    setLoading(false)
  }

  async function submit() {
    setLoading(true)
    const body = new FormData()
    Object.entries(data).forEach(([k, v]) => {
      if (v instanceof File) body.append(k, v)
      else if (typeof v === "string") body.append(k, v)
      else if (v != null) body.append(k, String(v))
    })
    const res = await fetch("/api/applications", { method: "POST", body })
    const json = await res.json()
    setApplicationId(json.applicationId)
    setLoading(false)
    localStorage.removeItem(LOCAL_KEY)
  }

  return (
    <div>
      <Stepper step={step} />

      {step === 1 && (
        <section className="mt-4 grid gap-3">
          <Label htmlFor="aadhaar">Aadhaar Number</Label>
          <Input
            id="aadhaar"
            inputMode="numeric"
            maxLength={12}
            placeholder="12-digit Aadhaar"
            value={data.aadhaar}
            onChange={(e) => setData({ ...data, aadhaar: e.target.value.replace(/\D/g, "").slice(0, 12) })}
          />
          <div className="flex gap-2">
            <Button onClick={simulateEKYC} disabled={loading || data.aadhaar.length !== 12}>
              {loading ? "Verifying..." : ekycVerified ? "eKYC Verified" : "Start eKYC"}
            </Button>
            <Button variant="secondary" onClick={() => setStep(2)} disabled={!ekycVerified}>
              Next
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Simulated Aadhaar eKYC for prototype; no real data accessed.</p>
        </section>
      )}

      {step === 2 && (
        <section className="mt-4 grid gap-3">
          <Label>Name</Label>
          <Input value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
          <Label>Date of Birth</Label>
          <Input type="date" value={data.dob} onChange={(e) => setData({ ...data, dob: e.target.value })} />
          <Label>Address</Label>
          <Textarea value={data.address} onChange={(e) => setData({ ...data, address: e.target.value })} />
          <Label>Phone</Label>
          <Input inputMode="tel" value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} />
          <Label>Email (optional)</Label>
          <Input type="email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} />
          <div className="flex items-center gap-2 mt-2">
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button onClick={() => setStep(3)} disabled={!canNext}>
              Next
            </Button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="mt-4 grid gap-3">
          <Label>Scheme</Label>
          <div className="flex gap-3">
            <button
              className={`px-3 py-2 rounded border ${data.scheme === "relief" ? "bg-primary text-primary-foreground" : "bg-card"}`}
              onClick={() => setData({ ...data, scheme: "relief" })}
            >
              Relief (PoA/PCR)
            </button>
            <button
              className={`px-3 py-2 rounded border ${data.scheme === "icm" ? "bg-primary text-primary-foreground" : "bg-card"}`}
              onClick={() => setData({ ...data, scheme: "icm" })}
            >
              Inter-caste Marriage Incentive
            </button>
          </div>
          <Label>Upload FIR copy (PDF/JPG)</Label>
          <Input
            type="file"
            accept=".pdf,image/*"
            onChange={(e) => setData({ ...data, fir: e.target.files?.[0] || null })}
          />
          <Label>Upload Caste Certificate (PDF/JPG)</Label>
          <Input
            type="file"
            accept=".pdf,image/*"
            onChange={(e) => setData({ ...data, casteCert: e.target.files?.[0] || null })}
          />
          <Label>Notes (optional)</Label>
          <Textarea value={data.notes} onChange={(e) => setData({ ...data, notes: e.target.value })} />
          <div className="flex items-center gap-2 mt-2">
            <Button variant="outline" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button onClick={() => setStep(4)} disabled={!canNext}>
              Next
            </Button>
          </div>
        </section>
      )}

      {step === 4 && (
        <section className="mt-4">
          <Card>
            <CardContent className="pt-6 text-sm">
              <div className="grid gap-2">
                <div>
                  <span className="text-muted-foreground">Name:</span> {data.name}
                </div>
                <div>
                  <span className="text-muted-foreground">Aadhaar:</span> XXXX-XXXX-{data.aadhaar.slice(-4)}
                </div>
                <div>
                  <span className="text-muted-foreground">Scheme:</span>{" "}
                  {data.scheme === "relief" ? "Relief" : "Inter-caste Marriage Incentive"}
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" onClick={() => setStep(3)}>
                  Back
                </Button>
                <Button onClick={submit} disabled={loading}>
                  {loading ? "Submitting..." : "Submit with eSign"}
                </Button>
              </div>
              {applicationId && (
                <div className="mt-4 text-sm">
                  Application submitted. Your ID: <span className="font-medium">{applicationId}</span>
                </div>
              )}
            </CardContent>
          </Card>
          <p className="mt-2 text-xs text-muted-foreground">eSign simulated for prototype.</p>
        </section>
      )}
    </div>
  )
}

function Stepper({ step }: { step: Step }) {
  const steps = ["eKYC", "Details", "Documents", "Review"]
  return (
    <ol className="grid grid-cols-4 gap-2">
      {steps.map((label, idx) => {
        const i = (idx + 1) as Step
        const active = i <= step
        return (
          <li
            key={label}
            className={`flex items-center justify-center gap-2 rounded border px-3 py-2 text-sm ${active ? "bg-primary text-primary-foreground" : "bg-card"}`}
          >
            <span className="size-5 rounded-full border flex items-center justify-center bg-background">{i}</span>
            <span className="sr-only md:not-sr-only">{label}</span>
          </li>
        )
      })}
    </ol>
  )
}
