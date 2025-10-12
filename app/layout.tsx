import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { SiteHeader } from "@/components/site-header"
import { I18nProvider } from "@/components/providers/i18n-provider"
import { AccessibilityProvider } from "@/components/providers/accessibility-provider"
import { Suspense } from "react"
import { ChatbotWidget } from "@/components/chatbot-widget"

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <I18nProvider>
            <AccessibilityProvider>
              <SiteHeader />
              <main className="min-h-dvh">{children}</main>
              <ChatbotWidget />
            </AccessibilityProvider>
          </I18nProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
