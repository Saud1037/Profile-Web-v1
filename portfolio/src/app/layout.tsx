import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Saud — Personal System',
  description: 'Developer specialized in building exceptional digital experiences.',
  keywords: ['developer', 'portfolio', 'discord bot', 'nextjs', 'react'],
  openGraph: {
    title: 'Saud — Personal System',
    description: 'Developer specialized in building exceptional digital experiences.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <div className="scanline" aria-hidden="true" />
        {children}
      </body>
    </html>
  )
}
