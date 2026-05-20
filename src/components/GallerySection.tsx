import { motion } from 'motion/react';

interface GallerySectionProps {
  images: string[];
}

export function GallerySection({ images }: GallerySectionProps) {
  return (
    <section className="py-24 px-4 w-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-6xl font-serif text-white mb-6">Fragments of Us</h2>
        <p className="text-pink-300 font-light tracking-widest uppercase text-sm">A thousand words in each frame</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 max-w-7xl mx-auto">
        {images.map((src, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className={`group relative overflow-hidden rounded-2xl glass-card border-none
              ${index === 0 || index === 3 ? 'md:col-span-2 md:row-span-2 aspect-video md:aspect-auto' : 'aspect-square'}
            `}
          >
            <div className="absolute inset-0 bg-[#05040a]/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
            <img 
              src={src} 
              alt={`Memory ${index + 1}`} 
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out"
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
