import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { Heart } from 'lucide-react';

interface LetterSectionProps {
  content: string[];
}

export function LetterSection({ content }: LetterSectionProps) {
  // We can use a simple stagger effect for the paragraphs
  return (
    <section className="min-h-screen py-24 flex items-center justify-center relative px-4">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1 }}
        className="glass-card max-w-3xl w-full p-8 md:p-16 rounded-[2rem] relative z-10 before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:rounded-[2rem] before:pointer-events-none"
      >
        <div className="absolute top-8 right-8 text-pink-400/50">
          <Heart className="w-8 h-8 md:w-12 md:h-12" strokeWidth={1} />
        </div>
        
        <div className="space-y-6 md:space-y-8">
          {content.map((paragraph, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.4 + 0.5, duration: 1 }}
              className={cn(
                "text-lg md:text-2xl font-serif leading-relaxed",
                index === 0 ? "text-3xl md:text-4xl text-violet-300 mb-8" : "text-slate-100/90"
              )}
            >
              {paragraph}
            </motion.p>
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: content.length * 0.4 + 1, duration: 1 }}
          className="mt-16 flex justify-end"
        >
          <div className="w-24 h-px bg-gradient-to-r from-transparent to-violet-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}
