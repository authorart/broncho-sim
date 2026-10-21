import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Sidebar } from "@/components/layout/Sidebar";
import { ProgressHydrator } from "@/components/layout/ProgressHydrator";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BronchoSim — Interactive Bronchoscopy Training",
    template: "%s · BronchoSim",
  },
  description:
    "Interactive bronchoscopy & interventional pulmonology training: 3D airway atlas, virtual bronchoscopy simulator, equipment guide, procedural trainers and self-assessment.",
};

export const viewport: Viewport = {
  themeColor: "#070b12",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-background font-sans text-foreground">
        <ProgressHydrator />
        <div className="flex min-h-dvh flex-col lg:flex-row">
          <Sidebar />
          <main className="min-w-0 flex-1 px-4 py-6 md:px-8 lg:py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
