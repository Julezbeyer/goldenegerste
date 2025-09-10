# Goldene Gerste - German Brewery Website

## Overview
This is a Next.js website for "Goldene Gerste", a German craft brewery based in Stuttgart. The site showcases their beer selection including Pils, Kellerpils, Hefeweizen, and Helles varieties with detailed product information, legal pages, and contact functionality.

## Project Architecture
- **Framework**: Next.js 14.2.16 with TypeScript
- **Styling**: TailwindCSS with custom variables and themes
- **Components**: Radix UI components library
- **Fonts**: Inter from Google Fonts
- **Analytics**: Vercel Analytics integration

## Current State
- ✅ Next.js development server running on port 5000
- ✅ All dependencies installed
- ✅ TypeScript compilation working
- ✅ Replit environment configured with proper host settings
- ✅ Deployment configuration set up for autoscale
- ⚠️ Missing some product images (hefeweizen-bottle.jpg, helles-bottle.jpg)

## Key Features
- Responsive brewery website with video hero section
- Product catalog with detailed beer specifications
- Cookie consent management
- Contact form functionality
- Legal pages (AGB, Impressum, Datenschutz, etc.)
- Mobile-responsive navigation with hamburger menu

## Development Setup
The project is configured to run in the Replit environment with:
- Frontend server on port 5000 (0.0.0.0:5000)
- Cache-Control headers disabled for development
- Hot reloading enabled

## Recent Changes
- Added cache-control headers to Next.js config for Replit
- Configured development server to bind to all hosts
- Set up workflow for automatic server startup