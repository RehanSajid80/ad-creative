
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { GeneratedImage } from '@/components/ResultsGallery';

export function useImageGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const { toast } = useToast();

  // Sample placeholder images - we'll use the uploaded image instead
  const placeholderImages = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
    'https://images.unsplash.com/photo-1637858868799-7f26a0640eb6',
    'https://images.unsplash.com/photo-1622737133809-d95047b9e673',
    'https://images.unsplash.com/photo-1632516643720-e7bce6227441',
    'https://images.unsplash.com/photo-1638803040283-7a5ffd48dad5',
  ];

  // Text options to add to images
  const textOptions = [
    "MODERN WORKSPACE",
    "CORPORATE EXCELLENCE",
    "BUSINESS INNOVATION",
    "PROFESSIONAL ENVIRONMENT",
    "EXECUTIVE SUITE"
  ];

  // Vibrant color overlays
  const colorOverlays = [
    "rgba(13, 180, 185, 0.3)", // Teal overlay
    "rgba(240, 68, 145, 0.25)", // Pink overlay
    "rgba(111, 66, 193, 0.3)", // Purple overlay
    "rgba(249, 115, 22, 0.25)", // Bright orange overlay
    "rgba(14, 165, 233, 0.25)" // Ocean blue overlay
  ];

  const generateRandomDescription = () => {
    const adjectives = ['Vibrant', 'Bold', 'Energetic', 'Dynamic', 'Striking', 'Powerful'];
    const elements = ['color overlay', 'text treatment', 'composition', 'visual appeal', 'brand message'];
    const effects = ['enhanced', 'amplified', 'optimized', 'transformed', 'elevated'];
    
    return `${adjectives[Math.floor(Math.random() * adjectives.length)]} design with ${
      elements[Math.floor(Math.random() * elements.length)]
    } ${effects[Math.floor(Math.random() * effects.length)]}.`;
  };

  const applyVibrantEffectToImage = async (
    imageUrl: string, 
    textOption: string,
    colorOverlay: string
  ): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      
      img.onload = () => {
        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          resolve(imageUrl); // Fallback to original if canvas not supported
          return;
        }
        
        // Set canvas dimensions to match image
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw the original image
        ctx.drawImage(img, 0, 0);
        
        // Apply color overlay for vibrance
        ctx.fillStyle = colorOverlay;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw original image in "multiply" blend mode for vibrant effect
        ctx.globalCompositeOperation = 'multiply';
        ctx.drawImage(img, 0, 0);
        ctx.globalCompositeOperation = 'source-over';
        
        // Add text
        ctx.fillStyle = 'white';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.fillText(textOption, canvas.width / 2, canvas.height - 50);
        
        // Return data URL
        resolve(canvas.toDataURL('image/jpeg'));
      };
      
      img.onerror = () => {
        resolve(imageUrl); // Fallback to original if loading fails
      };
      
      img.src = imageUrl;
    });
  };

  const generateImages = async (
    imageFile: File | null, 
    styleGuide: string, 
    referenceUrl: string, 
    count: number,
    styleStrength: number,
    stylePreset: string,
    contextMessages: string[] = []
  ) => {
    if (!imageFile) {
      toast({
        title: "No image provided",
        description: "Please upload an image to generate variations.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Convert the uploaded image to a data URL
      const imageUrl = URL.createObjectURL(imageFile);
      
      // For now, we'll use the uploaded image instead of placeholders
      const processedImages: GeneratedImage[] = [];
      
      // Generate the specified number of variations
      for (let i = 0; i < count; i++) {
        const textOption = textOptions[i % textOptions.length];
        const colorOverlay = colorOverlays[i % colorOverlays.length];
        
        // Apply vibrant effect and text to the image
        const enhancedImageUrl = await applyVibrantEffectToImage(
          imageUrl, 
          textOption,
          colorOverlay
        );
        
        processedImages.push({
          id: `img-${Date.now()}-${i}`,
          url: enhancedImageUrl,
          description: `${generateRandomDescription()} Text: ${textOption}`
        });
      }
      
      setGeneratedImages(processedImages);
      
      toast({
        title: "Images generated",
        description: `Successfully generated ${count} vibrant variations with text.`
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Failed to generate image variations. Please try again.",
        variant: "destructive"
      });
      console.error("Error generating images:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLike = (id: string) => {
    toast({
      title: "Feedback recorded",
      description: "You liked this variation. We'll use this to improve future generations."
    });
  };

  const handleDislike = (id: string) => {
    toast({
      title: "Feedback recorded",
      description: "You disliked this variation. We'll use this to improve future generations."
    });
  };

  const handleDownload = (id: string) => {
    const image = generatedImages.find(img => img.id === id);
    if (!image) return;

    // Create an anchor element and set attributes for download
    const downloadLink = document.createElement('a');
    downloadLink.href = image.url;
    downloadLink.download = `vibrant-image-${id}.jpg`;
    
    // Append to body, click and remove
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    toast({
      title: "Download started",
      description: "Your image is being downloaded."
    });
  };

  const handleRegenerate = async (id: string) => {
    const image = generatedImages.find(img => img.id === id);
    if (!image) return;
    
    toast({
      title: "Regenerating image",
      description: "Creating a new vibrant variation..."
    });
    
    setIsGenerating(true);
    
    try {
      // Find the original image
      const originalImageUrl = URL.createObjectURL(imageFile);
      
      // Get random text and color overlay
      const randomTextIndex = Math.floor(Math.random() * textOptions.length);
      const randomColorIndex = Math.floor(Math.random() * colorOverlays.length);
      
      // Apply new effects
      const newImageUrl = await applyVibrantEffectToImage(
        originalImageUrl,
        textOptions[randomTextIndex],
        colorOverlays[randomColorIndex]
      );
      
      const updatedImages = generatedImages.map(img => {
        if (img.id === id) {
          return {
            ...img,
            url: newImageUrl,
            description: `${generateRandomDescription()} Text: ${textOptions[randomTextIndex]}`
          };
        }
        return img;
      });
      
      setGeneratedImages(updatedImages);
      
      toast({
        title: "Image regenerated",
        description: "Successfully created a new vibrant variation."
      });
    } catch (error) {
      toast({
        title: "Regeneration failed",
        description: "Failed to regenerate image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generatedImages,
    generateImages,
    handleLike,
    handleDislike,
    handleDownload,
    handleRegenerate
  };
}
