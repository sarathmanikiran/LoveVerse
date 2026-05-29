import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Clock, Camera, Heart, Navigation, Star } from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { id: 'intro', label: 'Start', icon: Star },
  { id: 'letter', label: 'Message', icon: Mail },
  { id: 'timeline', label: 'Journey', icon: Clock },
  { id: 'gallery', label: 'Memories', icon: Camera },
  { id: 'reasons', label: 'Reasons', icon: Heart },
  { id: 'proposal', label: 'Forever', icon: Navigation },
];

export function ScrollNav() {
  const [activeSection, setActiveSection] = useState('intro');
  const [isVisible, setIsVisible] = useState(false);
  const [availableItems, setAvailableItems] = useState(navItems);

  useEffect(() => {
    // Reveal navigation after a short delay so it doesn't clash with intro
    const timer = setTimeout(() => {
      // Find which items actually exist in the DOM
      const existing = navItems.filter(item => document.getElementById(item.id));
      setAvailableItems(existing);
      setIsVisible(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Find the current section
      const sections = availableItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      let currentId = 'intro';
      sections.forEach(section => {
        if (section && section.offsetTop <= scrollPosition) {
          currentId = section.id;
        }
      });
      setActiveSection(currentId);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [availableItems]);

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    } else if (id === 'intro') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-6"
    >
      {availableItems.map((item) => {
        const isActive = activeSection === item.id;
        const Icon = item.icon;
        
        return (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className="group relative flex items-center justify-end w-32"
            aria-label={`Scroll to ${item.label}`}
          >
            <span 
              className={cn(
                "absolute right-12 text-sm font-medium tracking-wide transition-all duration-300 pointer-events-none",
                isActive 
                  ? "opacity-100 text-pink-400 translate-x-0" 
                  : "opacity-0 text-white/50 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0"
              )}
            >
              {item.label}
            </span>
            
            <div 
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                isActive 
                  ? "bg-pink-500/20 border border-pink-500/50 scale-110 shadow-[0_0_15px_rgba(236,72,153,0.3)]" 
                  : "bg-black/20 border border-white/10 hover:border-pink-500/30 hover:bg-black/40"
              )}
            >
              <Icon 
                className={cn(
                  "w-4 h-4 transition-colors duration-300",
                  isActive ? "text-pink-400" : "text-white/50 group-hover:text-pink-300"
                )} 
              />
            </div>
          </button>
        );
      })}
    </motion.div>
  );
}
