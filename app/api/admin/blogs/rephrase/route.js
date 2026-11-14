import { NextResponse } from 'next/server'
import { rephraseBlogContent } from '@/lib/gemini'

export async function POST(request) {
  try {
    const body = await request.json()
    const { title, rawContent, instructions } = body

    if (!rawContent || !rawContent.trim()) {
      return NextResponse.json(
        { success: false, error: 'Rough notes or draft content are required for Gemini AI to rephrase.' },
        { status: 400 }
      )
    }

    const result = await rephraseBlogContent({
      title: title || '',
      rawContent: rawContent.trim(),
      instructions: instructions || ''
    })

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to rephrase blog content with Gemini AI.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      simulated: result.simulated || false,
      message: result.message || null
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error during AI rephrase.' },
      { status: 500 }
    )
  }
}
