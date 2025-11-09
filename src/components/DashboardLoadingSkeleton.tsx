'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function DashboardLoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-9 w-64 bg-gray-800" />
          <Skeleton className="h-5 w-96 bg-gray-800" />
        </div>

        {/* Cards Grid Skeleton */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Subscription Card Skeleton */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <Skeleton className="h-6 w-48 bg-gray-800" />
              <Skeleton className="h-4 w-64 bg-gray-800 mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-24 bg-gray-800" />
                <Skeleton className="h-5 w-20 bg-gray-800" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-20 bg-gray-800" />
                <Skeleton className="h-5 w-16 bg-gray-800" />
              </div>
              <Skeleton className="h-32 w-full bg-gray-800 rounded-md mt-4" />
              <Skeleton className="h-10 w-full bg-gray-800 rounded-md" />
            </CardContent>
          </Card>

          {/* Active Indicators Card Skeleton */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <Skeleton className="h-6 w-40 bg-gray-800" />
              <Skeleton className="h-4 w-72 bg-gray-800 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-48 w-full bg-gray-800 rounded-md" />
            </CardContent>
          </Card>
        </div>

        {/* TradingView Username Card Skeleton */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <Skeleton className="h-6 w-48 bg-gray-800" />
            <Skeleton className="h-4 w-80 bg-gray-800 mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 bg-gray-800" />
              <Skeleton className="h-10 w-full bg-gray-800 rounded-md" />
              <Skeleton className="h-3 w-48 bg-gray-800" />
            </div>
            <Skeleton className="h-24 w-full bg-gray-800 rounded-md" />
            <div className="flex justify-between items-center pt-4">
              <Skeleton className="h-4 w-40 bg-gray-800" />
              <Skeleton className="h-10 w-32 bg-gray-800 rounded-md" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

