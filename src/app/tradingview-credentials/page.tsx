import { Suspense } from 'react';
import TradingViewCredentialsComponent from '@/components/TradingViewCredentialsComponent';

export default function TradingViewCredentialsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><div className="text-white text-xl">Loading...</div></div>}>
      <TradingViewCredentialsComponent />
    </Suspense>
  );
}
