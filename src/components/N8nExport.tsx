
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExternalLink, Loader2, SendToBack } from "lucide-react";

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
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <ExternalLink className="h-5 w-5 text-primary" />
          <span>n8n Integration</span>
        </CardTitle>
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
            Enter your n8n webhook URL to send the image, style guide, and conversation context to ChatGPT for enhanced creative suggestions.
          </p>
        </div>
      </CardContent>
      
      <CardFooter>
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
      </CardFooter>
    </Card>
  );
};

export default N8nExport;
