"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Download, ImageIcon } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

type ImageAsset = {
  src: string
  alt: string
  selected: boolean
  filename: string
}

export default function SourceCodeConverter() {
  const [sourceCode, setSourceCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [imageAssets, setImageAssets] = useState<ImageAsset[]>([])
  const [activeTab, setActiveTab] = useState("preview")

  const extractImageAssets = (html: string) => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, "text/html")
    const images = Array.from(doc.querySelectorAll("img"))

    return images.map((img) => {
      const src = img.getAttribute("src") || ""
      const alt = img.getAttribute("alt") || "Image"
      const filename = src.split("/").pop() || `image-${Math.random().toString(36).substring(2, 10)}.jpg`

      return {
        src,
        alt,
        selected: true,
        filename,
      }
    })
  }

  const handleConvert = () => {
    try {
      // Basic validation
      if (!sourceCode.trim()) {
        throw new Error("Please enter some HTML source code.")
      }

      // Extract image assets
      const assets = extractImageAssets(sourceCode)
      setImageAssets(assets)

      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.")
    }
  }

  const toggleImageSelection = (index: number) => {
    setImageAssets((prev) => prev.map((asset, i) => (i === index ? { ...asset, selected: !asset.selected } : asset)))
  }

  const selectAllImages = (selected: boolean) => {
    setImageAssets((prev) => prev.map((asset) => ({ ...asset, selected })))
  }

  const downloadSelectedImages = async () => {
    const selectedImages = imageAssets.filter((asset) => asset.selected)

    if (selectedImages.length === 0) {
      setError("Please select at least one image to download.")
      return
    }

    try {
      for (const image of selectedImages) {
        // Handle both absolute and relative URLs
        const imageUrl = image.src
        if (!imageUrl.startsWith("http") && !imageUrl.startsWith("data:")) {
          // For demo purposes, we'll skip images that can't be fetched directly
          if (imageUrl.startsWith("/")) {
            // This is a relative URL from the root
            continue
          }
        }

        try {
          const response = await fetch(imageUrl)
          const blob = await response.blob()

          // Create a download link
          const link = document.createElement("a")
          link.href = URL.createObjectURL(blob)
          link.download = image.filename
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)

          // Clean up the URL object
          URL.revokeObjectURL(link.href)
        } catch (err) {
          console.error(`Failed to download image: ${imageUrl}`, err)
          // Continue with other images even if one fails
        }
      }
    } catch (err) {
      setError("Failed to download some images. Check console for details.")
    }
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Textarea
            placeholder="Paste your HTML source code here..."
            value={sourceCode}
            onChange={(e) => setSourceCode(e.target.value)}
            className="h-[calc(100vh-300px)] min-h-[300px] font-mono"
          />
          <Button onClick={handleConvert} className="mt-2">
            Convert
          </Button>
        </div>
        <div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="images">
                Images
                {imageAssets.length > 0 && (
                  <span className="ml-2 rounded-full bg-primary text-primary-foreground px-2 py-0.5 text-xs">
                    {imageAssets.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="preview">
              <Card className="h-[calc(100vh-350px)] min-h-[300px] overflow-auto">
                {error ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ) : (
                  <iframe
                    srcDoc={sourceCode}
                    title="Rendered HTML"
                    className="w-full h-full border-0"
                    sandbox="allow-scripts"
                  />
                )}
              </Card>
            </TabsContent>
            <TabsContent value="images">
              <Card className="h-[calc(100vh-350px)] min-h-[300px] overflow-hidden">
                {imageAssets.length > 0 ? (
                  <div className="p-4 h-full flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="select-all"
                          checked={imageAssets.every((asset) => asset.selected)}
                          onCheckedChange={(checked) => selectAllImages(!!checked)}
                        />
                        <Label htmlFor="select-all">Select All</Label>
                      </div>
                      <Button onClick={downloadSelectedImages} disabled={!imageAssets.some((asset) => asset.selected)}>
                        <Download className="h-4 w-4 mr-2" />
                        Download Selected
                      </Button>
                    </div>
                    <ScrollArea className="flex-1">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {imageAssets.map((asset, index) => (
                          <div key={index} className="border rounded-md p-2 flex flex-col">
                            <div className="flex items-start mb-2">
                              <Checkbox
                                id={`image-${index}`}
                                checked={asset.selected}
                                onCheckedChange={() => toggleImageSelection(index)}
                                className="mr-2 mt-1"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{asset.filename}</p>
                                <p className="text-xs text-muted-foreground truncate">{asset.src}</p>
                              </div>
                            </div>
                            <div className="h-24 bg-muted rounded flex items-center justify-center overflow-hidden">
                              {asset.src ? (
                                <img
                                  src={asset.src || "/placeholder.svg"}
                                  alt={asset.alt}
                                  className="max-h-full max-w-full object-contain"
                                  onError={(e) => {
                                    e.currentTarget.src = ""
                                    e.currentTarget.alt = "Failed to load image"
                                    e.currentTarget.parentElement?.classList.add("bg-destructive/10")
                                  }}
                                />
                              ) : (
                                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-4">
                    <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground text-center">
                      No images found in the source code. Convert HTML to see available images.
                    </p>
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

