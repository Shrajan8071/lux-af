'use client'

import { useState } from 'react'

export default function ContainImage({ src, alt, priority = false, className = '' }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  // Neutral luxury placeholder if no image or error
  const placeholder = (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#F3EFE8] text-luxury-muted p-6 text-center">
      <span className="font-editorial-serif italic text-lg tracking-wide text-luxury-accent">Editorial Archive</span>
      <span className="text-[11px] tracking-widest uppercase mt-2 text-luxury-subtle">Object Documentation</span>
    </div>
  )

  return (
    <div className={`relative w-full h-full flex items-center justify-center overflow-hidden bg-[#F6F3EC] ${className}`}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-[#F4F0E8] animate-pulse" />
      )}
      
      {hasError || !src ? (
        placeholder
      ) : (
        <img
          src={src}
          alt={alt || "Product image"}
          loading={priority ? 'eager' : 'lazy'}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full object-contain p-4 transition-opacity duration-500 ease-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  )
}
