# Paper Theme Migration Checklist

Use this checklist to track the migration of all components to the paper theme.

## ✅ Completed

- [x] `components/PaperComponents.tsx` - Created comprehensive component library
- [x] `components/Home/Hero.tsx` - Already using paper theme
- [x] `components/Home/Navbar.tsx` - Migrated to fixed navbar with paper theme
- [x] `components/Home/AboutComponent.tsx` - Already using paper theme
- [x] `components/Home/Footer.tsx` - Already using paper theme
- [x] `components/EventCard.tsx` - **MIGRATED** ✨
- [x] `app/about/page.tsx` - Partially using paper theme
- [x] `app/gallery/page.tsx` - Already using paper theme
- [x] `app/sponsor/page.tsx` - Already using paper theme
- [x] `components/currentsponsor.tsx` - Already using paper theme

## 🔄 High Priority - Needs Migration

### Event Components
- [ ] `components/EventDetails.tsx` - Dark theme → Paper theme
- [ ] `components/EventDetailsList.tsx` - Dark theme → Paper theme
- [ ] `components/Eventspage.tsx` - Dark theme → Paper theme

### Sponsor Components
- [ ] `components/TexusSponsors.tsx` - Dark theme → Paper theme

### Dashboard Components
- [ ] `components/RegisteredEventsList.tsx` - Gradient cards → Paper theme
- [ ] `components/SupportTicketsList.tsx` - Gradient cards → Paper theme

## 📋 Medium Priority

### Event Pages
- [ ] `app/events/page.tsx` - Update to use paper components
- [ ] `app/events/technical/page.tsx` - Update event cards
- [ ] `app/events/nontechnical/page.tsx` - Update event cards
- [ ] `app/events/hackathon/page.tsx` - Update event cards
- [ ] `app/events/workshop/page.tsx` - Update event cards
- [ ] `app/events/musical-night/page.tsx` - Update event cards
- [ ] `app/events/about/page.tsx` - Update layout
- [ ] `app/events/sponsors/page.tsx` - Update sponsor cards

### User Pages
- [ ] `app/profile/page.tsx` - Update profile cards
- [ ] `app/support/page.tsx` - Update support interface
- [ ] `app/support/components/UserProfileCard.tsx` - Migrate card style

### Nilgiris (Global Summit)
- [ ] `app/nilgiris/page.tsx` - Check and update if needed
- [ ] `app/nilgiris/ConferenceDetails.tsx` - Update detail cards

## 🔧 Low Priority

### Payment & Forms
- [ ] `app/payment_portal/page.tsx` - Update payment interface
- [ ] `app/payment_portal/components/PaymentSection.tsx` - Migrate cards
- [ ] `app/register/page.tsx` - Update registration form

### Utility Pages
- [ ] `app/test-payment/page.tsx` - Update if needed
- [ ] `app/maintenance/page.tsx` - Update styling
- [ ] `app/failed/page.tsx` - Update error card

## 🎨 UI Components to Update

### Core UI (Shadcn)
- [ ] `components/ui/card.tsx` - Consider wrapping with paper styles
- [ ] `components/ui/badge.tsx` - Consider wrapping with paper styles
- [ ] `components/ui/button.tsx` - Add paper variant option
- [ ] `components/ui/dialog.tsx` - Add paper theme variant
- [ ] `components/ui/animated-modal.tsx` - Add paper theme

### Specialized Components
- [ ] `components/ui/3d-card.tsx` - Adapt to paper theme
- [ ] `components/ui/focus-cards.tsx` - Adapt to paper theme

## 📚 Documentation
- [x] Create `PAPER_THEME_GUIDE.md` - Complete component guide
- [x] Create `PAPER_THEME_IMPLEMENTATION.md` - Implementation summary
- [x] Create `PAPER_THEME_CHECKLIST.md` - This file
- [ ] Add JSDoc comments to all PaperComponents
- [ ] Create Storybook stories for components (optional)

## 🚀 Future Enhancements

### New Components to Create
- [ ] `PaperInput` - Text input with paper theme
- [ ] `PaperTextarea` - Textarea with paper theme
- [ ] `PaperSelect` - Dropdown select with paper theme
- [ ] `PaperCheckbox` - Checkbox with paper theme
- [ ] `PaperRadio` - Radio button with paper theme
- [ ] `PaperTable` - Table component with paper theme
- [ ] `PaperToast` - Toast notification with paper theme
- [ ] `PaperSkeleton` - Loading skeleton with paper theme
- [ ] `PaperAccordion` - Accordion with paper theme
- [ ] `PaperTabs` - Tabs component with paper theme

### Additional Features
- [ ] Add dark mode variant for paper theme (optional)
- [ ] Add animation presets for consistent motion
- [ ] Create theme configuration file for easy customization
- [ ] Add accessibility improvements (ARIA labels, keyboard nav)
- [ ] Performance optimization (lazy loading, memoization)

## 📝 Migration Instructions

For each component:

1. **Read the file** and identify all card/box/badge elements
2. **Import PaperComponents**:
   ```tsx
   import { 
     PaperCard, 
     PaperBadge, 
     PaperHeading,
     PaperText,
     PAPER 
   } from "@/components/PaperComponents";
   ```

3. **Replace old components**:
   - `<Card>` → `<PaperCard>` or `<PaperSimpleCard>`
   - `<Badge>` → `<PaperBadge>` or `<InkBadge>`
   - `<h1/2/3>` → `<PaperHeading>`
   - `<p>` → `<PaperText>`
   - Status badges → `<PaperStatusBadge>`
   - Buttons → `<PaperButton>`

4. **Update colors**:
   - Replace `purple-500`, `blue-500`, etc. with `PAPER.accent`
   - Replace `black`, `gray-900` backgrounds with paper texture
   - Use `PAPER.ink` for text and borders

5. **Test the component**:
   - Check hover states
   - Verify responsive behavior
   - Ensure readability
   - Test accessibility

6. **Update this checklist** by changing `[ ]` to `[x]`

## 🎯 Quick Reference

### Component Selection Guide

| What you need | Use this component |
|--------------|-------------------|
| Interactive card (hover) | `PaperCard` |
| Static card (no hover) | `PaperSimpleCard` |
| Large section | `PaperPanel` |
| Category/label | `PaperBadge` |
| Status (paid/pending) | `PaperStatusBadge` |
| Small tag | `InkBadge` |
| Tiny inline tag | `InkTag` |
| Date/info box | `PaperBox` |
| Button | `PaperButton` |
| Image card | `PolaroidCard` |
| Modal/dialog | `PaperDialog` |

### Common Replacements

```tsx
// Old → New
<Card> → <PaperCard> or <PaperSimpleCard>
<Badge> → <PaperBadge>
<Button> → <PaperButton>
className="bg-black/50" → // Remove, handled by component
className="border-purple-500" → // Remove, handled by component
className="shadow-xl" → // Remove, handled by component
```

## 💡 Tips

1. **Start with high-priority files** - They're user-facing and have the most impact
2. **Test incrementally** - Migrate one component at a time
3. **Keep old code commented** - Until you verify the new version works
4. **Use the guide** - `PAPER_THEME_GUIDE.md` has all the examples you need
5. **Be consistent** - Always use PaperComponents, never mix with old styles

## 📊 Progress Tracker

- **Completed**: 10 files ✅
- **High Priority**: 6 files 🔄
- **Medium Priority**: 12 files 📋
- **Low Priority**: 6 files 🔧
- **Total**: 34 files to migrate

**Progress**: ~29% Complete

---

Last Updated: 2026-01-25
