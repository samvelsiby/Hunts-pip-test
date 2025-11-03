'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, BarChart3, TrendingUp, ChevronRight, Filter, Search } from 'lucide-react';
import Link from 'next/link';

// Define indicator type
interface Indicator {
  id: string;
  name: string;
  description: string;
  category: 'Trend' | 'Momentum' | 'Volatility' | 'Volume' | 'Custom';
  planAccess: 'free' | 'pro' | 'premium';
  isActive: boolean;
}

// Mock indicator data
const indicators: Indicator[] = [
  {
    id: 'ind-1',
    name: 'MACD Crossover',
    description: 'Moving Average Convergence Divergence indicator with signal line crossover alerts',
    category: 'Momentum',
    planAccess: 'free',
    isActive: true,
  },
  {
    id: 'ind-2',
    name: 'RSI Divergence',
    description: 'Relative Strength Index with bullish and bearish divergence detection',
    category: 'Momentum',
    planAccess: 'pro',
    isActive: true,
  },
  {
    id: 'ind-3',
    name: 'Bollinger Bands',
    description: 'Dynamic volatility bands with standard deviation multiplier',
    category: 'Volatility',
    planAccess: 'free',
    isActive: true,
  },
  {
    id: 'ind-4',
    name: 'Fibonacci Retracement',
    description: 'Automatic Fibonacci retracement levels with extension projections',
    category: 'Trend',
    planAccess: 'premium',
    isActive: false,
  },
  {
    id: 'ind-5',
    name: 'Volume Profile',
    description: 'Advanced volume analysis with point of control and value areas',
    category: 'Volume',
    planAccess: 'premium',
    isActive: true,
  },
];

export default function IndicatorsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  const filteredIndicators = indicators.filter(indicator => {
    const matchesSearch = indicator.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         indicator.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || indicator.category.toLowerCase() === categoryFilter.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });
  
  const activeIndicators = filteredIndicators.filter(ind => ind.isActive);
  const inactiveIndicators = filteredIndicators.filter(ind => !ind.isActive);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Indicators</h1>
          <p className="text-gray-400 mt-1">
            Manage your trading indicators and deploy them to TradingView.
          </p>
        </div>

      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search indicators..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full sm:w-[180px]">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Category" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="trend">Trend</SelectItem>
              <SelectItem value="momentum">Momentum</SelectItem>
              <SelectItem value="volatility">Volatility</SelectItem>
              <SelectItem value="volume">Volume</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="active">Active ({activeIndicators.length})</TabsTrigger>
          <TabsTrigger value="inactive">Inactive ({inactiveIndicators.length})</TabsTrigger>
          <TabsTrigger value="all">All ({filteredIndicators.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          <div className="grid gap-4">
            {activeIndicators.length > 0 ? (
              activeIndicators.map(indicator => (
                <IndicatorCard key={indicator.id} indicator={indicator} />
              ))
            ) : (
              <EmptyState message="No active indicators found matching your filters." />
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="inactive">
          <div className="grid gap-4">
            {inactiveIndicators.length > 0 ? (
              inactiveIndicators.map(indicator => (
                <IndicatorCard key={indicator.id} indicator={indicator} />
              ))
            ) : (
              <EmptyState message="No inactive indicators found matching your filters." />
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="all">
          <div className="grid gap-4">
            {filteredIndicators.length > 0 ? (
              filteredIndicators.map(indicator => (
                <IndicatorCard key={indicator.id} indicator={indicator} />
              ))
            ) : (
              <EmptyState message="No indicators found matching your filters." />
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Need More Indicators?</CardTitle>
          <CardDescription>
            Explore our full library of trading indicators and tools.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Our library includes over 50 professional-grade indicators for various trading strategies.
            Upgrade your plan to access premium indicators with advanced features.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/pricing">View Plans</Link>
          </Button>
          <Button asChild>
            <Link href="/library">
              Browse Library
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
      </div>
    </div>
  );
}

function IndicatorCard({ indicator }: { indicator: Indicator }) {
  const planColors = {
    free: 'bg-green-500/10 text-green-400 border-green-500/20',
    pro: 'bg-[#FF5B41]/10 text-[#FF5B41] border-[#FF5B41]/20',
    premium: 'bg-[#DD0000]/10 text-[#DD0000] border-[#DD0000]/20',
  };

  const categoryIcons = {
    Trend: <TrendingUp className="h-4 w-4" />,
    Momentum: <BarChart3 className="h-4 w-4" />,
    Volatility: <LineChart className="h-4 w-4" />,
    Volume: <BarChart3 className="h-4 w-4" />,
    Custom: <LineChart className="h-4 w-4" />,
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              {indicator.name}
              {!indicator.isActive && (
                <Badge variant="outline" className="ml-2 text-muted-foreground">
                  Inactive
                </Badge>
              )}
            </CardTitle>
            <CardDescription>{indicator.description}</CardDescription>
          </div>
          <Badge className={`${planColors[indicator.planAccess]} capitalize`}>
            {indicator.planAccess}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm">
          <Badge variant="secondary" className="flex items-center gap-1">
            {categoryIcons[indicator.category]}
            {indicator.category}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">
          Settings
        </Button>
        <Button size="sm">
          {indicator.isActive ? 'Update' : 'Activate'}
        </Button>
      </CardFooter>
    </Card>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="border border-dashed border-gray-700 rounded-lg p-8 text-center">
      <div className="mx-auto w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-4">
        <Search className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">No Indicators Found</h3>
      <p className="text-sm text-muted-foreground mb-4">{message}</p>
      <Button variant="outline" asChild>
        <Link href="/library">Browse Indicator Library</Link>
      </Button>
    </div>
  );
}
