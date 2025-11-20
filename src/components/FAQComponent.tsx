'use client';

import { useState } from 'react';
import Link from 'next/link';

// FAQ item type definition
interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQComponent() {
  // State to track which FAQ is open
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Toggle FAQ open/close
  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // FAQ data
  const faqs: FAQItem[] = [
    {
      question: 'How does HuntsPip work?',
      answer:
        'Once you choose a plan, you’ll get instant access to your dashboard along with an email link for convenience. You’ll be guided to connect your TradingView and Discord accounts, both completely free. From there, you can start using our tools right away on your charts. We use Stripe  for secure payments, and all credentials are safely encrypted for full protection.'
    },
    {
      question: 'Which markets do your indicators support?',
      answer:
        'All Hunts Pip indicators work on any market available on TradingView, including forex, crypto, stocks, indices, and commodities. You can use them across all timeframes such as 1m, 5m, 15m, 1H, 4H, and 1D, making them suitable for scalping, swing trading, or investing.'
    },
    {
      question: 'Can I use Hunts Pip on MetaTrader 4 or 5?',
      answer:
        'Currently, our indicators are built exclusively for TradingView, a free and web-based charting platform. You can analyze trades using Hunts Pip tools on TradingView and then execute your positions on MT4, MT5, or any other platform in real time.'
    },
    {
      question: 'Does HuntsPip guarantee profits?',
      answer:
        'No trading system or indicator can guarantee profits or 100% accuracy. Hunts Pip provides powerful analytical tools to help you make informed decisions, not predictions. Trading involves risk, and results will always vary depending on the trader’s skill, discipline, and market conditions.'
    },
    {
      question: 'Is HuntsPip suitable for beginners?',
      answer:
        'Absolutely. Our platform is designed for all experience levels. Beginners can follow our tutorials, learn visually with our Learning Accelerator, and engage with a supportive community for guidance. Advanced traders can take advantage of our customization features and multi–time frame analysis for deeper insights.'
    },
    {
      question: 'What makes HuntsPip different from other indicator providers?',
      answer:
        'Unlike most tools that offer limited settings, Hunts Pip gives you full customization and flexibility. You can tailor each indicator to your trading style, adjust visuals, alerts, and parameters, and access insights across multiple timeframes — all neatly organized for easy execution and learning.'
    },
    {
      question: 'What do I get with my subscription?',
      answer:
        'Every subscription includes access to a complete trading toolkit — not just one indicator. You’ll receive a growing collection of tools, with new indicators added regularly, ensuring you always have the latest market technology and analysis power.'
    }
  ];

  return (
    <section className="relative z-10 px-4 sm:px-8 py-16 sm:py-20 lg:py-24" style={{
      background: 'linear-gradient(to bottom right, rgba(0,0,0,0.9), rgba(128,0,0,0.2), rgba(0,0,0,0.9))',
      backgroundSize: '200% 200%',
    }}>
      <div className="max-w-3xl mx-auto">
        {/* FAQ Header */}
        <div className="text-center mb-12">
          <div className="text-red-500 font-medium mb-2">FAQ</div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-400 text-sm sm:text-base">
            We have compiled list of frequently asked questions to provide you with
            quick and comprehensive answers.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-[#2A2A2C] backdrop-blur-sm rounded-lg overflow-hidden border border-gray-700/50 transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center"
                aria-expanded={openIndex === index}
              >
                <span className="text-white font-medium text-sm sm:text-base">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openIndex === index ? 'transform rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Answer Panel */}
              <div 
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-4 text-gray-300 text-sm sm:text-base">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Link */}
        <div className="text-center mt-8 text-sm text-gray-400">
          More questions? <Link href="/contact" className="text-red-500 hover:text-red-400 transition-colors">Contact Us</Link>
        </div>
      </div>
    </section>
  );
}
