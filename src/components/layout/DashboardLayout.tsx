'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { Menu, X, Home, Settings, User, BarChart3, BookOpen } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: <Home className="h-5 w-5" />,
  },
  {
    title: 'Indicators',
    href: '/dashboard/indicators',
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    title: 'Library',
    href: '/library',
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: <Settings className="h-5 w-5" />,
  },
  {
    title: 'Profile',
    href: '/dashboard/profile',
    icon: <User className="h-5 w-5" />,
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex flex-col w-64 bg-gray-900 border-r border-gray-800">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <span className="text-black font-bold text-lg">{`{}`}</span>
            </div>
            <span className="text-white text-xl font-bold">HUNTS PIP</span>
          </Link>
        </div>
        <Separator className="bg-gray-800" />
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    pathname === item.href
                      ? "bg-gray-800 text-white"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                  )}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Mobile navigation */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-50">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-gray-900 border-r border-gray-800">
          <div className="p-6">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <span className="text-black font-bold text-lg">{`{}`}</span>
              </div>
              <span className="text-white text-xl font-bold">MUNTS PIP</span>
            </Link>
          </div>
          <Separator className="bg-gray-800" />
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                      pathname === item.href
                        ? "bg-gray-800 text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                    )}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top navigation */}
        <header className="h-16 border-b border-gray-800 flex items-center justify-end px-6 md:px-8">
          <div className="flex items-center gap-4">
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
