import type { Metadata } from 'next'
import './globals.css'
import { SiteNav } from './site-nav'

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
        ?.setAttribute("content", theme === "light" ? "#f5ecd9" : "#1a1a18");
    } catch {}
  })();
`;

export const metadata: Metadata = {
  metadataBase: new URL("https://sewhail.com"),
  title: "suhail.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "suhail.",
    url: "/",
    siteName: "suhail.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/social-card-art.jpg",
        width: 1200,
        height: 630,
        alt: "Abstract charcoal orbit and terracotta circle on warm paper",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "suhail.",
    images: ["/social-card-art.jpg"],
  },
  icons: {
    icon: '/icon.svg?v=5',
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
        <meta name="theme-color" content="#1a1a18" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <SiteNav />
        {children}
      </body>
    </html>
  )
}
