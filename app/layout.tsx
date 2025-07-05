import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { AuthProvider } from "@/contexts/AuthContext"
import { DataProvider } from "@/contexts/DataContext"
import { NotificationProvider } from "@/contexts/NotificationContext"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "DentalCare Pro - Advanced Practice Management",
  description: "Professional dental practice management system with advanced features",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <DataProvider>
            <NotificationProvider>
              {children}
              <Toaster />
            </NotificationProvider>
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
