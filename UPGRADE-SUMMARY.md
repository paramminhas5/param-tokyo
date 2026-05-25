# 🎮 Param Tokyo - Pokemon Aesthetic Upgrade Summary

## Overview

Your game/resume has been completely transformed with:
1. **Authentic Pokemon Gen 1-3 (GBA) aesthetic** prompts
2. **Minimax video generation** support for animated backgrounds
3. **50+ standalone prompts** ready to test in any AI tool
4. **5-layer optimized parallax** (down from 9)
5. **Comprehensive performance optimizations** (60fps target)

---

## 📁 Files Modified

### New Files Created
- **`PROMPTS.md`** - All 50+ prompts for testing in different tools
- **`PERFORMANCE.md`** - Complete performance optimization guide
- **`UPGRADE-SUMMARY.md`** - This document

### Files Updated
- **`scripts/manifest.mjs`** - Pokemon-style prompts for all assets
- **`scripts/lib/fal.mjs`** - Added Minimax video generation functions
- **`src/components/WorldStage.tsx`** - Reduced layers, GPU acceleration
- **`src/components/GlobalHero.tsx`** - translate3d transforms
- **`src/game/progress.ts`** - Throttled scroll handling (60fps)
- **`src/app/globals.css`** - GPU acceleration, image rendering optimization

---

## 🎨 Art Style Transformation

### Before: Generic 16-bit
```
"16-bit pixel art, retro game aesthetic, sharp pixel edges, 
no anti-aliasing, limited palette, screen-print poster style"
```

### After: Pokemon GBA Authentic
```
"authentic Pokemon pixel art style, Game Boy Advance era, 
isometric perspective, 56-color palette maximum, dithered gradients, 
sharp clean pixels, no blur, no anti-aliasing, tile-based environmental 
design, Nintendo GBA aesthetic"
```

### Key Changes
- ✅ Isometric perspective (like Pokemon routes)
- ✅ 56-color palette limit (GBA hardware constraint)
- ✅ Dithered gradients (authentic retro technique)
- ✅ Tile-based design vocabulary
- ✅ Environmental storytelling through sprites/objects
- ✅ Pokemon-specific terminology (sprites, tiles, objects, GBA aesthetic)

---

## 🎬 Video Generation Support

Added two Minimax functions to `scripts/lib/fal.mjs`:

### 1. Image-to-Video
```javascript
callMinimaxVideo({
  imageUrl: "path/to/image.png",
  prompt: "gentle clouds drifting left, subtle parallax",
  duration: 5,
  seed: 12345
})
```

**Use Cases:**
- Animated sky backgrounds (drifting clouds)
- Flowing water effects
- Particle animations
- Ambient environmental motion

### 2. Text-to-Video
```javascript
callMinimaxTextToVideo({
  prompt: "Pokemon GBA style sky with drifting clouds",
  duration: 5,
  aspectRatio: "16:9",
  seed: 12345
})
```

**Use Cases:**
- Fully generative animated backgrounds
- Character animations
- Special effects

### Cost Estimate
- **Minimax video**: ~$0.02-0.05 per 5-second video
- **Full set** (9 animated skies): ~$0.20-0.45
- **Optional**: Only animate key worlds to save cost

---

## 📝 Standalone Prompts

Created `PROMPTS.md` with all prompts organized by:

### Categories
1. **Hero Character** (idle + walk poses)
2. **Title Screen**
3. **9 Worlds** - each with:
   - Sky background
   - Far silhouette layer
   - Mid silhouette layer
   - Near silhouette layer (merged into mid in rendering)
   - Poster/trainer card

### Testing Instructions
```markdown
# Copy any prompt from PROMPTS.md

# Test in Midjourney:
/imagine <prompt> --style raw --v 6 --ar 4:3

# Test in DALL-E:
Paste prompt directly

# Test in Stable Diffusion:
Use SDXL + PixelArt LoRA
```

### Tool-Specific Tips Included
- ✅ Midjourney flags and parameters
- ✅ Stable Diffusion model recommendations
- ✅ DALL-E optimization notes
- ✅ Flux (current setup) configuration
- ✅ Minimax video motion examples

---

## ⚡ Performance Improvements

### Layer Reduction (9 → 5)

**Before:**
```
Sky → Far → Mid → Near → Ground → Props → Skills → Color Grade → Vignette
(9 separate layers per world)
```

**After:**
```
Sky → Far (30% opacity) → Mid (60% opacity) → Ground → Props+NPCs+Skills
(5 layers per world, integrated overlays)
```

**Benefits:**
- 44% fewer DOM elements (-4 layers × 9 worlds = 36 elements)
- Clearer visual hierarchy
- Better depth perception via opacity
- Faster paint and composite times

### GPU Acceleration

