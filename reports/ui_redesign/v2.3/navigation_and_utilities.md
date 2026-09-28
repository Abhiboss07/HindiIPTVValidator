# T2L V2.3 — Navigation & Secondary Utility Hub

## 1. Top Bar Simplification

The upper floating bar has been distilled to its purest form:

```text
┌────────────────────────────────────────────────────────────────────────┐
│ [ T2L SYMBOL ]                     [ 🔔 ]   [ 👤 ]   [ ☰ ]             │
│ (Nexus Ribbon only)                 Notif   Profile  Hamburger         │
└────────────────────────────────────────────────────────────────────────┘
```

### Key Refinements
1. **Symbol-Only Identity**:
   * The wordmark `T2L` was completely removed from the header.
   * Only the 28×28px vector symbol ("The Nexus Ribbon") anchors the upper-left, keeping the header exceptionally light, unobtrusive, and art-aware.
2. **Master Brand System Button Removed**:
   * Removed entirely from the top bar to ensure zero clutter.
3. **Right Action Trio**:
   * `Notifications`: Vector bell icon with subtle cyan unread indicator dot.
   * `Profile`: Vector user avatar icon opening user preferences & zero-trust status.
   * `Hamburger`: Vector 3-line menu icon opening the secondary utility hub.
4. **Behavior**:
   * Transparent with zero background on initial load, letting hero key art shine.
   * Transitions smoothly to frosted glass (`background: rgba(10, 12, 17, 0.72); backdrop-filter: blur(20px);`) on scroll past 40px.

---

## 2. Hamburger Menu Architecture (Secondary Control Hub)

The hamburger menu is designed as T2L's dedicated command and secondary utility space rather than an alternative primary navigation bar.

### Layout & Sizing
* **Mobile (320px–430px)**:
  * Floating side sheet sliding smoothly from the right.
  * Max width: `84%` of viewport (`width: min(340px, 84vw);`), never drowning the screen.
  * Backdrop dimming: `rgba(0, 0, 0, 0.75)` with `backdrop-filter: blur(12px)`.
* **Tablet & Desktop (768px–1440px)**:
  * Narrow, elegant 360px floating panel anchored to the right edge with safe-area clearance.

### Information Architecture & Sections

```
┌────────────────────────────────────────────────────────┐
│  UTILITIES & HUB                                  [✕]  │
├────────────────────────────────────────────────────────┤
│  PERSONAL                                              │
│  • My List                                             │
│  • Continue         (hover: Continue Watching)         │
│  • Downloads                                           │
├────────────────────────────────────────────────────────┤
│  TOOLS                                                 │
│  • Streamer         (hover: Instant Streamer)          │
│  • Network          (hover: Network Diagnostics)       │
│  • Settings                                            │
├────────────────────────────────────────────────────────┤
│  INFORMATION                                           │
│  • About                                               │
│  • Help                                                │
│  • Privacy                                             │
├────────────────────────────────────────────────────────┤
│  [ T2L SYMBOL ]  T2L v2.3 · Zero-Trust Streaming       │
└────────────────────────────────────────────────────────┘
```

### Visual Characteristics
* Dark OLED surface (`--t2l-surface-1: #0A0C11;`).
* Subtle border highlight (`1px solid rgba(255, 255, 255, 0.1)`).
* Rounded corners on sheet (`border-radius: 20px 0 0 20px` on mobile/desktop).
* Vector SVG icons for every row (stroke-width: 1.8px).
* Hover & touch active state (`background: rgba(255, 255, 255, 0.06); transform: translateX(-2px);`).
