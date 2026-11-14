import { GoogleGenerativeAI } from '@google/generative-ai'

/**
 * Server-side Gemini service for drafting luxury editorial product articles.
 * Strictly adheres to the AI Honesty Requirement:
 * - Does not invent claims, specifications, or personal test experiences
 * - Drafts structured title, objective editorial description, and a suggested "My Take" based on provided rating & content
 */
export async function generateEditorialDraft({ sourceContent, rating, affiliateUrl }) {
  const apiKey = process.env.GEMINI_API_KEY
  const configuredModel = process.env.GEMINI_MODEL || 'gemini-3.5-flash'

  if (!apiKey || apiKey === 'your-gemini-api-key') {
    return {
      success: true,
      data: {
        title: "Curated Design Object",
        description: `Drawn from the manufacturer's documentation:\n\n${sourceContent.slice(0, 300).trim()}... Formed with meticulous attention to material fidelity and architectural proportion.`,
        my_take: `Reflecting our rating of ${rating || 4.5} out of 5: This piece demonstrates disciplined craftsmanship and restrained materiality. A considered addition for those who value understated design. (Note: Please review and adjust this editorial perspective to reflect your personal opinion before publishing.)`
      },
      simulated: true,
      message: 'Draft generated using local editorial template. Set GEMINI_API_KEY in .env.local to activate live Gemini AI generation.'
    }
  }

  const prompt = `
You are a senior luxury design editor and art director for an independent, refined product discovery journal.
Your task is to write a polished, restrained, authentic editorial article based SOLELY on the supplied product information.

INPUT CONTEXT:
- Pasted Product Source Content: """${sourceContent}"""
- Selected Rating: ${rating || 4.5} out of 5
- Affiliate Reference Link: ${affiliateUrl || 'Not provided'}

STRICT HONESTY & EDITORIAL RULES:
1. DO NOT invent product specifications, lab measurements, materials, or claims not supported by the provided text.
2. DO NOT make first-person claims of personal ownership, physical testing, or multi-year usage unless explicitly stated in the source text.
3. The tone must be restrained, timeless, sophisticated, and authentically luxurious—never hype-driven, never buzzword-heavy, never cheesy affiliate-sales copy.
4. "title": A clean, refined editorial title including maker/brand and model name.
5. "description": An objective, beautifully written editorial summary explaining the design, materials, and functional purpose in 2 to 3 paragraphs.
6. "my_take": A suggested draft of an editorial point of view (2-3 sentences) aligned with the ${rating} rating, discussing design merit and aesthetic value. Keep it as a suggestion that the site owner can easily review and edit.

OUTPUT FORMAT:
Return strictly valid JSON with this exact structure:
{
  "title": "string",
  "description": "string",
  "my_take": "string"
}
`

  // Models to try in order of priority & reliability
  const candidateModels = [
    configuredModel,
    'gemini-3.5-flash',
    'gemini-3.8-flash',
    'gemini-flash-latest'
  ].filter((v, i, a) => a.indexOf(v) === i) // Unique list

  const genAI = new GoogleGenerativeAI(apiKey)
  let lastError = null

  for (const modelName of candidateModels) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.3,
        }
      })

      const result = await model.generateContent(prompt)
      const responseText = result.response.text()
      const parsed = JSON.parse(responseText)

      if (parsed.title && parsed.description) {
        return {
          success: true,
          data: {
            title: parsed.title.trim(),
            description: parsed.description.trim(),
            my_take: (parsed.my_take || '').trim()
          },
          modelUsed: modelName
        }
      }
    } catch (err) {
      console.warn(`Model ${modelName} attempt error:`, err.message)
      lastError = err
    }
  }

  return {
    success: false,
    error: lastError?.message || 'Failed to generate content with Gemini API'
  }
}

/**
 * Server-side Gemini service for professionally rephrasing and elevating blog articles.
 * Takes rough thoughts, draft notes, or raw text and crafts an authoritative, refined editorial essay.
 */
