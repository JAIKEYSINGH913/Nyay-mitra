import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { TelemetryProvider } from "@/components/TelemetryProvider";
import { NeuralProvider } from "@/components/NeuralProvider";
import { Toaster } from "react-hot-toast";
import LoadingScreen from "@/components/LoadingScreen";
import CookieConsent from "@/components/CookieConsent";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://nyay-mitra.tech"),
  title: {
    default: "Nyay-Mitra | Sovereign Judicial Engine",
    template: "%s | Nyay-Mitra"
  },
  description: "A glass-box deterministic Legal AI platform bridging legacy IPC to BNS with real-time Knowledge Graph-powered intelligence. Experience multilingual voice-to-legal capabilities.",
  keywords: ["Legal AI", "Nyay-Mitra", "BNS", "IPC", "GraphRAG", "Neo4j", "Indian Law", "Legal Engine", "Sovereign AI"],
  authors: [{ name: "Nyay-Mitra Team" }],
  creator: "Sovereign Judicial Engine",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Nyay-Mitra | Sovereign Judicial Engine",
    description: "Knowledge Graph-powered legal intelligence for modern India. Bridge the gap between languages and the law.",
    url: "/",
    siteName: "Nyay-Mitra",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Nyay-Mitra Judicial Engine",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nyay-Mitra | Sovereign Judicial Engine",
    description: "Knowledge Graph-powered legal intelligence for modern India.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@8..144,100..1000&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      </head>
      <body style={{ fontFamily: "'Google Sans Flex', 'Roboto', sans-serif" }} suppressHydrationWarning>
        <ThemeProvider>
          <TelemetryProvider>
            <NeuralProvider>
              <Toaster position="top-right" reverseOrder={false} />
              <LoadingScreen />
              <CookieConsent />
              <Navbar />
              <main className="min-h-screen">
                {children}
              </main>
              <Footer />
            </NeuralProvider>
          </TelemetryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
