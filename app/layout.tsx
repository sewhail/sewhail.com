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
        url: "/social-card.png",
        width: 1200,
        height: 630,
        alt: "suhail.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "suhail.",
    images: ["/social-card.png"],
  },
  icons: {
    icon: '/icon.svg?v=2',
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
