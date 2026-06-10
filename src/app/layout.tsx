import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";
import ParticleBackground from "@/components/ParticleBackground";

export const metadata: Metadata = {
  title: "Atul Choubey | Senior MLOps Engineer",
  description:
    "Personal website of Atul Choubey showcasing career journey, family values, lifestyle, and future aspirations.",
  metadataBase: new URL("https://atulchoubey.com"),
  keywords: [
    "Atul Choubey",
    "MLOps Engineer",
    "Machine Learning",
    "DevOps",
    "Bihar",
    "UBS",
    "Bosch",
    "Personal Website",
    "Matrimonial Profile",
  ],
  authors: [{ name: "Atul Choubey" }],
  openGraph: {
    title: "Atul Choubey | Senior MLOps Engineer",
    description:
      "Personal website of Atul Choubey showcasing career journey, family values, lifestyle, and future aspirations.",
    url: "https://atulchoubey.com",
    siteName: "Atul Choubey Personal Website",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Atul Choubey | Senior MLOps Engineer",
    description:
      "Personal website of Atul Choubey showcasing career journey, family values, lifestyle, and future aspirations.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-background text-foreground antialiased selection:bg-accent/30 selection:text-accent min-h-screen flex flex-col">
        {/* Custom cursor follower */}
        <CustomCursor />

        {/* Dynamic canvas backdrop */}
        <ParticleBackground />

        {/* Shared navigation header */}
        <Navbar />

        {/* Main layout contents */}
        <div className="flex-grow flex flex-col relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
