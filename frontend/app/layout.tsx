import type { Metadata, Viewport } from 'next'
import { Manrope } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const manrope = Manrope({ 
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: {
    default: 'Bucaly - Odontologia Afetiva',
    template: '%s | Bucaly',
  },
  description: 'Produtos odontológicos profissionais selecionados para seu máximo conforto e sucesso clínico.',
  keywords: ['odontologia', 'produtos dentários', 'ortodontia', 'higiene oral', 'bucaly'],
  authors: [{ name: 'Bucaly' }],
  creator: 'Bucaly',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Bucaly',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f4d125',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={manrope.variable}>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        {children}
        <Toaster position="top-right" richColors />
        <Analytics />
      </body>
    </html>
  )
}
