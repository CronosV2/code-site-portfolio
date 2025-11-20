import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vortex App',
  description: 'Application créée avec Vortex Framework',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, padding: 0, background: '#ffffff' }}>
        {children}
      </body>
    </html>
  )
}
