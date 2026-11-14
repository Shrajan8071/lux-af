'use client'

import React from 'react'

/**
 * Editorial Content Renderer
 * Parses markdown headings (#..####), bullet lists (- or *), numbered lists (1.),
 * blockquotes (>), inline bold (**bold**), italics (*italic*), code (`code`),
 * and links ([text](url)) with an authentic editorial aesthetic.
 */
export default function BlogContentRenderer({ content, className = '' }) {
  if (!content) return null

  const blocks = parseMarkdown(content)

  return (
    <div className={`space-y-6 ${className}`}>
      {blocks.map((block, idx) => {
        if (block.type === 'heading') {
          if (block.level === 1 || block.level === 2) {
            return (
              <h2
                key={idx}
                className="font-editorial-serif text-2xl sm:text-3xl md:text-4xl text-luxury-text font-normal pt-6 pb-2 border-b border-luxury-border/40 tracking-tight"
              >
                {renderInline(block.text)}
              </h2>
            )
          }
          if (block.level === 3) {
            return (
              <h3
                key={idx}
                className="font-editorial-serif text-xl sm:text-2xl text-luxury-text font-normal pt-5 pb-1 tracking-tight"
              >
                {renderInline(block.text)}
              </h3>
            )
          }
          return (
            <h4
              key={idx}
              className="font-mono text-xs uppercase tracking-widest text-luxury-accent pt-4 pb-1"
            >
              {renderInline(block.text)}
            </h4>
          )
        }

        if (block.type === 'ul') {
          return (
            <ul key={idx} className="space-y-3 my-5 pl-5 list-disc text-luxury-muted font-light leading-relaxed">
              {block.items.map((item, itemIdx) => (
                <li key={itemIdx} className="leading-relaxed">
                  {renderInline(item)}
                </li>
              ))}
            </ul>
          )
        }

        if (block.type === 'ol') {
          return (
            <ol key={idx} className="space-y-3 my-5 pl-5 list-decimal text-luxury-muted font-light leading-relaxed">
              {block.items.map((item, itemIdx) => (
                <li key={itemIdx} className="leading-relaxed">
                  {renderInline(item)}
                </li>
              ))}
            </ol>
          )
        }

        if (block.type === 'quote') {
          return (
            <blockquote
              key={idx}
              className="border-l-2 border-luxury-accent pl-5 my-6 italic font-editorial-serif text-lg text-luxury-muted"
            >
              {block.lines.map((line, qIdx) => (
                <p key={qIdx} className={qIdx > 0 ? 'mt-2' : ''}>
                  {renderInline(line)}
                </p>
              ))}
            </blockquote>
          )
        }

        // Paragraph
        return (
          <p key={idx} className="font-light leading-relaxed">
            {renderInline(block.text)}
          </p>
        )
      })}
    </div>
  )
}

function parseMarkdown(content) {
  if (!content) return []

  const lines = content.replace(/\r\n/g, '\n').split('\n')
  const blocks = []
  let currentParagraph = []
  let currentList = null // { type: 'ul' | 'ol', items: [] }
  let currentQuote = []

  function flushParagraph() {
    if (currentParagraph.length > 0) {
      blocks.push({
        type: 'paragraph',
        text: currentParagraph.join(' ').trim()
      })
      currentParagraph = []
    }
  }

  function flushList() {
    if (currentList) {
      blocks.push(currentList)
      currentList = null
    }
  }

  function flushQuote() {
    if (currentQuote.length > 0) {
      blocks.push({
        type: 'quote',
        lines: [...currentQuote]
      })
      currentQuote = []
    }
  }

  function flushAll() {
    flushParagraph()
    flushList()
    flushQuote()
  }

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i]
    const trimmed = rawLine.trim()

    // Blank line indicates a block break
    if (!trimmed) {
      flushAll()
      continue
    }

    // Heading: #, ##, ###, ####
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/)
    if (headingMatch) {
      flushAll()
      blocks.push({
        type: 'heading',
        level: headingMatch[1].length,
        text: headingMatch[2].trim()
      })
      continue
    }

    // Blockquote: > Quote
    if (trimmed.startsWith('>')) {
      flushParagraph()
      flushList()
      currentQuote.push(trimmed.replace(/^>\s*/, '').trim())
      continue
    } else {
      flushQuote()
    }

    // Bullet list: - item or * item
    const bulletMatch = trimmed.match(/^[-*]\s+(.+)$/)
    if (bulletMatch) {
      flushParagraph()
      if (!currentList || currentList.type !== 'ul') {
        flushList()
        currentList = { type: 'ul', items: [] }
      }
      currentList.items.push(bulletMatch[1].trim())
      continue
    }

    // Numbered list: 1. item
    const numberedMatch = trimmed.match(/^(\d+)\.\s+(.+)$/)
    if (numberedMatch) {
      flushParagraph()
      if (!currentList || currentList.type !== 'ol') {
        flushList()
        currentList = { type: 'ol', items: [] }
      }
      currentList.items.push(numberedMatch[2].trim())
      continue
    }

    // Normal text line breaks list accumulation
    flushList()

    // Accumulate paragraph
    currentParagraph.push(trimmed)
  }

  flushAll()
  return blocks
}

function renderInline(text) {
  if (!text) return ''

  // Split tokens by markdown link [label](url), **bold**, *italic*, `code`
  const tokens = text.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g)

  return tokens.map((token, i) => {
    if (!token) return null

    // Markdown link: [label](url)
    if (token.startsWith('[') && token.includes('](') && token.endsWith(')')) {
      const match = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
      if (match) {
        const [, label, url] = match
        const isExternal = url.startsWith('http://') || url.startsWith('https://')
        return (
          <a
            key={i}
            href={url}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className="text-luxury-accent underline decoration-luxury-accent/40 underline-offset-4 hover:decoration-luxury-accent transition-colors"
          >
            {label}
          </a>
        )
      }
    }

    // Bold: **text**
    if (token.startsWith('**') && token.endsWith('**') && token.length >= 4) {
      return (
        <strong key={i} className="font-medium text-luxury-text">
          {token.slice(2, -2)}
        </strong>
      )
    }

    // Italic: *text*
    if (token.startsWith('*') && token.endsWith('*') && token.length >= 2) {
      return (
        <em key={i} className="italic">
          {token.slice(1, -1)}
        </em>
      )
    }

    // Inline code: `code`
    if (token.startsWith('`') && token.endsWith('`') && token.length >= 2) {
      return (
        <code key={i} className="px-1.5 py-0.5 font-mono text-xs bg-luxury-card border border-luxury-border/60 text-luxury-text rounded-none">
          {token.slice(1, -1)}
        </code>
      )
    }

    return token
  })
}
