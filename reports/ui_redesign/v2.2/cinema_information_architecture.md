# T2L V2.2 — Cinema Information Architecture

## 1. The Architectural Shift

The V2.1 Cinema page was structured as a flat, database-style browsing page:
```
[V2.1 Cinema]
Header -> [All | Films | Series] Chips -> Small Banner -> 4 Generic Genre Cards -> 2-col Poster Grid
```

V2.2 discards this formula entirely and rebuilds Cinema as an **Editorial Discovery Space**:
```
[V2.2 Cinema: The Curated Pavilion]

┌────────────────────────────────────────────────────────────────────────┐
│ 1. CINEMA ATMOSPHERIC PREMIERE SHOWCASE (Type A)                       │
│    Expansive panoramic key art, theatrical typography, true metadata,  │
│    contextual "Watch Premiere" & "Explore Experience" triggers         │
└────────────────────────────────────────────────────────────────────────┘
                                   │
┌──────────────────────────────────┴─────────────────────────────────────┐
│ 2. CINEMATIC DISCOVERY MODES (Subtle, architectural text triggers)     │
│    [ PREMIERES ]          [ THEATRICAL ]          [ SAGAS ]            │
└────────────────────────────────────────────────────────────────────────┘
                                   │
┌──────────────────────────────────┴─────────────────────────────────────┐
│ 3. THEATRICAL HORIZONS RAIL (Type B/C Carousel)                        │
│    High-octane trending releases in theatrical 2:3 & scope formats      │
└────────────────────────────────────────────────────────────────────────┘
                                   │
┌──────────────────────────────────┴─────────────────────────────────────┐
│ 4. "CONTINUE YOUR JOURNEY" SHELF (Type D Card)                         │
│    Real progress indicators on active sessions, 16:9 cinematic frames   │
└────────────────────────────────────────────────────────────────────────┘
                                   │
┌──────────────────────────────────┴─────────────────────────────────────┐
│ 5. CURATED CINEMA SHELVES (Varied Visual Rhythm)                       │
│    • Shelf 1: Modern Masterpieces (2024–2026)                          │
│    • Shelf 2: Epic Multi-Season Sagas (Type C Cards)                   │
│    • Shelf 3: High-Octane Action & Thrillers                           │
│    • Shelf 4: Public Domain & Heritage Archive (Type B Cards)          │
└────────────────────────────────────────────────────────────────────────┘
                                   │
┌──────────────────────────────────┴─────────────────────────────────────┐
│ 6. THE GRAND THEATRICAL REPERTORY GRID (Responsive 2/4/6 Columns)      │
│    Uncluttered, artwork-first presentation with pure title & release   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Information Hierarchy & Rules

1. **Artwork Supremacy**: Posters and backdrops occupy at least 80% of card surface area. Technical metadata (resolution badges, audio tags) is suppressed until card interaction or detail view.
2. **Editorial Modes over Category Chips**:
   - `PREMIERES`: Highlights top-tier cinematic releases with rich backdrops.
   - `THEATRICAL`: Focuses on feature-length standalone films.
   - `SAGAS`: Filters specifically for multi-season epic narratives (e.g. Game of Thrones, Mirzapur, Panchayat).
3. **No Hallucinated Data**: Every title displayed (e.g., *12th Fail*, *Kalki 2898 AD*, *Jawan*, *Dangal*, *Oppenheimer*, *Chhaava*, *Game of Thrones*, *Panchayat*, *Mirzapur*, *Sita Sings the Blues*) is sourced directly from `data/movies_catalog.json` with genuine years, runtimes, and genres.
4. **Seamless Elevation**: Tapping any card does not produce an abrupt dialog pop; instead, it expands into an immersive full-bleed details view with smooth backdrop morphing.
