import type { Metadata, Viewport } from "next";
import "./globals.css";

const OG_IMAGE = {
  url: "/og.jpg",
  width: 1200,
  height: 675,
  alt: "An anatomical heart specimen floating above a plinth, beside the Anatomy Atelier wordmark",
};

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : undefined);

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: "Anatomy Lab 3D — Developed by Rohit",
  description:
    "Explore medically detailed 3D organs — heart, brain, lungs, liver, kidneys, eye, intestine, pancreas, and skin — created by Rohit.",
  authors: [{ name: "Rohit" }],
  creator: "Rohit",
  publisher: "Rohit",
  applicationName: "Anatomy Lab 3D by Rohit",
  keywords: ["anatomy", "3D anatomy", "human body", "medical education", "interactive learning", "organs", "Rohit"],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.svg",
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
  },
  openGraph: {
    type: "website",
    siteName: "Anatomy Lab 3D by Rohit",
    title: "Anatomy Lab 3D — Developed by Rohit",
    description: "Learn anatomy through immersive, medically detailed 3D specimens. Developed by Rohit.",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Anatomy Lab 3D — Developed by Rohit",
    description: "Learn anatomy through immersive, medically detailed 3D specimens. Developed by Rohit.",
    images: [OG_IMAGE],
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f0e7",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
