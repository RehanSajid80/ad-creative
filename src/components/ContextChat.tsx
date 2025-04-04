
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Send } from "lucide-react";

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
      text: "Welcome! Share your thoughts on the images or describe what enhancements you'd like to see.",
      timestamp: new Date(),
      isUser: false,
    }
  ]);
  const [newMessage, setNewMessage] = useState("");

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
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          <span>Context Chat</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="messages-container max-h-[300px] overflow-y-auto space-y-3 p-1">
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
        </div>
      </CardContent>
      
      <CardFooter>
        <div className="w-full flex gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-grow min-h-[60px] resize-none"
            placeholder="Type your message here..."
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
