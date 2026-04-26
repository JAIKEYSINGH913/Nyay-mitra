import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InitializingKernel from "@/components/InitializingKernel";
import { TelemetryProvider } from "@/components/TelemetryProvider";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Nyay-Mitra – Legal AI Ecosystem",
  description: "A glass-box deterministic Legal AI platform bridging IPC to BNS with Knowledge Graph-powered intelligence.",
  keywords: ["Legal AI", "Nyay-Mitra", "BNS", "IPC", "GraphRAG", "Neo4j", "Indian Law"],
  openGraph: {
    title: "Nyay-Mitra – Legal AI Ecosystem",
    description: "Knowledge Graph-powered legal intelligence for modern India.",
    type: "website",
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
            <Toaster position="top-right" reverseOrder={false} />
            <InitializingKernel />
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
          </TelemetryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
