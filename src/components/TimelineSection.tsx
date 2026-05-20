import { motion } from 'motion/react';
import { Heart, Star, Camera, Plane, Coffee, Music } from 'lucide-react';
import { TimelineEvent } from '../types';

interface TimelineSectionProps {
  events: TimelineEvent[];
}

const iconMap = {
  heart: Heart,
  star: Star,
  camera: Camera,
  plane: Plane,
  coffee: Coffee,
  music: Music,
};

export function TimelineSection({ events }: TimelineSectionProps) {
  return (
    <section className="py-24 px-4 relative max-w-5xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-24"
      >
        <h2 className="text-4xl md:text-6xl font-serif text-white mb-6">Our Journey</h2>
        <p className="text-pink-200 font-light tracking-widest uppercase text-sm">Every moment led to this</p>
      </motion.div>

      <div className="relative">
        {/* Central Line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-pink-400/50 to-transparent md:-translate-x-1/2" />

        <div className="space-y-24">
          {events.map((event, index) => {
            const Icon = event.icon ? iconMap[event.icon] : Heart;
            const isEven = index % 2 === 0;

            return (
              <div key={event.id} className={`relative flex flex-col md:flex-row items-center ${isEven ? 'md:flex-row-reverse' : ''}`}>
                
                {/* Center Icon */}
                <motion.div 
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                  className="absolute left-4 md:left-1/2 w-12 h-12 -translate-x-[23px] md:-translate-x-1/2 rounded-full bg-[#05040a] border border-pink-400 flex items-center justify-center z-10 shadow-[0_0_20px_rgba(236,72,153,0.3)]"
                >
                  <Icon className="w-5 h-5 text-pink-300" />
                </motion.div>

                {/* Content Card */}
                <div className={`w-full pl-16 md:pl-0 md:w-1/2 ${isEven ? 'md:pr-16 text-left md:text-right' : 'md:pl-16 text-left'}`}>
                  <motion.div 
                    initial={{ opacity: 0, x: isEven ? -50 : 50, y: 20 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="glass-card p-8 rounded-2xl relative group overflow-hidden"
                  >
                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-pink-500/0 group-hover:bg-pink-500/10 transition-colors duration-500" />
                    
                    <span className="text-pink-400 text-sm font-bold tracking-widest uppercase mb-2 block">
                      {event.date}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-serif text-white mb-4">
                      {event.title}
                    </h3>
                    <p className="text-slate-100/80 leading-relaxed overflow-hidden">
                      {event.description}
                    </p>

                    {event.image && (
                      <div className="mt-6 rounded-xl overflow-hidden shadow-lg border border-white/10">
                        <img 
                          src={event.image} 
                          alt={event.title} 
                          className="w-full h-48 md:h-64 object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
