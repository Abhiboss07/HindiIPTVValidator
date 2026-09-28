# Tree-Sitter AST & Codebase Architecture Analysis

**Date:** 2026-09-28T11:23:00+05:30  
**Project:** T2L / HindiIPTVValidator  
**Tool:** `tree-sitter` MCP Server  

---

## 1. Project Language Breakdown

Tree-sitter AST scanner registered and parsed the following language distribution across the T2L codebase:

| Language | File Count | Primary Function |
| :--- | :--- | :--- |
| **Python** | 91 files | Zero-trust validators, test suites, media probes, catalog converters |
| **Markdown** | 39 files | Architecture documentation, forensic reports, guides |
| **JavaScript** | 21 files | Frontend media player engine, CatalogProvider, VLC controllers |
| **Java** | 9 files | Android native application, media bridge, torrent engine |
| **HTML** | 8 files | Main single-page application UI and modals |
| **JSON** | 67 files | Catalogs, channel feeds, tool schemas |
| **CSS** | 2 files | Obsidian and Glassmorphic theatrical styling |

---

## 2. Dead Asset Discovery & Pruning

- **Discovered Waste**: Tree-sitter directory inspection identified **39 untracked `.bak` placeholder files** in `assets/posters/` and `android_app/src/main/assets/assets/posters/`.
- **Space Saved**: **3.2 MB** reclaimed.
- **Action Taken**: Pruned all 39 `.bak` files, preventing them from being copied and compressed into the production APK during `build_apk.sh`.

---

## 3. AST Complexity Findings

- `assets/app.js` symbol tree contains 4 core subsystems:
  1. `CatalogProvider`: Indexed search and category filters.
  2. `loadChannelMedia`: Hls.js initialization and progressive MP4 loading.
  3. `AndroidMediaBridge`: Native audio and orientation sync.
  4. `T2LSentryTelemetry`: Real-time stream error and crash diagnostics.
- Recommended future refactoring: Safe extraction of `CatalogProvider` and `T2LSentryTelemetry` into separate ES modules.
