import AdminNav from '@/components/layout/AdminNav'
import { getSiteSettings } from '@/lib/supabase/data'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return {
    title: 'Admin Console',
    robots: {
      index: false,
      follow: false,
    },
  }
}

export default async function AdminLayout({ children }) {
  const settings = await getSiteSettings()
  const brandName = settings.brand_name || ''

  return (
    <div className="min-h-screen bg-luxury-bg flex flex-col font-editorial-sans text-luxury-text transition-colors duration-150">
      <AdminNav initialBrandName={brandName} />
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {children}
      </div>
    </div>
  )
}
