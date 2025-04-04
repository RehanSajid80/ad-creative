
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
    console.log("Attempting to send data to webhook:", webhookUrl);
    console.log("Payload preview:", { 
      hasImage: !!imageFile, 
      styleGuide: styleGuide.substring(0, 20) + "...", 
      contextMessages 
    });
    
    try {
      // Convert image to base64 if available
      let base64Image = null;
      if (imageFile) {
        base64Image = await fileToBase64(imageFile);
        console.log("Image converted to base64 successfully");
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
      
      // Send to n8n webhook using fetch with mode: 'cors'
      console.log("Sending payload to webhook...");
      
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        // Try with cors mode first, since no-cors limits functionality
        mode: 'cors'
      }).catch(async (corsError) => {
        console.log("CORS error, trying with no-cors mode", corsError);
        // Fallback to no-cors if cors fails
        return fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          mode: 'no-cors'
        });
      });
      
      console.log("Request sent successfully");
      
      toast({
        title: "Export successful",
        description: "Your creative brief has been sent to n8n for processing with ChatGPT."
      });
      
    } catch (error) {
      console.error("Error exporting to n8n:", error);
      toast({
        title: "Export failed",
        description: "Failed to send data to n8n. Please check your webhook URL and try again.",
        variant: "destructive"
      });
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
