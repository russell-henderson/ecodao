# EcoDAO Brand Guidelines

## Brand Philosophy

**Core Values**: Trust, Growth, Community, Transparency
**Design Philosophy**: Clean minimalism that breathes life into environmental action
**Voice**: Empowering, trustworthy, forward-thinking, inclusive

## Color Palette

### Primary Colors

**Forest Green** - `#22C55E` (Primary Action)

- Use: CTAs, active states, success messages
- Psychology: Growth, sustainability, action
- Accessibility: Excellent contrast on white/light backgrounds

**Ocean Blue** - `#3B82F6` (Secondary Action)  

- Use: Links, secondary buttons, governance elements
- Psychology: Trust, stability, democracy
- Accessibility: Strong contrast, readable text

**Pure White** - `#FFFFFF` (Foundation)

- Use: Primary background, card backgrounds
- Creates breathing room and clarity
- Represents transparency and openness

### Supporting Colors

**Sage Green** - `#10B981` (Success States)

- Verified actions, completed projects
- Softer alternative to primary green

**Sky Blue** - `#06B6D4` (Information)

- Voting status, informational elements
- Lighter, more approachable than ocean blue

**Stone Gray** - `#6B7280` (Text Secondary)

- Secondary text, descriptions, metadata
- Maintains readability without overwhelming

**Slate Dark** - `#1E293B` (Text Primary)

- Primary text, headings
- Strong contrast while remaining approachable

### Accent Colors

**Mint** - `#A7F3D0` (Highlights)

- Subtle backgrounds for success states
- Card hover effects, gentle emphasis

**Powder Blue** - `#DBEAFE` (Info Backgrounds)

- Governance notifications, info cards
- Non-intrusive information delivery

**Warm Gray** - `#F9FAFB` (Neutral Background)

- Section backgrounds, card containers
- Creates subtle depth without distraction

### Status Colors

**Success** - `#10B981` (Sage Green)
**Warning** - `#F59E0B` (Amber - sparingly used)
**Error** - `#EF4444` (Red - minimal usage)
**Info** - `#06B6D4` (Sky Blue)

## Typography

### Primary Font: **Inter**

- Clean, modern, excellent readability
- Strong in both headlines and body text
- Web-optimized with multiple weights

### Font Hierarchy

**Display** - Inter Bold, 48px+

- Hero sections, major headings
- Color: Slate Dark or Pure White (on dark backgrounds)

**Headline** - Inter Semibold, 32-40px

- Section headers, page titles
- Color: Slate Dark

**Subheading** - Inter Medium, 20-24px  

- Card titles, form headers
- Color: Slate Dark or Stone Gray

**Body** - Inter Regular, 16px

- Primary content, descriptions
- Color: Slate Dark
- Line height: 1.6 for optimal readability

**Caption** - Inter Medium, 14px

- Metadata, timestamps, small labels
- Color: Stone Gray

## Logo & Icon System

### Logo Concept

**EcoDAO Mark**: Stylized "V" incorporating:

- Upward arrow (growth/progress)
- Leaf element (sustainability)
- Geometric precision (blockchain/trust)

### Icon Style

- **Stroke-based icons** using Lucide React
- 24px standard size, scalable
- Consistent 2px stroke width
- Rounded line caps for friendliness

### Color Usage in Icons

- **Primary actions**: Forest Green
- **Secondary elements**: Ocean Blue  
- **Neutral states**: Stone Gray
- **On dark backgrounds**: Pure White

## Layout & Spacing

### Grid System

- **Container max-width**: 1200px
- **Responsive breakpoints**: Mobile-first approach
- **Column gaps**: 24px (desktop), 16px (mobile)

### Spacing Scale (Tailwind-based)

- **xs**: 4px - Tight element spacing
- **sm**: 8px - Component internal spacing  
- **md**: 16px - Card padding, button spacing
- **lg**: 24px - Section spacing
- **xl**: 32px - Major layout divisions
- **2xl**: 48px - Page section separation
- **3xl**: 64px - Hero sections, major breaks

### White Space Philosophy

- **Generous padding** around all interactive elements
- **Clear visual separation** between content sections
- **Breathing room** prevents cognitive overload
- **Asymmetrical balance** creates visual interest

## Component Design Principles

### Cards

```css
Background: Pure White
Border: 1px solid #E5E7EB (subtle gray)
Border Radius: 12px (friendly, modern)
Box Shadow: 0 1px 3px rgba(0, 0, 0, 0.1) (subtle depth)
Padding: 24px (generous internal spacing)
```

### Buttons

**Primary Button**:

- Background: Forest Green (#22C55E)
- Text: Pure White
- Padding: 12px 24px
- Border Radius: 8px
- Hover: Darken by 10%

**Secondary Button**:

- Border: 2px solid Ocean Blue
- Text: Ocean Blue  
- Background: Transparent
- Same padding and radius
- Hover: Fill with Ocean Blue, white text

### Form Elements

- **Clean borders**: 1px solid Stone Gray
- **Focus states**: Ocean Blue border, subtle glow
- **Generous padding**: 12px 16px
- **Consistent heights**: 48px for optimal touch targets

## Data Visualization

### Chart Colors

**Primary Data**: Forest Green (#22C55E)
**Secondary Data**: Ocean Blue (#3B82F6)  
**Tertiary Data**: Sky Blue (#06B6D4)
**Background Grids**: Light Gray (#F3F4F6)

### Progress Indicators

- **Complete**: Forest Green
- **In Progress**: Ocean Blue
- **Pending**: Stone Gray
- **Background Track**: Warm Gray

## Animation & Micro-interactions

### Timing

- **Quick transitions**: 150ms (hover states)
- **Standard transitions**: 300ms (page elements)
- **Loading animations**: 1000ms loops

### Easing

- **ease-out** for entrances (snappy, responsive feeling)
- **ease-in-out** for state changes (smooth, professional)

### Hover Effects

- **Scale**: 1.02 for cards (subtle lift)
- **Opacity**: 0.8 for secondary elements
- **Color transitions**: Always 150ms duration

## Accessibility Standards

### Contrast Ratios

- **Text on White**: Minimum 4.5:1 (WCAG AA)
- **Interactive elements**: Minimum 3:1
- **All primary combinations**: Tested for compliance

### Focus States

- **Visible focus rings**: 2px Ocean Blue outline
- **Skip navigation**: For keyboard users
- **Screen reader**: Semantic HTML throughout

## Usage Guidelines

### Do's

✅ Use generous white space to create calm, approachable interfaces
✅ Maintain consistent spacing using the defined scale  
✅ Keep Forest Green for primary actions only
✅ Use Ocean Blue for secondary actions and links
✅ Leverage Pure White as the foundation for trust and clarity

### Don'ts  

❌ Overcrowd interfaces - embrace minimalism
❌ Use colors outside the defined palette
❌ Make interactive elements smaller than 44px touch targets
❌ Use pure black text - Slate Dark is warmer and more approachable
❌ Apply multiple accent colors in the same component

## Brand Applications

### Web Interface Priority

1. **White space first** - Let content breathe
2. **Forest Green for key actions** - Vote, Submit, Create
3. **Ocean Blue for navigation** - Links, secondary actions
4. **Stone Gray for supporting text** - Timestamps, descriptions
5. **Subtle shadows and borders** - Create depth without distraction

### Community Feel

- **Warm, approachable color temperatures**
- **Consistent, predictable interactions**  
- **Clear information hierarchy**
- **Trustworthy, transparent design patterns**

This palette speaks to environmental stewardship while maintaining the technological sophistication needed for blockchain governance. The generous use of white space creates trust and clarity - essential for community decision-making platforms.
