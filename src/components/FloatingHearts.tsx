import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';

export function FloatingHearts() {
  const [hearts, setHearts] = useState<{ id: number, x: number, duration: number, delay: number, size: number, drift: number }[]>([]);

  useEffect(() => {
    const newHearts = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // random start horizontal position %
      drift: Math.random() * 20 - 10,
      duration: Math.random() * 5 + 5, // 5-10s duration
      delay: Math.random() * 2, // 0-2s delay
      size: Math.random() * 20 + 16, // 16-36px
    }));
    setHearts(newHearts);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute bottom-[-100px] text-pink-500/40"
          initial={{ y: 0, x: `${heart.x}vw`, opacity: 0, scale: 0, rotate: 0 }}
          animate={{
             y: '-120vh', 
             opacity: [0, 1, 0.8, 0], 
             scale: [0.5, 1, 1.2, 0.8],
             x: [`${heart.x}vw`, `${heart.x + heart.drift}vw`],
             rotate: [0, heart.drift > 0 ? 45 : -45]
          }}
          transition={{
            duration: heart.duration,
            repeat: Infinity,
            delay: heart.delay,
            ease: 'linear'
          }}
        >
          <Heart width={heart.size} height={heart.size} className="fill-current" />
        </motion.div>
      ))}
    </div>
  );
}
