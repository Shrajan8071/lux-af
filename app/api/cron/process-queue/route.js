import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { publishNextQueuedBlog } from '@/lib/supabase/data'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function handleQueueProcess(request) {
  try {
    // Optional CRON_SECRET verification for production security
    const cronSecret = process.env.CRON_SECRET
    if (cronSecret) {
      const authHeader = request.headers.get('authorization')
      if (authHeader !== `Bearer ${cronSecret}`) {
        // If not matching secret and not an internal admin session, allow if in development
        if (process.env.NODE_ENV === 'production' && !request.headers.get('x-admin-trigger')) {
          return NextResponse.json({ success: false, error: 'Unauthorized cron invocation' }, { status: 401 })
        }
      }
    }

    // 1. Process the next queued blog
    const result = await publishNextQueuedBlog()

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }

    // 2. If a post was published, revalidate public cache paths
    if (result.published) {
      try {
        revalidatePath('/')
        revalidatePath('/blogs')
        revalidatePath(`/blogs/${result.published.slug}`)
      } catch (e) {
        console.warn('Cache revalidation notice:', e.message)
      }
    }

    return NextResponse.json({
      success: true,
      published: result.published,
      message: result.message
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal error processing automated blog queue.' },
      { status: 500 }
    )
  }
}

export async function GET(request) {
  return handleQueueProcess(request)
}

export async function POST(request) {
  return handleQueueProcess(request)
}
