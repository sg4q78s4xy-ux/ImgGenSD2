'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Sparkles, Wand2, Download } from 'lucide-react'

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    
    setIsGenerating(true)
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      
      const data = await response.json()
      
      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl)
      }
    } catch (error) {
      console.error('[v0] Error generating image:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a')
      link.href = generatedImage
      link.download = 'generated-image.jpg'
      link.click()
    }
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">ImgGen SD2</span>
          </div>
          <Button variant="outline" size="sm">
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-12 md:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            AI Image Generation
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl text-balance">
            Create stunning images with{' '}
            <span className="text-primary">AI</span>
          </h1>
          <p className="mb-8 text-lg text-muted-foreground text-pretty">
            Transform your imagination into reality with Stable Diffusion. 
            Enter a prompt and watch AI bring your ideas to life.
          </p>
        </div>

        {/* Generation Interface */}
        <div className="mx-auto max-w-4xl">
          <Card className="p-6 md:p-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="prompt" className="text-sm font-medium text-foreground">
                  Describe your image
                </label>
                <Textarea
                  id="prompt"
                  placeholder="A serene landscape with mountains at sunset, detailed, highly realistic..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-32 resize-none"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-5 w-5" />
                    Generate Image
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Generated Image Display */}
          {generatedImage && (
            <Card className="mt-8 overflow-hidden">
              <div className="relative aspect-square bg-muted">
                <img
                  src={generatedImage}
                  alt="Generated artwork"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex items-center justify-between border-t border-border p-4">
                <p className="text-sm text-muted-foreground">
                  Your generated image is ready
                </p>
                <Button onClick={handleDownload} variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </Card>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border bg-muted/50 py-12 md:py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-12 text-center text-3xl font-bold text-foreground">
              Powered by Advanced AI
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">High Quality</h3>
                <p className="text-sm text-muted-foreground">
                  Generate detailed, high-resolution images with Stable Diffusion v2
                </p>
              </Card>
              
              <Card className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Wand2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Fast Generation</h3>
                <p className="text-sm text-muted-foreground">
                  Experience quick image generation powered by optimized AI models
                </p>
              </Card>
              
              <Card className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Download className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Easy Export</h3>
                <p className="text-sm text-muted-foreground">
                  Download your creations instantly in high quality formats
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
