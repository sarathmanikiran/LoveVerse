import { useState } from 'react';
import { motion } from 'motion/react';
import { Share2, Check } from 'lucide-react';

export function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'A Beautiful Proposal',
          text: 'Check out this beautiful proposal cinematic experience!',
          url: url,
        });
      } catch (err) {
        // User cancelled or share failed, fallback to copy
        if ((err as Error).name !== 'AbortError') {
          copyToClipboard(url);
        }
      }
    } else {
      copyToClipboard(url);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleShare}
      className="flex items-center gap-2 px-6 py-3 mt-8 bg-white/5 border border-white/10 rounded-full text-pink-200 hover:bg-pink-500/10 hover:border-pink-500/30 hover:text-white transition-all shadow-lg backdrop-blur-sm mx-auto"
    >
      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4" />}
      <span className="text-sm font-medium tracking-wide">
        {copied ? 'Link Copied!' : 'Share Our Story'}
      </span>
    </motion.button>
  );
}
