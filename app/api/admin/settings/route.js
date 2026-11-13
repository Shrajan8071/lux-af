import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getSiteSettings, updateSiteSettings } from '@/lib/supabase/data'

export async function GET() {
  try {
    const settings = await getSiteSettings()
    return NextResponse.json({ success: true, settings })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json()

    // Validate brand name
    if (body.brand_name && typeof body.brand_name === 'string' && body.brand_name.trim().length === 0) {
      return NextResponse.json({ success: false, error: 'Brand name cannot be blank' }, { status: 400 })
    }

    const result = await updateSiteSettings(body)
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }

    // Invalidate caches across layout and public pages so changes reflect instantly
    try {
      revalidatePath('/', 'layout')
      revalidatePath('/')
      revalidatePath('/about')
    } catch (e) {
      // Revalidation warning catch
    }

    return NextResponse.json({ success: true, settings: result.data })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
