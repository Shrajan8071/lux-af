import React from 'react'

export default function StarRating({ rating = 5, size = 'sm', showNumeric = true }) {
  const numericRating = Math.max(1, Math.min(5, parseFloat(rating) || 5))
  
  // Render clean minimal stars
  const stars = [1, 2, 3, 4, 5].map((index) => {
    const isFilled = index <= Math.floor(numericRating)
    const isHalf = !isFilled && index === Math.ceil(numericRating) && numericRating % 1 !== 0

    return (
      <span key={index} className="inline-block relative leading-none select-none" aria-hidden="true">
        {isFilled ? (
          <span className="text-[#8B8172]">★</span>
        ) : isHalf ? (
          <span className="relative text-[#D8D2C6]">
            ★
            <span className="absolute top-0 left-0 w-1/2 overflow-hidden text-[#8B8172]">★</span>
          </span>
        ) : (
          <span className="text-[#D8D2C6]">★</span>
        )}
      </span>
    )
  })

  return (
    <div 
      className="inline-flex items-center gap-1 text-xs text-luxury-muted tracking-tight whitespace-nowrap shrink-0"
      aria-label={`Rating: ${numericRating} out of 5 stars`}
    >
      <div className={`flex items-center ${size === 'lg' ? 'text-sm tracking-wider' : 'text-[11px] sm:text-xs tracking-tight'}`}>
        {stars}
      </div>
      {showNumeric && (
        <span className="text-[10px] sm:text-[11px] font-medium text-luxury-muted font-mono ml-0.5">
          {numericRating.toFixed(1)}
        </span>
      )}
    </div>
  )
}
