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
      
      {/* Boat with transparent input container */}
      <div
        ref={boatRef}
        className="relative mx-4 mb-8"
        style={{
          maxWidth: '600px',
          margin: '0 auto 2rem auto'
        }}
      >
        {/* Boat background visual */}
        <div className="boat-visual absolute inset-0 z-0">
          {/* Boat mast */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 flex items-center z-10">
            <Anchor className="w-5 h-5 text-accent animate-gentle-wave" />
          </div>
          
          {/* Boat hull SVG */}
          <svg 
            viewBox="0 0 400 100" 
            className="w-full h-20 absolute top-0"
            style={{ filter: 'drop-shadow(var(--boat-glow))' }}
          >
            <path
              d="M50 80 Q200 60 350 80 Q350 90 200 95 Q50 90 50 80 Z"
              fill="url(#boatGradient)"
              className="animate-bob"
            />
            <defs>
              <linearGradient id="boatGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--boat))" />
                <stop offset="100%" stopColor="hsl(var(--boat-shadow))" />
              </linearGradient>
            </defs>
            
            {/* Boat details */}
            <circle cx="120" cy="85" r="3" fill="hsl(var(--boat-shadow))" opacity="0.8" />
            <circle cx="280" cy="85" r="3" fill="hsl(var(--boat-shadow))" opacity="0.8" />
          </svg>
        </div>
        
        {/* Transparent input form overlay */}
        <form onSubmit={handleSubmit} className="relative z-10 flex items-center gap-3 p-6 pt-8">
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
                "bg-transparent text-foreground placeholder-foreground/60",
                "border-none outline-none backdrop-blur-sm",
                "scrollbar-thin scrollbar-thumb-accent/20 scrollbar-track-transparent"
              )}
              style={{ maxHeight: '120px' }}
            />
          </div>
          
          <Button
            type="submit"
            size="lg"
            disabled={!message.trim() || disabled}
            className={cn(
              "rounded-full h-12 w-12 p-0 z-20 relative",
              "bg-primary hover:bg-primary/90 text-primary-foreground",
              "shadow-lg hover:shadow-xl transition-all duration-200",
              "disabled:opacity-50 disabled:hover:bg-primary"
            )}
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};