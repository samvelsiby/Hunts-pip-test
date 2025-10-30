# Money-Back Guarantee Component

## ✅ Component Overview

A fully responsive Money-Back Guarantee section for the landing page, featuring a modern card design with a 30-day guarantee badge.

## 🎨 Design Features

### Visual Elements
- **Red gradient card** with smooth color transitions (from-red-500 to-red-600)
- **Green hexagon badge** displaying "30 DAYS" in the top-right corner
- **White border effect** around the hexagon for depth
- **Decorative wave patterns** in the background (subtle opacity)
- **Image placeholder** on the left side (ready for your custom image)
- **Rounded corners** with responsive sizing (2.5rem on desktop)

### Typography
- **Large bold heading**: "Money-Back Guarantee"
- **Descriptive text**: Lorem ipsum placeholder (ready to customize)
- **Call-to-action button**: "See Pricing" with arrow icon

### Interactive Elements
- **Hover effects** on the CTA button
- **Arrow animation** that slides right on hover
- **Shadow effects** that intensify on hover

## 📱 Responsive Design

### Mobile (< 640px)
- **Single column layout**
- Content appears above image
- Smaller badge (24px × 28px)
- Reduced padding and spacing
- Text sizes: 3xl heading, sm body text
- Full-width button

### Tablet (640px - 1024px)
- **Single column layout** maintained
- Larger badge (32px × 36px)
- Medium padding
- Text sizes: 4xl heading, base body text
- Inline button with padding

### Desktop (> 1024px)
- **Two-column grid layout**
- Image on left, content on right
- Largest badge (40px × 44px)
- Maximum padding (4rem)
- Text sizes: 5xl-6xl heading, lg body text
- Badge positioned absolutely in top-right

## 🔧 Technical Implementation

### Component Location
```
/src/components/MoneyBackGuaranteeComponent.tsx
```

### Integration
Added to landing page (`/src/app/page.tsx`) between:
- Devices Section
- Pricing Section

### Key Technologies
- **React** with 'use client' directive
- **Tailwind CSS** for styling
- **Next.js Link** for navigation
- **SVG graphics** for hexagon and decorative elements

### CSS Classes Used
- Responsive grid: `grid lg:grid-cols-2`
- Gradient background: `bg-gradient-to-br from-red-500 via-red-500 to-red-600`
- Rounded corners: `rounded-3xl sm:rounded-[2.5rem]`
- Responsive padding: `p-6 sm:p-10 lg:p-16`
- Responsive text: `text-3xl sm:text-4xl lg:text-5xl xl:text-6xl`

## 🎯 Customization Guide

### 1. Replace Placeholder Image
Replace the placeholder div in line ~60 with your image:

```tsx
<div className="bg-gray-200 rounded-2xl sm:rounded-3xl w-full aspect-[4/3] lg:aspect-[3/4] shadow-xl overflow-hidden">
  <Image 
    src="/your-image.jpg" 
    alt="Money-back guarantee" 
    fill
    className="object-cover"
  />
</div>
```

### 2. Update Text Content
Replace the Lorem ipsum text with your actual guarantee details:

```tsx
<p className="text-white/90 text-sm sm:text-base lg:text-lg leading-relaxed max-w-md">
  Your custom guarantee text here. Explain your 30-day money-back policy.
</p>
```

### 3. Change Colors
Modify the gradient colors:

```tsx
// Current: Red gradient
className="bg-gradient-to-br from-red-500 via-red-500 to-red-600"

// Example: Blue gradient
className="bg-gradient-to-br from-blue-500 via-blue-500 to-blue-600"
```

### 4. Adjust Badge Days
Change the "30" to any number:

```tsx
<div className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-none">30</div>
```

### 5. Modify CTA Link
Update the button destination:

```tsx
<Link href="/pricing"> {/* Change to your desired route */}
  <button>See Pricing</button>
</Link>
```

## 📐 Layout Breakdown

### Structure
```
Section Container
└── Max Width Container (7xl)
    └── Relative Wrapper
        ├── Red Gradient Card
        │   ├── Decorative Wave SVG (background)
        │   └── Grid Container (2 columns on desktop)
        │       ├── Image Placeholder (left/bottom)
        │       └── Content (right/top)
        │           ├── Heading
        │           ├── Description
        │           └── CTA Button
        └── Green Hexagon Badge (absolute positioned)
            ├── White Border Layer
            ├── Green Hexagon
            └── Text Content
```

## 🎨 Color Palette

- **Primary Red**: `#ef4444` (red-500)
- **Dark Red**: `#dc2626` (red-600)
- **Guarantee Green**: `#22c55e` (green-500)
- **White**: `#ffffff`
- **Text White**: `rgba(255, 255, 255, 0.9)`

## ✨ Animation Details

### Button Hover
- Background: `white` → `gray-100`
- Shadow: `lg` → `xl`
- Arrow: Translates 4px to the right

### Transitions
- All transitions use `transition-all duration-300`
- Smooth easing for professional feel

## 📊 Spacing System

### Padding (Responsive)
- Mobile: `p-6` (1.5rem)
- Tablet: `p-10` (2.5rem)
- Desktop: `p-16` (4rem)

### Gap (Responsive)
- Mobile: `gap-8` (2rem)
- Desktop: `gap-12` (3rem)

### Vertical Spacing
- Section padding: `py-12 sm:py-16 lg:py-24`

## 🔍 Accessibility Features

- **Semantic HTML**: Proper section and heading tags
- **Alt text ready**: Image placeholder includes alt text guidance
- **Keyboard navigation**: Button is fully keyboard accessible
- **Focus states**: Default Tailwind focus rings
- **Color contrast**: White text on red background meets WCAG AA standards

## 📱 Testing Checklist

- [x] Mobile view (< 640px) - Single column, content above image
- [x] Tablet view (640px - 1024px) - Single column, larger elements
- [x] Desktop view (> 1024px) - Two columns, image left, content right
- [x] Badge positioning - Top-right corner, properly overlapping
- [x] Button hover effects - Smooth transitions
- [x] Text readability - All sizes legible on all devices
- [x] Link functionality - Routes to /pricing correctly

## 🚀 Performance

- **No external dependencies** beyond Next.js and Tailwind
- **Inline SVG** for optimal loading
- **Responsive images** ready (when you add your image)
- **Minimal JavaScript** (only for Link component)

## 📝 Notes

- The component uses 'use client' directive for Next.js App Router
- SVG hexagon is created with custom path for perfect shape
- Wave decorations are purely decorative (opacity: 0.1-0.2)
- Badge uses absolute positioning with negative margins for overlap effect
- All measurements are responsive using Tailwind's breakpoint system

## 🎯 Future Enhancements

Potential improvements you could add:

1. **Animation on scroll**: Fade in or slide in when visible
2. **Video background**: Replace image with video
3. **Countdown timer**: Show days remaining for special offer
4. **Testimonial integration**: Add customer quotes
5. **Multiple badges**: Add more guarantee features
6. **Dark mode support**: Alternative color scheme
7. **Parallax effect**: Subtle movement on scroll

## 🆘 Troubleshooting

### Badge not visible
- Check z-index: Badge should have `z-10`
- Verify positioning: Parent needs `relative` class

### Layout breaking on mobile
- Ensure `order-1` and `order-2` classes are present
- Check grid responsive classes: `grid lg:grid-cols-2`

### Button not clickable
- Verify Link component is imported from 'next/link'
- Check button is inside Link component

### Colors not matching
- Confirm Tailwind config includes all color values
- Check for custom color overrides in globals.css
