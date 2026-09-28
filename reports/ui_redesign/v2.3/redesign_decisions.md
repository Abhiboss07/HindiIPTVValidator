# T2L V2.3 — Architectural Redesign Decisions

## Decision Log

### Decision 1: Top Bar Header Simplification
* **Context**: The upper bar contained the textual wordmark `T2L` alongside the symbol, as well as a temporary "Master Brand System" button.
* **Resolution**:
  - Removed textual `T2L` wordmark from the header; retained **ONLY** the 28×28px vector symbol ("The Nexus Ribbon") on the left.
  - Removed "Master Brand System" button entirely.
  - Added vector Hamburger menu icon on the right (`[ Notifications ] [ Profile ] [ Hamburger ]`).
* **Status**: APPROVED for V2.3 Prototype.

### Decision 2: Implementation of Hamburger Menu Secondary Control Hub
* **Context**: Secondary utilities (My List, Continue, Downloads, Streamer, Network, Settings, About, Help, Privacy) needed a dedicated, polished home without cluttering primary navigation.
* **Resolution**: Created a slide-over floating side sheet from the right (`84%` max width on mobile, `360px` on desktop) utilizing the Aurora surface language, clean section dividers, and vector icons.
* **Status**: APPROVED for V2.3 Prototype.

### Decision 3: Typography Short Names with Desktop Hover Tooltips
* **Context**: Compound names like "Instant Magnet Streamer" or "Network Diagnostics" crowded the interface or wrapped awkwardly into multiple vertical lines.
* **Resolution**:
  - Adopted short visible labels (`Streamer`, `Network`, `Continue`, `Settings`).
  - Added subtle, elegant hover tooltips displaying full technical names on desktop/tablet pointers.
  - Enforced `white-space: nowrap` to prevent broken multi-line words.
* **Status**: APPROVED for V2.3 Prototype.

### Decision 4: Complete Footer Redesign
* **Context**: The existing footer was minimal and lacked cinematic closure.
* **Resolution**: Rebuilt the footer into an editorial closing composition:
  - Brand mark + T2L wordmark + "Your cinematic media space." statement.
  - Structured 4-column layout on desktop (*Navigation*, *Discover*, *Tools*, *Information*).
  * Compact expandable accordion/chevron hierarchy on mobile.
* **Status**: APPROVED for V2.3 Prototype.

### Decision 5: Cinema 100% Horizontal Flow
* **Context**: The lower portion of Cinema in V2.2 lapsed into a vertical `2 × 2` poster grid, breaking the horizontal discovery flow.
* **Resolution**: Completely removed the vertical 2×2 grid; implemented pure horizontal flowing rails throughout (*Trending Now*, *Cinematic Horizons*, *New Releases*, *Episodic Sagas*, *Continue Watching*, *Heritage Archive*).
* **Status**: APPROVED for V2.3 Prototype.

### Decision 6: Radio Station Card Scale Correction
* **Context**: Station cards in Radio were oversized and dominated the screen.
* **Resolution**: Scaled down station cards from large blocks to compact, refined, high-fidelity tiles (`140px` with `44px` icon and 11px frequency pill), keeping the turntable player and equalizer visualizer intact.
* **Status**: APPROVED for V2.3 Prototype.

### Decision 7: Local Media Vault Restoration to V2.1
* **Context**: V2.2 altered the Local page structure unnecessarily.
* **Resolution**: Restored the Local page 100% to the approved V2.1 baseline: pure media vault, zero storage telemetry, clean category filters (`All Media`, `Videos`, `Audio`, `Downloads`), and clean vector tiles.
* **Status**: APPROVED for V2.3 Prototype.
