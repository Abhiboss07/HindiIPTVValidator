# T2L V2.3 — Typography & Label Architecture

## 1. Short Names for Long UI Text

To eliminate visual clutter and ensure interface elements remain crisp and modern, all long secondary actions and menu items adopt **short, direct visible names**:

| Full Technical Label | Short Visible Label | Desktop / Tablet Hover Tooltip |
| :--- | :--- | :--- |
| **Instant Magnet Streamer** | `Streamer` | `Instant Streamer` |
| **Network Diagnostics & Telemetry** | `Network` | `Network Diagnostics` |
| **Continue Watching Queue** | `Continue` | `Continue Watching` |
| **Device & App Settings** | `Settings` | `Settings` |
| **Offline Download Manager** | `Downloads` | `Offline Downloads` |
| **Personal Watchlist** | `My List` | `My List` |

---

## 2. Desktop & Tablet Hover Tooltip System

For desktop and tablet pointers, hovering over any shortened label surfaces an elegant, non-intrusive tooltip:
* **Position**: Anchored 8px above or beside the element.
* **Aesthetic**: Charcoal glass pill (`background: rgba(18, 21, 29, 0.94); border: 1px solid rgba(255, 255, 255, 0.15); font-size: 11px; font-weight: 600; padding: 4px 8px; border-radius: 6px; box-shadow: 0 4px 14px rgba(0, 0, 0, 0.6);`).
* **Compositor Motion**: `opacity: 0 -> 1; transform: translateY(2px) -> translateY(0); transition: 140ms ease;`.
* **Zero Emojis**: Strictly alphanumeric typography.

---

## 3. Strict Horizontal Layout Mandate

### The Anti-Pattern
Breaking compound terms across multiple lines (e.g. `Network\nDiagnos-\ntics` or `Instant\nStreamer` or `Continue\nWatch-\ning`) damages typographical hierarchy and makes the UI appear cramped and unpolished.

### The Rule
All visible titles and secondary labels must expand horizontally:
```css
.t2l-menu-label,
.dock-label,
.content-rail-title,
.footer-link-item {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
}
```

---

## 4. Radio Station Card Scale Correction

In V2.2, station cards occupied excessive vertical real estate. V2.3 scales down radio cards to a refined, compact, and tactile geometry:

```
[ V2.2 Oversized Card ]            [ V2.3 Compact Refined Card ]
┌───────────────────────────┐      ┌─────────────────────────┐
│                           │      │ [ ARTWORK ]   Station   │
│       HUGE ARTWORK        │      │               102.8 FM  │
│                           │      │               Live ●    │
│       Station Name        │      └─────────────────────────┘
│       102.8 FM            │      Height: 68px (horizontal)
│       Now Playing         │      or 140px (compact vertical)
└───────────────────────────┘
```

* **Dimensions**: Compact `140px` tile with a 1:1 square artwork block (`48px`) or compact vertical tile with 8px radius.
* **Information Density**: Station title, frequency in cyan accent, and pulsing live indicator.
* **Ergonomics**: Reduced footprint allows 2.5 cards to peek on mobile and 5 cards on desktop without pushing content below the fold.
