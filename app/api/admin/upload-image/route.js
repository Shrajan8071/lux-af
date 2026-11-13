import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file || typeof file === 'string') {
      return NextResponse.json({ success: false, error: 'No image file uploaded' }, { status: 400 })
    }

    // Validate mime type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file format. Please upload JPEG, PNG, or WebP.' },
        { status: 400 }
      )
    }

    // Validate size (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: 'Image exceeds maximum allowable size (5MB).' },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`

    // Check if Supabase Storage is configured
    const supabaseAdmin = createAdminClient()
    if (supabaseAdmin) {
      const { data, error } = await supabaseAdmin.storage
        .from('product-images')
        .upload(filename, buffer, {
          contentType: file.type,
          upsert: false
        })

      if (error) {
        console.error('Supabase storage upload error:', error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
      }

      const { data: publicUrlData } = supabaseAdmin.storage
        .from('product-images')
        .getPublicUrl(filename)

      return NextResponse.json({
        success: true,
        imagePath: publicUrlData.publicUrl
      })
    }

    // Fallback data-url storage for local dev prior to Supabase setup
    const base64Data = `data:${file.type};base64,${buffer.toString('base64')}`
    return NextResponse.json({
      success: true,
      imagePath: base64Data,
      note: 'Stored as local DataURL. Once Supabase Storage is connected, files will be uploaded directly to your CDN bucket.'
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Image upload failed' },
      { status: 500 }
    )
  }
}
