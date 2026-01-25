# Paper Theme Style Guide

This guide explains how to use the consistent paper theme styling across the entire Texus'26 website.

## Theme Colors

```typescript
export const PAPER = {
  bg: "#F2F2F2",           // Paper background
  ink: "#12590F",          // Dark green ink for borders/text
  accent: "#79A677",       // Green accent
  lightAccent: "#ABBFA8",  // Light green accent
  shadow: "#12590F",       // Shadow color (same as ink)
  white: "#FFFFFF",        // White for buttons/cards
  purple: "#8B5CF6",       // Purple accent (optional)
  pink: "#EC4899",         // Pink accent (optional)
  green: "#10B981",        // Success green
};
```

## Core Components

All components are available in `@/components/PaperComponents`

### 1. PaperCard - Main Card Component

Perfect for feature cards, event cards, product displays.

```tsx
import { PaperCard } from "@/components/PaperComponents";

<PaperCard 
  hover={true}      // Enable hover animation (default: true)
  withTape={true}   // Show tape decorations (default: true)
  withTrees={true}  // Show tree decorations (default: true)
  className=""      // Additional classes
>
  <YourContent />
</PaperCard>
```

**Style:**
- Background: Paper texture
- Border: 3px solid ink
- Shadow: 8px 8px offset (12px on hover)
- Animations: Scale + rotation on hover
- Decorations: Tape on top, small trees on bottom

### 2. PaperSimpleCard - Static Card

For lists, static content, or cards without hover effects.

```tsx
<PaperSimpleCard 
  withTape={false}  // Optional tape (default: false)
  className=""
>
  <YourContent />
</PaperSimpleCard>
```

**Style:**
- Same as PaperCard but no hover effect
- Lighter shadow: 6px 6px
- Smaller padding by default

### 3. PaperPanel - Large Section Container

For major sections, hero areas, or large content blocks.

```tsx
<PaperPanel 
  padding="large"  // "small" | "medium" | "large"
  className=""
>
  <YourContent />
</PaperPanel>
```

**Style:**
- Larger border: 4px solid
- Larger shadow: 10px 10px
- More padding options

### 4. PaperBadge - Badge Component

For labels, categories, phases.

```tsx
<PaperBadge 
  color={PAPER.accent}  // Background color
  className=""
>
  PHASE 1
</PaperBadge>
```

**Style:**
- Rounded full (pill shape)
- 2px border
- 3px 3px shadow
- Bold font

### 5. PaperStatusBadge - Status Indicator

For payment status, event status, ticket status.

```tsx
<PaperStatusBadge 
  status="success"  // "default" | "success" | "warning" | "error" | "info"
  className=""
>
  PAID
</PaperStatusBadge>
```

**Colors:**
- default: Light green
- success: Green
- warning: Yellow
- error: Red
- info: Blue

### 6. InkBadge & InkTag - Small Tags

For tags, categories, inline labels.

```tsx
<InkBadge>Technical</InkBadge>
<InkTag>New</InkTag>
```

**Style:**
- InkBadge: Medium size, for standalone tags
- InkTag: Very small, for inline text

### 7. PaperBox - Date/Info Box

For dates, prices, important info.

```tsx
<PaperBox 
  color={PAPER.lightAccent}
  onClick={() => {}}  // Optional
  href="/link"        // Optional
>
  📅 FEB 14 & 15
</PaperBox>
```

**Style:**
- Rounded xl
- Interactive (hover + tap animations)
- Can be button or link

### 8. PaperButton - Button Component

Standard button with paper theme.

```tsx
<PaperButton 
  variant="default"  // "default" | "accent" | "white"
  onClick={() => {}}
  href="/link"       // Optional
  disabled={false}
>
  Click Me
</PaperButton>
```

**Variants:**
- default: Green accent background
- accent: Light green background
- white: White background

### 9. PaperTiltCard - Rotated Card

For dynamic, playful layouts.

```tsx
<PaperTiltCard tilt={-0.8}>
  <YourContent />
</PaperTiltCard>
```

**Style:**
- Same as PaperCard
- Default rotation applied
- Enhanced rotation on hover

### 10. PolaroidCard - Image Card

For galleries, team photos, etc.

```tsx
<PolaroidCard 
  image="/path/to/image.jpg"
  caption="Photo caption"
/>
```

**Style:**
- White background (like real polaroid)
- Square image with caption below
- Hover: scale + slight rotation

### 11. PaperDialog - Modal/Dialog

For modals and dialogs.