export async function rephraseBlogContent({ title = '', rawContent = '', instructions = '' }) {
  const apiKey = process.env.GEMINI_API_KEY
  const configuredModel = process.env.GEMINI_MODEL || 'gemini-3.5-flash'

  if (!rawContent.trim()) {
    return {
      success: false,
      error: 'Please provide rough thoughts or draft content to rephrase.'
    }
  }

  if (!apiKey || apiKey === 'your-gemini-api-key') {
    // Simulated editorial rephrase when Gemini key is not configured
    const paragraphs = rawContent.split(/\n\s*\n/).filter(Boolean)
    const simulatedBody = paragraphs.length > 0
      ? paragraphs.map(p => `${p.trim()}\n\nCrafted with deliberate attention to industrial restraint, each element reflects a disciplined approach to physical utility and enduring aesthetic balance.`).join('\n\n')
      : `Reflecting on the relationship between materials and functional discipline:\n\n${rawContent}\n\nTrue elegance emerges when superfluous ornamentation is stripped away, leaving only pure intent and uncompromising craft.`

    return {
      success: true,
      data: {
        title: title.trim() || 'On the Craft and Philosophy of Enduring Objects',
        excerpt: 'An inquiry into material discipline, honest engineering, and the enduring luxury of restrained design.',
        content: simulatedBody
      },
      simulated: true,
      message: 'Rephrased using local editorial styling template. Set GEMINI_API_KEY in .env.local to activate live Gemini AI rephrasing.'
    }
  }

  const prompt = `
You are the Editor-in-Chief of a world-class luxury design, technology, and hardware publication.
Your task is to take an author's raw draft thoughts, notes, or unpolished article text and rephrase/elevate it into an exceptionally written, professional editorial essay.

INPUT INFORMATION:
- Current Title (if provided): """${title}"""
- Raw Draft Content / Author's Notes:
"""${rawContent}"""
${instructions ? `- Author's Special Directives: """${instructions}"""` : ''}

EDITORIAL CADENCE & STYLE REQUIREMENTS:
1. ELEVATED YET AUTHENTIC: The writing must sound articulate, perceptive, refined, and intellectually honest. Avoid marketing clichés, clickbait phrases, hyperbolic tech hype ("revolutionary", "game-changer", "insane"), and generic filler.
2. DISCIPLINED STRUCTURE: Format into coherent, flowing paragraphs separated by double newlines (\n\n). Ensure natural transitions from observation to technical analysis and philosophical reflection.
3. RETAIN CORE IDEAS: Respect the author's original message, insights, and technical observations without fabricating unmentioned facts.
4. "title": Provide a compelling, poetic editorial headline (refine the existing title if given, or generate an evocative one).
5. "excerpt": Provide a concise, engaging 1 to 2 sentence summary (under 160 characters) suitable for article card previews and RSS/SEO.
6. "content": The complete, beautifully polished essay in multi-paragraph prose.

OUTPUT FORMAT:
Return strictly valid JSON with this exact schema:
{
  "title": "string",
  "excerpt": "string",
  "content": "string"
}
`

  const candidateModels = [
    configuredModel,
    'gemini-3.5-flash',
    'gemini-3.8-flash',
    'gemini-flash-latest'
  ].filter((v, i, a) => a.indexOf(v) === i)

  const genAI = new GoogleGenerativeAI(apiKey)
  let lastError = null

  for (const modelName of candidateModels) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.4,
        }
      })

      const result = await model.generateContent(prompt)
      const responseText = result.response.text()
      const parsed = JSON.parse(responseText)

      if (parsed.content) {
        return {
          success: true,
          data: {
            title: (parsed.title || title).trim(),
            excerpt: (parsed.excerpt || '').trim(),
            content: parsed.content.trim()
          },
          modelUsed: modelName
        }
      }
    } catch (err) {
      console.warn(`Gemini blog rephrase model ${modelName} error:`, err.message)
      lastError = err
    }
  }

  return {
    success: false,
    error: lastError?.message || 'Failed to rephrase blog content with Gemini AI.'
  }
}

/**
 * Server-side Gemini service for generating a full, structured editorial blog post
 * from raw product information, Amazon gadget listings, or feature dumps.
 * Specifically focuses on practical real-world value: how this object/gadget
 * helps normal people in day-to-day life and routines.
 * 
 * Strict constraints per user request:
 * - Decides Title, URL slug, Excerpt, and Full Content.
 * - NO external links, URLs, or markdown link syntax in the generated content.
 * - NO photos or image tags attached.
 */
export async function generateBlogFromSourceDump({ sourceDump = '', focusTopic = '' }) {
  const apiKey = process.env.GEMINI_API_KEY
  const configuredModel = process.env.GEMINI_MODEL || 'gemini-3.5-flash'

  if (!sourceDump.trim()) {
    return {
      success: false,
      error: 'Please paste product or gadget text to generate a blog post.'
    }
  }

  const effectiveFocus = focusTopic.trim() || 
    'Everyday utility: How this gadget or object genuinely helps normal people in day-to-day life, practical ergonomics, and daily routines.'

  if (!apiKey || apiKey === 'your-gemini-api-key') {
    // High-quality simulated editorial fallback when Gemini key is not configured
    const firstLine = sourceDump.trim().split('\n')[0].slice(0, 60)
    return {
      success: true,
      data: {
        title: `Everyday Utility & Thoughtful Design: A Practical Look at ${firstLine || 'Modern Gadgets'}`,
        excerpt: `A grounded, real-world assessment of how this device integrates into daily routines, reduces quiet friction, and delivers genuine utility for everyday people.`,
        content: `In a consumer landscape crowded with spec-sheet novelty and disposable gadgets, the true measure of any tool is not how many features it boasts, but how seamlessly it improves normal, day-to-day life.\n\nLooking beyond marketing jargon, what makes this piece noteworthy is its direct alignment with human routines. When you strip away promotional noise, everyday utility comes down to reliable ergonomics, tactile satisfaction, and eliminating small moments of friction throughout the workday.\n\n### Practical Problems Solved in Real Routines\n\nFor everyday people balancing busy schedules, modern hardware should solve tangible problems rather than demanding constant maintenance:\n- Seamless Workflow Integration: Designed to fade into the background, allowing you to focus on the task rather than configuring the tool.\n- Tactile & Ergonomic Comfort: Thoughtfully contoured to reduce physical fatigue over prolonged hours of daily handling.\n- Material Resilience: Built with honest surfaces that withstand real-world wear without becoming brittle or unsightly.\n\n### The Real-World Verdict\n\nUltimately, tools that justify their place in our spaces are those that respect human attention. Rather than demanding perpetual engagement, this piece stands out because it quietly does what it was made to do with quiet competence and lasting utility.`
      },
      simulated: true,
      message: 'Draft generated using local editorial template. Set GEMINI_API_KEY in .env.local to activate live Gemini AI generation.'
    }
  }

  const prompt = `
You are a senior tech & industrial design editor writing for an independent editorial publication.
Your audience consists of everyday people who appreciate well-made objects and want honest, practical insight into whether a gadget or product actually makes their daily lives better.

INPUT SOURCE INFORMATION (Copied from Amazon, product documentation, or rough specifications):
"""${sourceDump}"""

EDITORIAL FOCUS & ANGLE:
"""${effectiveFocus}"""

EDITORIAL INSTRUCTIONS:
1. FOCUS ON REAL DAILY LIFE: Frame the article around how this specific gadget/product genuinely helps normal people in their day-to-day life. Address real-world moments: morning routines, workspace fatigue, commute ease, home organization, or quiet moments of utility.
2. NO SCRIPTED SALES TALK: Do NOT write breathless marketing copy, affiliate sales pitches, or artificial hype (avoid "game-changer", "revolutionary", "must-have", "insane"). Be perceptive, balanced, and conversational yet refined.
3. STRICT PROHIBITIONS:
   - Absolutely NO links, URLs, affiliate tags, or markdown links ([text](url)).
   - Absolutely NO photo placeholders, images, or image markdown (![...](...)).
   - Do NOT include pricing or availability claims.
4. STRUCTURED MARKDOWN FORMAT:
   - Use '### Section Heading' for 2 to 3 logical section dividers (e.g. '### Where It Truly Helps in Daily Routines', '### Ergonomics & Material Feel', '### Practical Considerations').
   - Use clean bullet points ('- Point description') for key everyday benefits so it renders beautifully in our editorial theme.
   - Rich, coherent paragraphs with double newlines between them.
5. "title": A clean, engaging editorial headline that captures the essence of the gadget and its practical purpose (avoid clickbait).
6. "excerpt": A compelling 1 to 2 sentence summary (under 160 characters) explaining what the article is about and who it helps.
7. "content": The full essay body in clean markdown (around 350 - 550 words).

OUTPUT FORMAT:
Return strictly valid JSON with this exact schema:
{
  "title": "string",
  "excerpt": "string",
  "content": "string"
}
`

  const candidateModels = [
    configuredModel,
    'gemini-3.5-flash',
    'gemini-3.8-flash',
    'gemini-flash-latest'
  ].filter((v, i, a) => a.indexOf(v) === i)

  const genAI = new GoogleGenerativeAI(apiKey)
  let lastError = null

  for (const modelName of candidateModels) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.4,
        }
      })

      const result = await model.generateContent(prompt)
      const responseText = result.response.text()
      const parsed = JSON.parse(responseText)

      if (parsed.title && parsed.content) {
        return {
          success: true,
          data: {
            title: parsed.title.trim(),
            excerpt: (parsed.excerpt || '').trim(),
            content: parsed.content.trim()
          },
          modelUsed: modelName
        }
      }
    } catch (err) {
      console.warn(`Gemini generateBlogFromSourceDump model ${modelName} error:`, err.message)
      lastError = err
    }
  }

  return {
    success: false,
    error: lastError?.message || 'Failed to generate blog with Gemini AI.'
  }
}
