import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "sewhail.com",
  authors: [{ name: "Suhail" }],
  openGraph: {
    title: "sewhail.com",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "sewhail.com",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&family=Fira+Code:wght@300;400;500&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
