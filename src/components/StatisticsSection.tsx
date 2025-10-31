'use client';

export default function StatisticsSection() {
  return (
    <div className="grid grid-cols-3 gap-4 sm:gap-8 lg:gap-16 max-w-3xl pt-8 sm:pt-12">
      {/* Satisfied Users */}
      <div className="text-left">
        <div className="flex gap-0.5 sm:gap-1 mb-2 sm:mb-3">
          <div className="w-6 h-6 sm:w-10 sm:h-10 bg-white rounded-full"></div>
          <div className="w-6 h-6 sm:w-10 sm:h-10 bg-white rounded-full -ml-2 sm:-ml-4"></div>
          <div className="w-6 h-6 sm:w-10 sm:h-10 bg-white rounded-full -ml-2 sm:-ml-4"></div>
        </div>
        <div className="text-xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">3,000+</div>
        <div className="text-gray-400 text-xs sm:text-sm">Satisfied user</div>
      </div>

      {/* Rating */}
      <div className="text-left">
        <div className="flex gap-0.5 sm:gap-1 mb-2 sm:mb-3">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="w-3 h-3 sm:w-5 sm:h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <div className="text-xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">4.8</div>
        <div className="text-gray-400 text-xs sm:text-sm">Rating</div>
      </div>

      {/* Funds Managed */}
      <div className="text-left">
        <div className="mb-2 sm:mb-3">
          <svg className="w-6 h-6 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div className="text-xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">20+ M</div>
        <div className="text-gray-400 text-xs sm:text-sm">Funds Managed</div>
      </div>
    </div>
  );
}
