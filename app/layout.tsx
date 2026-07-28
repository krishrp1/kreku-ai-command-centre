import type { Metadata, Viewport } from "next";
import { Orbitron, Space_Grotesk, Space_Mono } from "next/font/google";
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

// Space Mono per the "KREKU Command" design system: all telemetry, timestamps,
// and widget IDs render monospace to reinforce the hardware-engraved feel.
const spaceMono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
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
      className={`${spaceGrotesk.variable} ${orbitron.variable} ${spaceMono.variable} h-full antialiased`}
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
