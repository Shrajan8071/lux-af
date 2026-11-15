import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getSiteSettings } from '@/lib/supabase/data'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Elevate Your Instagram into a Luxury Editorial House | Creator Platform Pitch',
  description: 'A bespoke, magazine-grade companion website that transforms fleeting 24-hour social stories into an enduring, high-commission editorial catalogue — powered by Gemini AI and automated drip publishing.',
}

export default async function PitchPage() {
  const settings = await getSiteSettings()

  return (
    <>
      <Header settings={settings} />

      <main className="min-h-screen bg-[#FBF9F5] dark:bg-[#12110F] text-[#181715] dark:text-[#EDE8E2] transition-colors duration-200">
        
        {/* Floating Quick Download Pill */}
        <div className="sticky top-20 z-40 max-w-5xl mx-auto px-4 sm:px-6 pointer-events-none flex justify-end">
          <a
            href="/Luxury_Creator_Platform_Pitch.pdf"
            download="Luxury_Creator_Platform_Pitch.pdf"
            className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2 bg-[#B88E5E] hover:bg-[#A37B4D] text-white text-xs font-semibold tracking-wider uppercase rounded-full shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download Presentation PDF</span>
          </a>
        </div>

        {/* ══════════════ SECTION 1: HAUTE LUXURY COVER ══════════════ */}
        <section className="relative overflow-hidden bg-[#12110F] text-white py-20 sm:py-28 px-4 sm:px-6 border-b border-white/10">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse,rgba(197,160,112,0.2)_0%,transparent_70%)] pointer-events-none" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            
            <div className="w-14 h-14 border border-[#C5A070]/40 rounded-sm flex items-center justify-center mx-auto mb-6">
              <span className="font-editorial-serif text-2xl italic text-[#C5A070]">E</span>
            </div>

            <span className="inline-block px-4 py-1.5 border border-[#C5A070]/30 rounded-full text-[10px] font-bold tracking-[3px] uppercase text-[#C5A070] bg-[#C5A070]/10 mb-6">
              Exclusive Creator Platform · 2026
            </span>

            <h1 className="font-editorial-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6 text-white">
              Your Instagram, <br />
              <span className="italic text-[#C5A070]">Elevated into an Editorial House.</span>
            </h1>

            <p className="text-sm sm:text-base text-white/70 max-w-2xl mx-auto font-light leading-relaxed mb-10">
              A bespoke, magazine-grade companion website that transforms fleeting 24-hour social stories into an enduring, high-commission editorial catalogue — powered by Gemini AI, automated drip publishing, and your personal voice.
            </p>

            {/* Direct Demonstration Hero Box */}
            <div className="bg-[#1C1A17]/80 border border-[#C5A070]/30 rounded-lg p-6 sm:p-8 max-w-2xl mx-auto mb-12 backdrop-blur-sm shadow-2xl text-left">
              <span className="text-[10px] font-bold tracking-widest text-[#C5A070] uppercase block mb-1">
                Live Reference Architecture
              </span>
              <h3 className="font-editorial-serif text-xl sm:text-2xl font-bold text-white mb-2">
                Experience the Live Demonstration
              </h3>
              <p className="text-xs sm:text-sm text-white/60 mb-6">
                Explore the live working platform on your phone or desktop right now to see the exact reading experience your followers will enjoy:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#C5A070] block mb-1">Live Platform</span>
                  <a href="https://shrajan-tech.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-xs text-white hover:text-[#C5A070] underline font-medium break-all">
                    shrajan-tech.vercel.app →
                  </a>
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#C5A070] block mb-1">Instagram</span>
                  <a href="https://www.instagram.com/gadget.cache/" target="_blank" rel="noopener noreferrer" className="text-xs text-white hover:text-[#C5A070] underline font-medium">
                    @gadget.cache →
                  </a>
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#C5A070] block mb-1">Inquiries</span>
                  <a href="mailto:shrajanguptahome@gmail.com" className="text-xs text-white hover:text-[#C5A070] underline font-medium break-all">
                    shrajanguptahome@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Credential Counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-y border-white/10 max-w-3xl mx-auto">
              <div className="text-center p-2">
                <div className="font-editorial-serif text-3xl sm:text-4xl font-bold text-white mb-1">30<span className="text-[#C5A070]">s</span></div>
                <div className="text-[10px] uppercase tracking-wider text-white/50">AI Review Generator</div>
              </div>
              <div className="text-center p-2">
                <div className="font-editorial-serif text-3xl sm:text-4xl font-bold text-[#C5A070] mb-1">∞</div>
                <div className="text-[10px] uppercase tracking-wider text-white/50">Evergreen Commission</div>
              </div>
              <div className="text-center p-2">
                <div className="font-editorial-serif text-3xl sm:text-4xl font-bold text-white mb-1">1<span className="text-[#C5A070]">-Click</span></div>
                <div className="text-[10px] uppercase tracking-wider text-white/50">Dark & Light Modes</div>
              </div>
              <div className="text-center p-2">
                <div className="font-editorial-serif text-3xl sm:text-4xl font-bold text-white mb-1">72<span className="text-[#C5A070]">h</span></div>
                <div className="text-[10px] uppercase tracking-wider text-white/50">Live Concierge Setup</div>
              </div>
            </div>

          </div>
        </section>


        {/* ══════════════ SECTION 2: PROBLEM VS SOLUTION ══════════════ */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-5xl mx-auto">
          <div className="mb-12">
            <span className="text-[10px] font-bold tracking-[3px] text-[#B88E5E] uppercase block mb-2">— The Creator Dilemma</span>
            <h2 className="font-editorial-serif text-2xl sm:text-4xl font-bold tracking-tight mb-4">
              Social Algorithms Expire. <br />
              <span className="italic text-[#B88E5E]">Your Editorial Catalogue Never Does.</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#66605B] dark:text-[#968F89] max-w-2xl leading-relaxed">
              Every week, creators lose thousands in affiliate commissions simply because Instagram stories disappear after 24 hours, bio link aggregators look cluttered, and followers are forced to spam comments asking for links.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* The Problem */}
            <div className="bg-[#FFF7F5] dark:bg-[#1F1716] border border-[#F1D4CD] dark:border-[#3D2522] border-t-4 border-t-[#D9534F] rounded-lg p-6 sm:p-8">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#D9534F] block mb-4">
                The Social Media Bottleneck
              </span>
              <ul className="space-y-3 text-xs sm:text-sm text-[#66605B] dark:text-white/70">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#D9534F] font-bold">✕</span>
                  <span>Story affiliate links die after 24 hours, vanishing into the archive.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#D9534F] font-bold">✕</span>
                  <span>Followers comment "Link please?" on Reels months later with no automated way to buy.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#D9534F] font-bold">✕</span>
                  <span>Linktree & generic bio tools look like spammy multi-link directories.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#D9534F] font-bold">✕</span>
                  <span>Luxury brands offer lower sponsorship rates when your only presence is a social profile.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#D9534F] font-bold">✕</span>
                  <span>Zero Google search visibility or organic discovery for your product recommendations.</span>
                </li>
              </ul>
            </div>

            {/* The Solution */}
            <div className="bg-[#1C1A17] text-white border border-white/10 border-t-4 border-t-[#C5A070] rounded-lg p-6 sm:p-8">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A070] block mb-4">
                The Custom Editorial Advantage
              </span>
              <ul className="space-y-3 text-xs sm:text-sm text-white/80">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#C5A070] font-bold">✓</span>
                  <span>Every recommended piece gets a stable 4-digit article number (e.g., #1006).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#C5A070] font-bold">✓</span>
                  <span>Tell your audience: "Link is Article #1006 in bio" — permanent and friction-free.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#C5A070] font-bold">✓</span>
                  <span>Bespoke aesthetic modeled after <em>Vogue</em>, <em>GQ</em>, and <em>Architectural Digest</em>.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#C5A070] font-bold">✓</span>
                  <span>Positions you as a respected curator, justifying 30% to 50% higher brand sponsorship fees.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#C5A070] font-bold">✓</span>
                  <span>Built-in Google SEO indexation turns everyday reviews into permanent passive search traffic.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#B88E5E] to-[#8E683E] text-white p-6 sm:p-8 rounded-lg shadow-lg flex items-center gap-6">
            <span className="font-editorial-serif text-5xl sm:text-6xl text-white/30 hidden sm:block leading-none">“</span>
            <div>
              <p className="font-editorial-serif text-lg sm:text-xl italic leading-snug mb-2">
                "Your Instagram Story expires in 24 hours. Your custom editorial catalogue earns affiliate commissions for years."
              </p>
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">
                — The Foundational Shift from Influencer to Media Brand
              </span>
            </div>
          </div>
        </section>


        {/* ══════════════ SECTION 3: DUAL THEME SHOWCASE ══════════════ */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 bg-[#F4F1EC] dark:bg-[#161513] border-y border-[#E5DFD7] dark:border-white/10">
          <div className="max-w-5xl mx-auto">
            <div className="mb-12">
              <span className="text-[10px] font-bold tracking-[3px] text-[#B88E5E] uppercase block mb-2">— Aesthetic Fluidity</span>
              <h2 className="font-editorial-serif text-2xl sm:text-4xl font-bold tracking-tight mb-4">
                Effortless Dual Aesthetics: <br />
                <span className="italic text-[#B88E5E]">Ivory Day & Velvet Night.</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#66605B] dark:text-[#968F89] max-w-2xl leading-relaxed">
                Your audience accesses your content in coffee shops and in bed at midnight. With one instant toggle, your website adapts between a warm Italian paper light mode and a deep velvet charcoal dark mode.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Light Mode Mockup */}
              <div>
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-[#968F89] mb-2">
                  <span>Editorial Warm Ivory</span>
                  <span className="px-2 py-0.5 bg-[#EFEBE5] text-[#181715] rounded">Light Theme</span>
                </div>
                <div className="bg-white rounded-lg border border-[#E5DFD7] overflow-hidden shadow-lg">
                  <div className="bg-[#F0ECE6] px-3 py-2 border-b border-[#E5DFD7] flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                    <span className="ml-2 px-2 py-0.5 bg-white text-[10px] font-mono text-[#66605B] rounded flex-1 truncate">
                      shrajan-tech.vercel.app [Light Theme]
                    </span>
                  </div>
                  <div className="h-72 sm:h-96 overflow-hidden bg-[#FAF8F5]">
                    <img src="/screenshots/home-light.png" alt="Catalogue Light Mode" className="w-full object-cover object-top" />
                  </div>
                </div>
              </div>

              {/* Dark Mode Mockup */}
              <div>
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-[#968F89] mb-2">
                  <span>Architectural Charcoal</span>
                  <span className="px-2 py-0.5 bg-[#2A2621] text-[#C5A070] rounded">Dark Theme</span>
                </div>
                <div className="bg-[#1C1A17] rounded-lg border border-white/10 overflow-hidden shadow-xl">
                  <div className="bg-[#23201D] px-3 py-2 border-b border-white/10 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                    <span className="ml-2 px-2 py-0.5 bg-[#181614] text-[10px] font-mono text-white/50 rounded flex-1 truncate">
                      shrajan-tech.vercel.app [Dark Theme]
                    </span>
                  </div>
                  <div className="h-72 sm:h-96 overflow-hidden bg-[#12110F]">
                    <img src="/screenshots/home-dark.png" alt="Catalogue Dark Mode" className="w-full object-cover object-top" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white dark:bg-[#1C1A17] p-5 rounded-lg border border-[#E5DFD7] dark:border-white/10">
              <div>
                <h4 className="font-editorial-serif text-sm font-bold mb-1">Persistent State</h4>
                <p className="text-xs text-[#66605B] dark:text-[#968F89]">Remembers reader theme choice across visits with zero screen flickering.</p>
              </div>
              <div>
                <h4 className="font-editorial-serif text-sm font-bold mb-1">Uncompromised Contrast</h4>
                <p className="text-xs text-[#66605B] dark:text-[#968F89]">WCAG AA accessible ratios ensure readability under bright sun or bedside reading.</p>
              </div>
              <div>
                <h4 className="font-editorial-serif text-sm font-bold mb-1">Uncropped Imagery</h4>
                <p className="text-xs text-[#66605B] dark:text-[#968F89]">Clean containment prevents product photography from ever being cropped.</p>
              </div>
            </div>
          </div>
        </section>


        {/* ══════════════ SECTION 4: GEMINI AI ENGINE ══════════════ */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-5xl mx-auto">
          <div className="mb-12">
            <span className="text-[10px] font-bold tracking-[3px] text-[#B88E5E] uppercase block mb-2">— Zero-Effort Publishing</span>
            <h2 className="font-editorial-serif text-2xl sm:text-4xl font-bold tracking-tight mb-4">
              The Gemini AI Engine: <br />
              <span className="italic text-[#B88E5E]">Raw Notes to Published Review in 30 Seconds.</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#66605B] dark:text-[#968F89] max-w-2xl leading-relaxed">
              You are a content creator, not a full-time copywriter. The platform's integrated Gemini API analyzes raw product specs or notes and writes a complete 3-paragraph luxury review plus your personal "My Take" appraisal.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-8">
            <div className="space-y-4">
              <div className="bg-white dark:bg-[#1C1A17] border border-[#E5DFD7] dark:border-white/10 border-l-4 border-l-[#C5A070] rounded-lg p-4">
                <span className="font-editorial-serif text-lg font-bold text-[#C5A070] block leading-none mb-1">01</span>
                <h4 className="text-xs font-bold uppercase tracking-wider mb-1">Paste Raw Specs & Affiliate URL</h4>
                <p className="text-xs text-[#66605B] dark:text-[#968F89]">Drop in raw manufacturer specs or voice notes from your shoot. Enter purchase price and star rating.</p>
              </div>

              <div className="bg-white dark:bg-[#1C1A17] border border-[#E5DFD7] dark:border-white/10 border-l-4 border-l-[#C5A070] rounded-lg p-4">
                <span className="font-editorial-serif text-lg font-bold text-[#C5A070] block leading-none mb-1">02</span>
                <h4 className="text-xs font-bold uppercase tracking-wider mb-1">Gemini AI Editorial Synthesis</h4>
                <p className="text-xs text-[#66605B] dark:text-[#968F89]">Our tuned editorial prompt crafts an authoritative 3-paragraph material analysis focused on industrial craft.</p>
              </div>

              <div className="bg-white dark:bg-[#1C1A17] border border-[#E5DFD7] dark:border-white/10 border-l-4 border-l-[#C5A070] rounded-lg p-4">
                <span className="font-editorial-serif text-lg font-bold text-[#C5A070] block leading-none mb-1">03</span>
                <h4 className="text-xs font-bold uppercase tracking-wider mb-1">Automatic "My Take" Appraisal</h4>
                <p className="text-xs text-[#66605B] dark:text-[#968F89]">Generates a signature first-person opinion segment summarizing who the item is best for, in your authentic voice.</p>
              </div>

              <div className="bg-white dark:bg-[#1C1A17] border border-[#E5DFD7] dark:border-white/10 border-l-4 border-l-[#C5A070] rounded-lg p-4">
                <span className="font-editorial-serif text-lg font-bold text-[#C5A070] block leading-none mb-1">04</span>
                <h4 className="text-xs font-bold uppercase tracking-wider mb-1">Instant Live Publishing</h4>
                <p className="text-xs text-[#66605B] dark:text-[#968F89]">Preview live, attach your Instagram Reel video, and hit "Publish." Done in under half a minute.</p>
              </div>
            </div>

            {/* Live Output Screenshot */}
            <div>
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-[#968F89] mb-2">
                <span>Live Article Output</span>
                <span className="px-2 py-0.5 bg-[#EFEBE5] text-[#181715] rounded">Finished Essay</span>
              </div>
              <div className="bg-white rounded-lg border border-[#E5DFD7] overflow-hidden shadow-lg">
                <div className="bg-[#F0ECE6] px-3 py-2 border-b border-[#E5DFD7] flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                  <span className="ml-2 px-2 py-0.5 bg-white text-[10px] font-mono text-[#66605B] rounded flex-1 truncate">
                    shrajan-tech.vercel.app/blogs/...
                  </span>
                </div>
                <div className="h-80 sm:h-96 overflow-hidden bg-[#FAF8F5]">
                  <img src="/screenshots/journal-inside-top.png" alt="Finished Article View" className="w-full object-cover object-top" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#1C1A17] text-white p-6 rounded-lg border border-white/10">
            <h4 className="font-editorial-serif text-base font-bold text-[#C5A070] mb-2">Ethical & Honest by Architecture</h4>
            <p className="text-xs text-white/70 leading-relaxed">
              Unlike generic AI chatbots that hallucinate fake claims, our engine is architected with strict boundary instructions: it never invents unverified specifications, false test results, or artificial endorsements. Every piece of copy remains 100% reviewable and editable before your audience sees it.
            </p>
          </div>
        </section>


        {/* ══════════════ SECTION 5: AUTO-QUEUE DRIP SYSTEM ══════════════ */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 bg-[#F7F4EE] dark:bg-[#161513] border-y border-[#E5DFD7] dark:border-white/10">
          <div className="max-w-5xl mx-auto">
            <div className="mb-12">
              <span className="text-[10px] font-bold tracking-[3px] text-[#B88E5E] uppercase block mb-2">— Autonomous Consistency</span>
              <h2 className="font-editorial-serif text-2xl sm:text-4xl font-bold tracking-tight mb-4">
                The Auto-Queue Drip System: <br />
                <span className="italic text-[#B88E5E]">Consistent Publishing While You Sleep.</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#66605B] dark:text-[#968F89] max-w-2xl leading-relaxed">
                Consistency is the secret to SEO ranking and follower retention. With the Auto-Queue engine, you can draft 10 articles in one afternoon and let the platform drip-release them on your scheduled cadence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Auto Queue Admin */}
              <div>
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-[#968F89] mb-2">
                  <span>Admin Auto-Queue Dashboard</span>
                  <span className="px-2 py-0.5 bg-[#2A2621] text-[#C5A070] rounded">Backend Scheduler</span>
                </div>
                <div className="bg-[#1C1A17] rounded-lg border border-white/10 overflow-hidden shadow-xl">
                  <div className="bg-[#23201D] px-3 py-2 border-b border-white/10 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                    <span className="ml-2 px-2 py-0.5 bg-[#181614] text-[10px] font-mono text-white/50 rounded flex-1 truncate">
                      shrajan-tech.vercel.app/admin/blogs/queue
                    </span>
                  </div>
                  <div className="h-72 sm:h-80 overflow-hidden bg-[#181614]">
                    <img src="/screenshots/admin-auto-queue.png" alt="Auto-Queue Dashboard" className="w-full object-cover object-top" />
                  </div>
                </div>
              </div>

              {/* Public Journal */}
              <div>
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-[#968F89] mb-2">
                  <span>Public Editorial Journal</span>
                  <span className="px-2 py-0.5 bg-[#EFEBE5] text-[#181715] rounded">Live Reader Index</span>
                </div>
                <div className="bg-white rounded-lg border border-[#E5DFD7] overflow-hidden shadow-lg">
                  <div className="bg-[#F0ECE6] px-3 py-2 border-b border-[#E5DFD7] flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                    <span className="ml-2 px-2 py-0.5 bg-white text-[10px] font-mono text-[#66605B] rounded flex-1 truncate">
                      shrajan-tech.vercel.app/blogs
                    </span>
                  </div>
                  <div className="h-72 sm:h-80 overflow-hidden bg-[#FAF8F5]">
                    <img src="/screenshots/journal-home.png" alt="Public Journal" className="w-full object-cover object-top" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white dark:bg-[#1C1A17] p-5 rounded-lg border border-[#E5DFD7] dark:border-white/10">
              <div className="flex items-start gap-3">
                <span className="text-[#C5A070] font-bold">✦</span>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider mb-1">Automated Cron Scheduling</h4>
                  <p className="text-xs text-[#66605B] dark:text-[#968F89]">Vercel cron jobs promote queued drafts to published articles automatically on your cadence.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[#C5A070] font-bold">✦</span>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider mb-1">Visual Reordering</h4>
                  <p className="text-xs text-[#66605B] dark:text-[#968F89]">Reprioritize upcoming drops in seconds with numbered queue badges and quick reordering controls.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[#C5A070] font-bold">✦</span>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider mb-1">Source-Dump Transformer</h4>
                  <p className="text-xs text-[#66605B] dark:text-[#968F89]">Dump unedited notes, audio transcripts, or links — the engine formats them into structured essays.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[#C5A070] font-bold">✦</span>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider mb-1">Evergreen SEO Compounding</h4>
                  <p className="text-xs text-[#66605B] dark:text-[#968F89]">Each newly published entry targets niche search queries, bringing high-intent organic visitors daily.</p>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ══════════════ SECTION 6: NO-CODE ADMIN CUSTOMIZER ══════════════ */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-5xl mx-auto">
          <div className="mb-12">
            <span className="text-[10px] font-bold tracking-[3px] text-[#B88E5E] uppercase block mb-2">— Zero Code Required</span>
            <h2 className="font-editorial-serif text-2xl sm:text-4xl font-bold tracking-tight mb-4">
              Total Creative Autonomy: <br />
              <span className="italic text-[#B88E5E]">Customize Every Pixel From Your Phone.</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#66605B] dark:text-[#968F89] max-w-2xl leading-relaxed">
              You are never locked into a fixed template. The live Admin Settings console empowers you to rebrand your entire website, change copy, adjust currencies, and manage links instantly with no developer needed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Admin Settings Screenshot */}
            <div>
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-[#968F89] mb-2">
                <span>Live Site Settings Editor</span>
                <span className="px-2 py-0.5 bg-[#2A2621] text-[#C5A070] rounded">Admin Panel</span>
              </div>
              <div className="bg-[#1C1A17] rounded-lg border border-white/10 overflow-hidden shadow-xl">
                <div className="bg-[#23201D] px-3 py-2 border-b border-white/10 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                  <span className="ml-2 px-2 py-0.5 bg-[#181614] text-[10px] font-mono text-white/50 rounded flex-1 truncate">
                    shrajan-tech.vercel.app/admin/settings
                  </span>
                </div>
                <div className="h-72 sm:h-80 overflow-hidden bg-[#181614]">
                  <img src="/screenshots/admin-settings.png" alt="Admin Settings Editor" className="w-full object-cover object-top" />
                </div>
              </div>
            </div>

            {/* Admin Products Screenshot */}
            <div>
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-[#968F89] mb-2">
                <span>Inventory & Affiliate Manager</span>
                <span className="px-2 py-0.5 bg-[#2A2621] text-[#C5A070] rounded">Product CRUD</span>
              </div>
              <div className="bg-[#1C1A17] rounded-lg border border-white/10 overflow-hidden shadow-xl">
                <div className="bg-[#23201D] px-3 py-2 border-b border-white/10 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                  <span className="ml-2 px-2 py-0.5 bg-[#181614] text-[10px] font-mono text-white/50 rounded flex-1 truncate">
                    shrajan-tech.vercel.app/admin/products
                  </span>
                </div>
                <div className="h-72 sm:h-80 overflow-hidden bg-[#181614]">
                  <img src="/screenshots/admin-products.png" alt="Admin Products Management" className="w-full object-cover object-top" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#1C1A17] text-white p-6 rounded-lg border border-white/10">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#C5A070] mb-1">Brand Name & Masthead</h4>
              <p className="text-xs text-white/60">Change your publication name, navigation tagline, and homepage headings in real-time.</p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#C5A070] mb-1">About Page & Philosophy</h4>
              <p className="text-xs text-white/60">Edit your personal backstory, curatorial principles, and brand commitments directly in Markdown.</p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#C5A070] mb-1">Global Currency Selector</h4>
              <p className="text-xs text-white/60">Switch between ₹ INR, $ USD, € EUR, or £ GBP instantly to serve your domestic or international audience.</p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#C5A070] mb-1">Multi-Network Affiliates</h4>
              <p className="text-xs text-white/60">Supports Amazon, LTK, Flipkart, ShareASale, CJ, or direct merchant partnership links seamlessly.</p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#C5A070] mb-1">Social & Contact Sync</h4>
              <p className="text-xs text-white/60">Sync your active Instagram handle, YouTube channel, and business email with automatic header rendering.</p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#C5A070] mb-1">Google AdSense Switch</h4>
              <p className="text-xs text-white/60">Toggle passive display ads on or off at the footer of your catalogue with zero layout shift.</p>
            </div>
          </div>
        </section>


        {/* ══════════════ SECTION 7: NICHES & CONCIERGE ══════════════ */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 bg-[#F4F1EC] dark:bg-[#161513] border-y border-[#E5DFD7] dark:border-white/10">
          <div className="max-w-5xl mx-auto">
            <div className="mb-12">
              <span className="text-[10px] font-bold tracking-[3px] text-[#B88E5E] uppercase block mb-2">— Limitless Adaptation</span>
              <h2 className="font-editorial-serif text-2xl sm:text-4xl font-bold tracking-tight mb-4">
                Built For Every Creator Niche. <br />
                <span className="italic text-[#B88E5E]">And We Help You Customize More.</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#66605B] dark:text-[#968F89] max-w-2xl leading-relaxed">
                Whether your domain is tech hardware, luxury skincare, quiet luxury fashion, or architectural interiors, the platform morphs to reflect your specific world.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-white dark:bg-[#1C1A17] p-4 rounded-lg border border-[#E5DFD7] dark:border-white/10 text-center">
                <span className="text-2xl mb-2 block">💻</span>
                <h4 className="font-editorial-serif text-sm font-bold mb-1">Tech & Gadgets</h4>
                <p className="text-[11px] text-[#66605B] dark:text-[#968F89]">Desk setups, cameras, audio, mobile hardware with deep spec analysis.</p>
              </div>
              <div className="bg-white dark:bg-[#1C1A17] p-4 rounded-lg border border-[#E5DFD7] dark:border-white/10 text-center">
                <span className="text-2xl mb-2 block">💄</span>
                <h4 className="font-editorial-serif text-sm font-bold mb-1">Beauty & Skincare</h4>
                <p className="text-[11px] text-[#66605B] dark:text-[#968F89]">Fragrance accords, routine breakdowns, vanity staples, texture details.</p>
              </div>
              <div className="bg-white dark:bg-[#1C1A17] p-4 rounded-lg border border-[#E5DFD7] dark:border-white/10 text-center">
                <span className="text-2xl mb-2 block">👗</span>
                <h4 className="font-editorial-serif text-sm font-bold mb-1">Fashion & Style</h4>
                <p className="text-[11px] text-[#66605B] dark:text-[#968F89]">Capsule wardrobes, lookbooks, artisanal leathercraft, jewelry curation.</p>
              </div>
              <div className="bg-white dark:bg-[#1C1A17] p-4 rounded-lg border border-[#E5DFD7] dark:border-white/10 text-center">
                <span className="text-2xl mb-2 block">🏠</span>
                <h4 className="font-editorial-serif text-sm font-bold mb-1">Home & Interiors</h4>
                <p className="text-[11px] text-[#66605B] dark:text-[#968F89]">Lighting, ceramics, tactile materials, furniture, intentional living.</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#1C1A17] to-[#2A241F] text-white p-6 sm:p-8 rounded-lg border border-[#C5A070]/30 shadow-xl">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A070] block mb-2">Concierge Engineering Support</span>
              <h3 className="font-editorial-serif text-xl sm:text-2xl font-bold mb-3">
                Need Something Bespoke? We Build It For You.
              </h3>
              <p className="text-xs sm:text-sm text-white/70 max-w-2xl leading-relaxed mb-6">
                Every creator has a distinct identity. If you need bespoke features, customized color palettes, or unique layouts beyond the core platform, our engineering team implements them for you directly.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-white/80">
                <div className="flex items-center gap-2"><span className="text-[#C5A070] font-bold">✓</span> Custom font pairing & branded color palettes</div>
                <div className="flex items-center gap-2"><span className="text-[#C5A070] font-bold">✓</span> Custom domain connection (yourname.com)</div>
                <div className="flex items-center gap-2"><span className="text-[#C5A070] font-bold">✓</span> Newsletter capture & email list integration</div>
                <div className="flex items-center gap-2"><span className="text-[#C5A070] font-bold">✓</span> VIP one-on-one onboarding & product migration</div>
                <div className="flex items-center gap-2"><span className="text-[#C5A070] font-bold">✓</span> Custom category taxonomy & filters</div>
                <div className="flex items-center gap-2"><span className="text-[#C5A070] font-bold">✓</span> Dedicated high-speed Vercel CDN deployment</div>
              </div>
            </div>
          </div>
        </section>


        {/* ══════════════ SECTION 8: ONBOARDING & CONTACT ══════════════ */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-5xl mx-auto">
          <div className="mb-12">
            <span className="text-[10px] font-bold tracking-[3px] text-[#B88E5E] uppercase block mb-2">— Seamless Launch</span>
            <h2 className="font-editorial-serif text-2xl sm:text-4xl font-bold tracking-tight mb-4">
              From Concept to Live Website <br />
              <span className="italic text-[#B88E5E]">In Under 72 Hours.</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#66605B] dark:text-[#968F89] max-w-2xl leading-relaxed">
              You don't need to understand databases, Vercel deployments, or DNS records. We handle 100% of the technical setup and deliver a turnkey publication ready for your Instagram bio.
            </p>
          </div>

          <div className="space-y-4 mb-12 max-w-3xl">
            <div className="flex items-start gap-4">
              <span className="px-2.5 py-1 bg-[#F4ECE1] text-[#B88E5E] text-[10px] font-bold uppercase tracking-wider rounded">Day 1</span>
              <div>
                <h4 className="font-editorial-serif text-base font-bold mb-1">Vision & Asset Handover</h4>
                <p className="text-xs text-[#66605B] dark:text-[#968F89]">Share your Instagram handle, brand color preferences, and 5–10 favorite products you want featured.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="px-2.5 py-1 bg-[#F4ECE1] text-[#B88E5E] text-[10px] font-bold uppercase tracking-wider rounded">Day 2</span>
              <div>
                <h4 className="font-editorial-serif text-base font-bold mb-1">Bespoke Platform Build & AI Seeding</h4>
                <p className="text-xs text-[#66605B] dark:text-[#968F89]">We deploy your isolated Supabase database, configure the Gemini AI engine, and load your initial reviews & essays.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="px-2.5 py-1 bg-[#F4ECE1] text-[#B88E5E] text-[10px] font-bold uppercase tracking-wider rounded">Day 3</span>
              <div>
                <h4 className="font-editorial-serif text-base font-bold mb-1">Private Preview & Live Handover</h4>
                <p className="text-xs text-[#66605B] dark:text-[#968F89]">You review the live preview on your phone. Once approved, we connect your custom domain and hand over your private admin credentials.</p>
              </div>
            </div>
          </div>

          {/* Contact Box */}
          <div className="bg-[#1C1A17] text-white p-8 sm:p-10 rounded-lg border border-[#C5A070]/30 shadow-2xl text-center">
            <h3 className="font-editorial-serif text-2xl sm:text-3xl font-bold mb-2">
              Ready to Transform Your Bio Link?
            </h3>
            <p className="text-xs sm:text-sm text-white/60 max-w-md mx-auto mb-8">
              Explore the live reference architecture or reach out directly to begin your bespoke editorial setup:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-white/10 max-w-2xl mx-auto">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#C5A070] block mb-1">Live Platform</span>
                <a href="https://shrajan-tech.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-sm text-white hover:text-[#C5A070] underline font-medium break-all">
                  shrajan-tech.vercel.app →
                </a>
              </div>
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#C5A070] block mb-1">Direct Instagram</span>
                <a href="https://www.instagram.com/gadget.cache/" target="_blank" rel="noopener noreferrer" className="text-sm text-white hover:text-[#C5A070] underline font-medium">
                  @gadget.cache →
                </a>
              </div>
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#C5A070] block mb-1">Direct Inquiries</span>
                <a href="mailto:shrajanguptahome@gmail.com" className="text-sm text-white hover:text-[#C5A070] underline font-medium break-all">
                  shrajanguptahome@gmail.com
                </a>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap justify-center gap-4">
              <a
                href="/Luxury_Creator_Platform_Pitch.pdf"
                download="Luxury_Creator_Platform_Pitch.pdf"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#B88E5E] hover:bg-[#A37B4D] text-white text-xs font-bold tracking-widest uppercase rounded transition-all shadow"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Download Executive PDF Pitch</span>
              </a>
            </div>
          </div>

          <p className="text-center text-[10px] uppercase tracking-widest text-[#968F89] mt-8">
            Turnkey Setup · Zero Maintenance Burden · 100% Creator Owned
          </p>
        </section>

      </main>

      <Footer settings={settings} />
    </>
  )
}
