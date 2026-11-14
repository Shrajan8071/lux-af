import { NextResponse } from 'next/server'
import { generateBlogFromSourceDump } from '@/lib/gemini'

export async function POST(request) {
  try {
    const body = await request.json()
    const { sourceDump, focusTopic } = body

    if (!sourceDump || !sourceDump.trim()) {
      return NextResponse.json(
        { success: false, error: 'Please paste product or gadget information in the source dump field.' },
        { status: 400 }
      )
    }

    const result = await generateBlogFromSourceDump({
      sourceDump: sourceDump.trim(),
      focusTopic: focusTopic || ''
    })

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to generate blog with Gemini AI.' },
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
      { success: false, error: error.message || 'Internal server error during blog generation.' },
      { status: 500 }
    )
  }
}
