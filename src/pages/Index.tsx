import React, { useState } from 'react';
import ImageUploader from '@/components/ImageUploader';
import StyleGuideInput from '@/components/StyleGuideInput';
import ResultsGallery from '@/components/ResultsGallery';
import GenerationControls from '@/components/GenerationControls';
import ContextChat from '@/components/ContextChat';
import { useImageGeneration } from '@/hooks/useImageGeneration';
import { useN8nIntegration } from '@/hooks/useN8nIntegration';
import { Toaster } from "@/components/ui/toaster";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wand2, Image as ImageIcon, PaintBucket, MessageCircle } from "lucide-react";

const Index = () => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [styleGuide, setStyleGuide] = useState('');
  const [referenceUrl, setReferenceUrl] = useState('');
  const [variationCount, setVariationCount] = useState(3);
  const [styleStrength, setStyleStrength] = useState(70);
  const [selectedStyle, setSelectedStyle] = useState('balanced');
  const [contextMessages, setContextMessages] = useState<string[]>([]);
  const [genratedimageList, setgenratedimageList] = useState("");

  const {
    isGenerating,
    generatedImages,
    generateImages,
    handleLike,
    handleDislike,
    handleDownload,
    handleRegenerate
  } = useImageGeneration();

  const {
    imageList,
    isExporting,
    webhookUrl,
    setWebhookUrl,
    exportToN8n
  } = useN8nIntegration();

  const handleImageUpload = (file: File | null) => {
    setUploadedImage(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  const handleGenerate = () => {
    generateImages(
      uploadedImage,
      styleGuide,
      referenceUrl,
      variationCount,
      styleStrength,
      selectedStyle,
      contextMessages
    );

    if (webhookUrl && webhookUrl.trim() !== '') {
      exportToN8n(
        uploadedImage,
        styleGuide,
        referenceUrl,
        contextMessages,
        styleStrength,
        selectedStyle,
        variationCount
      );
    }
  };

  const handleContextMessage = (message: string) => {
    setContextMessages([...contextMessages, message]);
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/da1dcfbd-82a4-4a6d-8595-33adcf5b087e.png" 
              alt="Logo" 
              className="h-10 w-auto"
            />
            <div>
              <h1 className="text-[#1a2b3d] text-2xl font-semibold">
                Generate AI-Powered Ads
              </h1>
              <p className="text-[#486581] text-sm mt-1">
                Upload an image, provide context, and let our AI create compelling ad suggestions for your campaigns.
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  <span>Upload Image</span>
                </TabsTrigger>
                <TabsTrigger value="results" className="flex items-center gap-2">
                  <PaintBucket className="h-4 w-4" />
                  <span>Results</span>
                </TabsTrigger>
                <TabsTrigger value="chat" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  <span>Context Chat</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload" className="space-y-6">
                <ImageUploader 
                  onImageUploaded={handleImageUpload}
                  previewUrl={imagePreview}
                />
                <StyleGuideInput
                  styleGuide={styleGuide}
                  onStyleGuideChange={setStyleGuide}
                  referenceUrl={referenceUrl}
                  onReferenceUrlChange={setReferenceUrl}
                />
              </TabsContent>
              
              <TabsContent value="results">
                <ResultsGallery
                  genratedimageList = {imageList}
                  images={generatedImages}
                  isLoading={isGenerating}
                  onLike={handleLike}
                  onDislike={handleDislike}
                  onDownload={handleDownload}
                  onRegenerate={handleRegenerate}
                />
              </TabsContent>

              <TabsContent value="chat">
                <ContextChat onSendMessage={handleContextMessage} />
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Wand2 className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold text-[#1a2b3d]">Generation Controls</h2>
              </div>
              <GenerationControls
                onGenerate={handleGenerate}
                isGenerating={isGenerating || isExporting}
                hasUploadedImage={!!uploadedImage}
                variationCount={variationCount}
                onVariationCountChange={setVariationCount}
                styleStrength={styleStrength}
                onStyleStrengthChange={setStyleStrength}
                selectedStyle={selectedStyle}
                onStyleChange={setSelectedStyle}
                webhookUrl={webhookUrl}
                onWebhookUrlChange={setWebhookUrl}
              />
              
              <div className="bg-muted rounded-lg p-4">
                <h3 className="font-medium mb-2">How it works</h3>
                <ol className="list-decimal ml-5 space-y-1 text-sm text-muted-foreground">
                  <li>Upload your image</li>
                  <li>Enter style guidelines and optional reference URL</li>
                  <li>Use the context chat to describe enhancement ideas</li>
                  <li>Configure the n8n webhook URL (optional)</li>
                  <li>Adjust generation controls</li>
                  <li>Generate variations and provide feedback</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default Index;
