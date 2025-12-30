import Link from 'next/link';
import { Coffee, Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-oak-950 text-oak-200 py-20 border-t border-oak-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-20">
          {/* Brand Column */}
          <div className="md:col-span-4">
            <Link href="/" className="flex items-center space-x-3 text-white mb-8 group">
              <div className="w-10 h-10 rounded-xl bg-oak-700 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                <Coffee className="w-6 h-6" />
              </div>
              <span className="text-xl font-serif font-bold tracking-tight">
                Steve's <span className="text-oak-400">Massage</span>
              </span>
            </Link>
            <p className="text-oak-300 mb-8 max-w-sm leading-relaxed italic">
              "Honest work and a warm heart. Helping my neighbors find 
              lasting relief, one session at a time."
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-oak-900 flex items-center justify-center hover:bg-oak-700 hover:text-white transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-oak-900 flex items-center justify-center hover:bg-oak-700 hover:text-white transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-oak-900 flex items-center justify-center hover:bg-oak-700 hover:text-white transition-all">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="md:col-span-2">
            <h4 className="text-white font-serif font-bold mb-6">Explore</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/services" className="hover:text-oak-400 transition-colors">How I Help</Link></li>
              <li><Link href="/about" className="hover:text-oak-400 transition-colors">My Story</Link></li>
              <li><Link href="/testimonials" className="hover:text-oak-400 transition-colors">Neighbor Stories</Link></li>
              <li><Link href="/book" className="hover:text-oak-400 transition-colors text-oak-400 font-bold">Book a Visit</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-3">
            <h4 className="text-white font-serif font-bold mb-6">Reach Out</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-oak-500" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-oak-500" />
                <span>hello@stevemassage.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-oak-500 mt-0.5" />
                <span>123 Wellness Way, Suite 100<br />Healing City, ST 12345</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div className="md:col-span-3">
            <h4 className="text-white font-serif font-bold mb-6">Studio Hours</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between border-b border-oak-900 pb-2">
                <span>Mon - Fri</span>
                <span className="text-white font-bold">9:00 - 19:00</span>
              </li>
              <li className="flex justify-between border-b border-oak-900 pb-2">
                <span>Saturday</span>
                <span className="text-white font-bold">10:00 - 16:00</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span className="text-white italic">Closed</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-oak-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-oak-500">
          <p>© {new Date().getFullYear()} Steve's Neighborhood Massage. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
