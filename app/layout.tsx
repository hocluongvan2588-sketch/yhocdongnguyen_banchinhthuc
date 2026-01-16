import type React from "react"
import type { Metadata, Viewport } from "next"
import { Noto_Serif, Noto_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const notoSerif = Noto_Serif({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
})

const notoSans = Noto_Sans({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Y Dịch Đồng Nguyên - Khám phá sức khỏe qua Mai Hoa Dịch Số",
  description:
    "Hệ thống chẩn đoán và điều trị kết hợp Y học Phương Đông, Kinh Dịch và Mai Hoa Dịch Số. Phương pháp trị liệu bao gồm khai huyệt, bài thuốc Nam Dược Thần Hiệu và tượng số bát quái.",
  keywords: [
    "Y Dịch",
    "Kinh Dịch",
    "Mai Hoa Dịch Số",
    "Y học cổ truyền",
    "Bát quái",
    "Châm cứu",
    "Huyệt đạo",
    "Nam Dược",
  ],
  authors: [{ name: "Y Dịch Đồng Nguyên" }],
  generator: "v0.app",
  openGraph: {
    title: "Y Dịch Đồng Nguyên",
    description: "Khám phá sức khỏe qua Mai Hoa Dịch Số và Y học cổ truyền",
    type: "website",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "oklch(0.98 0.005 85)" },
    { media: "(prefers-color-scheme: dark)", color: "oklch(0.18 0.01 85)" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className={`${notoSans.variable} ${notoSerif.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
