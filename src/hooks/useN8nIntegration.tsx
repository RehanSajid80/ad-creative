import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";

interface N8nPayload {
  uploadedImage: string | null; // Base64 encoded image
  styleGuide: string;
  referenceUrl: string;
  contextMessages: string[];
  styleStrength: number;
  stylePreset: string;
}

export function useN8nIntegration() {
  const [isExporting, setIsExporting] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState<string>('https://analyzelens.app.n8n.cloud/webhook-test/loveable-webhook-trigger');
  const { toast } = useToast();

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const exportToN8n = async (
    imageFile: File | null,
    styleGuide: string,
    referenceUrl: string,
    contextMessages: string[],
    styleStrength: number,
    stylePreset: string
  ) => {
    if (!webhookUrl) {
      toast({
        title: "No webhook URL",
        description: "Please enter an n8n webhook URL to continue.",
        variant: "destructive"
      });
      return;
    }

    setIsExporting(true);
    
    try {
      // Convert image to base64 if available
      let base64Image = null;
      if (imageFile) {
        base64Image = await fileToBase64(imageFile);
      }
      
      // Prepare payload for n8n
      const payload: N8nPayload = {
        uploadedImage: base64Image,
        styleGuide,
        referenceUrl,
        contextMessages,
        styleStrength,
        stylePreset
      };
      
      // Send to n8n webhook
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        mode: 'no-cors' // This might be necessary for cross-origin requests
      });
      
      // Since we're using no-cors, we can't read the response
      // Show a success message instead
      toast({
        title: "Export successful",
        description: "Your creative brief has been sent to n8n for processing with ChatGPT."
      });
      
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to send data to n8n. Please check your webhook URL and try again.",
        variant: "destructive"
      });
      console.error("Error exporting to n8n:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return {
    isExporting,
    webhookUrl,
    setWebhookUrl,
    exportToN8n
  };
}
