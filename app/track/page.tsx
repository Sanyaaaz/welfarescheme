"use client"

import { TrackForm } from "@/components/track/track-form"

export default function TrackPage() {
  return (
    <div className="px-4 md:px-8">
      <section className="mx-auto max-w-3xl py-8 md:py-12">
        <h1 className="text-2xl md:text-3xl font-semibold text-primary">Track Application Status</h1>
        <p className="mt-2 text-muted-foreground">Use your unique Application ID to view real-time status.</p>
        <div className="mt-6">
          <TrackForm />
        </div>
      </section>
    </div>
  )
}
