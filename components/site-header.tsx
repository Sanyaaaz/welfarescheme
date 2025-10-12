"use client"

import Image from "next/image"
import Link from "next/link"
import { LanguageToggle } from "./language-toggle"
import { LargeTextToggle } from "./large-text-toggle"
import { Button } from "@/components/ui/button"
import { VoiceAssistButton } from "./voice-assist-button"
import { HighContrastToggle } from "./high-contrast-toggle"

export function SiteHeader() {
  return (
    <header className="border-b bg-card">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/images/emblem.jpg" alt="Emblem of India" width={32} height={32} className="shrink-0" />
          <div className="leading-tight">
            <div className="font-semibold text-sm md:text-base text-primary text-pretty">
              Ministry of Social Justice & Empowerment
            </div>
            <div className="text-xs text-muted-foreground">Government of India</div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-4 text-sm">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <Link href="/apply" className="hover:underline">
            Apply
          </Link>
          <Link href="/track" className="hover:underline">
            Track Status
          </Link>
          <Link href="/schemes" className="hover:underline">
            Schemes
          </Link>
          <Link href="/dashboard" className="hover:underline">
            Dashboard
          </Link>
          <Link href="/grievances" className="hover:underline">
            Grievances
          </Link>
          <Link href="/contact" className="hover:underline">
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <LargeTextToggle />
          <HighContrastToggle />
          <VoiceAssistButton />
          <Button asChild size="sm" variant="outline" className="hidden md:inline-flex bg-transparent">
            <Link href="/apply">Apply Now</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
