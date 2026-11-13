import ProductCard from './ProductCard'

export default function ProductGrid({ products = [], currencySymbol = '₹' }) {
  if (!products || products.length === 0) {
    return (
      <div className="py-24 text-center border border-luxury-border/50 bg-luxury-card max-w-xl mx-auto p-12 my-12">
        <span className="text-xs uppercase tracking-widest text-luxury-accent font-mono block mb-3">
          Editorial Journal
        </span>
        <h3 className="font-editorial-serif text-2xl text-luxury-text mb-3">
          No Objects Currently Published
        </h3>
        <p className="text-luxury-muted text-sm leading-relaxed">
          The archive is presently being curated. New editorial recommendations will be published shortly.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
      {products.map((product) => (
        <ProductCard
          key={product.id || product.article_number}
          product={product}
          currencySymbol={currencySymbol}
        />
      ))}
    </div>
  )
}
