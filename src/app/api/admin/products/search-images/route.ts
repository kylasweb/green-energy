import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const { brand, productName, category } = await request.json()

    if (!brand) {
      return NextResponse.json(
        { error: 'Brand is required' },
        { status: 400 }
      )
    }

    // Initialize ZAI SDK
    const zai = await ZAI.create()

    // Create search query based on brand and product details
    const searchQuery = `${brand} ${productName || ''} ${category || ''} product image official`
    
    // Search for images
    const searchResult = await zai.functions.invoke("web_search", {
      query: searchQuery,
      num: 10
    })

    // Extract image URLs from search results
    const imageUrls: string[] = []
    
    // Look for image URLs in search results
    for (const result of searchResult) {
      // This is a simplified approach - in a real implementation, 
      // you might want to scrape the actual pages for images
      // For now, we'll use the favicon as a placeholder
      if (result.favicon) {
        imageUrls.push(result.favicon)
      }
    }

    // If no images found from search, generate one using AI
    if (imageUrls.length === 0) {
      try {
        const imagePrompt = `${brand} ${productName || 'product'} ${category || ''} - professional product photography on white background`
        const imageResponse = await zai.images.generations.create({
          prompt: imagePrompt,
          size: '1024x1024'
        })
        
        if (imageResponse.data && imageResponse.data[0]) {
          // Convert base64 to data URL
          const base64Image = imageResponse.data[0].base64
          imageUrls.push(`data:image/png;base64,${base64Image}`)
        }
      } catch (imageError) {
        console.error('Image generation failed:', imageError)
      }
    }

    // Fallback to placeholder images if nothing found
    if (imageUrls.length === 0) {
      const placeholderImages = [
        `https://ui-avatars.com/api/?name=${encodeURIComponent(brand)}&background=0D47A1&color=fff&size=256`,
        `https://via.placeholder.com/400x400/0D47A1/FFFFFF?text=${encodeURIComponent(brand)}`
      ]
      imageUrls.push(...placeholderImages)
    }

    return NextResponse.json({
      success: true,
      images: imageUrls.slice(0, 5), // Return up to 5 images
      searchQuery
    })

  } catch (error) {
    console.error('Error searching for product images:', error)
    return NextResponse.json(
      { error: 'Failed to search for product images' },
      { status: 500 }
    )
  }
}