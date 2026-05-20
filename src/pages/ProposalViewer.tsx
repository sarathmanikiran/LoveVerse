import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { ParticleBackground } from '../components/ParticleBackground';
import { IntroSequence } from '../components/IntroSequence';
import { LetterSection } from '../components/LetterSection';
import { TimelineSection } from '../components/TimelineSection';
import { GallerySection } from '../components/GallerySection';
import { ReasonsSection } from '../components/ReasonsSection';
import { ProposalSection } from '../components/ProposalSection';
import { CountdownSection } from '../components/CountdownSection';
import { AudioPlayer } from '../components/AudioPlayer';
import { Heart } from 'lucide-react';
import { SiteConfig } from '../types';

export default function ProposalViewer() {
  const { proposalId } = useParams<{ proposalId: string }>();
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [introFinished, setIntroFinished] = useState(false);

  useEffect(() => {
    async function fetchProposal() {
      if (!proposalId) return;
      try {
        const docRef = doc(db, 'proposals', proposalId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          // Map firestore data back to SiteConfig
          const data = docSnap.data();
          setConfig({
            partnerName: data.partnerName,
            startDate: data.createdAt ? new Date(data.createdAt).toISOString() : new Date().toISOString(),
            voiceMessageUrl: data.voiceMessageUrl,
            backgroundMusicUrl: data.backgroundMusicUrl,
            letterContent: data.letterContent ? data.letterContent.split('\n') : [],
            timeline: [], // we didn't add this in schema but it can be handled
            gallery: data.memories || [],
            reasons: data.reasons ? data.reasons.map((r: string, i: number) => ({ id: String(i), text: r, emoji: '✨' })) : [],
            finalQuestion: data.finalQuestion || "Will you stay with me forever?",
            finalEventDate: new Date(Date.now() + 86400000).toISOString() // Fake far date
          });
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProposal();
  }, [proposalId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#05040a]">
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity }}>
          <Heart className="w-12 h-12 text-pink-500 fill-pink-500" />
        </motion.div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#05040a] text-white">
        <h1 className="text-2xl font-serif">Proposal not found.</h1>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <ParticleBackground />

      <AnimatePresence mode="wait">
        {!introFinished ? (
          <motion.div key="intro">
            <IntroSequence 
              partnerName={config.partnerName} 
              onComplete={() => setIntroFinished(true)} 
            />
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="relative z-10 font-sans"
          >
            {/* Soft top gradient */}
            <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 pt-20 pb-10 sm:pt-32">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24 max-w-5xl mx-auto">
                {/* Voice Message Player */}
                {config.voiceMessageUrl && (
                  <AudioPlayer 
                    url={config.voiceMessageUrl} 
                    title="A Message For You" 
                    subtitle="Listen closely..."
                    className="w-full"
                  />
                )}
                
                {/* Background Music Player */}
                {config.backgroundMusicUrl && (
                  <AudioPlayer 
                    url={config.backgroundMusicUrl} 
                    title="Our Soundtrack" 
                    subtitle="Background Music" 
                    autoPlay
                    className="w-full"
                  />
                )}
              </div>
            </div>

            {config.letterContent.length > 0 && <LetterSection content={config.letterContent} />}
            {config.timeline && config.timeline.length > 0 && <TimelineSection events={config.timeline} />}
            {config.gallery && config.gallery.length > 0 && <GallerySection images={config.gallery} />}
            {config.reasons && config.reasons.length > 0 && <ReasonsSection reasons={config.reasons} />}

            {/* A small decorative divider */}
            <div className="flex justify-center py-20 opacity-50">
               <Heart className="w-8 h-8 text-pink-400" />
            </div>

            <ProposalSection partnerName={config.partnerName} finalQuestion={config.finalQuestion} />
            <CountdownSection targetDate={config.finalEventDate} />

            <footer className="py-24 text-center">
               <motion.div 
                 initial={{ opacity: 0 }}
                 whileInView={{ opacity: 1 }}
                 viewport={{ once: true }}
                 transition={{ duration: 1.5 }}
                 className="flex flex-col items-center justify-center space-y-4"
               >
                 <Heart className="w-8 h-8 text-pink-400 fill-pink-400 mb-4" />
                 <p className="text-xl md:text-3xl font-serif text-slate-100">Forever Yours.</p>
                 {/* Only display creatorName if it exists in the schema mapping, otherwise hide or show generic */}
                 <p className="text-pink-400/60 text-sm tracking-widest uppercase mt-8 pt-8 border-t border-pink-400/20 max-w-xs mx-auto">
                   Thank you for being part of my life
                 </p>
               </motion.div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
