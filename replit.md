# Sweetend Cheese Cake - Replit Project Guide

## Overview

Sweetend Cheese Cake is a web application for ordering homemade cheesecakes with a booking system. The application allows customers to browse available cheesecake flavors, select pickup locations, schedule pickup times, and complete bookings. It features a vibrant, Instagram-worthy design inspired by premium food delivery platforms with a focus on mobile-first user experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React with TypeScript for UI components
- Vite as the build tool and development server
- Wouter for client-side routing
- TanStack Query (React Query) for server state management
- Shadcn/ui component library with Radix UI primitives
- Tailwind CSS for styling

**Design System:**
- Custom theme based on "New York" style from Shadcn
- Orange primary color (#FF8C00 range) as brand accent
- Responsive design with mobile-first approach
- Custom "dripping icing" visual motifs as decorative elements
- Typography using display fonts (Poppins/similar) for headers and clean sans-serif for body text

**Component Structure:**
- Atomic design pattern with reusable UI components in `client/src/components/ui/`
- Feature components (Hero, ProductCard, BookingForm, Footer) in `client/src/components/`
- Page components (Home, Confirmation) in `client/src/pages/`
- Custom hooks in `client/src/hooks/`

**Routing:**
- Single-page application with client-side routing
- Routes: Home (`/`), Confirmation (`/confirmation/:id`), 404 fallback
- Navigation handled by Wouter for lightweight routing

### Backend Architecture

**Technology Stack:**
- Node.js with Express.js for REST API
- TypeScript for type safety
- Drizzle ORM for database operations
- PostgreSQL as the database (via Neon serverless)
- Session-based approach prepared (connect-pg-simple)

**API Structure:**
- RESTful endpoints under `/api/` prefix
- Product endpoints: `GET /api/products`, `GET /api/products/:id`
- Location endpoints: `GET /api/locations`, `GET /api/locations/:id`
- Booking endpoints: `POST /api/bookings`, `GET /api/bookings/:id`
- Validation using Zod schemas from shared types

**Development vs Production:**
- Separate entry points: `server/index-dev.ts` with Vite middleware, `server/index-prod.ts` serving static assets
- Development mode includes HMR and Vite dev server integration
- Production build outputs to `dist/` directory

### Data Storage Solutions

**Database:**
- PostgreSQL database (configured for Neon serverless)
- Schema defined in `shared/schema.ts` using Drizzle ORM
- Three main tables:
  - `products`: Cheesecake products with flavor, description, price, and optional image
  - `locations`: Pickup locations with name, address, and hours
  - `bookings`: Customer orders with full booking details including customer info, product selection, quantity, location, and pickup time

**Type Safety:**
- Shared TypeScript types between client and server
- Zod schemas for runtime validation and type inference
- Drizzle Zod integration for automatic schema validation

**Fallback Storage:**
- In-memory storage implementation (`MemStorage` class) for development/testing
- Pre-seeded with sample products and locations matching the menu design

### External Dependencies

**UI Component Libraries:**
- Radix UI primitives (20+ components including Dialog, Popover, Select, Calendar, etc.)
- Shadcn/ui as component framework built on Radix UI
- Class Variance Authority for component variant management
- Embla Carousel for image carousels
- CMDK for command palette interfaces

**Styling:**
- Tailwind CSS with custom configuration
- PostCSS for CSS processing
- Custom CSS variables for theme management
- Autoprefixer for browser compatibility

**Form Management:**
- React Hook Form for form state management
- Hookform Resolvers for Zod schema integration
- Date-fns for date manipulation and formatting

**Database & ORM:**
- Drizzle ORM for type-safe database queries
- Drizzle Kit for migrations
- Neon serverless PostgreSQL client (@neondatabase/serverless)
- Connect-pg-simple for PostgreSQL session storage

**Development Tools:**
- TSX for TypeScript execution
- ESBuild for production builds
- Replit-specific plugins (dev banner, cartographer, runtime error overlay)
- React Icons for icon library (Instagram icon in footer)

**Build & Deployment:**
- Vite for frontend bundling and development server
- Separate build processes for client (Vite) and server (ESBuild)
- Static file serving in production mode
- Environment variable configuration via `DATABASE_URL`