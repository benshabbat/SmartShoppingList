import './globals.css'
import { QueryProvider } from './providers/QueryProvider'
import { GlobalShoppingProvider } from './contexts/GlobalShoppingContext'

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
          <GlobalShoppingProvider>
            {children}
          </GlobalShoppingProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
