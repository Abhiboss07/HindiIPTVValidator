import re

STYLES_PATHS = ['assets/styles.css', 'android_app/src/main/assets/assets/styles.css']

NEW_CSS = """
/* ==========================================================================
   REFINEMENTS V2: DESKTOP FOOTER 4-COL GRID (NAVIGATION REMOVED)
   ========================================================================== */
@media (min-width: 768px) {
  .footer-desktop-grid {
    display: grid !important;
    grid-template-columns: 2fr 1fr 1fr 1fr !important;
    gap: 32px !important;
    margin-bottom: 36px !important;
  }
}

/* ==========================================================================
   REFINEMENTS V2: CINEMATIC ULTRA-SMOOTH HERO CAROUSEL
   ========================================================================== */
.hero-backdrop {
  transition: opacity 850ms cubic-bezier(0.16, 1, 0.3, 1), transform 1200ms cubic-bezier(0.16, 1, 0.3, 1) !important;
  will-change: opacity, transform !important;
  backface-visibility: hidden !important;
  -webkit-backface-visibility: hidden !important;
}

.hero-content-anim {
  transition: opacity 450ms cubic-bezier(0.16, 1, 0.3, 1), transform 450ms cubic-bezier(0.16, 1, 0.3, 1) !important;
  will-change: opacity, transform !important;
}

.hero-content-anim.hero-fading {
  opacity: 0.15 !important;
  transform: translateY(6px) !important;
}

/* ==========================================================================
   REFINEMENTS V2: YOUTUBE-STYLE ONE-TAP CLOSED CAPTIONS [CC]
   ========================================================================== */
.yt-cc-top-btn {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 4px 8px !important;
  border-radius: 8px !important;
  background: rgba(255, 255, 255, 0.08) !important;
  border: 1px solid rgba(255, 255, 255, 0.18) !important;
  font-family: var(--font-mono, monospace) !important;
  font-size: 11px !important;
  font-weight: 800 !important;
  color: #a3a3a3 !important;
  letter-spacing: 0.5px !important;
  cursor: pointer !important;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

.yt-cc-top-btn.active {
  background: #FFFFFF !important;
  color: #000000 !important;
  border-color: #FFFFFF !important;
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.4) !important;
}

#btnVlcSubtitles.active {
  color: #38bdf8 !important;
  background: rgba(56, 189, 248, 0.18) !important;
  border-radius: 50% !important;
}

/* Authentic YouTube Subtitles Floating Pill */
.player-cc-container {
  position: absolute !important;
  bottom: 74px !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  max-width: 90% !important;
  background: rgba(6, 6, 8, 0.82) !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  backdrop-filter: blur(8px) !important;
  -webkit-backdrop-filter: blur(8px) !important;
  border-radius: 8px !important;
  padding: 6px 14px !important;
  z-index: 45 !important;
  pointer-events: none !important;
  text-align: center !important;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.65) !important;
  transition: opacity 0.2s ease, transform 0.2s ease !important;
}

.player-cc-text {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans Devanagari", sans-serif !important;
  font-size: 17px !important;
  font-weight: 700 !important;
  color: #FFFFFF !important;
  line-height: 1.35 !important;
  margin: 0 !important;
  text-shadow: 0 1px 3px rgba(0,0,0,0.8) !important;
  letter-spacing: 0.2px !important;
}

/* ==========================================================================
   REFINEMENTS V2: MY LIST MODAL STYLES
   ========================================================================== */
.my-list-modal-card {
  width: 92%;
  max-width: 480px;
  max-height: 85vh;
  margin: auto;
  background: #12141a;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 24px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.85);
  box-sizing: border-box;
}

.my-list-content-scroll {
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-right: 4px;
  margin-top: 6px;
}

.my-list-item-row {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 8px 12px;
  transition: background 0.2s;
}

.my-list-thumb {
  width: 52px;
  height: 72px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
  background: #1a1a20;
}

.my-list-info {
  flex: 1;
  min-width: 0;
}

.my-list-title {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 3px;
}

.my-list-meta {
  font-size: 11px;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 6px;
}

.my-list-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.my-list-play-btn {
  background: #e50914;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: transform 0.15s;
}
.my-list-play-btn:active {
  transform: scale(0.95);
}

.my-list-remove-btn {
  background: rgba(255, 255, 255, 0.08);
  color: #ef4444;
  border: none;
  border-radius: 8px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
}

.my-list-empty {
  text-align: center;
  padding: 36px 16px;
  color: #94a3b8;
}

/* ==========================================================================
   REFINEMENTS V2: APP INFORMATION HUB MODAL (About, Help, Privacy)
   ========================================================================== */
.app-info-modal-card {
  width: 92%;
  max-width: 500px;
  max-height: 85vh;
  margin: auto;
  background: #12141a;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 24px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.85);
  box-sizing: border-box;
}

.app-info-tab-bar {
  display: flex;
  gap: 6px;
  background: rgba(255, 255, 255, 0.05);
  padding: 4px;
  border-radius: 12px;
  margin-bottom: 14px;
}

.app-info-tab {
  flex: 1;
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 12px;
  font-weight: 700;
  padding: 8px 6px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.app-info-tab.active {
  background: rgba(255, 255, 255, 0.12);
  color: #FFFFFF;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.app-info-tab-panel {
  overflow-y: auto;
  padding-right: 4px;
}

.info-card-block {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 14px;
  margin-bottom: 10px;
}

.info-card-title {
  font-size: 13px;
  font-weight: 800;
  color: #38bdf8;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.info-card-desc {
  font-size: 12px;
  color: #cbd5e1;
  line-height: 1.5;
  margin: 0;
}

.info-specs-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.info-spec-item {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  padding: 8px 10px;
}

.info-spec-label {
  display: block;
  font-size: 10px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-spec-val {
  display: block;
  font-size: 12px;
  font-weight: 700;
  color: #f1f5f9;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.info-bullet-list {
  margin: 0;
  padding-left: 18px;
  font-size: 12px;
  color: #cbd5e1;
  line-height: 1.6;
}

.help-gesture-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.help-gesture-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  padding: 8px 10px;
}

.help-gesture-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.help-gesture-item strong {
  display: block;
  font-size: 12px;
  color: #fff;
  margin-bottom: 2px;
}

.help-gesture-item p {
  font-size: 11px;
  color: #94a3b8;
  margin: 0;
  line-height: 1.4;
}

/* ==========================================================================
   REFINEMENTS V2: SPEED RECOMMENDED MOVIES
   ========================================================================== */
.speed-rec-card {
  flex: 0 0 120px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
}
.speed-rec-card:active {
  transform: scale(0.96);
}

.speed-rec-thumb {
  width: 100%;
  height: 75px;
  object-fit: cover;
  display: block;
}

.speed-rec-meta {
  padding: 6px;
}

.speed-rec-title {
  font-size: 11px;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
}

.speed-rec-badge {
  font-size: 9px;
  font-weight: 800;
  color: #10b981;
  background: rgba(16, 185, 129, 0.15);
  padding: 2px 4px;
  border-radius: 4px;
  display: inline-block;
}
"""

for p in STYLES_PATHS:
    with open(p, 'a', encoding='utf-8') as f:
        f.write("\n" + NEW_CSS)
    print(f"Appended refinements CSS to {p}")

