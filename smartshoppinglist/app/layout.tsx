import './globals.css'
import { QueryProvider } from './providers/QueryProvider'
import { GlobalShoppingProvider } from './contexts/GlobalShoppingContext'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { OfflineNotification } from './components/notifications/OfflineNotification'
import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'רשימת קניות חכמה | Smart Shopping List',
  description: 'אפליקציה חכמה לרשימת קניות המבוססת על הרגלי קנייה, עם מעקב תאריכי תפוגה ושליטה חכמה במלאי',
  keywords: 'רשימת קניות, קניות חכמות, מלאי, תאריכי תפוגה, ניהול קניות',
  authors: [{ name: 'Smart Shopping List Team' }],
  creator: 'Smart Shopping List Team',
  publisher: 'Smart Shopping List',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'he_IL',
    title: 'רשימת קניות חכמה',
    description: 'אפליקציה חכמה לרשימת קניות המבוססת על הרגלי קנייה',
    siteName: 'Smart Shopping List',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'רשימת קניות חכמה',
    description: 'אפליקציה חכמה לרשימת קניות המבוססת על הרגלי קנייה',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'רשימת קניות חכמה',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#3b82f6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl">
      <body>
        <ErrorBoundary>
          <QueryProvider>
            <GlobalShoppingProvider>
              <OfflineNotification />
              {children}
            </GlobalShoppingProvider>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
