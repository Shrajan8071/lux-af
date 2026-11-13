export default function AffiliateNotice({ customDisclosure }) {
  return (
    <div className="mt-14 pt-8 border-t border-luxury-border/60 text-xs text-luxury-muted leading-relaxed space-y-3">
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-luxury-accent/60" />
        <span className="text-[10px] uppercase tracking-widest font-mono text-luxury-subtle">
          Editorial &amp; Pricing Transparency
        </span>
      </div>
      <p>
        {customDisclosure ||
          'Editorial Disclosure: When you purchase through links on this journal, we may earn an affiliate commission from our retail partners. Every product featured is independently selected based on design merit, craftsmanship, and aesthetic integrity.'}
      </p>
      <p className="text-luxury-subtle text-[11px]">
        Historical Price Notice: The price displayed was documented at the time of publication or acquisition and serves as a reference. Retailer pricing, currency fluctuations, and stock availability are subject to change on the merchant’s website.
      </p>
    </div>
  )
}
