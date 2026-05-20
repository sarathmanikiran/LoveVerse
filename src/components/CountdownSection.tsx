import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface CountdownSectionProps {
  targetDate: string;
}

export function CountdownSection({ targetDate }: CountdownSectionProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft(); // initial call

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <section className="py-32 px-4 relative overflow-hidden">
      {/* Decorative gradient orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-400/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center relative z-10 glass-card p-12 md:p-20 rounded-[3rem]"
      >
        <h2 className="text-4xl md:text-6xl font-serif italic text-white mb-2">Countdown to <br className="md:hidden" />Our Forever</h2>
        <p className="text-pink-300 font-light tracking-widest uppercase text-sm mb-12">The rest of our lives starts here</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-3xl mx-auto">
          {Object.entries(timeLeft).map(([unit, value], index) => (
            <motion.div 
              key={unit}
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, type: 'spring' }}
              className="flex flex-col items-center"
            >
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 shadow-xl backdrop-blur-md relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-4xl md:text-5xl font-serif text-white drop-shadow-md">
                  {value.toString().padStart(2, '0')}
                </span>
              </div>
              <span className="text-pink-200 uppercase tracking-widest text-xs md:text-sm font-semibold">
                {unit}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
