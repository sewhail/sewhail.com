import type { Metadata } from 'next'
import './globals.css'
import { SiteNav } from './site-nav'

const themeScript = `
  (() => {
    const now = new Date();
    const hour = now.getHours();
    const automaticTheme = hour >= 7 && hour < 19 ? "light" : "dark";
    const overrideKey = "theme-override";
    let theme = automaticTheme;

    try {
      localStorage.removeItem("theme");

      const savedOverride = localStorage.getItem(overrideKey);
      if (savedOverride) {
        try {
          const override = JSON.parse(savedOverride);
          const isValidTheme = override.theme === "light" || override.theme === "dark";
          const isCurrent = Number(override.expiresAt) > now.getTime();

          if (isValidTheme && isCurrent) {
            theme = override.theme;
          } else {
            localStorage.removeItem(overrideKey);
          }
        } catch {
          localStorage.removeItem(overrideKey);
        }
      }
    } catch {}

    document.documentElement.dataset.theme = theme;
    const themeColor = document.createElement("meta");
    themeColor.name = "theme-color";
    themeColor.content = theme === "light" ? "#f5ecd9" : "#1a1a18";
    document.head.appendChild(themeColor);
  })();
`;

const siteDescription = "Suhail. Software and books.";

export const metadata: Metadata = {
  metadataBase: new URL("https://sewhail.com"),
  title: "suhail.",
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "suhail.",
    description: siteDescription,
    url: "/",
    siteName: "suhail.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/social-card-art.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "suhail.",
    description: siteDescription,
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
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <SiteNav />
        {children}
      </body>
    </html>
  )
}
