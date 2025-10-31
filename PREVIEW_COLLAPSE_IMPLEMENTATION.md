# Preview Collapse/Expand Implementation

## Summary

Successfully implemented a collapsible preview panel in the student challenge UI, allowing students to maximize their code editor space when they don't need to see the live preview.

---

## The Fix - Technical Explanation

### The Problem

The initial attempts to make the preview collapsible failed because of several conflicting approaches:

1. **First Attempt**: Tried to add collapse logic in the parent component with a new state, but the `PreviewSandbox` component already had its own internal collapse state, causing conflicts.

2. **Second Attempt**: Tried to hide the preview with CSS (`w-0` width) while keeping it mounted in the DOM, but flexbox conflicts between `flex-1` classes prevented proper expansion.

3. **Third Attempt**: The iframe's `srcdoc` attribute and sandbox restrictions were causing errors when the component was unmounted and remounted.

### The Solution

The final working solution combines three key strategies:

#### 1. **Explicit Width Control (Not Flexbox)**

Instead of relying on `flex-1` which can conflict, we use explicit width percentages:

```tsx
// Editor width
style={{ width: isPreviewCollapsed ? '100%' : '50%' }}

// Preview width
style={{ width: isPreviewCollapsed ? '0%' : '50%' }}
```

**Why this works**:
- Clear, predictable behavior
- No flexbox calculation conflicts
- Smooth CSS transitions with `transition-all duration-300`

#### 2. **Conditional Rendering (Unmount/Remount)**

The `PreviewSandbox` component is completely removed from the DOM when collapsed:

```tsx
{!isPreviewCollapsed && (
  <PreviewSandbox
    files={editorFiles}
    refreshTrigger={refreshTrigger}
    isCollapsed={isPreviewCollapsed}
    onCollapseChange={setIsPreviewCollapsed}
  />
)}
```

**Why this works**:
- Avoids iframe sandbox errors from keeping mounted but hidden iframes
- Cleans up memory when preview isn't needed
- Forces a fresh render when expanded, ensuring preview is up-to-date

#### 3. **Parent-Controlled State**

State management happens in the parent (`learn/page.tsx`), not the child component:

```tsx
// In parent component
const [isPreviewCollapsed, setIsPreviewCollapsed] = useState(false);

// Pass to PreviewSandbox
<PreviewSandbox
  isCollapsed={isPreviewCollapsed}
  onCollapseChange={setIsPreviewCollapsed}
/>
```

**Why this works**:
- Single source of truth for collapse state
- Parent can control both editor width and preview visibility
- Callback pattern allows PreviewSandbox to request state changes

---

## How It Works

### User Flow

1. **Default State (Expanded)**:
   - Editor: 50% width
   - Preview: 50% width
   - Preview shows toolbar with "Collapse Preview" button

2. **Click "Collapse Preview"**:
   - `PreviewSandbox` calls `onCollapseChange(true)`
   - Parent sets `isPreviewCollapsed = true`
   - Editor animates to 100% width
   - Preview shrinks to 0% width and unmounts
   - Floating "👁️ Show Preview" button appears

3. **Click "Show Preview"**:
   - Parent sets `isPreviewCollapsed = false`
   - Editor animates back to 50% width
   - Preview expands to 50% width and remounts
   - Preview content renders fresh

### Code Structure

```
learn/page.tsx (parent)
├── State: isPreviewCollapsed
├── Editor Section
│   └── Width: 100% when collapsed, 50% when expanded
├── Preview Section
│   ├── Width: 0% when collapsed, 50% when expanded
│   └── Conditional: Only render PreviewSandbox when !isPreviewCollapsed
└── Floating Button
    └── Only visible when isPreviewCollapsed
```

---

## Key Technical Decisions

### Why Not Keep Preview Mounted?

**Attempted**: Keeping the PreviewSandbox mounted but hidden with CSS (`w-0`, `overflow-hidden`)

**Problem**: The iframe would show console errors about `srcdoc` and sandbox attributes when hidden, and wouldn't properly re-render when shown again.

**Solution**: Unmount completely when collapsed, remount when expanded. This ensures:
- No background iframe errors
- Fresh render with current code
- Memory cleanup when not visible

### Why Explicit Widths Instead of Flex?

**Attempted**: Using `flex-1` and `w-0` together

**Problem**: Flexbox calculations would prioritize `flex-1` over `w-0`, causing the preview to not fully collapse or expand properly.

**Solution**: Use inline styles with explicit percentage widths that animate smoothly with CSS transitions.

### Why Parent State Instead of Child State?

**Attempted**: Letting PreviewSandbox manage its own collapse state

**Problem**: Parent component (learn/page.tsx) needs to know collapse state to adjust editor width and show/hide the floating button.

**Solution**: Lift state up to parent, pass down as props. Child can still request changes via callback.

---

## Files Modified

### apps/web/app/learn/page.tsx

**Added**:
- `isPreviewCollapsed` state
- Explicit width control for editor and preview sections
- Conditional rendering of PreviewSandbox
- Floating "Show Preview" button when collapsed

**Changed**:
- Editor section: Dynamic width (50% → 100% on collapse)
- Preview section: Dynamic width (50% → 0% on collapse)
- Layout: Removed flexbox conflicts, added inline styles

### apps/web/app/components/PreviewSandbox.tsx

**Added**:
- `isCollapsed` prop (optional, for controlled state)
- `onCollapseChange` callback prop
- Support for both controlled and uncontrolled collapse state

**Changed**:
- `handleToggle` function to call parent callback when controlled
- Removed internal collapse UI (since parent handles width animation)

---

## Benefits

✅ **More Screen Space**: Students can maximize editor to 100% width when coding

✅ **Clean Interface**: No distracting preview when not needed

✅ **Easy to Toggle**: One-click collapse/expand with clear visual feedback

✅ **Smooth Animations**: 300ms CSS transitions for professional feel

✅ **Fresh Renders**: Preview always shows latest code when expanded

✅ **Memory Efficient**: Preview iframe unmounts when collapsed

---

## Future Enhancements (Optional)

1. **Remember Preference**: Store collapse state in localStorage
2. **Keyboard Shortcut**: Add hotkey (e.g., Ctrl+P) to toggle preview
3. **Resize Handle**: Allow manual dragging to adjust editor/preview split
4. **Multiple Views**: Side-by-side, stacked, or PIP (picture-in-picture) modes
5. **Auto-collapse**: Automatically collapse on mobile/small screens

---

## Debugging Tips

If collapse/expand stops working in the future:

1. **Check State**: Add `console.log` in the onClick handlers to verify state changes
2. **Check Width**: Add background colors to editor/preview divs to see actual widths
3. **Check Rendering**: Add debug banner showing `isPreviewCollapsed` value
4. **Check Flexbox**: Remove all `flex-1` classes if adding new flex containers
5. **Check Z-Index**: Ensure floating button has high z-index (`z-50`)

---

**Status**: ✅ Complete and Working

**Date**: 2025-10-31

**Total Implementation Time**: ~2 hours of debugging and iterations
