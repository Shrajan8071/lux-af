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
