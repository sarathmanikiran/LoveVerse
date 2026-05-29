import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Upload, Music, ArrowRight, Share2, Download, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth, db, storage, loginWithGoogle, handleFirestoreError, OperationType } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { QRCodeSVG } from 'qrcode.react';

const THEMES = [
  { id: 'night', label: 'Night Sky' },
  { id: 'sunset', label: 'Sunset Beach' },
  { id: 'dreamy', label: 'Dreamy Purple' },
  { id: 'minimal', label: 'Minimal Romantic' },
];

export default function CreatorDashboard() {
  const [user, setUser] = useState(auth.currentUser);
  const [step, setStep] = useState(auth.currentUser ? 1 : 0);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [creatorName, setCreatorName] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [theme, setTheme] = useState('night');
  const [letterContent, setLetterContent] = useState('');
  const [finalQuestion, setFinalQuestion] = useState('Will you stay with me forever?');
  const [reasonsText, setReasonsText] = useState('');

  // Files
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [voiceFile, setVoiceFile] = useState<File | null>(null);
  
  // Output
  const [proposalId, setProposalId] = useState('');
  const proposalUrl = proposalId ? `${window.location.origin}/${proposalId}` : '';

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      if (u && step === 0) {
        setStep(1);
          }
        });
        return () => unsubscribe();
      }, [step]);
    
      const isIframe = window.self !== window.top;
    
      const handleLogin = async () => {
        try {
      const cred = await loginWithGoogle();
      setUser(cred.user);
      setStep(1);
    } catch (e: any) {
      console.error(e);
      if (e?.code !== 'auth/popup-closed-by-user') {
        alert(e.message || "Failed to sign in. Please try again.");
      }
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const generatedId = partnerName.toLowerCase().replace(/[^a-z]/g, '') + '-' + Math.random().toString(36).substring(2, 6);
      
      // Helper to read file as data URL (Base64)
      const fileToDataUrl = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      };

      // Helper to compress image
      const compressImage = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 800;
            const MAX_HEIGHT = 800;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.7)); // compress to jpeg 0.7 quality
          };
          img.onerror = reject;
          img.src = URL.createObjectURL(file);
        });
      };

      let imageUrls: string[] = [];
      for (const file of imageFiles) {
        try {
          const compressed = await compressImage(file);
          imageUrls.push(compressed);
        } catch(e) {
          console.error("Failed to compress image", e);
        }
      }

      let voiceUrl = '';
      if (voiceFile) {
        // Warning: Voice files can be large, we just base64 it and hope it's small enough for Firestore (<1MB doc size).
        // For a true production app, use Storage. But for AI Studio preview, base64 works if small.
        if (voiceFile.size > 700000) {
           alert("Voice message is too large. Please use a smaller file (< 700KB).");
           setLoading(false);
           return;
        }
        voiceUrl = await fileToDataUrl(voiceFile);
      }

      const proposalData = {
        creatorId: user.uid,
        creatorName,
        partnerName,
        theme,
        letterContent,
        finalQuestion,
        reasons: reasonsText.split('\n').filter(r => r.trim()),
        memories: imageUrls,
        voiceMessageUrl: voiceUrl,
        createdAt: new Date().toISOString()
      };

      console.log("Proposal data prepared, uploading to firestore...", proposalData);

      // Wrapper to timeout if it hangs forever
      const uploadWithTimeout = Promise.race([
        setDoc(doc(db, 'proposals', generatedId), proposalData),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Firestore upload timed out after 10s")), 10000))
      ]);

      await uploadWithTimeout;
      console.log("Firestore upload complete!");
      
      setProposalId(generatedId);
      setStep(5); // Success step
    } catch (e: any) {
      console.error("Submit error:", e);
      alert("Error saving proposal: " + (e.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  if (!user && step === 0) {
    return (
      <div className="min-h-screen bg-[#05040a] flex items-center justify-center p-4">
        <div className="glass-card max-w-md w-full p-8 text-center text-white">
          <Heart className="w-12 h-12 text-pink-500 mx-auto mb-6" />
          <h2 className="text-2xl font-serif mb-6">Welcome to LoveVerse Studio</h2>
          <p className="text-sm text-pink-200/80 mb-8">Sign in to start creating your personalized proposal experience.</p>
          <button onClick={handleLogin} className="w-full bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3 rounded-full transition text-white font-medium flex items-center justify-center gap-2">
             Sign in with Google
          </button>
          {isIframe && (
            <p className="mt-4 text-xs text-red-300 bg-red-900/40 p-3 rounded-xl border border-red-500/30">
              Note: Google Sign-In may fail within a preview frame. If it doesn't work, please open this app in a new tab (using the button in the top right).
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05040a] text-white p-4 md:p-8">
      <div className="max-w-2xl mx-auto mt-12 glass-card p-8 md:p-12 relative overflow-hidden">
        {loading && (
          <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center">
            <Heart className="w-12 h-12 text-pink-500 animate-pulse fill-pink-500 mb-4" />
            <p className="animate-pulse">Crafting your romance...</p>
          </div>
        )}

        {step > 0 && step !== 5 && (
          <div className="flex justify-between mb-8 text-xs font-mono text-pink-300">
             <span>Step {step} of 4</span>
             {step > 1 && <button onClick={prevStep} className="hover:text-white">← Back</button>}
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-3xl font-serif mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-violet-400">The Basics</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-pink-200 mb-2">Your Name</label>
                  <input value={creatorName} onChange={e => setCreatorName(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition" />
                </div>
                <div>
                  <label className="block text-sm text-pink-200 mb-2">Partner's Name</label>
                  <input value={partnerName} onChange={e => setPartnerName(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition" />
                </div>
                <div>
                  <label className="block text-sm text-pink-200 mb-2">Choose Theme</label>
                  <div className="grid grid-cols-2 gap-4">
                    {THEMES.map(t => (
                      <button 
                        key={t.id} 
                        onClick={() => setTheme(t.id)}
                        className={`p-4 rounded-xl border transition ${theme === t.id ? 'border-pink-500 bg-pink-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={nextStep} 
                disabled={!creatorName || !partnerName}
                className="mt-8 w-full bg-gradient-to-r from-pink-600 to-violet-600 py-4 rounded-full font-bold disabled:opacity-50 flex items-center justify-center gap-2"
              >
                Next <ArrowRight size={18} />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-3xl font-serif mb-8">Memories & Voice</h2>
              
              <div className="space-y-8">
                <div>
                  <label className="block text-sm text-pink-200 mb-2">Upload Photos (Optional)</label>
                  <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center hover:bg-white/5 transition">
                     <input type="file" multiple accept="image/*" onChange={e => e.target.files && setImageFiles(Array.from(e.target.files))} className="hidden" id="photo-upload" />
                     <label htmlFor="photo-upload" className="cursor-pointer flex flex-col items-center">
                       <Upload className="w-8 h-8 text-pink-400 mb-2" />
                       <span className="text-sm">Click to select files</span>
                       <span className="text-xs text-white/50">{imageFiles.length} selected</span>
                     </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-pink-200 mb-2">Upload Voice Message (Optional)</label>
                  <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center hover:bg-white/5 transition">
                     <input type="file" accept="audio/*" onChange={e => setVoiceFile(e.target.files?.[0] || null)} className="hidden" id="voice-upload" />
                     <label htmlFor="voice-upload" className="cursor-pointer flex flex-col items-center">
                       <Music className="w-8 h-8 text-violet-400 mb-2" />
                       <span className="text-sm">Click to select voice file</span>
                       <span className="text-xs text-white/50">{voiceFile ? voiceFile.name : 'No file chosen'}</span>
                     </label>
                  </div>
                </div>
              </div>

              <button 
                onClick={nextStep} 
                className="mt-8 w-full bg-gradient-to-r from-pink-600 to-violet-600 py-4 rounded-full font-bold flex items-center justify-center gap-2"
              >
                Next <ArrowRight size={18} />
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-3xl font-serif mb-8">Words of Love</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-pink-200 mb-2">Your Letter to {partnerName}</label>
                  <textarea 
                    value={letterContent} 
                    onChange={e => setLetterContent(e.target.value)} 
                    rows={6}
                    placeholder="My dearest..."
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition resize-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm text-pink-200 mb-2">Reasons I Love You (One per line)</label>
                  <textarea 
                    value={reasonsText} 
                    onChange={e => setReasonsText(e.target.value)} 
                    rows={4}
                    placeholder="Your beautiful smile\nThe way you care\nYour endless support"
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition resize-none" 
                  />
                </div>
              </div>

              <button 
                onClick={nextStep} 
                className="mt-8 w-full bg-gradient-to-r from-pink-600 to-violet-600 py-4 rounded-full font-bold flex items-center justify-center gap-2"
              >
                Next <ArrowRight size={18} />
              </button>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-3xl font-serif mb-8">The Big Moment</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-pink-200 mb-2">Proposal Question</label>
                  <input 
                    value={finalQuestion} 
                    onChange={e => setFinalQuestion(e.target.value)} 
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-xl font-serif focus:outline-none focus:border-pink-500 transition text-center" 
                  />
                </div>
              </div>

              <div className="mt-8 p-6 bg-pink-500/10 border border-pink-500/20 rounded-2xl">
                <p className="text-sm text-pink-200 mb-2">Ready to publish?</p>
                <p className="text-xs text-white/50">Once created, everything will be safely stored and you'll get a unique link to share with {partnerName}.</p>
              </div>

              <button 
                onClick={handleSubmit} 
                className="mt-8 w-full bg-gradient-to-r from-pink-600 to-violet-600 py-4 rounded-full font-bold shadow-[0_0_30px_rgba(236,72,153,0.3)] hover:shadow-[0_0_50px_rgba(236,72,153,0.5)] transition"
              >
                Create My Proposal ❤️
              </button>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="5" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 fill-current animate-pulse" />
              </div>
              <h2 className="text-4xl font-serif mb-4">It's Ready! 🎉</h2>
              <p className="text-pink-200 mb-12">Your cinematic proposal is live and waiting.</p>

              <div className="bg-white/5 p-6 rounded-2xl mb-8 flex flex-col items-center">
                <div className="bg-white p-4 rounded-2xl mb-6 flex items-center justify-center min-h-[160px] min-w-[160px]">
                   {proposalUrl ? (
                     <QRCodeSVG value={proposalUrl} size={150} />
                   ) : (
                     <div className="text-gray-400 text-sm">Generating QR...</div>
                   )}
                </div>
                
                <div className="flex bg-black/30 rounded-lg p-2 w-full max-w-sm border border-white/10">
                   <input readOnly value={proposalUrl} className="bg-transparent flex-1 text-sm px-2 text-white/70 outline-none" />
                   <button 
                     onClick={() => navigator.clipboard.writeText(proposalUrl)}
                     className="bg-white/10 px-3 py-1 rounded hover:bg-white/20 transition"
                   >
                     Copy
                   </button>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <a href={proposalUrl} target="_blank" rel="noreferrer" className="flex-1 max-w-[200px] flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 to-violet-600 py-3 rounded-full font-bold">
                  <Eye size={18} /> Preview
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
