import { motion } from 'motion/react';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ParticleBackground } from '../components/ParticleBackground';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <ParticleBackground />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center max-w-2xl mx-auto glass-card p-12"
      >
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 to-violet-600 flex items-center justify-center shadow-[0_0_30px_rgba(219,39,119,0.5)]">
            <Heart className="text-white w-8 h-8 fill-white" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-serif text-white mb-6">
          Ready to create a beautiful proposal experience? ❤️
        </h1>
        
        <p className="text-pink-200/80 mb-12 text-lg">
          Craft a cinematic journey of your love story and share it in a single link.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/create')}
          className="px-8 py-4 bg-gradient-to-r from-pink-600 to-violet-600 rounded-full font-bold text-lg shadow-[0_10px_40px_rgba(225,29,72,0.4)] border border-white/20 text-white"
        >
          Yes, I Want To Propose
        </motion.button>
      </motion.div>
    </div>
  );
}
