import { motion } from 'motion/react';
import { Reason } from '../types';

interface ReasonsSectionProps {
  reasons: Reason[];
}

export function ReasonsSection({ reasons }: ReasonsSectionProps) {
  return (
    <section className="py-32 px-4 relative max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-20"
      >
        <h2 className="text-4xl md:text-6xl font-serif text-white mb-6">Why I Love You</h2>
        <p className="text-violet-300 font-light tracking-widest uppercase text-sm">Just a few of the million reasons</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {reasons.map((reason, index) => (
          <motion.div
            key={reason.id}
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ 
              type: "spring", 
              bounce: 0.4, 
              delay: index * 0.1,
              duration: 0.8 
            }}
            whileHover={{ y: -10, scale: 1.02 }}
            className="glass-card p-8 rounded-3xl text-center relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 to-violet-500/0 group-hover:from-pink-500/10 group-hover:to-violet-500/5 rounded-3xl transition-colors duration-500" />
            <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
              {reason.emoji}
            </div>
            <p className="text-lg md:text-xl text-white font-medium">
              {reason.text}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
