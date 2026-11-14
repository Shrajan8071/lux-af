import { NextResponse } from 'next/server'
import { getQueuedBlogs, createBlog } from '@/lib/supabase/data'
import { generateBlogFromSourceDump } from '@/lib/gemini'

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/&/g, '-and-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

/**
 * GET: Retrieve all currently queued blog posts
 */
export async function GET() {
  try {
    const queue = await getQueuedBlogs()
    return NextResponse.json({ success: true, queue })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

/**
 * POST: Generate blog from sourceDump and insert into blogs table with status = 'queued'
 */
export async function POST(request) {
  try {
    const body = await request.json()
    const { sourceDump, focusTopic } = body

    if (!sourceDump || !sourceDump.trim()) {
      return NextResponse.json(
        { success: false, error: 'Please paste product or gadget text in the source dump field.' },
        { status: 400 }
      )
    }

    // 1. Generate editorial title, excerpt, and content via Gemini
    const aiResult = await generateBlogFromSourceDump({
      sourceDump: sourceDump.trim(),
      focusTopic: focusTopic || ''
    })

    if (!aiResult.success || !aiResult.data) {
      return NextResponse.json(
        { success: false, error: aiResult.error || 'Failed to generate blog post from dump.' },
        { status: 500 }
      )
    }

    const { title, excerpt, content } = aiResult.data

    let cleanSlug = slugify(title)
    if (!cleanSlug) {
      cleanSlug = `dispatch-${Date.now()}`
    }

    // 2. Insert into Supabase with status: 'queued'
    const dbResult = await createBlog({
      title: title.trim(),
      slug: cleanSlug,
      excerpt: excerpt ? excerpt.trim() : null,
      content: content.trim(),
      image_path: null,
      video_url: null,
      external_link: null,
      external_link_label: 'Reference Resource',
      status: 'queued',
      source_dump: sourceDump.trim(),
      queue_order: 0
    })

    if (!dbResult.success) {
      // If slug collision, retry with timestamp suffix
      if (dbResult.error && dbResult.error.includes('duplicate')) {
        cleanSlug = `${cleanSlug}-${Date.now().toString().slice(-4)}`
        const retryResult = await createBlog({
          title: title.trim(),
          slug: cleanSlug,
          excerpt: excerpt ? excerpt.trim() : null,
          content: content.trim(),
          image_path: null,
          video_url: null,
          external_link: null,
          external_link_label: 'Reference Resource',
          status: 'queued',
          source_dump: sourceDump.trim(),
          queue_order: 0
        })

        if (!retryResult.success) {
          return NextResponse.json({ success: false, error: retryResult.error }, { status: 500 })
        }

        return NextResponse.json({
          success: true,
          blog: retryResult.data,
          message: 'Post generated and successfully added to the daily queue.'
        })
      }

      return NextResponse.json({ success: false, error: dbResult.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      blog: dbResult.data,
      message: 'Post generated and successfully added to the daily queue.'
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error while queueing blog.' },
      { status: 500 }
    )
  }
}
