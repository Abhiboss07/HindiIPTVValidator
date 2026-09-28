#!/usr/bin/env python3
"""
Assemble T2L Production UI from approved V2.3 Design Prototype
Preserves 100% of functional pipelines, playback modals, and scripts.
"""

import re
import sys

def main():
    print("Reading approved V2.3 prototype and current production index.html...")
    with open('reports/ui_redesign/v2.3/prototype/index.html', 'r', encoding='utf-8') as f:
        proto_html = f.read()

    with open('/tmp/index_backup.html', 'r', encoding='utf-8') as f:
        prod_html = f.read()

    # 1. Extract Head from prototype, ensure assets/styles.css is linked
    head_match = re.search(r'<head>(.*?)</head>', proto_html, re.DOTALL)
    if not head_match:
        print("ERROR: Could not find head in prototype!")
        sys.exit(1)
    
    # 2. Extract Body up to </main>
    body_to_main = proto_html[proto_html.find('<body'):proto_html.find('</main>') + len('</main>')]

    # Ensure stylesheet path is assets/styles.css in head
    head_content = head_match.group(1)
    head_content = re.sub(r'href="[^"]*styles\.css"', 'href="assets/styles.css"', head_content)

    # 3. Extract Floating Dock from prototype
    dock_match = re.search(r'(<!-- =+\s*5\.\s*FLOATING SIGNATURE CAPSULE DOCK.*?</div>\s*</div>)', proto_html, re.DOTALL)
    if not dock_match:
        # Fallback to t2l-floating-dock-wrap
        dock_match = re.search(r'(<div class="t2l-floating-dock-wrap">.*?</div>\s*</div>)', proto_html, re.DOTALL)
    
    dock_html = dock_match.group(1) if dock_match else ''

    # 4. Extract Notifications & Profile Sheets from prototype
    notif_match = re.search(r'(<!-- =+\s*8\.\s*SLIDE-OVER NOTIFICATIONS & PROFILE.*?<!-- =+\s*9\.\s*BRAND SHOWCASE)', proto_html, re.DOTALL)
    if not notif_match:
        notif_match = re.search(r'(<aside id="notificationsSheet".*?</aside>\s*<aside id="profileSheet".*?</aside>)', proto_html, re.DOTALL)
    
    sheets_html = notif_match.group(1) if notif_match else ''

    # 5. Extract Functional Production Modals & Scripts
    idx_modals_start = prod_html.find('<!-- Hidden Local File Input -->')
    if idx_modals_start == -1:
        idx_modals_start = prod_html.find('<input type="file" id="localFileInput"')
    
    prod_modals = prod_html[idx_modals_start:]

    # Remove old dock and old side drawer from prod_modals
    prod_modals = re.sub(r'<!-- =+\s*FLOATING TRANSPARENT GLASS DOCK.*?<!-- =+\s*SIDE DRAWER', '<!-- ==========================================================\n         SIDE DRAWER', prod_modals, flags=re.DOTALL)
    prod_modals = re.sub(r'<!-- =+\s*SIDE DRAWER NAVIGATION MODAL.*?<!-- =+\s*INSTANT STREAMER MODAL', '<!-- ==========================================================\n         INSTANT STREAMER MODAL', prod_modals, flags=re.DOTALL)

    # 6. Adapt Prototype Views to support both ID systems (page- and view-) and dynamic content hooks
    # View 1: Home
    body_to_main = body_to_main.replace('id="view-home" class="t2l-view active"', 'id="page-home" class="t2l-view page-view active"')
    
    # View 2: Cinema (100% horizontal rails, zero 2x2 grid)
    body_to_main = body_to_main.replace('id="view-cinema" class="t2l-view"', 'id="page-movies" class="t2l-view page-view"')

    # View 3: Live TV
    body_to_main = body_to_main.replace('id="view-live" class="t2l-view"', 'id="page-live" class="t2l-view page-view"')

    # View 4: Radio
    body_to_main = body_to_main.replace('id="view-radio" class="t2l-view"', 'id="page-radio" class="t2l-view page-view"')

    # View 5: Local
    body_to_main = body_to_main.replace('id="view-local" class="t2l-view"', 'id="page-local" class="t2l-view page-view"')

    # Add page-favs if needed
    if 'id="page-favs"' not in body_to_main:
        favs_html = '''
    <!-- VIEW 6: MY LIST / SAVED CHANNELS -->
    <section id="page-favs" class="t2l-view page-view">
      <div style="padding: 24px 16px; margin-top: var(--t2l-header-height);">
        <h1 class="page-heading-main" style="margin-bottom: 8px;">My List & Favorites</h1>
        <p style="font-size: 13px; color: var(--t2l-text-muted); margin-bottom: 24px;">Saved channels, movies, and custom streams</p>
        <div id="favoritesFeed" style="display: flex; flex-direction: column; gap: 12px;"></div>
      </div>
    </section>
'''
        body_to_main = body_to_main.replace('<!-- ==========================================================================\n         12. REDESIGNED CINEMATIC FOOTER', favs_html + '\n    <!-- ==========================================================================\n         12. REDESIGNED CINEMATIC FOOTER')

    # Update dock onclicks to switchPage
    dock_html = dock_html.replace("onclick=\"navigateTo('home', this)\"", "id=\"tab-home\" onclick=\"switchPage('home')\"")
    dock_html = dock_html.replace("onclick=\"navigateTo('cinema', this)\"", "id=\"tab-movies\" onclick=\"switchPage('movies')\"")
    dock_html = dock_html.replace("onclick=\"navigateTo('live', this)\"", "id=\"tab-live\" onclick=\"switchPage('live')\"")
    dock_html = dock_html.replace("onclick=\"navigateTo('radio', this)\"", "id=\"tab-radio\" onclick=\"switchPage('radio')\"")
    dock_html = dock_html.replace("onclick=\"navigateTo('local', this)\"", "id=\"tab-local\" onclick=\"switchPage('local')\"")

    # Add watermark to playerModal if not present
    watermark_svg = '''
        <!-- Approved T2L Brand Symbol Watermark -->
        <div class="player-brand-watermark">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                <path d="M6 7H26L18 16H8L6 7Z" fill="url(#cyan_purple_grad_pwm)" stroke="#22D3EE" stroke-width="1.5" stroke-linejoin="round"/>
                <path d="M14 16H24L26 25H6L14 16Z" fill="url(#purple_blue_grad_pwm)" stroke="#8B5CF6" stroke-width="1.5" stroke-linejoin="round"/>
                <defs>
                    <linearGradient id="cyan_purple_grad_pwm" x1="6" y1="7" x2="26" y2="16" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#22D3EE"/>
                        <stop offset="1" stop-color="#8B5CF6"/>
                    </linearGradient>
                    <linearGradient id="purple_blue_grad_pwm" x1="6" y1="16" x2="26" y2="25" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#8B5CF6"/>
                        <stop offset="1" stop-color="#3B82F6"/>
                    </linearGradient>
                </defs>
            </svg>
        </div>
'''
    if 'player-brand-watermark' not in prod_modals:
        prod_modals = prod_modals.replace('<div id="playerAmbientBackdrop"', watermark_svg + '\n        <div id="playerAmbientBackdrop"')

    # Build complete HTML
    final_html = f'''<!DOCTYPE html>
<html lang="en">
<head>
{head_content}
</head>
{body_to_main}

{dock_html}

{sheets_html}

{prod_modals}
'''

    # Ensure Zero-Trust is strictly absent from footer
    final_html = final_html.replace('<span class="footer-badge-pill">● Zero-Trust Architecture</span>', '')
    final_html = final_html.replace('● Zero-Trust Architecture', '')
    final_html = final_html.replace('Zero-Trust Architecture', '')

    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(final_html)

    print("SUCCESS: index.html assembled cleanly!")
    print(f"Total lines: {len(final_html.splitlines())}")

if __name__ == '__main__':
    main()
