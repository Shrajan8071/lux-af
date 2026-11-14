import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getAllBlogsAdmin, createBlog } from '@/lib/supabase/data'

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/&/g, '-and-')      // Replace & with 'and'
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '')          // Trim - from end of text
}

export async function GET() {
  try {
    const blogs = await getAllBlogsAdmin()
    return NextResponse.json({ success: true, blogs })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { title, content, excerpt, slug, image_path, video_url, external_link, external_link_label, status } = body

    if (!title || !title.trim()) {
      return NextResponse.json(
        { success: false, error: 'A blog title is required.' },
        { status: 400 }
      )
    }

    if (!content || !content.trim()) {
      return NextResponse.json(
        { success: false, error: 'Blog essay content is required.' },
        { status: 400 }
      )
    }

    // Generate or clean slug
    let cleanSlug = slugify(slug || title)
    if (!cleanSlug) {
      cleanSlug = `dispatch-${Date.now()}`
    }

    // Validate external link if provided
    let cleanExternalLink = null
    if (external_link && external_link.trim()) {
      let trimmed = external_link.trim()
      if (!/^https?:\/\//i.test(trimmed)) {
        trimmed = 'https://' + trimmed
      }
      try {
        new URL(trimmed)
        cleanExternalLink = trimmed
      } catch {
        return NextResponse.json(
          { success: false, error: 'External reference link must be a valid http/https URL.' },
          { status: 400 }
        )
      }
    }

    // Validate video link if provided
    let cleanVideoUrl = null
    if (video_url && video_url.trim()) {
      let trimmed = video_url.trim()
      if (!/^https?:\/\//i.test(trimmed)) {
        trimmed = 'https://' + trimmed
      }
      try {
        new URL(trimmed)
        cleanVideoUrl = trimmed
      } catch {
        return NextResponse.json(
          { success: false, error: 'Video review URL must be a valid http/https URL.' },
          { status: 400 }
        )
      }
    }

    const result = await createBlog({
      title: title.trim(),
      slug: cleanSlug,
      excerpt: excerpt ? excerpt.trim() : null,
      content: content.trim(),
      image_path: image_path ? image_path.trim() : null,
      video_url: cleanVideoUrl,
      external_link: cleanExternalLink,
      external_link_label: external_link_label ? external_link_label.trim() : 'Reference Resource',
      status: status || 'draft'
    })

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }

    try {
      revalidatePath('/')
      revalidatePath('/blogs')
      revalidatePath(`/blogs/${cleanSlug}`)
    } catch (e) {}

    return NextResponse.json({ success: true, data: result.data })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
