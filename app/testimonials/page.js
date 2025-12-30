'use client';

import { Star, Quote, ArrowRight, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

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

const reviews = [
  {
    name: "Sarah J.",
    location: "Healing City",
    rating: 5,
    text: "Steve has been helping me with my chronic back pain for over a year now. He's not just a great therapist, he's a great listener. I always leave feeling lighter and more at ease.",
    date: "2 months ago",
    service: "Deep Tissue Care",
    img: "https://i.pravatar.cc/150?u=sarah"
  },
  {
    name: "Michael R.",
    location: "Wellness Park",
    rating: 5,
    text: "As someone who works with their hands all day, Steve is a lifesaver. He knows exactly where the tension is hiding. No corporate rush here, just honest, expert care.",
    date: "1 month ago",
    service: "Sports Recovery",
    img: "https://i.pravatar.cc/150?u=michael"
  },
  {
    name: "Elena G.",
    location: "Downtown",
    rating: 5,
    text: "The studio is so peaceful, and Steve is such a kind person. The Swedish massage was the most relaxing hour of my month. I felt like a whole new person walking out.",
    date: "3 weeks ago",
    service: "Swedish Relax",
    img: "https://i.pravatar.cc/150?u=elena"
  },
  {
    name: "David W.",
    location: "Suburbs",
    rating: 5,
    text: "I was skeptical about trigger point work, but Steve explained it all so clearly. He found tension I didn't even know was there. He's clearly got a lot of experience.",
    date: "4 months ago",
    service: "Trigger Point Care",
    img: "https://i.pravatar.cc/150?u=david"
  },
  {
    name: "Jennifer L.",
    location: "Uptown",
    rating: 5,
    text: "The prenatal massage was exactly what I needed. Steve made sure I was comfortable the entire time and really helped with my hip pain. Highly recommend!",
    date: "2 weeks ago",
    service: "Prenatal Care",
    img: "https://i.pravatar.cc/150?u=jennifer"
  }
];

export default function TestimonialsPage() {
  return (
    <div className="py-24 bg-oak-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          initial="initial"
          animate="animate"
          variants={fadeIn}
          className="max-w-4xl mx-auto text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-oak-100 text-oak-700 text-sm font-bold mb-6 border border-oak-200">
            <Heart className="w-4 h-4" />
            <span>Neighbor Stories</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-8 text-oak-950 tracking-tight leading-tight">Kind Words.</h1>
          <p className="text-xl text-oak-800/70 leading-relaxed max-w-2xl mx-auto font-serif italic">
            "I'm lucky to have such wonderful people come through my door. Here's what some 
            of my neighbors have said about our time together."
          </p>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          {reviews.map((review, index) => (
            <motion.div 
              key={index} 
              variants={fadeIn}
              className="bg-white p-10 rounded-[3rem] border border-oak-100 shadow-sm hover:shadow-xl transition-all duration-500 relative flex flex-col group"
            >
              <Quote className="absolute top-10 right-10 w-12 h-12 text-oak-100 group-hover:text-oak-200 transition-colors" />
              
              <div className="flex text-amber-500 mb-8">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              
              <p className="text-lg text-oak-800/80 italic mb-10 flex-grow leading-relaxed">
                "{review.text}"
              </p>
              
              <div className="pt-8 border-t border-oak-50 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-oak-100 overflow-hidden relative shadow-sm shrink-0">
                  <Image src={review.img} alt={review.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="font-serif font-bold text-oak-950 text-xl">{review.name}</p>
                  <div className="flex justify-between items-center text-xs font-bold text-oak-600/60 mt-1 uppercase tracking-widest">
                    <span>{review.service}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Google Reviews Callout */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-32 bg-white rounded-[4rem] p-12 md:p-20 text-center border-4 border-oak-100 max-w-5xl mx-auto relative overflow-hidden shadow-2xl shadow-oak-900/[0.05]"
        >
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 text-oak-950 tracking-tight">Highest Rated Locally</h2>
            <p className="text-xl text-oak-800/60 mb-12 max-w-2xl mx-auto leading-relaxed italic">
              "It's an honor to be one of the highest-rated therapists in the area. 
              You can read more verified stories from my neighbors on Google."
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button asChild size="lg" className="h-16 px-10 rounded-2xl bg-oak-800 hover:bg-oak-950 text-white text-lg font-serif font-bold shadow-xl transition-transform hover:scale-[1.05]">
                <a href="https://google.com/maps" target="_blank" rel="noopener noreferrer">Verified Google Reviews</a>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-16 px-10 rounded-2xl border-oak-200 text-oak-800 text-lg font-serif font-bold">
                <Link href="/book">Schedule Your Visit</Link>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 text-center"
        >
          <h2 className="text-4xl font-serif font-bold mb-10 text-oak-950">Ready to feel better?</h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button asChild size="lg" className="h-16 px-12 rounded-2xl bg-oak-800 hover:bg-oak-950 text-white text-xl font-serif font-bold shadow-2xl transition-transform hover:scale-[1.05]">
              <Link href="/book" className="flex items-center gap-2">Book a Visit <ArrowRight className="w-6 h-6" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-16 px-12 rounded-2xl font-serif font-bold text-xl border-oak-200 text-oak-800">
              <Link href="/contact">Ask me a Question</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
