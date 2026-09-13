import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
    default: "CodeVault",
    template: "%s | CodeVault",
  },
  description: "A modern coding platform with a polished 3D-inspired interface.",
  metadataBase: new URL("https://example.com"),
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#070b14] text-slate-100 selection:bg-cyan-400/30 selection:text-white">
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.14),transparent_30%),radial-gradient(circle_at_top_right,rgba(167,139,250,0.12),transparent_24%),radial-gradient(circle_at_bottom,rgba(34,197,94,0.08),transparent_28%)]">
          <div className="mx-auto flex min-h-screen max-w-screen-2xl flex-col">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}