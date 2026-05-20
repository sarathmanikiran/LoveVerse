import { SiteConfig } from './types';

export const config: SiteConfig = {
  partnerName: "Elena",
  startDate: "2022-04-15T00:00:00Z",
  // Unsplash place holder audio / music
  backgroundMusicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Placeholder soft background audio
  voiceMessageUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", // Placeholder
  letterContent: [
    "My dearest Elena,",
    "From the moment you walked into my life, everything changed.",
    "The colors became brighter, the music sounded sweeter, and my heart found its home.",
    "You are my safe place, my greatest adventure, and my most beautiful dream come true.",
    "I write this not just as a letter, but as a promise.",
    "A promise to love you, to cherish you, and to stand by you, always.",
  ],
  timeline: [
    {
      id: "first-meet",
      date: "April 15, 2022",
      title: "The Day We Met",
      description: "It was a rainy afternoon at the coffee shop. You spilled your latte, and I gave you my napkins. Best decision of my life.",
      icon: "coffee"
    },
    {
      id: "first-date",
      date: "April 22, 2022",
      title: "Our First Date",
      description: "We talked for 5 hours at the park. I didn't want the night to end.",
      icon: "heart"
    },
    {
      id: "first-trip",
      date: "September 10, 2022",
      title: "Trip to the Mountains",
      description: "Watching the sunrise together above the clouds. That's when I knew.",
      icon: "plane",
      image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "anniversary",
      date: "April 15, 2023",
      title: "One Year Down",
      description: "Celebrating our first anniversary at the spot we met.",
      icon: "star"
    }
  ],
  gallery: [
    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1606248897732-2c5cfe7ea085?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?auto=format&fit=crop&q=80&w=600"
  ],
  reasons: [
    { id: "1", text: "The way your nose crinkles when you laugh", emoji: "✨" },
    { id: "2", text: "How you always know exactly what I'm thinking", emoji: "💭" },
    { id: "3", text: "Your endless compassion for others", emoji: "💖" },
    { id: "4", text: "The magic in your sleepy morning voice", emoji: "🌅" },
    { id: "5", text: "Because you make me want to be a better person", emoji: "🌱" },
    { id: "6", text: "Simply because you are you", emoji: "🥺" },
  ],
  finalEventDate: "2026-12-31T23:59:59Z", // Set a future date for the countdown
};
