
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { 
  Wand2, 
  Loader2,
  Sliders,
  InfoIcon,
  Sparkles,
  TextCursorInput,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";

interface GenerationControlsProps {
  onGenerate: () => void;
  isGenerating: boolean;
  hasUploadedImage: boolean;
  variationCount: number;
  onVariationCountChange: (value: number) => void;
  styleStrength: number;
  onStyleStrengthChange: (value: number) => void;
  selectedStyle: string;
  onStyleChange: (value: string) => void;
  webhookUrl: string;
  onWebhookUrlChange: (url: string) => void;
}

const GenerationControls: React.FC<GenerationControlsProps> = ({
  onGenerate,
  isGenerating,
  hasUploadedImage,
  variationCount,
  onVariationCountChange,
  styleStrength,
  onStyleStrengthChange,
  selectedStyle,
  onStyleChange,
  webhookUrl,
  onWebhookUrlChange
}) => {
  const { toast } = useToast();

  // Sample JSON to show in the tooltip for n8n webhook configuration
  const sampleJson = `{
  "uploadedImage": "base64_encoded_image_data",
  "styleGuide": "Modern minimalist design...",
  "referenceUrl": "https://example.com/brand",
  "contextMessages": ["Target audience...", "..."],
  "styleStrength": 70,
  "stylePreset": "balanced"
}`;

  const copyJsonStructure = () => {
    navigator.clipboard.writeText(sampleJson);
    toast({
      title: "Copied to clipboard",
      description: "The JSON structure has been copied to your clipboard."
    });
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          Vibrant Text Generator
        </CardTitle>
        <CardDescription>
          Create colorful variations of your image with custom text
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-2 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="variation-count">Number of Variations</Label>
            <span className="text-sm font-medium">{variationCount}</span>
          </div>
          <Slider
            id="variation-count"
            min={1}
            max={5}
            step={1}
            value={[variationCount]}
            onValueChange={(value) => onVariationCountChange(value[0])}
            disabled={isGenerating}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="style-strength">Color Intensity</Label>
            <span className="text-sm font-medium">{styleStrength}%</span>
          </div>
          <Slider
            id="style-strength"
            min={20}
            max={100}
            step={5}
            value={[styleStrength]}
            onValueChange={(value) => onStyleStrengthChange(value[0])}
            disabled={isGenerating}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="style-preset" className="flex items-center gap-2">
            <TextCursorInput className="h-4 w-4 text-muted-foreground" />
            Text Style
          </Label>
          <Select
            value={selectedStyle}
            onValueChange={onStyleChange}
            disabled={isGenerating}
          >
            <SelectTrigger id="style-preset" className="w-full">
              <SelectValue placeholder="Select text style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vibrant">Vibrant</SelectItem>
              <SelectItem value="bold">Bold</SelectItem>
              <SelectItem value="minimal">Minimal</SelectItem>
              <SelectItem value="corporate">Corporate</SelectItem>
              <SelectItem value="artistic">Artistic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="webhook-url" className="flex items-center gap-1">
              n8n Webhook URL
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-[300px]">
                    <p className="text-xs mb-1">Optional: Enter n8n webhook URL to send data to ChatGPT</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={copyJsonStructure}
              className="h-6 px-2 text-xs"
            >
              Copy JSON
            </Button>
          </div>
          <Input
            id="webhook-url"
            placeholder="https://your-n8n-instance.com/webhook/..."
            value={webhookUrl}
            onChange={(e) => onWebhookUrlChange(e.target.value)}
            className="font-mono text-xs"
            disabled={isGenerating}
          />
          {webhookUrl && (
            <p className="text-xs text-muted-foreground">
              Data will be sent to n8n when generating
            </p>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="secondary"
          size="sm"
          className="gap-1"
          disabled={!hasUploadedImage || isGenerating}
        >
          <Sliders className="h-4 w-4" />
          <span>Advanced</span>
        </Button>
        
        <Button 
          onClick={onGenerate}
          disabled={!hasUploadedImage || isGenerating}
          className="gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4" />
              <span>Generate</span>
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GenerationControls;
