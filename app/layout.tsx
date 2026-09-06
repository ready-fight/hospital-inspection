import type { Metadata, Viewport } from 'next'
import './globals.css'
import PwaRegister from '@/components/PwaRegister'

export const metadata: Metadata = {
  title: '設備定期点検',
  description: '病院設備の定期保守点検報告システム',
  applicationName: '設備定期点検',
  appleWebApp: { capable: true, title: '設備点検', statusBarStyle: 'default' }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#183153'
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>
        <PwaRegister />
        {children}
      </body>
    </html>
  )
}
