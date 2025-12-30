'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, Info, Heart, ArrowRight, Coffee, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8 }
};

export default function BookPage() {
  return (
    <div className="py-24 bg-oak-50/50 min-h-screen overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial="initial"
            animate="animate"
            variants={fadeIn}
            className="text-center mb-24"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-oak-100 text-oak-700 text-sm font-bold mb-6 border border-oak-200">
              <Calendar className="w-4 h-4" />
              <span>Real-Time Calendar</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-8 text-oak-950 tracking-tight leading-tight">Book a Visit.</h1>
            <p className="text-xl text-oak-800/70 max-w-2xl mx-auto leading-relaxed font-serif italic">
              "Find a time that works for you. No phone tag or corporate run-around. 
              My calendar is live and ready for your visit."
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Booking Column */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="lg:col-span-8"
            >
              <div className="bg-white rounded-[4rem] shadow-xl shadow-oak-900/[0.03] border border-oak-100 overflow-hidden min-h-[700px] flex flex-col relative">
                <div className="p-8 md:p-12 border-b bg-white/80 backdrop-blur-xl sticky top-0 z-20 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-oak-100 rounded-2xl flex items-center justify-center shadow-sm">
                      <Coffee className="w-6 h-6 text-oak-700" />
                    </div>
                    <div>
                      <span className="font-serif font-bold text-oak-950 block">Live Calendar</span>
                      <span className="text-xs font-black uppercase tracking-[0.2em] text-oak-400">Powered by Clover</span>
                    </div>
                  </div>
                </div>
                
                {/* Clover Widget Placeholder */}
                <div className="flex-grow p-10 md:p-20 flex flex-col items-center justify-center text-center relative">
                   <div className="absolute inset-0 bg-oak-50/30 opacity-50 pointer-events-none" />
                  
                  <div className="max-w-md relative z-10">
                    <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-oak-900/10 ring-8 ring-oak-100">
                      <Calendar className="w-12 h-12 text-oak-700" />
                    </div>
                    <h3 className="text-3xl font-serif font-bold mb-6 text-oak-950 tracking-tight text-oak-950">Pick a Time</h3>
                    <p className="text-lg text-oak-800/60 mb-10 leading-relaxed italic">
                      "I've made it as simple as possible. Select your service, find 
                      a slot that fits your day, and I'll see you then."
                    </p>
                    
                    <div className="p-8 bg-oak-100/50 border border-oak-200 rounded-[2.5rem] text-oak-800 text-sm mb-10 flex items-start text-left gap-5">
                      <div className="bg-white p-3 rounded-2xl shrink-0 shadow-sm border border-oak-100">
                        <Info className="w-5 h-5 text-oak-600" />
                      </div>
                      <p className="leading-relaxed italic">
                        <strong className="block mb-1 not-italic font-serif font-bold text-oak-950">Clover Integration:</strong> 
                        "Once we're live, this area will show my interactive calendar 
                        where you can book directly."
                      </p>
                    </div>

                    <Button className="w-full h-20 bg-oak-800 hover:bg-oak-950 text-white text-xl font-serif font-bold rounded-[1.5rem] shadow-2xl shadow-oak-900/10 transition-all hover:scale-[1.02] flex items-center justify-center gap-3 group">
                      Open Calendar <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Sidebar Column */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-4 space-y-8"
            >
              <div className="bg-white p-12 rounded-[3.5rem] border border-oak-100 shadow-sm">
                <h3 className="text-2xl font-serif font-bold mb-10 text-oak-950 tracking-tight">Visit Policies</h3>
                <ul className="space-y-8">
                  <li className="flex items-start gap-5 group">
                    <div className="bg-oak-50 p-4 rounded-2xl group-hover:bg-oak-700 transition-colors duration-500 shadow-sm">
                      <Clock className="w-5 h-5 text-oak-400 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-oak-900 mb-1 text-lg">Cancellations</h4>
                      <p className="text-sm text-oak-800/60 leading-relaxed italic">"If you need to change your time, just let me know 24 hours ahead."</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-5 group">
                    <div className="bg-oak-50 p-4 rounded-2xl group-hover:bg-oak-700 transition-colors duration-500 shadow-sm">
                      <Check className="w-5 h-5 text-oak-400 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-oak-900 mb-1 text-lg">Arrival</h4>
                      <p className="text-sm text-oak-800/60 leading-relaxed italic">"Try to arrive 10 minutes early so we can have a proper talk before we start."</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-oak-900 p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
                <h3 className="text-2xl font-serif font-bold mb-6 tracking-tight relative z-10">First time visit?</h3>
                <p className="text-oak-300 mb-10 leading-relaxed relative z-10 font-serif italic">
                  "Don't worry, every first session includes a diagnostic talk 
                  to make sure we're doing the right thing for your body."
                </p>
                <Button asChild variant="outline" className="w-full h-14 rounded-xl border-white/20 text-white hover:bg-white hover:text-oak-950 transition-all font-serif font-bold relative z-10">
                  <Link href="/about">Get to know me</Link>
                </Button>
              </div>

              <div className="p-10 bg-white rounded-[3rem] border-4 border-dashed border-oak-100 text-center">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-oak-400 mb-4">Need help booking?</p>
                <p className="text-3xl font-serif font-black text-oak-950 tracking-tight">(555) 123-4567</p>
                <p className="text-sm font-medium text-oak-600/60 mt-2">Call or Text me personally</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
