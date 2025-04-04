
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { 
  Wand2, 
  RefreshCw, 
  Loader2,
  Sliders
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  onStyleChange
}) => {
  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
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
            <Label htmlFor="style-strength">Style Strength</Label>
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
          <Label htmlFor="style-preset">Style Preset</Label>
          <Select
            value={selectedStyle}
            onValueChange={onStyleChange}
            disabled={isGenerating}
          >
            <SelectTrigger id="style-preset" className="w-full">
              <SelectValue placeholder="Select a style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="balanced">Balanced</SelectItem>
              <SelectItem value="vibrant">Vibrant</SelectItem>
              <SelectItem value="minimal">Minimal</SelectItem>
              <SelectItem value="corporate">Corporate</SelectItem>
              <SelectItem value="artistic">Artistic</SelectItem>
            </SelectContent>
          </Select>
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
              <span>Generating...</span>
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
