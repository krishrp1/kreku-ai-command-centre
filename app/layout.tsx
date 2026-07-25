import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Orbitron, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/providers/app-providers";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-display",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KREKU — AI Command Centre",
  description:
    "A futuristic AI operating system interface: holographic dashboards, live telemetry, 3D core, and an integrated assistant.",
};

export const viewport: Viewport = {
  themeColor: "#05060A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${orbitron.variable} ${jetbrainsMono.variable} h-full antialiased`}
      data-accent="cyan"
      data-motion="full"
      data-contrast="normal"
      suppressHydrationWarning
    >
      <body className="h-full">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
