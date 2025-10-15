"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, FileCheck } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

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
  consent?: boolean
  firPreview?: string
  castePreview?: string
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
    consent: false,
    firPreview: "",
    castePreview: "",
  })
  const [dialogOpen, setDialogOpen] = useState(false)
  const [verifyOpen, setVerifyOpen] = useState(false)

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
    if (step === 4) return !!data.consent
    return true
  }, [step, data, ekycVerified])

  async function simulateEKYC() {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setEkycVerified(true)
    setData((prev) => ({
      ...prev,
      name: prev.name || "Ravi Kumar",
      dob: prev.dob || "1994-06-12",
      address: prev.address || "123, Ward 5, Example Nagar, Jaipur, Rajasthan",
    }))
    setLoading(false)
    setVerifyOpen(true)
  }

  async function importFromDigiLocker() {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 700))
    setEkycVerified(true)
    setData((prev) => ({
      ...prev,
      name: "Ravi Kumar",
      dob: "1994-06-12",
      address: "123, Ward 5, Example Nagar, Jaipur, Rajasthan",
      email: prev.email || "ravi@example.com",
    }))
    setLoading(false)
    setVerifyOpen(true)
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

  function validateFile(file: File) {
    const okType = /^(application\/pdf|image\/jpeg|image\/png)$/i.test(file.type)
    const okSize = file.size <= 5 * 1024 * 1024
    return { ok: okType && okSize, okType, okSize }
  }

  async function handleFile(kind: "fir" | "caste", f: File | null) {
    if (!f) {
      setData((d) => ({ ...d, [kind]: null, [`${kind}Preview`]: "" as any }))
      return
    }
    const { ok, okType, okSize } = validateFile(f)
    if (!ok) {
      alert(
        `Invalid file. Allowed: PDF/JPEG/PNG; Max size: 5MB.\nType ok: ${okType ? "yes" : "no"} | Size ok: ${
          okSize ? "yes" : "no"
        }`,
      )
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setData((d) => ({ ...d, [kind]: f, [`${kind}Preview`]: reader.result as string }))
    }
    reader.readAsDataURL(f)
  }

  function simulateOCR() {
    // very simple mock extraction from filename
    const nameFromFile =
      data.fir?.name.replace(/\.[^.]+$/, "").replace(/[_-]/g, " ") ||
      data.casteCert?.name.replace(/\.[^.]+$/, "").replace(/[_-]/g, " ")
    if (nameFromFile) {
      setData((d) => ({
        ...d,
        name: d.name || nameFromFile.split(" ")[0] + " Kumar",
        address: d.address || "Auto-extracted: Ward 10, Sample Colony",
      }))
    }
  }

  function syncNow() {
    alert("Sync simulated. Your draft has been uploaded in this demo.")
    localStorage.removeItem(LOCAL_KEY)
  }

  return (
    <div>
      <Stepper step={step} />

      {step === 1 && (
        <section className="mt-4 grid gap-3">
          <Label htmlFor="aadhaar">Aadhaar Number</Label>
          <div className="flex items-center gap-2">
            <Input
              id="aadhaar"
              inputMode="numeric"
              maxLength={12}
              placeholder="12-digit Aadhaar"
              value={data.aadhaar}
              onChange={(e) => setData({ ...data, aadhaar: e.target.value.replace(/\D/g, "").slice(0, 12) })}
            />
            {ekycVerified && (
              <Badge variant="secondary" className="text-green-700 border-green-600/30 bg-green-50">
                <ShieldCheck className="mr-1 h-3.5 w-3.5" /> Verified
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={simulateEKYC} disabled={loading || data.aadhaar.length !== 12}>
              {loading ? "Verifying..." : "Verify Aadhaar"}
            </Button>
            <Button variant="secondary" onClick={importFromDigiLocker} disabled={loading}>
              <FileCheck className="mr-2 h-4 w-4" /> Import from DigiLocker
            </Button>
            <Button variant="ghost" onClick={() => setStep(2)} disabled={!ekycVerified}>
              Next
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Mock verification for demo; auto-fills basic details after verify.
          </p>
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
          <Input type="file" accept=".pdf,image/*" onChange={(e) => handleFile("fir", e.target.files?.[0] || null)} />
          {data.firPreview && (
            <div className="flex items-center gap-2">
              <Image
                src={data.firPreview || "/placeholder.svg"}
                alt="FIR preview"
                width={80}
                height={80}
                className="rounded border"
              />
              <span className="text-xs text-muted-foreground">{data.fir?.name}</span>
            </div>
          )}
          <Label>Upload Caste Certificate (PDF/JPG)</Label>
          <Input type="file" accept=".pdf,image/*" onChange={(e) => handleFile("caste", e.target.files?.[0] || null)} />
          {data.castePreview && (
            <div className="flex items-center gap-2">
              <Image
                src={data.castePreview || "/placeholder.svg"}
                alt="Caste certificate preview"
                width={80}
                height={80}
                className="rounded border"
              />
              <span className="text-xs text-muted-foreground">{data.casteCert?.name}</span>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="secondary" onClick={simulateOCR}>
              Simulate OCR Extract
            </Button>
            <Button size="sm" variant="outline" onClick={syncNow}>
              Sync Now
            </Button>
          </div>
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
          <div className="mt-3 flex items-center gap-2">
            <input
              id="consent"
              type="checkbox"
              checked={!!data.consent}
              onChange={(e) => setData({ ...data, consent: e.target.checked })}
            />
            <label htmlFor="consent" className="text-sm">
              I agree to data verification via Aadhaar/DigiLocker and accept the{" "}
              <button type="button" className="underline" onClick={() => setDialogOpen(true)}>
                Privacy Policy
              </button>
              .
            </label>
          </div>
          <div className="mt-2">
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              Download Receipt (PDF)
            </Button>
          </div>
        </section>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Privacy Policy</DialogTitle>
            <DialogDescription>
              This demo simulates consented verification. No real personal data is processed. Uploaded files stay
              in-browser only.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={verifyOpen} onOpenChange={setVerifyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Identity Verified</DialogTitle>
            <DialogDescription>Details have been auto-filled from Aadhaar/DigiLocker for this demo.</DialogDescription>
          </DialogHeader>
          <div className="text-sm grid gap-2">
            <div>
              <span className="text-muted-foreground">Name:</span> {data.name || "—"}
            </div>
            <div>
              <span className="text-muted-foreground">DOB:</span> {data.dob || "—"}
            </div>
            <div className="break-words">
              <span className="text-muted-foreground">Address:</span> {data.address || "—"}
            </div>
            <div>
              <Badge variant="secondary" className="text-green-700 border-green-600/30 bg-green-50">
                <ShieldCheck className="mr-1 h-3.5 w-3.5" /> Verified
              </Badge>
            </div>
            <div className="mt-2">
              <Button size="sm" onClick={() => setVerifyOpen(false)}>
                Continue
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
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
