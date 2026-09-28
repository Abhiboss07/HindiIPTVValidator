# T2L V2.2 — Architectural Redesign Decisions

## Decision Log

### Decision 1: Replacement of "Kinetic Aperture" with "The Nexus Ribbon"
* **Context**: User found the V2.1 iris/camera/signal concept unsatisfactory and requested a completely new brand identity.
* **Resolution**: Explored 4 distinct concepts (A: Typographic Monolith, B: Resonant Horizon, C: Aspect Gate, D: Nexus Ribbon). Evaluated across 10 criteria. Selected Concept D ("The Nexus Ribbon") for its pure geometric monogram integrating `T`, `2`, and `L`, unmatched 16px miniaturization, zero clichés, and premium tech/media aesthetic.
* **Status**: APPROVED for V2.2 Prototype.

### Decision 2: Complete Discard of V2.1 Cinema Information Architecture
* **Context**: V2.1 Cinema had a generic header, 3-button chip bar (`[All | Films | Series]`), 4 arbitrary genre boxes, and an uninspiring uniform 2-column grid.
* **Resolution**: Rebuilt Cinema as an editorial discovery pavilion featuring an atmospheric Premiere showcase, refined discovery mode triggers (`[PREMIERES | THEATRICAL | SAGAS]`), a horizontal Theatrical Horizons rail, curated shelves with varied visual rhythm, and 5 distinct card types.
* **Status**: APPROVED for V2.2 Prototype.

### Decision 3: Five Distinct Card Types (A, B, C, D, E)
* **Context**: Uniform card styling leads to visual fatigue and fails to distinguish standalone films from episodic series or continue-watching progress.
* **Resolution**:
  - Type A: Featured Premiere Widescreen Card
  - Type B: Standard Theatrical 2:3 Poster Card
  - Type C: Panoramic Series / Saga Card (16:10 with multi-season indicator)
  - Type D: Continue Watching 16:9 Card with actual progress fill
  - Type E: Curated Editorial Collection Banner
* **Status**: APPROVED for V2.2 Prototype.

### Decision 4: Smooth Card-to-Backdrop Detail Transition
* **Context**: Abrupt modal popups interrupt visual continuity and diminish the cinematic feeling.
* **Resolution**: Implemented smooth card-to-backdrop expand transitions utilizing CSS `@starting-style` and compositor-friendly transforms (`scale`, `translateY`, `opacity`).
* **Status**: APPROVED for V2.2 Prototype.

### Decision 5: Complete Preservation of All Other V2.1 Features
* **Context**: User explicitly instructed to FREEZE everything else: Home, Live TV, Radio, Local Vault, Footer, Navigation Dock, Notifications, Profile, and Player.
* **Resolution**: All non-Cinema views and navigation systems are 100% preserved from V2.1, with only the brand logo updated across headers, watermarks, splash, and footer to ensure brand consistency.
* **Status**: APPROVED for V2.2 Prototype.

### Decision 6: Zero Production Code Modifications
* **Context**: User strictly mandated that no production files (`index.html`, `assets/`, `android_app/`) be modified or built.
* **Resolution**: All changes are strictly confined to `reports/ui_redesign/v2.2/`. The prototype runs in isolation.
* **Status**: APPROVED for V2.2 Prototype.
