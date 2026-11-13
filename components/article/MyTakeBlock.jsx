export default function MyTakeBlock({ take }) {
  if (!take || !take.trim()) return null

  return (
    <section 
      aria-labelledby="my-take-heading"
      className="my-10 border-l-2 border-luxury-accent pl-6 sm:pl-8 py-2 text-luxury-text"
    >
      <span 
        id="my-take-heading"
        className="text-[11px] uppercase tracking-widest font-mono text-luxury-accent font-medium block mb-2"
      >
        Editorial Perspective — My Take
      </span>
      <blockquote className="font-editorial-serif text-lg sm:text-xl font-normal leading-relaxed text-luxury-text italic">
        "{take}"
      </blockquote>
    </section>
  )
}
