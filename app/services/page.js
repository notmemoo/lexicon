'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, Heart } from 'lucide-react';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

const services = [
  {
    id: 'swedish',
    name: 'Swedish Massage',
    duration: '60 / 90 min',
    price: '$85 / $120',
    description: 'A classic, gentle massage using long, gliding strokes to improve circulation and melt away daily stress. Perfect if you just need an hour to breathe and reset.',
    benefits: ['Stress reduction', 'Improved sleep', 'Muscle relaxation', 'Better circulation'],
  },
  {
    id: 'deep-tissue',
    name: 'Deep Tissue',
    duration: '60 / 90 min',
    price: '$110 / $150',
    description: 'Focused work on the deeper layers of muscle. I use my hands and experience to find those stubborn knots and help release chronic tension in your neck, back, and shoulders.',
    benefits: ['Chronic pain relief', 'Injury recovery', 'Reduced inflammation', 'Better mobility'],
    popular: true,
  },
  {
    id: 'sports',
    name: 'Sports Recovery',
    duration: '60 / 90 min',
    price: '$120 / $160',
    description: 'Designed for my active neighbors—from weekend gardeners to marathon runners. We focus on flexibility and keeping your body moving the way it should.',
    benefits: ['Flexibility boost', 'Faster recovery', 'Injury prevention', 'Better performance'],
  },
  {
    id: 'trigger-point',
    name: 'Trigger Point Care',
    duration: '60 min',
    price: '$100',
    description: 'Targeted therapy for specific "knots" that cause pain in other parts of your body. Very effective for those dealing with recurring headaches or localized muscle pain.',
    benefits: ['Direct pain relief', 'Released muscle knots', 'Range of motion', 'Headache relief'],
  },
  {
    id: 'prenatal',
    name: 'Prenatal Massage',
    duration: '60 min',
    price: '$95',
    description: 'Tailored specifically for expectant mothers. I make sure you\'re comfortable and supported while we work on relieving that back pain and leg swelling.',
    benefits: ['Reduced swelling', 'Relieved back pain', 'Improved mood', 'Better hormone balance'],
  },
];

export default function ServicesPage() {
  return (
    <div className="py-24 bg-oak-50">
      <div className="container mx-auto px-4">
        <motion.div 
          initial="initial"
          animate="animate"
          variants={fadeIn}
          className="max-w-3xl mx-auto text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-oak-100 text-oak-700 text-sm font-bold mb-6 border border-oak-200">
            <Heart className="w-4 h-4" />
            <span>Honest Work • Fair Pricing</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-8 text-oak-950 leading-tight text-oak-950">How I can help.</h1>
          <p className="text-xl text-oak-800/70 leading-relaxed font-serif italic">
            "No complicated packages or corporate fluff. Just real, effective massage 
            tailored to what your body is telling us today."
          </p>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto"
        >
          {services.map((service) => (
            <motion.div 
              key={service.id} 
              id={service.id}
              variants={fadeIn}
              className={`group bg-white p-10 rounded-[2.5rem] border-2 transition-all duration-500 hover:shadow-xl ${
                service.popular ? 'border-oak-400 ring-4 ring-oak-400/5' : 'border-oak-100'
              }`}
            >
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
                <div>
                  {service.popular && (
                    <span className="inline-block bg-oak-700 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-3 uppercase tracking-widest font-serif">
                      Most Requested
                    </span>
                  )}
                  <h3 className="text-3xl font-serif font-bold text-oak-950">{service.name}</h3>
                </div>
                <div className="md:text-right bg-oak-50 px-6 py-3 rounded-2xl border border-oak-100">
                  <p className="text-oak-800 font-serif font-bold text-2xl">{service.price}</p>
                  <p className="text-oak-600/70 text-xs font-bold uppercase tracking-widest font-serif">{service.duration}</p>
                </div>
              </div>
              
              <p className="text-lg text-oak-800/80 mb-8 leading-relaxed italic">
                "{service.description}"
              </p>
              
              <div className="mb-10 bg-oak-50/50 p-8 rounded-3xl border border-oak-100/50">
                <h4 className="font-serif font-bold mb-5 text-oak-900 flex items-center gap-3">
                  <Check className="w-5 h-5 text-oak-600" /> Key Benefits:
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center text-sm text-oak-800 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-oak-400 mr-3 shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
              
              <Button asChild size="lg" className="w-full h-16 rounded-2xl text-lg font-serif font-bold bg-oak-800 hover:bg-oak-950 text-white shadow-xl shadow-oak-900/10 transition-transform hover:scale-[1.02]">
                <Link href="/book" className="flex items-center justify-center gap-2">
                  Book a Visit <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* Info Box */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-32 bg-oak-900 rounded-[3.5rem] p-10 md:p-20 max-w-6xl mx-auto text-white relative overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
            <div>
              <h2 className="text-4xl font-serif font-bold mb-8 leading-tight">Unsure what <br /><span className="text-oak-400 italic">your body needs?</span></h2>
              <p className="text-lg text-oak-200 mb-10 leading-relaxed italic">
                "It's my job to figure that out with you. Every first visit includes a 
                cup of tea and a proper talk about your history and what's hurting."
              </p>
              <div className="space-y-6">
                {[
                  "Complementary 10-minute consultation",
                  "Pressure is always adjusted to your comfort",
                  "I mix techniques based on what I feel during the session"
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-4 group">
                    <div className="bg-oak-800 p-2 rounded-xl group-hover:bg-oak-700 transition-colors">
                      <Check className="w-5 h-5 text-oak-400" />
                    </div>
                    <p className="font-medium text-oak-100 font-serif">{text}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md p-10 md:p-12 rounded-[3rem] border border-white/10 shadow-2xl">
              <h3 className="text-2xl font-serif font-bold mb-8 text-oak-400 tracking-tight">Small Comforts</h3>
              <ul className="space-y-6 mb-10">
                {[
                  ["Essential Oils", "Included"],
                  ["Hot Towel Focus", "+$15"],
                  ["CBD Balm", "+$25"],
                  ["Warm Foot Scrub", "+$20"]
                ].map(([name, price], i) => (
                  <li key={i} className="flex justify-between items-center group">
                    <span className="text-lg font-medium text-oak-100 group-hover:text-white transition-colors">{name}</span>
                    <span className={`font-bold ${price === 'Included' ? 'text-green-400' : 'text-white bg-white/10 px-4 py-1.5 rounded-xl border border-white/5'}`}>{price}</span>
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="w-full h-14 rounded-xl border-white/20 text-white hover:bg-white hover:text-oak-950 transition-all font-serif font-bold">
                <Link href="/contact">Have a Question?</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
