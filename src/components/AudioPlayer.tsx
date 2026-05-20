import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface AudioPlayerProps {
  url: string;
  title: string;
  subtitle?: string;
  className?: string;
  autoPlay?: boolean;
}

export function AudioPlayer({ url, title, subtitle, className, autoPlay = false }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false); // don't assume autoPlay succeeds initially
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    if (audioRef.current && autoPlay) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromiseRef.current = playPromise;
        playPromise.then(() => {
           setIsPlaying(true);
        }).catch(() => {
           setIsPlaying(false);
           playPromiseRef.current = null;
        });
      } else {
        setIsPlaying(true);
      }
    }
  }, [autoPlay, url]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        if (playPromiseRef.current !== null) {
          playPromiseRef.current.then(() => {
            audioRef.current?.pause();
          }).catch(() => {
            // Already caught
          });
        } else {
          audioRef.current.pause();
        }
        setIsPlaying(false);
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromiseRef.current = playPromise;
          playPromise.then(() => {
            setIsPlaying(true);
          }).catch(err => {
            console.error("Playback failed:", err);
            setIsPlaying(false);
            playPromiseRef.current = null;
          });
        } else {
          setIsPlaying(true);
        }
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      setProgress((current / total) * 100);
    }
  };

  return (
    <div className={cn("glass-card rounded-2xl p-6 sm:p-8 flex flex-col gap-6 relative overflow-hidden", className)}>
      {/* Background glow when playing */}
      <motion.div 
        className="absolute inset-0 bg-pink-500/10"
        animate={{ opacity: isPlaying ? [0.5, 1, 0.5] : 0 }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <audio 
        ref={audioRef} 
        src={url} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        loop={false}
      />
      
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex flex-col">
          <h3 className="font-serif text-xl sm:text-2xl text-white">{title}</h3>
          {subtitle && (
            <p className="text-pink-300 text-sm italic">{subtitle}</p>
          )}
        </div>
        
        <button 
          onClick={toggleMute}
          className="text-pink-300 hover:text-white transition-colors"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>

      <div className="relative z-10 flex items-center gap-6">
        <button 
          onClick={togglePlay}
          className="flex-shrink-0 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 fill-current" />
          ) : (
            <Play className="w-6 h-6 fill-current ml-1" />
          )}
        </button>
        
        <div className="flex-1 space-y-2">
          {/* Faux Waveform Visualizer */}
          <div className="h-8 flex items-end gap-1 mb-2 overflow-hidden">
            {[...Array(40)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-gradient-to-t from-pink-500 to-violet-500 rounded-full opacity-70"
                animate={{
                  height: isPlaying ? [`${Math.random() * 40 + 20}%`, `${Math.random() * 80 + 20}%`, `${Math.random() * 40 + 20}%`] : '10%',
                }}
                transition={{
                  duration: Math.random() * 0.5 + 0.3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-pink-500 to-violet-500"
              style={{ width: `${progress}%` }}
              layout
            />
          </div>
        </div>
      </div>
    </div>
  );
}
