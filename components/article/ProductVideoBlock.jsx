'use client'

import { Play, ExternalLink, Film } from 'lucide-react'

function getYouTubeId(url) {
  if (!url) return null
  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes('youtube.com')) {
      if (parsed.pathname.startsWith('/shorts/')) {
        return parsed.pathname.split('/')[2]
      }
      if (parsed.searchParams.has('v')) {
        return parsed.searchParams.get('v')
      }
      if (parsed.pathname.startsWith('/embed/')) {
        return parsed.pathname.split('/')[2]
      }
    } else if (parsed.hostname === 'youtu.be') {
      return parsed.pathname.slice(1).split('?')[0]
    }
  } catch {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([\w-]{11})/)
    return match ? match[1] : null
  }
  return null
}

function isInstagram(url) {
  return /instagram\.com\/(reel|p)\//i.test(url)
}

export default function ProductVideoBlock({ videoUrl }) {
  if (!videoUrl || typeof videoUrl !== 'string' || !videoUrl.trim()) {
    return null
  }

  const cleanUrl = videoUrl.trim()
  const youtubeId = getYouTubeId(cleanUrl)
  const isInsta = isInstagram(cleanUrl)

  return (
    <section className="my-10 pt-8 border-t border-luxury-border/60">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] uppercase tracking-widest font-mono text-luxury-accent font-medium flex items-center gap-2">
          <Film className="w-3.5 h-3.5" />
          <span>Hands-on Evaluation &middot; Video Review</span>
        </span>
        <span className="text-[10px] uppercase tracking-wider font-mono text-luxury-subtle">
          {youtubeId ? 'YouTube' : isInsta ? 'Instagram Reel' : 'Video Field Notes'}
        </span>
      </div>

      {/* Case 1: Embedded YouTube Player */}
      {youtubeId ? (
        <div className="space-y-3">
          <div className="relative aspect-video w-full bg-black border border-luxury-border/80 overflow-hidden shadow-sm">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0`}
              title="Hands-on Review Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
            />
          </div>
          <div className="flex items-center justify-between text-xs font-mono text-luxury-muted pt-1">
            <span className="text-[11px]">In-depth hands-on review and ergonomics inspection</span>
            <a
              href={cleanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-luxury-text hover:text-luxury-accent transition-colors underline underline-offset-4 text-[11px]"
            >
              <span>Watch on YouTube</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      ) : (
        /* Case 2: Instagram Reel or External Video Card */
        <div className="p-6 sm:p-8 bg-[#FAF9F6] border border-luxury-border/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-lg">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-white border border-luxury-border/60 text-[10px] uppercase tracking-widest font-mono text-luxury-accent">
              <Play className="w-3 h-3 fill-luxury-accent text-luxury-accent" />
              <span>{isInsta ? 'Instagram Reel' : 'Hands-on Video'}</span>
            </div>
            <h3 className="font-editorial-serif text-xl sm:text-2xl text-luxury-text font-normal">
              {isInsta ? 'Watch the Hands-on Reel & Impressions' : 'Watch the Video Evaluation'}
            </h3>
            <p className="text-xs text-luxury-muted leading-relaxed">
              {isInsta
                ? 'Visual breakdown covering build quality, tactile feel, and everyday carry impressions on Instagram.'
                : 'Experience the real-world performance, physical materials, and audio-visual evaluation.'}
            </p>
          </div>

          <a
            href={cleanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-luxury-black text-white hover:bg-luxury-accent transition-colors text-xs font-mono uppercase tracking-widest shrink-0 w-full sm:w-auto text-center"
          >
            <span>{isInsta ? 'Watch on Instagram' : 'Watch Video'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}
    </section>
  )
}
