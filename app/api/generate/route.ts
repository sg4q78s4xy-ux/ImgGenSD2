import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // For demo purposes, we'll return a placeholder image
    // In production, you would integrate with an actual AI image generation API
    // like Replicate, Hugging Face, or Stability AI
    
    console.log('[v0] Generating image for prompt:', prompt)
    
    // Simulate generation delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Return a placeholder image URL
    // Replace this with actual API integration
    const placeholderImage = `https://placehold.co/1024x1024/1a1a1a/white?text=${encodeURIComponent(prompt.slice(0, 30))}`
    
    return NextResponse.json({
      imageUrl: placeholderImage,
      prompt,
    })
  } catch (error) {
    console.error('[v0] Error in generate API:', error)
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    )
  }
}
