"use client"

import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function AnnouncementBar() {
  const { data } = useSWR("/api/announcements", fetcher)

  if (!data?.items?.length) return null

  return (
    <div className="w-full bg-secondary text-secondary-foreground">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-2 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          {data.items.map((it: any, idx: number) => (
            <span key={idx} className="mr-8 text-sm">
              {it.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
