
import React, { useState } from 'react';
import ImageUploader from '@/components/ImageUploader';
import StyleGuideInput from '@/components/StyleGuideInput';
import ResultsGallery from '@/components/ResultsGallery';
import GenerationControls from '@/components/GenerationControls';
import ContextChat from '@/components/ContextChat';
import N8nExport from '@/components/N8nExport';
import { useImageGeneration } from '@/hooks/useImageGeneration';
import { useN8nIntegration } from '@/hooks/useN8nIntegration';
import { Toaster } from "@/components/ui/toaster";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wand2, Image as ImageIcon, PaintBucket, ScanSearch, MessageCircle, ExternalLink } from "lucide-react";

const Index = () => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [styleGuide, setStyleGuide] = useState('');
  const [referenceUrl, setReferenceUrl] = useState('');
  const [variationCount, setVariationCount] = useState(3);
  const [styleStrength, setStyleStrength] = useState(70);
  const [selectedStyle, setSelectedStyle] = useState('balanced');
  const [contextMessages, setContextMessages] = useState<string[]>([]);
  
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
  };

  const handleContextMessage = (message: string) => {
    setContextMessages([...contextMessages, message]);
    // In a real implementation, this could trigger additional AI processing
    // or be stored for the next generation cycle
  };

  const handleExportToN8n = () => {
    exportToN8n(
      uploadedImage,
      styleGuide,
      referenceUrl,
      contextMessages,
      styleStrength,
      selectedStyle
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <ScanSearch className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            AnalyzeLens
          </h1>
        </div>
        <p className="text-muted-foreground mt-2">
          Transform your images with AI-powered style analysis
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
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
              <TabsTrigger value="n8n" className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                <span>n8n Export</span>
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

            <TabsContent value="n8n">
              <N8nExport 
                webhookUrl={webhookUrl}
                onWebhookUrlChange={setWebhookUrl}
                onExport={handleExportToN8n}
                isExporting={isExporting}
                hasUploadedImage={!!uploadedImage}
              />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Wand2 className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Generation Controls</h2>
            </div>
            <GenerationControls
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              hasUploadedImage={!!uploadedImage}
              variationCount={variationCount}
              onVariationCountChange={setVariationCount}
              styleStrength={styleStrength}
              onStyleStrengthChange={setStyleStrength}
              selectedStyle={selectedStyle}
              onStyleChange={setSelectedStyle}
            />
            
            <div className="bg-muted rounded-lg p-4">
              <h3 className="font-medium mb-2">How it works</h3>
              <ol className="list-decimal ml-5 space-y-1 text-sm text-muted-foreground">
                <li>Upload your image</li>
                <li>Enter style guidelines and optional reference URL</li>
                <li>Use the context chat to describe enhancement ideas</li>
                <li>Adjust generation controls</li>
                <li>Generate variations and provide feedback</li>
                <li>Or export to n8n + ChatGPT for advanced processing</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Index;
