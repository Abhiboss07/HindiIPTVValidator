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
  if (suzumeHtml.includes('Official Trailer')) {
    console.error("FAIL: Suzume rendered with Official Trailer!");
    process.exit(1);
  }

  console.log("\nALL JS RENDERER TESTS PASSED 100%!");
} catch (e) {
  console.error("ERROR running JS renderer test:", e);
  process.exit(1);
}
