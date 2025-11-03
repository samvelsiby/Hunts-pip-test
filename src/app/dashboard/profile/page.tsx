'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader2, Mail, Calendar, User, Shield, ExternalLink } from 'lucide-react';

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState('overview');

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
          <p className="text-muted-foreground mb-6">You need to be signed in to access this page.</p>
        </div>
      </div>
    );
  }

  const userInitials = user.firstName && user.lastName 
    ? `${user.firstName[0]}${user.lastName[0]}`
    : user.firstName 
      ? user.firstName[0]
      : 'U';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground mt-1">
          Manage your personal information and account settings.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.imageUrl} alt={user.fullName || 'User'} />
                <AvatarFallback className="text-xl">{userInitials}</AvatarFallback>
              </Avatar>
            </div>
            <CardTitle>{user.fullName || 'User'}</CardTitle>
            <CardDescription>{user.primaryEmailAddress?.emailAddress}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Badge variant="outline" className="mb-4">
              Free Plan
            </Badge>
            <div className="space-y-2 text-sm text-left">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user.primaryEmailAddress?.emailAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <a href="https://accounts.clerk.dev/user" target="_blank" rel="noopener noreferrer">
                Manage Account
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </CardFooter>
        </Card>

        {/* Profile Details Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>View and manage your account information.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="subscription">Subscription</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium">Personal Information</h3>
                  <Separator />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">First Name</p>
                    <p className="text-sm font-medium">{user.firstName || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Name</p>
                    <p className="text-sm font-medium">{user.lastName || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{user.primaryEmailAddress?.emailAddress}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">User ID</p>
                    <p className="text-sm font-medium truncate">{user.id}</p>
                  </div>
                </div>
                
                <div className="bg-gray-800/50 rounded-md p-4 mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-blue-400" />
                    <h4 className="text-sm font-medium">Profile Completion</h4>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
                    <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Complete your profile to get the most out of our platform.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="security" className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium">Security Settings</h3>
                  <Separator />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-400" />
                      <div>
                        <p className="text-sm font-medium">Password</p>
                        <p className="text-xs text-muted-foreground">Manage your password</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://accounts.clerk.dev/user/security" target="_blank" rel="noopener noreferrer">
                        Change
                      </a>
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-yellow-400" />
                      <div>
                        <p className="text-sm font-medium">Two-Factor Authentication</p>
                        <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://accounts.clerk.dev/user/security" target="_blank" rel="noopener noreferrer">
                        Setup
                      </a>
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="subscription" className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium">Subscription Details</h3>
                  <Separator />
                </div>
                
                <div className="bg-gray-800/50 rounded-md p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h4 className="text-sm font-medium">Current Plan</h4>
                      <p className="text-xs text-muted-foreground">Free Plan</p>
                    </div>
                    <Badge>Active</Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Features</span>
                      <span>Basic</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Indicators</span>
                      <span>3 included</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Support</span>
                      <span>Community</span>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex justify-end">
                    <Button asChild>
                      <a href="/pricing">Upgrade Plan</a>
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
