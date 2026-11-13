import { NextResponse } from 'next/server'
import { generateEditorialDraft } from '@/lib/gemini'

export async function POST(request) {
  try {
    const body = await request.json()
    const { sourceContent, rating, affiliateUrl } = body

    if (!sourceContent || typeof sourceContent !== 'string' || sourceContent.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Pasted source content is required to generate an editorial draft.' },
        { status: 400 }
      )
    }

    const result = await generateEditorialDraft({
      sourceContent: sourceContent.trim(),
      rating: parseFloat(rating) || 4.5,
      affiliateUrl: affiliateUrl ? affiliateUrl.trim() : ''
    })

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Server error while generating content.' },
      { status: 500 }
    )
  }
}
