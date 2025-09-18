import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
}

export const ChatMessage = ({ message, isUser, timestamp }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "message-bubble max-w-md rounded-2xl p-4 mb-4 relative",
        isUser
          ? "bg-message-user text-message-user-foreground ml-auto"
          : "bg-message-bot text-message-bot-foreground mr-auto",
        "backdrop-blur-sm border border-white/10"
      )}
    >
      <p className="text-sm leading-relaxed">{message}</p>
      <span className="text-xs opacity-70 mt-2 block">
        {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
      
      {/* Floating bubble effect */}
      <div className="absolute -bottom-2 -left-2 w-3 h-3 rounded-full bg-accent/30 animate-float" />
      <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-accent/20 animate-float" style={{ animationDelay: '0.5s' }} />
    </div>
  );
};