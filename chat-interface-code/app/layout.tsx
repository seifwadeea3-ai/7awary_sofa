import React from "react"
import type { Metadata } from 'next'
import { Tajawal } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const tajawal = Tajawal({ 
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "700", "800", "900"]
});

export const metadata: Metadata = {
  title: '7awary Sofa - Modern Chat Community',
  description: 'A sleek, modern chat community with real-time messaging',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <body className={`${tajawal.className} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
