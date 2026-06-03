import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AIPFF — All In Poker For Friends',
  description: 'פוקר עם חברים — קבוצות, טורנירים, וסטטיסטיקות',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body className="felt-bg min-h-screen">{children}</body>
    </html>
  )
}
