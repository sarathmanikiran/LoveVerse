import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Heart } from 'lucide-react';

interface ProposalSectionProps {
  partnerName: string;
  finalQuestion?: string;
}

export function ProposalSection({ partnerName, finalQuestion = "Will you stay with me forever?" }: ProposalSectionProps) {
  const [accepted, setAccepted] = useState(false);
  const [noHoverCount, setNoHoverCount] = useState(0);

  const handleYes = () => {
    setAccepted(true);
    
    // Fire confetti
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
  };

  const handleNoHover = () => {
    setNoHoverCount(prev => prev + 1);
  };

  return (
    <section id="proposal" className="min-h-screen py-24 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-pink-500/10 via-[#05040a] to-[#05040a] pointer-events-none" />
      
      <div className="max-w-4xl w-full text-center relative z-10">
        <AnimatePresence mode="wait">
          {!accepted ? (
            <motion.div
              key="question"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 1.1 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center"
            >
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }} 
                transition={{ repeat: Infinity, duration: 2 }}
                className="mb-12 text-pink-500"
              >
                <Heart className="w-16 h-16 fill-current drop-shadow-[0_0_20px_rgba(236,72,153,0.6)]" />
              </motion.div>
              
              <h2 className="text-5xl md:text-7xl font-serif italic text-white mb-8 tracking-wide leading-tight">
                {partnerName},<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-violet-400 not-italic font-sans font-black text-4xl md:text-6xl uppercase h-auto pb-4">
                  {finalQuestion}
                </span>
              </h2>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-16 mt-min-h-[100px] relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleYes}
                  className="px-10 py-5 bg-gradient-to-r from-pink-600 to-rose-600 rounded-full font-bold text-lg shadow-[0_10px_40px_rgba(225,29,72,0.4)] hover:scale-105 transition-transform border border-white/20"
                >
                  YES ❤️
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleYes}
                  className="px-10 py-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full font-bold text-lg hover:bg-white/20 transition-all"
                >
                  OBVIOUSLY YES 😭
                </motion.button>

                {/* Playful "No" button that shrinks or disappears if you hover enough */}
                {noHoverCount < 3 && (
                  <motion.button
                    onHoverStart={handleNoHover}
                    onClick={handleNoHover}
                    animate={
                      noHoverCount === 1 ? { x: 50, scale: 0.8 } :
                      noHoverCount === 2 ? { x: -50, scale: 0.6 } : {}
                    }
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    className="absolute bottom-[-80px] sm:static sm:bottom-auto px-8 py-3 rounded-full text-pink-300/50 hover:text-pink-300/20 text-sm opacity-50"
                  >
                    No
                  </motion.button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, type: "spring", bounce: 0.5 }}
              className="flex flex-col items-center"
            >
              <h2 className="text-6xl md:text-8xl font-serif text-white mb-8 drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">
                She said Yes! 💍
              </h2>
              <p className="text-2xl font-light text-pink-200">
                The beginning of our forever...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
