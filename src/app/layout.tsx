import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const instrumentSerif = localFont({
  src: [
    {
      path: "../../public/fonts/InstrumentSerif-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/InstrumentSerif-Italic.ttf",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-instrument-serif",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

export const viewport: Viewport = {
  themeColor: "#070707",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    template: "%s | Josbin Joseph",
    default: "Josbin Joseph — Senior Technical Support Engineer",
  },
  description:
    "Senior Technical Support Engineer specializing in Cloud, Data, Kubernetes, and Data Virtualization. Explore my portfolio, case studies, certifications, and technical blog.",
  keywords: [
    "Josbin Joseph",
    "Senior Technical Support Engineer",
    "Cloud Engineer",
    "Kubernetes",
    "AWS",
    "Azure",
    "Data Virtualization",
    "Portfolio",
  ],
  authors: [{ name: "Josbin Joseph" }],
  creator: "Josbin Joseph",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Josbin Joseph — Portfolio",
    title: "Josbin Joseph — Senior Technical Support Engineer",
    description:
      "Senior Technical Support Engineer specializing in Cloud, Data, Kubernetes, and Data Virtualization.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Josbin Joseph — Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Josbin Joseph — Senior Technical Support Engineer",
    description:
      "Senior Technical Support Engineer specializing in Cloud, Data, Kubernetes, and Data Virtualization.",
    images: ["/images/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-text font-sans">
        {children}
      </body>
    </html>
  );
}
