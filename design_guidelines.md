# Sweetend Cheese Cake - Design Guidelines

## Design Approach
**Reference-Based Approach** - Drawing inspiration from premium food delivery platforms (DoorDash, Grubhub) and artisanal dessert brands while incorporating the vibrant, playful brand identity from the provided assets.

**Core Principles:**
- Instagram-worthy visual presentation that makes users crave the product
- Seamless booking flow with minimal friction
- Bold use of brand orange with dripping icing motifs as visual accents
- Mobile-first approach (food ordering is predominantly mobile)

## Typography
- **Headers:** Rounded sans-serif font (Nunito/Quicksand weight 700-800) for playful, approachable feel
- **Body:** Clean sans-serif (Inter/Work Sans weight 400-500) for readability
- **Pricing/CTAs:** Bold weight (700) to draw attention
- **Hierarchy:** H1 (4xl-5xl), H2 (3xl-4xl), H3 (2xl), Body (base-lg)

## Layout System
**Spacing Units:** Tailwind 4, 6, 8, 12, 16 for consistent vertical rhythm
- Sections: py-16 to py-24 (desktop), py-12 (mobile)
- Cards: p-6 to p-8
- Component spacing: gap-6 to gap-8

## Component Library

**Navigation:**
- Sticky header with logo left, minimal menu center, "Book Now" CTA button right
- Mobile: Hamburger with slide-in menu

**Hero Section:**
- Full-width hero (90vh) with appetizing cheesecake image
- Overlay gradient (dark bottom fade) for text readability
- Centered headline: "Sweetend Cheese Cake - Where Every Slice is Sweet Bliss"
- Subheading about customization/freshness
- Dual CTAs: Primary "Order Now" + Secondary "View Menu" with blurred backgrounds

**Product Showcase:**
- Masonry grid or staggered card layout (2 cols mobile, 3-4 cols desktop)
- Each card: Large product image, flavor name, short description, price, "Add to Order" button
- Flavor badges with dripping icing borders
- Hover: Subtle lift effect

**Booking Section (Core Feature):**
- Multi-step visual flow or single-page form with clear sections
- Step 1: Product selection with quantity stepper
- Step 2: Location selector (dropdown or map-based cards showing branches)
- Step 3: Date picker + time slot grid (morning/afternoon/evening blocks)
- Step 4: Contact details (name, phone, email)
- Order summary sidebar (sticky on desktop) showing selections + total
- Confirmation page with booking details and countdown timer to pickup

**Location Cards:**
- Display branch name, address, operating hours, "Select Location" button
- Optional: Distance from user if geolocation enabled

**Footer:**
- Three columns: About/Menu, Locations, Social Media
- Newsletter signup: "Get Sweet Deals" with email input
- Instagram feed integration (4-6 recent posts)
- Contact: Phone, email, WhatsApp link

## Images

**Required Images:**
1. **Hero Image:** High-quality hero shot of signature cheesecake slice with dripping sauce, toppings visible, professional food photography lighting
2. **Product Images:** Individual shots for each flavor - Classic, Blueberry, Mango, Kiwi, Ki-ki Oreo (can use provided assets or request professional photos)
3. **Location Images:** Photos of each stall/branch (exterior/interior)
4. **About Section:** Behind-the-scenes baking or team photo for authenticity
5. **Instagram Grid:** Pull from actual Instagram feed if available

**Image Treatment:**
- Rounded corners (rounded-2xl) for warmth
- Subtle shadows for depth
- Maintain aspect ratio 4:3 or 1:1 for product cards

## Accessibility
- High contrast text on images (use overlays/blurred backgrounds)
- Clear focus states on form inputs and buttons
- Touch targets minimum 44x44px for mobile
- Date/time pickers with keyboard navigation support
- Form validation with clear error messages

## Key Interactions
- Smooth scroll to booking section from CTAs
- Quantity steppers with haptic feedback feel
- Calendar highlights available dates
- Time slots disable when fully booked
- Success animation on booking confirmation
- Minimal, purposeful animations - avoid distraction from food imagery

## Special Brand Elements
- Dripping icing SVG decorations as section dividers
- Orange accent color (#FF8C42 or similar from brand) for CTAs, highlights, active states
- Playful micro-copy: "Sweet your schedule", "Pick your slice moment"
- Sprinkle/confetti pattern as subtle background texture in hero or booking confirmation