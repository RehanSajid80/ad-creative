
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExternalLink, Loader2, SendToBack, InfoIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";

interface N8nExportProps {
  webhookUrl: string;
  onWebhookUrlChange: (url: string) => void;
  onExport: () => void;
  isExporting: boolean;
  hasUploadedImage: boolean;
}

const N8nExport: React.FC<N8nExportProps> = ({
  webhookUrl,
  onWebhookUrlChange,
  onExport,
  isExporting,
  hasUploadedImage
}) => {
  const { toast } = useToast();
  
  // Sample JSON to show in the tooltip
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
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <ExternalLink className="h-5 w-5 text-primary" />
          <span>n8n Integration</span>
        </CardTitle>
        <CardDescription>
          Send your creative brief to n8n for advanced processing with AI
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="webhook-url">n8n Webhook URL</Label>
          <Input
            id="webhook-url"
            placeholder="https://your-n8n-instance.com/webhook/..."
            value={webhookUrl}
            onChange={(e) => onWebhookUrlChange(e.target.value)}
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            Current webhook URL: <span className="font-medium">{webhookUrl || "None set"}</span>
          </p>
          <p className="text-xs text-muted-foreground">
            Enter your n8n webhook URL to send the image, style guide, and conversation context to ChatGPT for enhanced creative suggestions.
          </p>
        </div>
        
        {!hasUploadedImage && (
          <Alert variant="destructive">
            <AlertDescription>
              You need to upload an image first before exporting to n8n.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="bg-muted p-3 rounded-md">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium">JSON Payload Structure</h4>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={copyJsonStructure}
              className="h-7 px-2"
            >
              Copy
            </Button>
          </div>
          <pre className="text-xs bg-background p-2 rounded border overflow-auto max-h-36">
            {sampleJson}
          </pre>
          <p className="text-xs text-muted-foreground mt-2">
            Use this structure to configure your n8n workflow nodes.
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="flex-col space-y-2">
        <Button 
          onClick={onExport} 
          disabled={!webhookUrl || isExporting || !hasUploadedImage}
          className="w-full gap-2"
        >
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <SendToBack className="h-4 w-4" />
              <span>Export to n8n + ChatGPT</span>
            </>
          )}
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          Testing webhook: {webhookUrl}
        </p>
      </CardFooter>
    </Card>
  );
};

export default N8nExport;
