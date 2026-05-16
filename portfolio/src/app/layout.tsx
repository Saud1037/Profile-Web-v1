import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'سعود — نظام شخصي',
  description: 'مطور متخصص في بناء تجارب رقمية استثنائية',
  keywords: ['developer', 'portfolio', 'discord bot', 'nextjs', 'react'],
  openGraph: {
    title: 'سعود — نظام شخصي',
    description: 'مطور متخصص في بناء تجارب رقمية استثنائية',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head />
      <body>
        <div className="scanline" aria-hidden="true" />
        {children}
      </body>
    </html>
  )
}
