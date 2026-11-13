import './globals.css'
import { getSiteSettings } from '@/lib/supabase/data'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const settings = await getSiteSettings()
  const brandName = settings.brand_name || 'MAISON & OBJECT'
  const navSubtitle = settings.nav_subtitle || 'Editorial Product Discovery'
  const tagline = settings.tagline || 'A curated journal of exceptional design, craft, and material beauty.'

  return {
    title: {
      default: `${brandName} — ${navSubtitle}`,
      template: `%s | ${brandName}`
    },
    description: tagline,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    openGraph: {
      title: brandName,
      description: tagline,
      siteName: brandName,
      locale: 'en_US',
      type: 'website',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (stored === 'dark' || (!stored && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-luxury-bg text-luxury-text antialiased selection:bg-[#E8E2D5]">
        {children}
      </body>
    </html>
  )
}
