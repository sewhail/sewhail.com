import type { Metadata } from 'next'
import './globals.css'

const themeScript = `
  (() => {
    try {
      const saved = localStorage.getItem("theme");
      const theme =
        saved === "light" || saved === "dark"
          ? saved
            : matchMedia("(prefers-color-scheme: light)").matches
              ? "light"
              : "dark";
      document.documentElement.dataset.theme = theme;
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", theme === "light" ? "#f5ecd9" : "#1a1a1a");
    } catch {}
  })();
`;

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#1a1a1a" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
