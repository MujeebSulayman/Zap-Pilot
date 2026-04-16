import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import { Navigation } from "@/components/Navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Zap Pilot | Your Auto-Yield Savings",
  description: "Deposit fiat straight from your local bank account and allocate into yield markets. No crypto knowledge required.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Providers>
          <Navigation />
          <main className="flex-1 flex flex-col pt-16">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
