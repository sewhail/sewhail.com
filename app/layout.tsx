import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL("https://sewhail.com"),
  title: "Suhail — Software Engineer",
  description: "Software engineer in Amsterdam building software for hard problems.",
  authors: [{ name: "Suhail" }],
  openGraph: {
    title: "Suhail — Software Engineer",
    description: "Software engineer in Amsterdam building software for hard problems.",
    url: "/",
    siteName: "Suhail",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/social-card.png",
        width: 1200,
        height: 630,
        alt: "Suhail — software engineer in Amsterdam",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Suhail — Software Engineer",
    description: "Software engineer in Amsterdam building software for hard problems.",
    images: ["/social-card.png"],
  },
  icons: {
    icon: '/icon.svg?v=2',
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
      <body>{children}</body>
    </html>
  )
}
