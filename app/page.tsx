'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { Sparkles, Wand2, Download, Image as ImageIcon, Settings2 } from 'lucide-react'

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [negativePrompt, setNegativePrompt] = useState('')
  const [guidanceScale, setGuidanceScale] = useState([7.5])
  const [steps, setSteps] = useState([20])
  const [seed, setSeed] = useState('1000000')
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    
    setIsGenerating(true)
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt,
          negativePrompt,
          guidanceScale: guidanceScale[0],
          steps: steps[0],
          seed: parseInt(seed) || 1000000
        }),
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
          <Tabs defaultValue="text-to-image" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="text-to-image">
                <Wand2 className="mr-2 h-4 w-4" />
                Text to Image
              </TabsTrigger>
              <TabsTrigger value="image-to-image">
                <ImageIcon className="mr-2 h-4 w-4" />
                Image to Image
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text-to-image">
              <Card className="p-6 md:p-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="prompt">Prompt</Label>
                    <Textarea
                      id="prompt"
                      placeholder="a photo of an astronaut riding a horse on mars"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="min-h-24 resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="negative-prompt">Negative Prompt (optional)</Label>
                    <Textarea
                      id="negative-prompt"
                      placeholder="blurry, low quality, distorted"
                      value={negativePrompt}
                      onChange={(e) => setNegativePrompt(e.target.value)}
                      className="min-h-16 resize-none"
                    />
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="w-full"
                  >
                    <Settings2 className="mr-2 h-4 w-4" />
                    {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
                  </Button>

                  {showAdvanced && (
                    <div className="space-y-6 rounded-lg border border-border bg-muted/50 p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="guidance">Guidance Scale</Label>
                          <span className="text-sm text-muted-foreground">{guidanceScale[0]}</span>
                        </div>
                        <Slider
                          id="guidance"
                          min={1}
                          max={20}
                          step={0.5}
                          value={guidanceScale}
                          onValueChange={setGuidanceScale}
                        />
                        <p className="text-xs text-muted-foreground">Higher values stick closer to the prompt</p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="steps">Steps</Label>
                          <span className="text-sm text-muted-foreground">{steps[0]}</span>
                        </div>
                        <Slider
                          id="steps"
                          min={10}
                          max={50}
                          step={5}
                          value={steps}
                          onValueChange={setSteps}
                        />
                        <p className="text-xs text-muted-foreground">More steps = better quality but slower</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="seed">Seed</Label>
                        <Input
                          id="seed"
                          type="number"
                          placeholder="1000000"
                          value={seed}
                          onChange={(e) => setSeed(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">Use the same seed for consistent results</p>
                      </div>
                    </div>
                  )}

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
            </TabsContent>

            <TabsContent value="image-to-image">
              <Card className="p-6 md:p-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Start Image</Label>
                    <div className="rounded-lg border-2 border-dashed border-border bg-muted/50 p-8 text-center">
                      <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Image-to-image generation coming soon
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="img2img-prompt">Prompt</Label>
                    <Textarea
                      id="img2img-prompt"
                      placeholder="Describe how to modify the image..."
                      className="min-h-24 resize-none"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Strength</Label>
                      <span className="text-sm text-muted-foreground">0.5</span>
                    </div>
                    <Slider
                      min={0}
                      max={1}
                      step={0.1}
                      defaultValue={[0.5]}
                    />
                    <p className="text-xs text-muted-foreground">
                      How much to transform the original image (0.0 - 1.0)
                    </p>
                  </div>

                  <Button
                    disabled
                    className="w-full"
                    size="lg"
                  >
                    <Wand2 className="mr-2 h-5 w-5" />
                    Generate (Coming Soon)
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>

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
