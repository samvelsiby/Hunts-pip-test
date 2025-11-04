'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function FooterComponent() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Here you would typically send this to your backend
      console.log('Subscribing email:', email);
      setSubscribed(true);
      setEmail('');
      
      // Reset the subscribed state after 3 seconds
      setTimeout(() => {
        setSubscribed(false);
      }, 3000);
    }
  };

  return (
    <footer className="relative bg-black text-white pt-16 pb-8 overflow-hidden">
      {/* Background stars */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-1 h-1 bg-white/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1.5 h-1.5 bg-white/20 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-60 left-1/3 w-1 h-1 bg-white/25 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute bottom-40 right-1/4 w-1 h-1 bg-white/20 rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-20 left-1/5 w-1.5 h-1.5 bg-white/30 rounded-full animate-pulse delay-1500"></div>
      </div>

      {/* Top border line */}
      <div className="border-t border-gray-800 max-w-7xl mx-auto"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-12">
          {/* Column 1: Company */}
          <div>
            <h3 className="text-lg font-medium mb-6">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">About</Link></li>
              <li><Link href="/pricing" className="text-gray-400 hover:text-white transition-colors text-sm">Pricing</Link></li>
              <li><Link href="/docs" className="text-gray-400 hover:text-white transition-colors text-sm">Knowledge Base</Link></li>
              <li><Link href="/support" className="text-gray-400 hover:text-white transition-colors text-sm">Support</Link></li>
              <li><Link href="/careers" className="text-gray-400 hover:text-white transition-colors text-sm">Careers</Link></li>
              <li><Link href="/open-source" className="text-gray-400 hover:text-white transition-colors text-sm">Open Source</Link></li>
              <li><Link href="/strategies-kit" className="text-gray-400 hover:text-white transition-colors text-sm">Strategies Kit</Link></li>
            </ul>
          </div>

          {/* Column 2: Legal */}
          <div>
            <h3 className="text-lg font-medium mb-6">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="/imprint" className="text-gray-400 hover:text-white transition-colors text-sm">Imprint</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">Terms & Condition</Link></li>
              <li><Link href="/transparency" className="text-gray-400 hover:text-white transition-colors text-sm">Transparency Report</Link></li>
              <li><Link href="/threat-model" className="text-gray-400 hover:text-white transition-colors text-sm">Threat Model</Link></li>
              <li><Link href="/report-abuse" className="text-gray-400 hover:text-white transition-colors text-sm">Report Abuse</Link></li>
            </ul>
          </div>

          {/* Column 3: Subscribe */}
          <div>
            <h2 className="text-3xl font-medium mb-3">Subscribe</h2>
            <div className="relative">
              <div className="absolute -top-2 -right-4 w-full max-w-xs">
                <Image 
                  src="/animations/Commet.svg" 
                  alt="Comet" 
                  width={470} 
                  height={109} 
                  className="w-full"
                />
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-6 max-w-xs">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean cursus elit nec dictum pharetra.
            </p>
            
            <div className="mt-8">
              <p className="text-sm text-white mb-2">Stay up to date</p>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-grow bg-gray-800 border border-gray-700 rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-red-500 text-white text-sm"
                  required
                />
                <button
                  type="submit"
                  className="bg-red-500 hover:bg-red-600 text-white font-medium rounded-full px-6 py-2 transition-colors text-sm"
                >
                  Subscribe
                </button>
              </form>
              {subscribed && (
                <p className="text-green-500 mt-2 text-xs">Thank you for subscribing!</p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                By subscribing you agree to with our <Link href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom section with copyright */}
        <div className="border-t border-gray-800 pt-6 mt-4 text-center">
          <p className="text-xs text-gray-500">
            © 2025 HUNTS PIP. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
