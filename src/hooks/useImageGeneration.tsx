
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { GeneratedImage } from '@/components/ResultsGallery';

export function useImageGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const { toast } = useToast();

  // Sample placeholder images
  const placeholderImages = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
    'https://images.unsplash.com/photo-1637858868799-7f26a0640eb6',
    'https://images.unsplash.com/photo-1622737133809-d95047b9e673',
    'https://images.unsplash.com/photo-1632516643720-e7bce6227441',
    'https://images.unsplash.com/photo-1638803040283-7a5ffd48dad5',
  ];

  const generateRandomDescription = () => {
    const adjectives = ['Vibrant', 'Bold', 'Minimalist', 'Modern', 'Elegant', 'Striking'];
    const elements = ['color palette', 'typography', 'composition', 'contrast', 'balance'];
    const effects = ['enhanced', 'refined', 'adjusted', 'optimized', 'transformed'];
    
    return `${adjectives[Math.floor(Math.random() * adjectives.length)]} design with ${
      elements[Math.floor(Math.random() * elements.length)]
    } ${effects[Math.floor(Math.random() * effects.length)]}.`;
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
      // In a real implementation, this would call an actual AI service
      // and pass the contextMessages as well to inform the generation
      console.log("Context messages for generation:", contextMessages);
      
      // For now, we'll simulate the generation with a timeout
      await new Promise((resolve) => setTimeout(resolve, 3000));
      
      // Generate random images
      const newImages: GeneratedImage[] = Array.from({ length: count }).map((_, index) => {
        return {
          id: `img-${Date.now()}-${index}`,
          url: `${placeholderImages[index % placeholderImages.length]}?random=${Date.now() + index}`,
          description: generateRandomDescription()
        };
      });
      
      setGeneratedImages(newImages);
      
      toast({
        title: "Images generated",
        description: `Successfully generated ${count} image variations.`
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

    // In a real implementation, this would download the actual image
    // For this demo, we'll just open the image in a new tab
    window.open(image.url, '_blank');
    
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
      description: "Creating a new variation of this image..."
    });
    
    setIsGenerating(true);
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const randomIndex = Math.floor(Math.random() * placeholderImages.length);
      const updatedImages = generatedImages.map(img => {
        if (img.id === id) {
          return {
            ...img,
            url: `${placeholderImages[randomIndex]}?random=${Date.now()}`,
            description: generateRandomDescription()
          };
        }
        return img;
      });
      
      setGeneratedImages(updatedImages);
      
      toast({
        title: "Image regenerated",
        description: "Successfully created a new variation."
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
