
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";

interface N8nPayload {
  uploadedImage: string | null; // Base64 encoded image
  styleGuide: string;
  referenceUrl: string;
  contextMessages: string[];
  styleStrength: number;
  stylePreset: string;
  variationCount: number;
}

export function useN8nIntegration() {
  type ImageData = {
    url: string;
    revised_prompt: string;
  };
  const [imageList, setImageList] = useState<ImageData[]>([]);

  const [isExporting, setIsExporting] = useState(false);
  // LOCAL TEST WEBHOOK URL
  // const [webhookUrl, setWebhookUrl] = useState<string>('https://analyzelens.app.n8n.cloud/webhook-test/3dce7b94-5633-42e5-917e-906bd9c7eb59');

  // PRODUCTION WEBHOOK URL
  const [webhookUrl, setWebhookUrl] = useState<string>('https://analyzelens.app.n8n.cloud/webhook/3dce7b94-5633-42e5-917e-906bd9c7eb59');
  
  const { toast } = useToast();

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Function to save the image to Supabase
  const saveImageToSupabase = async (imageUrl: string, prompt: string) => {
    // This function would normally connect to Supabase
    // For now, we'll just display a toast message
    
    // In a real implementation, you would:
    // 1. Convert the image from URL to a File object
    // 2. Upload it to Supabase storage
    // 3. Store the metadata in a Supabase database table
    
    toast({
      title: "Supabase Integration Required",
      description: "To save images to a database, please connect this project to Supabase.",
      variant: "destructive"
    });
    
    console.log("Would save to Supabase:", { imageUrl, prompt });
    
    // Return placeholder for now
    return { 
      success: true, 
      imageUrl, 
      saved: new Date().toISOString()
    };
  };

  const exportToN8n = async (
    imageFile: File | null,
    styleGuide: string,
    referenceUrl: string,
    contextMessages: string[],
    styleStrength: number,
    stylePreset: string,
    variationCount : number
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
        stylePreset,
        variationCount
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
        // const testResponse = await fetch(webhookUrl, {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(testPayload),
        // });
        
        // console.log("Test payload response:", {
        //   status: testResponse.status,
        //   statusText: testResponse.statusText,
        //   ok: testResponse.ok
        // });
        
        // if (testResponse.ok) {

          console.log("Test payload sent successfully, now sending full payload");
          setImageList([]);
          const fullResponse = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });

          const responseJson = await fullResponse.json();
          
          // console.log("Full payload response:", {
          //   status: fullResponse.status,
          //   statusText: fullResponse.statusText,
          //   ok: fullResponse.ok
          // });
          console.log(responseJson.images,"responseJson")

          setImageList(responseJson.images)
      
          if (fullResponse.ok) {
            toast({
              title: "Export successful",
              description: "Your creative brief has been sent to n8n for processing."
            });
            setIsExporting(false);
            return;
          }
       // }

      } catch (error) {
        console.error("Error with direct fetch:", error);
      }  
      
      // Try with no-cors as fallback
      // console.log("Attempting no-cors mode as fallback");
      // const testResponse1 =  await fetch(webhookUrl, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(payload),
      //   mode: 'no-cors'
      // });
      // console.log(testResponse1,"testResponse-testResponse");

      
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
    imageList,
    isExporting,
    webhookUrl,
    setWebhookUrl,
    exportToN8n,
    saveImageToSupabase
  };
}
