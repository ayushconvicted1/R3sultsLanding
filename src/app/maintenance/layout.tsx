import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Under Construction | Results.com',
  description: "This page is currently under construction. We're building something great.",
  robots: { index: false, follow: false },
}

export default function MaintenanceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ backgroundColor: '#080808', minHeight: '100vh', width: '100%' }}>
      {children}
    </div>
  )
}
