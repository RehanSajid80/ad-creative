
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/input";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe } from "lucide-react";

interface StyleGuideInputProps {
  styleGuide: string;
  onStyleGuideChange: (value: string) => void;
  referenceUrl: string;
  onReferenceUrlChange: (value: string) => void;
}

const StyleGuideInput: React.FC<StyleGuideInputProps> = ({
  styleGuide,
  onStyleGuideChange,
  referenceUrl,
  onReferenceUrlChange
}) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Style Guide & References</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="style-guide">Style Guide</Label>
          <Textarea
            id="style-guide"
            className="style-guide-input"
            placeholder="Enter style guidelines (colors, typography, brand elements, etc.)"
            value={styleGuide}
            onChange={(e) => onStyleGuideChange(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Describe your brand's visual identity, color palette, typography, and any specific style requirements.
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="reference-url">Reference URL (optional)</Label>
          <div className="flex">
            <div className="relative flex-grow">
              <Input
                id="reference-url"
                className="url-input pl-8"
                placeholder="https://example.com"
                value={referenceUrl}
                onChange={(e) => onReferenceUrlChange(e.target.value)}
              />
              <Globe className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Optionally provide a website URL to extract visual style references.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StyleGuideInput;
