import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AIPFF — All In Poker For Friends',
  description: 'פלטפורמת פוקר לחברים',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body>{children}</body>
    </html>
  )
}
