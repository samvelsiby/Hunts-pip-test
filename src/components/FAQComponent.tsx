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
      question: "Why do I need a custom strategy?",
      answer: "A custom trading strategy is tailored to your specific financial goals, risk tolerance, and market preferences. Unlike generic approaches, our custom strategies account for your unique circumstances, potentially leading to better performance and helping you navigate market volatility with greater confidence."
    },
    {
      question: "How do you provide us with the subscription",
      answer: "Our subscription service is delivered through our secure platform. Once you subscribe, you'll receive immediate access to your chosen plan's features via your dashboard. We provide regular updates, real-time signals, and comprehensive documentation to ensure you can maximize the value of your subscription."
    },
    {
      question: "How to not be foolish",
      answer: "Successful trading requires discipline, education, and strategic planning. We recommend starting with clear goals, developing a solid understanding of market fundamentals, diversifying your investments, and most importantly, making decisions based on analysis rather than emotions. Our educational resources can help guide you through this process."
    },
    {
      question: "How not to be dumb",
      answer: "Smart trading involves continuous learning, adapting to market changes, and maintaining realistic expectations. We encourage using proper risk management techniques, staying informed about market trends, and avoiding common pitfalls like overtrading or chasing losses. Our platform provides tools and insights to support informed decision-making."
    },
    {
      question: "Why are these questions so hard",
      answer: "Trading and investment questions often seem challenging because financial markets are complex and multifaceted. They involve understanding technical concepts, market psychology, and risk management principles. We strive to break down these complex topics into accessible information through our resources, support, and educational materials."
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
