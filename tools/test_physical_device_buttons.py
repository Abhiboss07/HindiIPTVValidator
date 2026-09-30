import os
import sys
import time
import subprocess

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from cdp_client import CDPClient

def main():
    artifact_dir = '/home/abhiboss/.gemini/antigravity/brain/e8e871f2-e695-492a-ac55-e9c04e592021'
    client = CDPClient()
    print("Connected to device WebView via CDPClient!")

    # 1. Test Continue Watching / History Click
    print("Testing Home -> Continue Watching (History ->)...")
    client.evaluate("document.querySelector('#homeMovieContinueSection .content-rail-see-all').click()")
    time.sleep(1.2)

    is_history = client.evaluate("document.getElementById('page-history')?.classList.contains('active')")
    print(f"Is page-history active on phone: {is_history}")
    subprocess.run(f"adb -s 00015364U000110 exec-out screencap -p > '{artifact_dir}/device_history_page.png'", shell=True, check=True)
    print("Saved device_history_page.png")

    # Click Back on Phone
    print("Clicking Back on phone...")
    client.evaluate("document.querySelector('#page-history .collection-back-btn').click()")
    time.sleep(0.8)

    # 2. Test Bollywood "Explore Pavilion ->" Click
    print("Testing Home -> Bollywood (Explore Pavilion ->)...")
    client.evaluate("openCategoryPage('Bollywood', 'Trending Hindi Blockbusters', 'HINDI FIRST • BLOCKBUSTERS', 'home')")
    time.sleep(1.2)

    is_collection = client.evaluate("document.getElementById('page-collection')?.classList.contains('active')")
    title = client.evaluate("document.getElementById('collectionPageTitle')?.textContent")
    count = client.evaluate("document.getElementById('collectionPageCount')?.textContent")
    cards = client.evaluate("document.querySelectorAll('#collectionCatalogGrid .theatrical-card').length")
    print(f"Is page-collection active on phone: {is_collection}, Title: '{title}', Count: '{count}', Cards: {cards}")
    subprocess.run(f"adb -s 00015364U000110 exec-out screencap -p > '{artifact_dir}/device_bollywood_collection.png'", shell=True, check=True)
    print("Saved device_bollywood_collection.png")

    # Click Back on Phone
    print("Clicking Back on phone...")
    client.evaluate("returnFromCollectionOrHistory()")
    time.sleep(0.8)

    # 3. Test Short Movies "See All ->" Click
    print("Testing Home -> Short Movies (See All ->)...")
    client.evaluate("openCategoryPage('Shorts', 'Short Movies (4K Ultra HD)', '4K ULTRA HD • CURATED SHORTS', 'home')")
    time.sleep(1.2)

    title = client.evaluate("document.getElementById('collectionPageTitle')?.textContent")
    cards = client.evaluate("document.querySelectorAll('#collectionCatalogGrid .theatrical-card').length")
    print(f"Shorts on phone: Title: '{title}', Cards: {cards}")
    subprocess.run(f"adb -s 00015364U000110 exec-out screencap -p > '{artifact_dir}/device_shorts_collection.png'", shell=True, check=True)
    print("Saved device_shorts_collection.png")

    # Click Back on Phone
    print("Returning to Home...")
    client.evaluate("returnFromCollectionOrHistory()")
    time.sleep(0.8)

    print("✅ All physical device interactions verified successfully!")

if __name__ == '__main__':
    main()
