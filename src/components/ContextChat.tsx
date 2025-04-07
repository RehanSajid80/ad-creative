
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Send, TextCursorInput } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  isUser: boolean;
}

interface ContextChatProps {
  onSendMessage?: (message: string) => void;
}

const ContextChat: React.FC<ContextChatProps> = ({ onSendMessage }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-msg",
      text: "Enter text to overlay on your images. Each message will be used as text for a different variation.",
      timestamp: new Date(),
      isUser: false,
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Add user message to chat
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      text: newMessage,
      timestamp: new Date(),
      isUser: true,
    };
    
    setMessages([...messages, userMessage]);
    
    // Call the callback if provided
    if (onSendMessage) {
      onSendMessage(newMessage);
    }
    
    // Add system response
    const systemMessage: Message = {
      id: `msg-sys-${Date.now()}`,
      text: "Text will be applied to your next image generation. Add more text messages for more variations.",
      timestamp: new Date(),
      isUser: false,
    };
    
    setTimeout(() => {
      setMessages(prev => [...prev, systemMessage]);
    }, 300);
    
    // Clear input
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <TextCursorInput className="h-5 w-5 text-primary" />
          <span>Image Text Input</span>
        </CardTitle>
        <CardDescription>
          Enter text phrases to be overlaid on your generated images
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-3">
            {messages.map((message) => (
              <div 
                key={message.id}
                className={`message p-3 rounded-lg ${
                  message.isUser 
                    ? 'bg-primary text-primary-foreground ml-8' 
                    : 'bg-muted text-muted-foreground mr-8'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <div className="text-xs mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      
      <CardFooter>
        <div className="w-full flex gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-grow min-h-[60px] resize-none"
            placeholder="Type text for image overlay..."
          />
          <Button 
            onClick={handleSendMessage} 
            className="self-end"
            disabled={!newMessage.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ContextChat;
