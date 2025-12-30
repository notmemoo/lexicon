'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Heart, Coffee, Leaf, Home, ArrowRight, Star } from 'lucide-react';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8 }
};

export default function AboutPage() {
  return (
    <div className="flex flex-col py-24 bg-oak-50 overflow-hidden">
      {/* Bio Section */}
      <section className="container mx-auto px-4 mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/5] relative rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-white ring-1 ring-oak-200">
              <Image 
                src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=1974&auto=format&fit=crop" 
                alt="Steve"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 bg-oak-700 text-white p-10 rounded-[2.5rem] shadow-2xl hidden md:block border-8 border-white">
              <p className="text-5xl font-serif font-bold mb-1 tracking-tighter text-white">15+</p>
              <p className="text-xs uppercase tracking-[0.2em] font-black text-oak-200">Years Healing</p>
            </div>
          </motion.div>
          
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-oak-100 text-oak-700 text-sm font-bold mb-8 border border-oak-200">
              <Home className="w-4 h-4" />
              <span>Small Business • Family Owned</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-8 text-oak-950 leading-tight">My Story.</h1>
            <p className="text-2xl text-oak-600 font-serif font-semibold mb-10 leading-relaxed italic">
              "I believe a good massage can change your whole week. I've spent 15 years 
              learning exactly how to make that happen."
            </p>
            
            <div className="space-y-8 text-oak-800/80 text-lg leading-relaxed max-w-xl font-serif italic">
              <p>
                Hi, I'm Steve. I didn't set out to build a "wellness empire." I just 
                wanted to help people feel better. I saw too many neighbors struggling 
                with chronic pain and stress, and I knew I had a knack for finding 
                where the body holds onto its troubles.
              </p>
              <p>
                Over the last 15 years, I've worked in clinic settings and high-end spas, 
                but I always felt something was missing—the personal connection. That's why 
                I opened this small studio. 
              </p>
              <p className="font-bold text-oak-950 not-italic">
                Here, the focus is entirely on you. No rush, no corporate policies—just 
                honest work from someone who cares about your recovery.
              </p>
            </div>

            <div className="mt-12 flex flex-wrap gap-6">
              <Button asChild size="lg" className="h-16 px-10 rounded-2xl bg-oak-800 hover:bg-oak-950 text-white text-lg font-serif font-bold shadow-xl shadow-oak-900/10 transition-transform hover:scale-[1.02]">
                <Link href="/book">Stop by & Visit</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-16 px-10 rounded-2xl text-lg font-serif font-bold border-oak-200 text-oak-800">
                <Link href="/services">What I Do</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="bg-white py-32 relative border-y border-oak-100">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-oak-950 tracking-tight">The Way I Work</h2>
            <p className="text-xl text-oak-800/60 max-w-2xl mx-auto leading-relaxed italic">
              "Healing isn't just about muscle and bone—it's about making sure 
              you feel seen, heard, and cared for."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Heart, title: "Neighborly Care", text: "You're more than a client here. I treat everyone like I'd treat my own family." },
              { icon: Coffee, title: "No Rush Policy", text: "We take the time needed. Every session starts with a talk and ends with care." },
              { icon: Leaf, title: "Natural Approach", text: "I use pure essential oils and natural balms to help your body heal itself." },
              { icon: Star, title: "Humble Expertise", text: "15 years of learning applied with a humble heart and a focus on your relief." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-oak-50 p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500 border border-oak-200 group"
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 group-hover:bg-oak-700 transition-colors duration-500 shadow-sm border border-oak-100">
                  <item.icon className="w-8 h-8 text-oak-700 group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="text-2xl font-serif font-bold mb-4 text-oak-950">{item.title}</h3>
                <p className="text-oak-800/70 leading-relaxed italic">"{item.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-32">
        <div className="bg-oak-900 rounded-[4rem] p-12 md:p-24 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
             <Image 
                src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070&auto=format&fit=crop" 
                alt="Studio background"
                fill
                className="object-cover"
              />
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-10 tracking-tight leading-tight">Ready for a different <br /> <span className="text-oak-400 italic">kind of care?</span></h2>
            <p className="text-xl text-oak-200 mb-12 max-w-2xl mx-auto leading-relaxed italic">
              "Stop by the studio and let's get you back on your feet. The kettle is 
              always on and I'm ready to help."
            </p>
            <Button asChild size="lg" className="h-16 px-12 rounded-2xl bg-white text-oak-950 hover:bg-oak-50 text-xl font-serif font-bold shadow-2xl transition-transform hover:scale-[1.05]">
              <Link href="/book" className="flex items-center gap-2 text-oak-950">Book a Visit <ArrowRight className="w-6 h-6" /></Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
