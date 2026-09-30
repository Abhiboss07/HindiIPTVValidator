import re
import os

ROOT_DIR = "/home/abhiboss/Projects/HindiIPTVValidator"
STYLES_PATHS = [
    os.path.join(ROOT_DIR, "assets/styles.css"),
    os.path.join(ROOT_DIR, "android_app/src/main/assets/assets/styles.css")
]

for p in STYLES_PATHS:
    with open(p, "r", encoding="utf-8") as f:
        css = f.read()

    # 1. Remove --t2l-safe-top from :root
    css = re.sub(r'\s*--t2l-safe-top:\s*max\([^;]+;\n?', '\n', css)

    # 2. Remove REFINEMENTS V4: PUNCH-HOLE CAMERA SAFE AREA CLEARANCE block
    punchhole_block_pattern = re.compile(
        r'/\*\s*={10,}\s*REFINEMENTS V4: PUNCH-HOLE CAMERA SAFE AREA CLEARANCE\s*={10,}\s*\*/'
        r'.*?'
        r'(?=/\*\s*={10,}\s*REFINEMENTS V4: OOKLA-STYLE SPEEDOMETER)',
        re.DOTALL
    )
    if punchhole_block_pattern.search(css):
        css = punchhole_block_pattern.sub('', css)
        print(f"✓ Removed punch-hole clearance block from {p}")
    else:
        print(f"⚠️ Punch-hole clearance block not matched in {p}")

    with open(p, "w", encoding="utf-8") as f:
        f.write(css)

print("Reversion script complete.")
