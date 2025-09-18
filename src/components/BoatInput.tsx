import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send, Anchor } from "lucide-react";
import { cn } from "@/lib/utils";
import boatSilhouette from "@/assets/boat-silhouette.png";

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
      {/* Floating black boat in background */}
      <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 z-0">
        <img 
          src={boatSilhouette} 
          alt="Floating boat" 
          className="w-24 h-24 opacity-30 animate-bob"
        />
      </div>
      
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
      
      {/* Golden boat hull input container */}
      <div
        ref={boatRef}
        className="relative p-6 mx-4 mb-8 z-10"
        style={{
          minHeight: '80px',
          maxWidth: '600px',
          margin: '0 auto 2rem auto',
          background: 'linear-gradient(135deg, #D4A574 0%, #B8956A 50%, #D4A574 100%)',
          borderRadius: '50px 50px 30px 30px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 2px 8px rgba(255, 255, 255, 0.2)'
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
                "bg-transparent text-gray-800 placeholder-gray-600",
                "border-none outline-none",
                "scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent"
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
        
        {/* Golden boat hull details */}
        <div className="absolute -bottom-3 left-6 w-4 h-6 bg-amber-700 rounded-full opacity-60" />
        <div className="absolute -bottom-3 right-6 w-4 h-6 bg-amber-700 rounded-full opacity-60" />
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-3 bg-amber-800 rounded-full opacity-40" />
      </div>
    </div>
  );
};