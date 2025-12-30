'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X, Coffee } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? 'bg-oak-50/90 backdrop-blur-xl border-b border-oak-200 py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container flex items-center justify-between mx-auto px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="group flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              scrolled ? 'bg-oak-700 text-white' : 'bg-white text-oak-700 shadow-md'
            }`}>
              <Coffee className="w-5 h-5" />
            </div>
            <span className={`text-xl font-serif font-bold tracking-tight transition-colors ${
              scrolled ? 'text-oak-950' : 'text-oak-950'
            }`}>
              Steve's <span className="text-oak-600">Massage</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10 text-sm font-semibold">
          {[
            ['Services', '/services'],
            ['About', '/about'],
            ['Testimonials', '/testimonials'],
            ['Contact', '/contact'],
          ].map(([name, url]) => (
            <Link 
              key={name} 
              href={url} 
              className={`transition-colors font-serif text-oak-800 hover:text-oak-600`}
            >
              {name}
            </Link>
          ))}
          <Button asChild className="bg-oak-700 hover:bg-oak-800 rounded-xl px-8 font-serif font-bold text-white shadow-lg shadow-oak-900/10">
            <Link href="/book">Book Now</Link>
          </Button>
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className={`md:hidden p-2 rounded-xl transition-colors text-oak-950 hover:bg-oak-100`} 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-oak-100 overflow-hidden bg-white shadow-2xl"
          >
            <div className="flex flex-col gap-2 p-6">
              {[
                ['Services', '/services'],
                ['About', '/about'],
                ['Testimonials', '/testimonials'],
                ['Contact', '/contact'],
              ].map(([name, url]) => (
                <Link 
                  key={name} 
                  href={url} 
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 rounded-xl text-lg font-serif font-medium text-oak-800 hover:bg-oak-50 hover:text-oak-600 transition-all"
                >
                  {name}
                </Link>
              ))}
              <div className="pt-4">
                <Button asChild className="w-full h-14 bg-oak-700 text-lg rounded-xl font-serif font-bold text-white">
                  <Link href="/book" onClick={() => setIsOpen(false)}>Book Your Visit</Link>
                </Button>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
