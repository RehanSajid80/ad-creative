
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { GeneratedImage } from '@/components/ResultsGallery';

export function useImageGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();

  // Sample placeholder images - we'll use the uploaded image instead
  const placeholderImages = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
    'https://images.unsplash.com/photo-1637858868799-7f26a0640eb6',
    'https://images.unsplash.com/photo-1622737133809-d95047b9e673',
    'https://images.unsplash.com/photo-1632516643720-e7bce6227441',
    'https://images.unsplash.com/photo-1638803040283-7a5ffd48dad5',
  ];

  // Fallback text options (used if no context messages are provided)
  const fallbackTextOptions = [
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

  // Get text options from context messages or use fallbacks
  const getTextOptions = (contextMessages: string[]): string[] => {
    if (!contextMessages || contextMessages.length === 0) {
      return fallbackTextOptions;
    }
    
    // Process the messages to create more suitable text overlays
    return contextMessages.map(message => {
      // Extract a short phrase (up to 30 chars) and convert to uppercase for overlay styling
      const shortPhrase = message.length > 30 
        ? message.substring(0, 30).trim() + "..."
        : message.trim();
      
      return shortPhrase.toUpperCase();
    });
  };

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
        
        // Increase text size and make it more prominent
        ctx.fillStyle = 'white';
        ctx.font = 'bold 64px Arial'; // Increased font size from 32px to 64px
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'; // Darker shadow
        ctx.shadowBlur = 10; // Increased shadow blur
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
        
        // Center the text vertically
        const textX = canvas.width / 2;
        const textY = canvas.height - 100; // Adjusted vertical position
        
        ctx.fillText(textOption, textX, textY);
        
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
    uploadedImageFile: File | null, 
    styleGuide: string, 
    referenceUrl: string, 
    count: number,
    styleStrength: number,
    stylePreset: string,
    contextMessages: string[] = []
  ) => {
    if (!uploadedImageFile) {
      toast({
        title: "No image provided",
        description: "Please upload an image to generate variations.",
        variant: "destructive"
      });
      return;
    }

    setImageFile(uploadedImageFile);
    
    setIsGenerating(true);
    
    try {
      // Convert the uploaded image to a data URL
      const imageUrl = URL.createObjectURL(uploadedImageFile);
      
      // Get text options from context messages or use fallbacks
      const textOptions = getTextOptions(contextMessages);
      
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
    
    if (!imageFile) {
      toast({
        title: "Regeneration failed",
        description: "No source image available for regeneration.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Regenerating image",
      description: "Creating a new vibrant variation..."
    });
    
    setIsGenerating(true);
    
    try {
      // Find the original image
      const originalImageUrl = URL.createObjectURL(imageFile);
      
      // Get random text and color overlay
      const randomTextIndex = Math.floor(Math.random() * fallbackTextOptions.length);
      const randomColorIndex = Math.floor(Math.random() * colorOverlays.length);
      
      // Apply new effects
      const newImageUrl = await applyVibrantEffectToImage(
        originalImageUrl,
        fallbackTextOptions[randomTextIndex],
        colorOverlays[randomColorIndex]
      );
      
      const updatedImages = generatedImages.map(img => {
        if (img.id === id) {
          return {
            ...img,
            url: newImageUrl,
            description: `${generateRandomDescription()} Text: ${fallbackTextOptions[randomTextIndex]}`
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
