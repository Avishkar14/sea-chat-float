import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send, Anchor } from "lucide-react";
import { cn } from "@/lib/utils";

interface BoatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export const BoatInput = ({ onSendMessage, disabled = false }: BoatInputProps) => {
  const [message, setMessage] = useState("");
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const boatRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
      createRipple();
    }
  };

  const createRipple = () => {
    const boat = boatRef.current;
    if (!boat) return;
    
    const rect = boat.getBoundingClientRect();
    const newRipple = {
      id: Date.now(),
      x: Math.random() * rect.width,
      y: Math.random() * 20 + rect.height - 10
    };
    
    setRipples(prev => [...(prev || []), newRipple]);
    
    setTimeout(() => {
      setRipples(prev => prev?.filter(r => r.id !== newRipple.id) || []);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  }, [message]);

  return (
    <div className="relative">
      {/* Water ripples */}
      {ripples?.map(ripple => (
        <div
          key={ripple.id}
          className="ripple-effect"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: '10px',
            height: '10px'
          }}
        />
      ))}
      
      {/* Boat hull container */}
      <div
        ref={boatRef}
        className="boat-hull relative p-6 mx-4 mb-8"
        style={{
          minHeight: '80px',
          maxWidth: '600px',
          margin: '0 auto 2rem auto'
        }}
      >
        {/* Boat mast indicator */}
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 flex items-center">
          <Anchor className="w-5 h-5 text-accent animate-gentle-wave" />
        </div>
        
        {/* Input form */}
        <form onSubmit={handleSubmit} className="flex items-end gap-3">
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Cast your message into the waters..."
              disabled={disabled}
              rows={1}
              className={cn(
                "w-full resize-none rounded-2xl px-4 py-3",
                "bg-transparent text-boat-foreground placeholder-boat-foreground/60",
                "border-none outline-none",
                "scrollbar-thin scrollbar-thumb-boat-shadow scrollbar-track-transparent"
              )}
              style={{ maxHeight: '120px' }}
            />
          </div>
          
          <Button
            type="submit"
            size="lg"
            disabled={!message.trim() || disabled}
            className={cn(
              "rounded-full h-12 w-12 p-0",
              "bg-primary hover:bg-primary/90 text-primary-foreground",
              "shadow-lg hover:shadow-xl transition-all duration-200",
              "disabled:opacity-50 disabled:hover:bg-primary"
            )}
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
        
        {/* Boat details */}
        <div className="absolute -bottom-2 left-4 w-3 h-8 bg-boat-shadow rounded-full opacity-80" />
        <div className="absolute -bottom-2 right-4 w-3 h-8 bg-boat-shadow rounded-full opacity-80" />
      </div>
    </div>
  );
};