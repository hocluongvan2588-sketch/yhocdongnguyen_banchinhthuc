import React from "react"
import type { Metadata, Viewport } from 'next'

import { Analytics } from '@vercel/analytics/next'
import './globals.css'

// Viewport configuration - cố định màn hình mobile, không cho phóng to/thu nhỏ
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  viewportFit: 'cover', // Hỗ trợ iPhone có notch
}

import { Geist_Mono, Manrope as V0_Font_Manrope, Geist_Mono as V0_Font_Geist_Mono, Cormorant as V0_Font_Cormorant } from 'next/font/google'

// Initialize fonts
const _manrope = V0_Font_Manrope({ subsets: ['latin'], weight: ["200","300","400","500","600","700","800"] })
const _geistMono = V0_Font_Geist_Mono({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })
const _cormorant = V0_Font_Cormorant({ subsets: ['latin'], weight: ["300","400","500","600","700"] })

export const metadata: Metadata = {
  title: 'ydichdongnguyen - Nền tảng Tham vấn Sức kh���e Dịch học Đông y',
  description: 'Chào mừng bạn đến với ydichdongnguyen - Hệ thống tham vấn sức khỏe dựa trên Dịch học cổ truyền, kết hợp tri thức Bát Quái và Ngũ Hành để chẩn đoán và tư vấn sức khỏe toàn diện',
  keywords: 'ydichdongnguyen, y dịch đồng nguyên, dịch học, đông y, bát quái, ngũ hành, y học cổ truyền, tham vấn sức khỏe',
  generator: 'v0.app',
  icons: {
    icon: '/logo.jpg',
    apple: '/logo.jpg',
  },
  openGraph: {
    title: 'Y Dịch Đồng Nguyên - Nền tảng Tham vấn Sức khỏe',
    description: 'Hệ thống tham vấn sức khỏe dựa trên Dịch học cổ truyền, kết hợp tri thức Bát Quái và Ngũ Hành',
    images: ['/logo.jpg'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