```tsx
<PaperDialog>
  <YourContent />
</PaperDialog>
```

**Style:**
- Large border and shadow
- Entry/exit animations
- Max width for readability

## Typography Components

### PaperHeading

```tsx
<PaperHeading 
  size="2xl"  // "xl" | "2xl" | "3xl" | "4xl"
>
  My Heading
</PaperHeading>
```

### PaperText

```tsx
<PaperText opacity={0.8}>
  Description text here
</PaperText>
```

## Decorative Components

### Tape

```tsx
<Tape 
  className="-top-4 left-6"
  rotate={-3}
/>
```

### CardTree

```tsx
<CardTree 
  side="left"     // "left" | "right"
  size={60}
  className="bottom-2 left-2"
/>
```

### DoodleLine

```tsx
<DoodleLine className="mx-auto my-4" />
```

### ArrowDecoration

```tsx
<ArrowDecoration className="bottom-4 right-4" />
```

## Complete Example - Event Card

```tsx
import { 
  PaperCard, 
  PaperBadge, 
  PaperHeading, 
  PaperText, 
  PaperBox,
  ArrowDecoration,
  PAPER 
} from "@/components/PaperComponents";

function EventCard({ event }) {
  return (
    <PaperCard hover={true} withTape={true}>
      {/* Badge */}
      <PaperBadge color={PAPER.accent}>
        {event.category}
      </PaperBadge>

      {/* Title */}
      <PaperHeading size="2xl">
        {event.title}
      </PaperHeading>

      {/* Description */}
      <PaperText>
        {event.description}
      </PaperText>

      {/* Date */}
      <PaperBox color={PAPER.lightAccent}>
        📅 {event.date}
      </PaperBox>

      {/* Arrow */}
      <ArrowDecoration className="bottom-6 right-6" />
    </PaperCard>
  );
}
```

## Migration Guide

### From Dark Theme to Paper Theme

**Before:**
```tsx
<div className="bg-black/50 border border-purple-500 rounded-xl p-6">
  <span className="bg-purple-600 px-3 py-1 rounded-full">Badge</span>
</div>
```

**After:**
```tsx
<PaperSimpleCard>
  <PaperBadge color={PAPER.accent}>Badge</PaperBadge>
</PaperSimpleCard>
```

### From Shadcn Card to Paper Card

**Before:**
```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

**After:**
```tsx
import { PaperCard, PaperHeading, PaperText } from "@/components/PaperComponents";

<PaperCard>
  <PaperHeading size="xl">Title</PaperHeading>
  <PaperText>Content</PaperText>
</PaperCard>
```

### From Standard Badge to Paper Badge

**Before:**
```tsx
<span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
  Badge
</span>
```

**After:**
```tsx
<PaperBadge>Badge</PaperBadge>
```

## Best Practices

1. **Consistency**: Use paper components everywhere for visual consistency
2. **Hover Effects**: Enable hover on interactive elements, disable on static lists
3. **Decorations**: Use tape/trees sparingly on important cards only
4. **Colors**: Stick to PAPER colors for brand consistency
5. **Spacing**: Use consistent padding (small/medium/large)
6. **Typography**: Always use PaperHeading and PaperText for text in cards

## Component Matrix

| Use Case | Component |
|----------|-----------|
| Interactive feature card | PaperCard with hover |
| List item | PaperSimpleCard |
| Large section | PaperPanel |
| Category label | PaperBadge |
| Status indicator | PaperStatusBadge |
| Small tag | InkBadge or InkTag |
| Date/info display | PaperBox |
| Button | PaperButton |
| Image with caption | PolaroidCard |
| Modal/Dialog | PaperDialog |
| Playful card | PaperTiltCard |

## Files to Update

Priority files that need paper theme migration:

1. ✅ `components/Home/Hero.tsx` - Already using paper theme
2. ✅ `components/Home/Navbar.tsx` - Already using paper theme
3. ✅ `components/Home/AboutComponent.tsx` - Already using paper theme
4. ❌ `components/EventCard.tsx` - Needs migration from dark theme
5. ❌ `components/TexusSponsors.tsx` - Needs migration from dark theme
6. ❌ `components/RegisteredEventsList.tsx` - Needs migration
7. ❌ `components/SupportTicketsList.tsx` - Needs migration
8. ❌ `app/about/page.tsx` - Partial migration needed
9. ❌ `app/events/page.tsx` - Needs migration
10. ❌ Other event-related pages

---

## Questions?

Refer to `components/PaperComponents.tsx` for implementation details and prop types.