All transforms now use `translate3d()`:

```javascript
// Before
transform: translateX(-50%)

// After  
transform: translate3d(-50%, 0, 0)
backfaceVisibility: hidden
willChange: transform
```

**Impact:**
- Forces hardware acceleration
- Moves calculations from CPU → GPU
- Smoother 60fps animations

### Scroll Optimization

Throttled recompute to 60fps (16ms intervals):

```typescript
const THROTTLE_MS = 16; // 60fps max
if (timeSinceLastScroll < THROTTLE_MS) return;
```

**Benefits:**
- Prevents scroll jank
- Caps CPU usage
- Smoother on low-end devices
- Battery savings on mobile

### Lazy Rendering

Only renders worlds within ±1 of active:

```typescript
const distance = Math.abs(chapter.index - worldIndex);
const isNear = distance <= 1;
```

**Savings:**
- ~36 images not loaded until needed
- ~27 DOM layers removed (far worlds)
- Faster initial page load
- Lower memory footprint

---

## 🎯 World-by-World Prompt Examples

### Origin (Bengaluru 2010)
**Accent:** #fbbf24 (Amber)  
**Vibe:** Warm dawn, nostalgia, beginnings

**Sky:**
```
Pokemon GBA style sky background, warm dawn gradient from amber 
yellow to deep purple, dithered gradient transitions, scattered 
twinkling stars fading out, soft pixelated clouds at horizon, 
clean 56-color palette
```

**Objects:** CRT TV, cassette deck, desk lamp, banyan tree, antenna towers

---

### SoleSearch (Sneaker Festival)
**Accent:** #ff6b35 (Orange)  
**Vibe:** Festival energy, vibrant, community

**Sky:**
```
Pokemon GBA style festival evening sky, orange to hot pink dithered 
gradient, lens flare pixels, scattered confetti particles, vibrant 
palette like Pokemon contest halls
```

**Objects:** Sneaker boxes, LED walls, DJ deck, microphone, stage lights

---

### Fere.ai (AI Crypto)
**Accent:** #22d3ee (Cyan)  
**Vibe:** Futuristic, holographic, cyber

**Sky:**
```
Pokemon GBA style holographic sky, deep cyan to electric blue 
dithered gradient, glowing pixel grid lines fading to horizon, 
floating data dot particles, Pokemon cyber zone aesthetic
```

**Objects:** Trading terminals, server racks, holographic charts, cyborg cat

---

## 🚀 Next Steps

### 1. Generate New Art (Recommended)

```bash
# Set up your FAL_KEY in .env.local
echo "FAL_KEY=your_key_here" > .env.local

# Generate all missing assets
npm run art:gen

# Or selective regeneration
npm run art:gen -- --only=origin,grp,hab
```

**Cost:** ~$0.15 for full regeneration (50 assets)

### 2. Test in Other Tools (Optional)

```bash
# Copy prompts from PROMPTS.md
# Test in Midjourney, DALL-E, or Stable Diffusion
# Compare results, pick the best
# Manually place in /public/game/
```

### 3. Add Animated Backgrounds (Optional)

```javascript
// Example: Animate Origin sky
import { callMinimaxVideo } from './scripts/lib/fal.mjs';

const animatedSky = await callMinimaxVideo({
  imageUrl: '/game/worlds/origin-sky.jpg',
  prompt: 'gentle clouds drifting left, stars twinkling',
  duration: 10, // 10-second loop
});

// Save as origin-sky.mp4
// Update WorldStage to use <video> for sky layer
```

### 4. Performance Testing

```bash
# Build for production
npm run build

# Start production server
npm run start

# Run Lighthouse audit
npx lighthouse http://localhost:3000/play --view
```

**Target Scores:**
- Performance: >90
- FPS: 60fps on desktop, 50+ on mobile
- Time to Interactive: <5s

### 5. Mobile Optimization (If Needed)

If performance is poor on mobile, apply these optional fixes:

```typescript
// In WorldStage.tsx
const isMobile = window.matchMedia("(max-width: 768px)").matches;
const parallaxScale = isMobile ? 0.3 : 1.0; // Reduce parallax

// In progress.ts
const THROTTLE_MS = isMobile ? 32 : 16; // 30fps on mobile
```

---

## 📊 Expected Results

### Visual Quality
- ✅ Authentic Pokemon GBA aesthetic
- ✅ Clearer depth perception (30% → 60% → 100% opacity)
- ✅ Stronger environmental storytelling
- ✅ More cohesive color palettes
- ✅ Better focal hierarchy (props pop, backgrounds recede)

### Performance
- ✅ 60fps scroll on modern desktops
- ✅ 50+ fps on mid-range mobile (2020+)
- ✅ 40-50% fewer DOM elements active
- ✅ <100MB memory usage
- ✅ <5s time to interactive
- ✅ Smooth spring physics

