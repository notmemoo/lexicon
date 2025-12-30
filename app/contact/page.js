'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MapPin, Phone, Send, Coffee, Clock, Heart } from 'lucide-react';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8 }
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Send data to our API route
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to send message');
      }
      
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-24 bg-oak-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial="initial"
            animate="animate"
            variants={fadeIn}
            className="text-center mb-24"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-oak-100 text-oak-700 text-sm font-bold mb-6 border border-oak-200">
              <Coffee className="w-4 h-4" />
              <span>Reach Out Anytime</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-8 text-oak-950 tracking-tight leading-tight">Let's Talk.</h1>
            <p className="text-xl text-oak-800/70 max-w-2xl mx-auto leading-relaxed font-serif italic">
              "Have a question about a specific pain, or just want to see if I'm the 
              right fit for you? Give me a shout and I'll get back to you personally."
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
            {/* Contact Info */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2 space-y-8"
            >
              <div className="bg-oak-900 p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
                <h3 className="text-3xl font-serif font-bold mb-12 tracking-tight">How to reach me</h3>
                
                <div className="space-y-12">
                  <div className="flex items-start gap-6 group">
                    <div className="bg-white/10 p-4 rounded-2xl group-hover:bg-oak-700 transition-colors duration-500">
                      <Phone className="w-6 h-6 text-oak-300 group-hover:text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-oak-300 uppercase font-black tracking-[0.2em] mb-2">Call or Text</p>
                      <p className="text-2xl font-serif font-bold text-white">(555) 123-4567</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 group">
                    <div className="bg-white/10 p-4 rounded-2xl group-hover:bg-oak-700 transition-colors duration-500">
                      <Mail className="w-6 h-6 text-oak-300 group-hover:text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-oak-300 uppercase font-black tracking-[0.2em] mb-2">Email Steve</p>
                      <p className="text-2xl font-serif font-bold text-white">hello@stevemassage.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 group">
                    <div className="bg-white/10 p-4 rounded-2xl group-hover:bg-oak-700 transition-colors duration-500">
                      <MapPin className="w-6 h-6 text-oak-300 group-hover:text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-oak-300 uppercase font-black tracking-[0.2em] mb-2">My Studio</p>
                      <p className="text-xl font-serif font-bold text-white leading-relaxed">123 Wellness Way, Suite 100<br />Healing City, ST 12345</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-12 rounded-[3.5rem] border border-oak-200 shadow-sm">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 bg-oak-50 rounded-2xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-oak-700" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-oak-950 tracking-tight">My Hours</h3>
                </div>
                <ul className="space-y-5">
                  {[
                    ["Monday - Friday", "9:00 - 19:00"],
                    ["Saturday", "10:00 - 16:00"],
                    ["Sunday", "Closed"]
                  ].map(([day, hours], i) => (
                    <li key={i} className="flex justify-between items-center group">
                      <span className="font-serif font-bold text-oak-800 group-hover:text-oak-950 transition-colors">{day}</span>
                      <span className={`font-serif ${hours === 'Closed' ? 'text-oak-400 italic' : 'font-bold text-oak-700'}`}>{hours}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              <div className="bg-white p-10 md:p-16 rounded-[4rem] border-2 border-oak-100 shadow-xl shadow-oak-900/[0.02] h-full relative overflow-hidden">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div 
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="h-full flex flex-col items-center justify-center text-center py-20"
                    >
                      <div className="w-24 h-24 bg-oak-50 text-oak-600 rounded-full flex items-center justify-center mb-8 border border-oak-100 shadow-inner">
                        <Heart className="w-12 h-12" />
                      </div>
                      <h2 className="text-4xl font-serif font-bold mb-4 text-oak-950 tracking-tight">Got it!</h2>
                      <p className="text-xl text-oak-800/60 mb-10 leading-relaxed max-w-sm italic">
                        "Thanks for reaching out. I'll read this and get back to you personally 
                        as soon as I'm between sessions."
                      </p>
                      <Button onClick={() => setSubmitted(false)} variant="outline" className="h-14 px-8 rounded-xl font-bold font-serif border-oak-200 text-oak-800">
                        Send Another Note
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div key="form" exit={{ opacity: 0, y: -20 }}>
                      <h3 className="text-3xl font-serif font-bold mb-10 text-oak-950 tracking-tight">Send me a note</h3>
                      <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-[0.2em] text-oak-400">Your Name</label>
                            <Input 
                              required 
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="Full Name" 
                              className="h-16 rounded-2xl border-oak-200 focus:border-oak-500 focus:ring-4 focus:ring-oak-500/10 bg-oak-50/30 transition-all text-lg font-serif px-6"
                            />
                          </div>
                          <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-[0.2em] text-oak-400">Email</label>
                            <Input 
                              required 
                              type="email" 
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="email@example.com" 
                              className="h-16 rounded-2xl border-oak-200 focus:border-oak-500 focus:ring-4 focus:ring-oak-500/10 bg-oak-50/30 transition-all text-lg font-serif px-6"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-[0.2em] text-oak-400">Phone (Optional)</label>
                            <Input 
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder="(555) 000-0000" 
                              className="h-16 rounded-2xl border-oak-200 focus:border-oak-500 focus:ring-4 focus:ring-oak-500/10 bg-oak-50/30 transition-all text-lg font-serif px-6"
                            />
                          </div>
                          <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-[0.2em] text-oak-400">What's on your mind?</label>
                            <Input 
                              required 
                              name="subject"
                              value={formData.subject}
                              onChange={handleChange}
                              placeholder="Booking, pain, general question..." 
                              className="h-16 rounded-2xl border-oak-200 focus:border-oak-500 focus:ring-4 focus:ring-oak-500/10 bg-oak-50/30 transition-all text-lg font-serif px-6"
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="text-xs font-black uppercase tracking-[0.2em] text-oak-400">Message</label>
                          <Textarea 
                            required 
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Tell me a bit more..." 
                            className="min-h-[200px] rounded-3xl border-oak-200 focus:border-oak-500 focus:ring-4 focus:ring-oak-500/10 bg-oak-50/30 transition-all text-lg font-serif p-6"
                          />
                        </div>

                        {error && (
                          <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100 flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                            {error}
                          </div>
                        )}

                        <Button 
                          disabled={isSubmitting} 
                          type="submit" 
                          className="w-full h-20 bg-oak-800 hover:bg-oak-950 text-white text-xl font-serif font-bold rounded-[1.5rem] shadow-2xl shadow-oak-900/10 transition-all hover:scale-[1.02] flex items-center justify-center gap-3 group"
                        >
                          {isSubmitting ? 'Sending...' : (
                            <>
                              Send Note <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </>
                          )}
                        </Button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
