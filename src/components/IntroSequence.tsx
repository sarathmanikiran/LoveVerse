import { Headphones, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

interface IntroSequenceProps {
  partnerName: string;
  onComplete: () => void;
}

export function IntroSequence({ partnerName, onComplete }: IntroSequenceProps) {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < 2) {
      setStep((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center flex flex-col items-center"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-3xl md:text-5xl font-serif text-white mb-12 tracking-wide font-light"
            >
              Someone has a message for you...
            </motion.h1>
            
            <motion.button
              onClick={handleNext}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="group relative px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-slate-100 backdrop-blur-md transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-violet-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
              <span className="relative z-10 flex items-center gap-3 text-lg tracking-wider font-bold">
                Open My Heart 
                <Heart className="w-5 h-5 text-pink-400 drop-shadow-[0_0_8px_rgba(244,114,182,0.8)]" fill="currentColor" />
              </span>
            </motion.button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="text-center flex flex-col items-center gap-8 max-w-sm"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Headphones className="w-16 h-16 text-pink-300" strokeWidth={1.5} />
            </motion.div>
            <p className="text-xl md:text-2xl font-serif text-slate-100/90 leading-relaxed font-light">
              For the best experience,<br />please wear your earphones.
            </p>
            <button
              onClick={handleNext}
              className="mt-4 text-pink-400 hover:text-white transition-colors border-b border-pink-400/30 hover:border-white pb-1"
            >
              Continue
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            <div className="overflow-hidden">
               <motion.h2 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl md:text-8xl font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-violet-400 drop-shadow-[0_0_15px_rgba(244,114,182,0.3)]"
               >
                 Dear {partnerName}...
               </motion.h2>
            </div>
            
            <motion.button
              onClick={handleNext}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 1 }}
              className="mt-16 group flex flex-col items-center text-pink-300 hover:text-white transition-colors"
            >
              <span className="text-sm tracking-[0.2em] uppercase mb-4 opacity-70">Begin Journey</span>
              <motion.div 
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-px h-16 bg-gradient-to-b from-current to-transparent"
              />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
