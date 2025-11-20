'use client';

import Link from "next/link";
import AuthButtons from './AuthButtons';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null;
  
  return (
    <div className="lg:hidden fixed inset-0 z-40 bg-black/95 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center h-full space-y-8 px-8">
        <Link 
          href="/library" 
          className="text-white hover:text-gray-300 text-lg"
          onClick={onClose}
        >
          Library
        </Link>
        <Link 
          href="/pricing" 
          className="text-white hover:text-gray-300 text-lg"
          onClick={onClose}
        >
          Pricing
        </Link>
        <div onClick={onClose}>
          <AuthButtons />
        </div>
      </div>
    </div>
  );
}
