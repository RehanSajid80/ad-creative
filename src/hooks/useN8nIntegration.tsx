
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
  const [webhookUrl, setWebhookUrl] = useState<string>('https://analyzelens.app.n8n.cloud/webhook-test/adcreative-webhook');
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
      
      console.log("Sending payload to n8n:", {
        webhookUrl,
        payloadSize: JSON.stringify(payload).length,
        hasImage: !!base64Image,
        styleGuidePreview: styleGuide.substring(0, 50) + "...",
        messageCount: contextMessages.length
      });
      
      // Test with simplified payload first
      const testPayload = {
        test: true,
        timestamp: new Date().toISOString(),
        message: "Test webhook connection"
      };
      
      console.log("Sending test payload first:", testPayload);
      
      try {
        const testResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(testPayload),
        });
        
        console.log("Test payload response:", {
          status: testResponse.status,
          statusText: testResponse.statusText,
          ok: testResponse.ok
        });
        
        if (testResponse.ok) {
          console.log("Test payload sent successfully, now sending full payload");
          
          const fullResponse = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });
          
          console.log("Full payload response:", {
            status: fullResponse.status,
            statusText: fullResponse.statusText,
            ok: fullResponse.ok
          });
          
          if (fullResponse.ok) {
            toast({
              title: "Export successful",
              description: "Your creative brief has been sent to n8n for processing."
            });
            setIsExporting(false);
            return;
          }
        }
      } catch (error) {
        console.error("Error with direct fetch:", error);
      }
      
      // Try with no-cors as fallback
      console.log("Attempting no-cors mode as fallback");
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        mode: 'no-cors'
      });
      
      console.log("Request sent with no-cors mode");
      toast({
        title: "Export attempted",
        description: "Request sent to n8n webhook. Check your n8n instance to confirm receipt."
      });
      
    } catch (error) {
      console.error("Final error exporting to n8n:", error);
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
