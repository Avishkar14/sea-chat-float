import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { BoatInput } from "./BoatInput";
import { OceanBackground } from "./OceanBackground";
import { toast } from "sonner";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const BOT_RESPONSES = [
  "Like a message in a bottle, your thoughts have reached me! 🌊",
  "The ocean whispers back: that's an interesting perspective!",
  "Your words ripple across the digital waves... Let me respond.",
  "The depths of conversation grow deeper with each message.",
  "From one shore to another, communication flows like the tide.",
  "In the vast ocean of knowledge, I've found your message.",
  "The currents of conversation carry us to new horizons.",
  "Like dolphins playing in the waves, let's explore this topic!"
];

export const OceanChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Welcome aboard! I'm your AI companion sailing through the digital seas. What adventures shall we embark on today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: BOT_RESPONSES[Math.floor(Math.random() * BOT_RESPONSES.length)],
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
      toast("Message delivered across the digital ocean!");
    }, 1000 + Math.random() * 2000);
  };

  return (
    <div className="relative h-screen flex flex-col overflow-hidden">
      <OceanBackground />
      
      {/* Header */}
      <header className="relative z-10 p-6 text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Ocean Chat
        </h1>
        <p className="text-surface-foreground/80">
          Navigate the depths of conversation
        </p>
      </header>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-6 relative z-10">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message.text}
              isUser={message.isUser}
              timestamp={message.timestamp}
            />
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="message-bubble bg-message-bot text-message-bot-foreground mr-auto max-w-md rounded-2xl p-4 backdrop-blur-sm border border-white/10">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
                <span className="text-xs opacity-70">Sailing through thoughts...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Boat input at bottom */}
      <div className="relative z-10 pb-6">
        <BoatInput onSendMessage={handleSendMessage} disabled={isTyping} />
      </div>
    </div>
  );
};