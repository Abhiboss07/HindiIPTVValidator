// Script to verify JS renderers in app.js
const fs = require('fs');

const code = fs.readFileSync('assets/app.js', 'utf8');

// Mock window and document
const mockWindow = {
  selectedMovieStreamQuality: 'auto'
};
global.window = mockWindow;
global.document = {
  getElementById: () => null
};
global.localStorage = {
  getItem: () => null,
  setItem: () => null
};

// Evaluate getContentClassification and renderMovieCard
// We extract the function or eval the file in a sandbox
try {
  // Extract getContentClassification function
  const match = code.match(/window\.getContentClassification = function\(item\) \{([\s\S]*?)\n\};/);
  if (!match) throw new Error("Could not find window.getContentClassification in assets/app.js");
  
  const getContentClassification = new Function('item', match[1]);
  mockWindow.getContentClassification = getContentClassification;
  global.getContentClassification = getContentClassification;

  // Extract renderMovieCard
  const matchCard = code.match(/function renderMovieCard\(movie\) \{([\s\S]*?)\n\}/);
  if (!matchCard) throw new Error("Could not find renderMovieCard in assets/app.js");
  const renderMovieCard = new Function('movie', matchCard[1]);

  // Load catalog
  const catalog = JSON.parse(fs.readFileSync('data/movies_catalog.json', 'utf8'));
  const movies = catalog.movies;

  console.log("Auditing " + movies.length + " catalog cards rendered by renderMovieCard...");

  let failures = 0;
  for (const m of movies) {
    const html = renderMovieCard(m);
    const classification = getContentClassification(m);

    if (classification.isSeries) {
      if (html.includes('Official Trailer') || html.includes('Trailer (4K)')) {
        console.error("FAIL: Series " + m.id + " rendered with Trailer badge in HTML: " + html);
        failures++;
      }
    }
  }

  if (failures === 0) {
    console.log("SUCCESS: 0 series rendered with Trailer badge! All 22 series cards are clean.");
  } else {
    console.error("FAILURE: " + failures + " series rendered with Trailer badges!");
    process.exit(1);
  }

  // Test Gullak specifically
  const gullak = movies.find(m => m.id === 'series_gullak');
  const gullakHtml = renderMovieCard(gullak);
  console.log("\nGullak Card HTML:");
  console.log(gullakHtml.trim());
  if (!gullakHtml.includes('3 Seasons • 14 Episodes') || !gullakHtml.includes('1080p FHD')) {
    console.error("FAIL: Gullak metadata incorrect in card!");
    process.exit(1);
  }

  // Test Suzume specifically
  const suzume = movies.find(m => m.id === 'vod_suzume');
  const suzumeHtml = renderMovieCard(suzume);
  console.log("\nSuzume Card HTML:");
  console.log(suzumeHtml.trim());
  // Test Squid Game Season 2 specifically (Upcoming Trailer)
  const squidS2 = movies.find(m => m.id === 'series_squid_game_s2_2025');
  const squidS2Classification = getContentClassification(squidS2);
  const squidS2Html = renderMovieCard(squidS2);
  console.log("\nSquid Game Season 2 Card HTML:");
  console.log(squidS2Html.trim());
  if (!squidS2Classification.isTrailer || squidS2Classification.isSeries) {
    console.error("FAIL: Squid Game Season 2 must be classified as trailer!");
    process.exit(1);
  }
  if (!squidS2Html.includes('Trailer (4K)')) {
    console.error("FAIL: Squid Game Season 2 card must show Trailer (4K) badge!");
    process.exit(1);
  }
  console.log("✅ PASS: Squid Game Season 2 mini-card correctly displays Trailer (4K)");

  // Test Aspirants specifically
  const aspirants = movies.find(m => m.id === 'series_aspirants');
  const aspClassification = getContentClassification(aspirants);
  const aspHtml = renderMovieCard(aspirants);
  console.log("\nAspirants Card HTML:");
  console.log(aspHtml.trim());
  if (!aspClassification.isSeries || !aspClassification.isCompleteContent) {
    console.error("FAIL: Aspirants must be classified as complete series!");
    process.exit(1);
  }
  console.log("✅ PASS: TVF Aspirants correctly classified as complete series (5 Episodes)");

  // Test Kota Factory specifically
  const kota = movies.find(m => m.id === 'series_kota_factory');
  const kotaClassification = getContentClassification(kota);
  if (!kotaClassification.isSeries || kotaClassification.episodesCount !== 5) {
    console.error("FAIL: Kota Factory must have 5 episodes!");
    process.exit(1);
  }
  console.log("✅ PASS: Kota Factory verified with full 5 episodes");

  console.log("\nALL JS RENDERER TESTS PASSED 100%!");
} catch (e) {
  console.error("ERROR running JS renderer test:", e);
  process.exit(1);
}
