import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getBlogById, updateBlog, deleteBlog } from '@/lib/supabase/data'

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

export async function GET(request, { params }) {
  try {
    const { id } = params
    const blog = await getBlogById(id)
    if (!blog) {
      return NextResponse.json({ success: false, error: 'Blog post not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true, blog })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params
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

    let cleanSlug = slugify(slug || title)
    if (!cleanSlug) {
      cleanSlug = `dispatch-${Date.now()}`
    }

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

    const result = await updateBlog(id, {
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

export async function DELETE(request, { params }) {
  try {
    const { id } = params
    const result = await deleteBlog(id)

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }

    try {
      revalidatePath('/')
      revalidatePath('/blogs')
    } catch (e) {}

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
