import { useEffect, useState } from "react";

export const OceanBackground = () => {
  const [waves, setWaves] = useState<{ id: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    // Create animated wave layers
    const waveData = Array.from({ length: 3 }, (_, i) => ({
      id: i,
      delay: i * 0.5,
      duration: 6 + i * 2
    }));
    setWaves(waveData);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 water-surface">
      {/* Animated wave layers */}
      {waves.map((wave) => (
        <div
          key={wave.id}
          className="absolute inset-0 opacity-30"
          style={{
            background: `linear-gradient(
              ${120 + wave.id * 15}deg,
              transparent 0%,
              hsl(var(--accent) / 0.${2 + wave.id}) 50%,
              transparent 100%
            )`,
            animation: `gentle-wave ${wave.duration}s ease-in-out infinite`,
            animationDelay: `${wave.delay}s`
          }}
        />
      ))}
      
      {/* Deep ocean gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-ocean-surface/20 via-transparent to-ocean-deep/40" />
      
      {/* Subtle light reflections */}
      <div 
        className="absolute top-1/4 left-1/3 w-64 h-32 rounded-full"
        style={{
          background: 'radial-gradient(ellipse, hsl(var(--accent) / 0.1) 0%, transparent 70%)',
          animation: 'float 8s ease-in-out infinite'
        }}
      />
      <div 
        className="absolute top-3/4 right-1/4 w-48 h-24 rounded-full"
        style={{
          background: 'radial-gradient(ellipse, hsl(var(--accent) / 0.08) 0%, transparent 70%)',
          animation: 'float 6s ease-in-out infinite reverse'
        }}
      />
    </div>
  );
};