### Development
- ✅ Easy to test prompts in any tool
- ✅ Clear prompt structure for iteration
- ✅ Video generation ready to use
- ✅ Performance monitoring guide included
- ✅ Mobile-specific optimization path documented

---

## 🎨 Color Palette Reference

Quick reference for each world's signature color:

| World | Hex | Vibe |
|-------|-----|------|
| Origin | #fbbf24 | Warm amber dawn |
| GetRightPrice | #22d3ee | Electric cyan tech |
| Hab | #e84393 | Warm pink afternoon |
| Octo | #22d3ee | Deep cyan night |
| Investopad | #fbbf24 | Golden morning |
| SoleSearch | #ff6b35 | Orange festival |
| Fere | #22d3ee | Cyber blue |
| Cats Can Dance | #ec4899 | Magenta disco |
| Iterate | #f59e0b | Amber dawn |

---

## 🐛 Troubleshooting

### Art Generation Fails
```bash
# Check FAL_KEY is set
cat .env.local

# Try generating just one asset
npm run art:gen -- --only=origin --dry-run
npm run art:gen -- --only=origin
```

### Prompts Don't Work Well
- Try different AI tools (Midjourney vs DALL-E)
- Adjust `pixelScale` in manifest (4 → 5 or 6 for chunkier pixels)
- Add negative prompts: "no blur, no smooth gradients, no anti-aliasing"
- Lock seed for consistency across regenerations

### Performance Issues
1. Check Chrome DevTools → Performance (should see 60fps)
2. Check Chrome DevTools → Layers (should be <20 active)
3. Try reducing lazy render distance (±1 → ±0 in WorldStage)
4. Disable parallax on mobile (set all shift values to 0)

### Visuals Look Wrong
- Clear browser cache (Cmd/Ctrl + Shift + R)
- Check image-rendering: pixelated is applied
- Verify opacity values in WorldStage (far: 0.3, mid: 0.6)
- Inspect element to confirm translate3d is being used

---

## 📚 Documentation Files

All documentation is now in the repo:

1. **`PROMPTS.md`** → Copy-paste prompts for any AI tool
2. **`PERFORMANCE.md`** → Complete optimization guide
3. **`UPGRADE-SUMMARY.md`** → This file (overview)
4. **`scripts/README.md`** → Art generation workflow (existing)

---

## 🎉 What's Different?

### Art Style
- Generic 16-bit → Authentic Pokemon GBA
- Vague prompts → Specific tile/sprite vocabulary
- No depth cues → 56-color palette + dithering
- Painted style → Clean pixel art aesthetic

### Performance
- 9 layers → 5 layers (-44% complexity)
- translateX → translate3d (GPU accelerated)
- Unthrottled scroll → 60fps throttled
- No lazy loading → ±1 world visibility

### Developer Experience
- Locked prompts in code → Standalone PROMPTS.md
- No video support → Minimax image/text-to-video
- Basic docs → 3 comprehensive guides
- Flux-only → Test anywhere (Midjourney, DALL-E, SD)

---

## 🔮 Future Enhancements (Not Implemented)

These are documented but not yet built:

1. **Animated Sky Backgrounds** (Minimax video integration)
2. **WebGL Parallax Renderer** (massive performance gain)
3. **Virtual Scrolling** (unmount distant worlds entirely)
4. **WebP/AVIF Images** (40% smaller file sizes)
5. **Service Worker Caching** (instant offline loading)

All documented in `PERFORMANCE.md` → "Future Optimization Opportunities"

---

## ✅ Summary Checklist

- [x] Pokemon GBA prompts updated (manifest.mjs)
- [x] Minimax video functions added (fal.mjs)
- [x] Standalone prompts created (PROMPTS.md)
- [x] Parallax reduced 9→5 layers (WorldStage.tsx)
- [x] GPU acceleration added (globals.css, components)
- [x] Scroll throttled to 60fps (progress.ts)
- [x] Performance guide written (PERFORMANCE.md)
- [x] Summary document created (this file)

---

## 🎮 Ready to Generate!

Everything is set up. To see the new aesthetic:

```bash
# 1. Set your FAL API key
echo "FAL_KEY=your_key_here" > .env.local

# 2. Generate all assets (~2 minutes, $0.15)
npm run art:gen

# 3. Start dev server
npm run dev

# 4. Open http://localhost:3000/play
```

Or test prompts manually in Midjourney/DALL-E first by copying from `PROMPTS.md`!

---

**Questions?** All details are in:
- Art prompts → `PROMPTS.md`
- Performance → `PERFORMANCE.md`
- Generation → `scripts/README.md`

**Good luck making this the best-looking game out there! 🚀**
