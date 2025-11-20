'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Home, Settings, User, BookOpen } from 'lucide-react';

// Dynamically import UserButton to avoid hydration issues
const UserButton = dynamic(
  () => import('@clerk/nextjs').then((mod) => mod.UserButton),
  { ssr: false }
);
import BackgroundParticles from '@/components/BackgroundParticles';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

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
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-black relative overflow-hidden flex w-full">
        {/* Corner gradient */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div 
            className="absolute top-0 left-0 w-[600px] h-[600px] opacity-20 blur-3xl"
            style={{
              background: 'radial-gradient(circle, #DD0000 0%, #FF5B41 50%, transparent 70%)',
            }}
          />
        </div>
        
        {/* Background particles effect */}
        <BackgroundParticles />
        
        {/* Sidebar */}
        <Sidebar>
          <SidebarHeader>
            <Link href="/" className="flex items-center gap-2 px-4 py-2 hover:opacity-80 transition-opacity">
              <Image 
                src="/hunts-pip-logo.svg" 
                alt="HUNTS PIP Logo" 
                width={150} 
                height={40}
                className="w-full max-w-[150px] h-auto"
                priority
              />
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href}
                        className={cn(
                          pathname === item.href && "bg-gradient-to-r from-[#DD0000]/20 to-[#FF5B41]/20 text-white border-l-2 border-[#FF5B41]"
                        )}
                      >
                        <Link href={item.href}>
                          {item.icon}
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        
        {/* Main content */}
        <SidebarInset className="relative z-10">
          <div className="flex h-16 items-center gap-4 border-b border-gray-800 px-6 bg-black/50 backdrop-blur-sm sticky top-0 z-20">
            <SidebarTrigger />
            <div className="ml-auto flex items-center gap-4">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
          <main className="overflow-auto">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
