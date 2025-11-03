# MUNTS PIP Dashboard

This document provides an overview of the dashboard implementation for the MUNTS PIP application.

## Features

- **Protected Routes**: All dashboard routes are protected with Clerk authentication
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **Responsive Design**: Works on mobile, tablet, and desktop devices
- **Dark Theme**: Consistent dark theme throughout the application

## Pages

### Dashboard Overview

- Main dashboard with tabs for Overview, Indicators, and Performance
- Trading performance visualization placeholders
- Plan information and features
- Quick actions for common tasks

### Settings

- TradingView account setup
- Notification preferences (placeholder)
- Appearance settings (placeholder)

### Profile

- User information display
- Account management
- Subscription details
- Security settings

### Indicators

- List of active and inactive indicators
- Filtering by category
- Search functionality
- Indicator management

## Architecture

### Protected Routes

All dashboard routes are protected using Clerk middleware. The routes are defined in `src/middleware.ts`:

```typescript
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/admin(.*)',
  '/api/user(.*)',
  '/api/billing(.*)',
  '/api/checkout(.*)',
  '/library/protected(.*)',
]);
```

### Layout

The dashboard uses a shared layout component (`DashboardLayout.tsx`) that provides:

- Sidebar navigation (desktop)
- Mobile navigation drawer
- Top header with user menu
- Consistent padding and structure

### User Data Management

User subscription data and TradingView username are stored in Clerk's metadata system:

- `UserSubscriptionData` interface defines the structure
- API routes for getting and updating user data
- Client-side components for managing user preferences

## Getting Started

1. Run the development server:
   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

3. Navigate to the dashboard at `/dashboard`

## Technologies Used

- Next.js 15.5.5
- Clerk for authentication
- shadcn/ui for UI components
- Tailwind CSS for styling
- Lucide icons

## Future Improvements

- Add real data integration for indicators
- Implement chart visualizations for performance metrics
- Add notification system
- Enhance mobile experience
- Add admin dashboard for managing users
