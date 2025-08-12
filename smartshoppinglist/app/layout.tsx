import './globals.css'
import { QueryProvider } from './providers/QueryProvider'
import { GlobalAppProvider } from './contexts/GlobalAppContext'

export const metadata = {
  title: 'רשימת קניות חכמה',
  description: 'אפליקציה חכמה לרשימת קניות המבוססת על הרגלי קנייה',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl">
      <body>
        <QueryProvider>
          <GlobalAppProvider>
            {children}
          </GlobalAppProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
