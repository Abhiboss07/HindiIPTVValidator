// ==========================================================
// AAKASHSTREAM - CORE APPLICATION & MEDIA ENGINE
// ==========================================================

const FALLBACK_CHANNELS = [
  {
    "id": "aajtak",
    "name": "Aaj Tak HD Live",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "India's leading 24x7 Hindi national news channel with ground reports and prime-time debates.",
    "url": "https://feeds.intoday.in/aajtak/api/aajtakhd/master.m3u8",
    "isFeatured": true
  },
  {
    "id": "abp-news",
    "name": "ABP News Live",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Top Hindi national political coverage, investigative bulletins, and election reports.",
    "url": "https://abpnews.akamaized.net/hls/live/2040313/abpnews/playlist.m3u8",
    "isFeatured": true
  },
  {
    "id": "ndtv-india",
    "name": "NDTV India HD",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Credible national primetime debates, special documentaries, and economic analysis.",
    "url": "https://ndtvindiaelemarchana.akamaized.net/hls/live/2003679/ndtvindia/master.m3u8",
    "isFeatured": true
  },
  {
    "id": "india-tv",
    "name": "India TV Live",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Aap Ki Adalat, Superfast 200, and fast Hindi national breaking news bulletins.",
    "url": "https://indiatvnews.akamaized.net/hls/live/2040315/indiatv/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "zee-news",
    "name": "Zee News HD",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "DNA daily analysis, national headlines, and investigative special broadcasts.",
    "url": "https://zeenews-lh.akamaihd.net/i/zee24taak_1@174853/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "news18-india",
    "name": "News18 India",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Network18 flagship Hindi national news channel with Aar Paar debates and live coverage.",
    "url": "https://news18india-lh.akamaihd.net/i/news18india_1@174939/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "republic-bharat",
    "name": "Republic Bharat",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Rashtra Ke Naam, high-energy prime-time debates, and fast Hindi breaking bulletins.",
    "url": "https://republicindia.akamaized.net/hls/live/2049302/republic/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "dd-news-hd",
    "name": "DD News HD Live",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Official public broadcaster of India with verified national governance bulletins.",
    "url": "https://ddnews.akamaized.net/hls/live/2040317/ddnews/master.m3u8",
    "isFeatured": true
  },
  {
    "id": "dd-national",
    "name": "DD National HD",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Doordarshan flagship national cultural programming, patriotic specials, and live sports.",
    "url": "https://ddnational.akamaized.net/hls/live/2040319/ddnational/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "sansad-tv-1",
    "name": "Sansad TV (Lok Sabha)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Official live broadcast of Indian Parliament Lok Sabha debates and committee hearings.",
    "url": "https://sansadtv1.akamaized.net/hls/live/2040321/sansadtv1/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "cnbc-awaaz",
    "name": "CNBC Awaaz Live",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Business News",
    "quality": "1080p FHD",
    "description": "Stock market live analysis, Sensex/Nifty updates, personal finance, and commodity trading.",
    "url": "https://cnbcawaaz-lh.akamaihd.net/i/cnbcawaaz_1@174955/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "zee-business",
    "name": "Zee Business HD",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Business News",
    "quality": "1080p FHD",
    "description": "Market Gurus, trading strategies, IPO insights, and business discussions in Hindi.",
    "url": "https://zeebiz-lh.akamaihd.net/i/zeebiz_1@174958/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "news-nation",
    "name": "News Nation",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "24x7 Hindi national news with special investigative crime and political documentaries.",
    "url": "https://newsnation.akamaized.net/hls/live/2040325/newsnation/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "tv9-bharatvarsh",
    "name": "TV9 Bharatvarsh HD",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Global warfare coverage, defense analysis, and prime time Hindi news reports.",
    "url": "https://tv9bharatvarsh.akamaized.net/hls/live/2040327/tv9/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "good-news-today",
    "name": "Good News Today (GNT)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Positive journalism, inspirational human stories, and uplifting national bulletins.",
    "url": "https://gnt.akamaized.net/hls/live/2040329/gnt/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "aastha-tv",
    "name": "Aastha TV HD Live",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Devotional",
    "quality": "1080p FHD",
    "description": "Vedic philosophy, yoga by Swami Ramdev, live Aarti from major pilgrim centres, and spiritual discourses.",
    "url": "https://aasthatv.akamaized.net/hls/live/2034040/aastha/master.m3u8",
    "isFeatured": true
  },
  {
    "id": "sanskar-tv",
    "name": "Sanskar TV HD",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Devotional",
    "quality": "1080p FHD",
    "description": "Bhajans, Katha by Pujya Morari Bapu, Pandit Pradeep Mishra, and live temple Darshan.",
    "url": "https://sanskartv.akamaized.net/hls/live/2034042/sanskar/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "sadhna-tv",
    "name": "Sadhna TV Live",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Devotional",
    "quality": "720p HD",
    "description": "Spiritual satsang, Vedic mantras, and astrological guidance in Hindi.",
    "url": "https://sadhnanews.akamaized.net/hls/live/2034044/sadhna/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "ishwar-tv",
    "name": "Ishwar Bhakti TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Devotional",
    "quality": "720p HD",
    "description": "Devotional kirtans, live temple Pujas, and religious discourses 24x7.",
    "url": "https://ishwartv.akamaized.net/hls/live/2034046/ishwar/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "9xm-music",
    "name": "9XM Hindi Music HD",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Music",
    "quality": "1080p FHD",
    "description": "Latest Bollywood party hits, top chartbusters, and hilarious animation shorts with Bade-Chhote.",
    "url": "https://9xm.akamaized.net/hls/live/2040333/9xm/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "b4u-music",
    "name": "B4U Music India",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Music",
    "quality": "1080p FHD",
    "description": "Classic and new Bollywood songs, pop countdowns, and celebrity interviews.",
    "url": "https://b4umusic.akamaized.net/hls/live/2040335/b4umusic/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "mastiii-tv",
    "name": "Mastiii Hindi Hits",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Music",
    "quality": "1080p FHD",
    "description": "Continuous Hindi romantic melodies, retro classics, and high-energy dance tracks.",
    "url": "https://mastiii.akamaized.net/hls/live/2040337/mastiii/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "b4u-kadak",
    "name": "B4U Kadak Cinema",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Blockbuster Hindi dubbed South Indian action movies and Bollywood blockbusters.",
    "url": "https://b4ukadak.akamaized.net/hls/live/2040339/b4ukadak/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "manoranjan-movies",
    "name": "Manoranjan TV Movies",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Classic Hindi cinema, comedy specials, and family entertainment films.",
    "url": "https://manoranjantv.akamaized.net/hls/live/2040341/manoranjan/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "air-vividh-bharati-12",
    "name": "AIR Vividh Bharati 102.8 FM",
    "type": "radio",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Radio",
    "quality": "32 kbps FM",
    "description": "Evergreen Bollywood golden melodies, Sangeet Sarita, Chhaya Geet, and classic All India Radio broadcasts.",
    "url": "https://air.pc.cdn.bitgravity.com/air/live/pbaudio034/playlist.m3u8",
    "isFeatured": true
  },
  {
    "id": "air-fm-gold-delhi-13",
    "name": "AIR FM Gold (Delhi 106.4 FM)",
    "type": "radio",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Radio",
    "quality": "32 kbps FM",
    "description": "Timeless Hindi retro music, live national news bulletins every hour, and cultural talk shows.",
    "url": "https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio001/hlspbaudio001_Auto.m3u8",
    "isFeatured": true
  },
  {
    "id": "air-fm-rainbow-delhi-14",
    "name": "AIR FM Rainbow (Delhi 102.6 FM)",
    "type": "radio",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Radio",
    "quality": "32 kbps FM",
    "description": "Contemporary Bollywood pop, western music specials, RJ chit-chat, and youth infotainment.",
    "url": "https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio002/hlspbaudio002_Auto.m3u8",
    "isFeatured": false
  },
  {
    "id": "air-national-hindi-15",
    "name": "AIR National Hindi News",
    "type": "radio",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Radio",
    "quality": "32 kbps",
    "description": "Live continuous Akashvani national news bulletins, Samachar, and Current Affairs from New Delhi.",
    "url": "https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio003/hlspbaudio003_Auto.m3u8",
    "isFeatured": false
  },
  {
    "id": "air-raagam-classical-16",
    "name": "AIR Raagam (Carnatic & Hindustani)",
    "type": "radio",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Radio",
    "quality": "32 kbps Classical",
    "description": "24x7 pure Indian Classical music: Hindustani Khayal, Carnatic Kritis, Dhrupad, and jugalbandis.",
    "url": "https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudioragam/hlspbaudioragam_Auto.m3u8",
    "isFeatured": false
  },
  {
    "id": "air-punjabi",
    "name": "AIR Punjabi (Jalandhar)",
    "type": "radio",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Radio",
    "quality": "32 kbps",
    "description": "Punjabi Lok Geet, Gurbani, Sufiana Kalam, and regional broadcasts from Punjab.",
    "url": "https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio020/hlspbaudio020_Auto.m3u8",
    "isFeatured": false
  },
  {
    "id": "air-marathi",
    "name": "AIR Marathi (Pune)",
    "type": "radio",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Radio",
    "quality": "32 kbps",
    "description": "Marathi Bhavgeet, Natyasangeet, Abhang, and cultural sahitya.",
    "url": "https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio022/hlspbaudio022_Auto.m3u8",
    "isFeatured": false
  },
  {
    "id": "air-gujarati",
    "name": "AIR Gujarati (Ahmedabad)",
    "type": "radio",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Radio",
    "quality": "32 kbps",
    "description": "Gujarati Sugam Sangeet, Garba, Dayro, and Prantiya Seva.",
    "url": "https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio024/hlspbaudio024_Auto.m3u8",
    "isFeatured": false
  },
  {
    "id": "air-bengali",
    "name": "AIR Bengali (Kolkata)",
    "type": "radio",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Radio",
    "quality": "32 kbps",
    "description": "Rabindrasangeet, Nazrul Geeti, Adhunik Bangla Gaan, and regional bulletins.",
    "url": "https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio026/hlspbaudio026_Auto.m3u8",
    "isFeatured": false
  },
  {
    "id": "air-tamil",
    "name": "AIR Tamil (Chennai Rainbow)",
    "type": "radio",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Radio",
    "quality": "32 kbps",
    "description": "Tamil cine melodies, Carnatic classical, and regional cultural programmes from Chennai.",
    "url": "https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio028/hlspbaudio028_Auto.m3u8",
    "isFeatured": false
  },
  {
    "id": "air-telugu",
    "name": "AIR Telugu (Hyderabad)",
    "type": "radio",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Radio",
    "quality": "32 kbps",
    "description": "Telugu Lalitha Sangeetham, Annamacharya Kirtanas, and Deccan regional news.",
    "url": "https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio030/hlspbaudio030_Auto.m3u8",
    "isFeatured": false
  },
  {
    "id": "air-urdu",
    "name": "AIR Urdu Service",
    "type": "radio",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Radio",
    "quality": "32 kbps",
    "description": "Urdu Ghazals, Mushaira, Qawwali, and literary discussions.",
    "url": "https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio032/hlspbaudio032_Auto.m3u8",
    "isFeatured": false
  },
  {
    "id": "abc-news-us",
    "name": "ABC News Live HD",
    "type": "tv",
    "country": "US",
    "countryName": "United States",
    "flag": "\ud83c\uddfa\ud83c\uddf8",
    "category": "News",
    "quality": "1080p FHD",
    "description": "American 24/7 breaking news, special investigations, politics, and live global coverage.",
    "url": "https://content.uplynk.com/channel/3324f2467c414329b3b0cc5da9f34b60.m3u8",
    "isFeatured": false
  },
  {
    "id": "cbs-news-us",
    "name": "CBS News 24/7",
    "type": "tv",
    "country": "US",
    "countryName": "United States",
    "flag": "\ud83c\uddfa\ud83c\uddf8",
    "category": "News",
    "quality": "1080p FHD",
    "description": "CBS News live national news stream, 60 Minutes specials, and in-depth reporting.",
    "url": "https://cbsn-us.cbsnstream.cbsnews.com/out/v1/55a8648e8f134e82a470f83d562deeea/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "nbc-news-now",
    "name": "NBC News NOW",
    "type": "tv",
    "country": "US",
    "countryName": "United States",
    "flag": "\ud83c\uddfa\ud83c\uddf8",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Live breaking news, international reporting, and primetime news analysis.",
    "url": "https://nbcnews-lh.akamaihd.net/i/nbcnews_1@174991/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "bloomberg-us",
    "name": "Bloomberg TV USA",
    "type": "tv",
    "country": "US",
    "countryName": "United States",
    "flag": "\ud83c\uddfa\ud83c\uddf8",
    "category": "Business News",
    "quality": "1080p FHD",
    "description": "Wall Street financial coverage, tech market trends, CEO interviews, and global economics.",
    "url": "https://bloomberg.com/media-manifest/streams/us.m3u8",
    "isFeatured": false
  },
  {
    "id": "nasa-tv-us",
    "name": "NASA TV HD (Space Live)",
    "type": "tv",
    "country": "US",
    "countryName": "United States",
    "flag": "\ud83c\uddfa\ud83c\uddf8",
    "category": "Science & Space",
    "quality": "1080p FHD",
    "description": "Live views from the International Space Station (ISS), rocket launches, spacewalks, and deep space exploration.",
    "url": "https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8",
    "isFeatured": true
  },
  {
    "id": "redbull-tv-us",
    "name": "Red Bull TV Live",
    "type": "tv",
    "country": "US",
    "countryName": "United States",
    "flag": "\ud83c\uddfa\ud83c\uddf8",
    "category": "Sports & Action",
    "quality": "1080p FHD",
    "description": "Extreme sports, Formula 1, downhill mountain biking, surfing, and music festival streams.",
    "url": "https://rbmn-live.akamaized.net/hls/live/590964/flns-bk1-p/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "livenow-fox-us",
    "name": "LiveNOW from FOX",
    "type": "tv",
    "country": "US",
    "countryName": "United States",
    "flag": "\ud83c\uddfa\ud83c\uddf8",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Raw, unfiltered live breaking news events, press conferences, and emergency coverage from the US.",
    "url": "https://fox-foxnewsnow-1-us.samsung.wurl.tv/manifest/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "sky-news-uk",
    "name": "Sky News UK Live HD",
    "type": "tv",
    "country": "UK",
    "countryName": "United Kingdom",
    "flag": "\ud83c\uddec\ud83c\udde7",
    "category": "News",
    "quality": "1080p FHD",
    "description": "British first for breaking news, international diplomacy, business, and Royal reporting.",
    "url": "https://skynews.akamaized.net/hls/live/2040347/skynews/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "gb-news-uk",
    "name": "GB News UK Live",
    "type": "tv",
    "country": "UK",
    "countryName": "United Kingdom",
    "flag": "\ud83c\uddec\ud83c\udde7",
    "category": "News",
    "quality": "1080p FHD",
    "description": "UK national news discussions, politics, opinion, and community debates.",
    "url": "https://gbnews.akamaized.net/hls/live/2040349/gbnews/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "reuters-uk",
    "name": "Reuters TV Live",
    "type": "tv",
    "country": "UK",
    "countryName": "United Kingdom",
    "flag": "\ud83c\uddec\ud83c\udde7",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Global news wire, geopolitics, business markets, and unbiased reporting from around the globe.",
    "url": "https://reuters-reuterstv-1-us.samsung.wurl.tv/manifest/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "al-jazeera-en",
    "name": "Al Jazeera English HD",
    "type": "tv",
    "country": "AE",
    "countryName": "UAE & Middle East",
    "flag": "\ud83c\udde6\ud83c\uddea",
    "category": "News",
    "quality": "1080p FHD",
    "description": "In-depth international news with award-winning global documentaries and Middle East coverage.",
    "url": "https://live-hls-web-aje.getaj.net/AJE/03.m3u8",
    "isFeatured": false
  },
  {
    "id": "al-jazeera-ar",
    "name": "Al Jazeera Arabic Live",
    "type": "tv",
    "country": "AE",
    "countryName": "UAE & Middle East",
    "flag": "\ud83c\udde6\ud83c\uddea",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Leading Arabic 24x7 breaking news network from Doha, Qatar.",
    "url": "https://live-hls-web-aja.getaj.net/AJA/03.m3u8",
    "isFeatured": false
  },
  {
    "id": "dubai-tv",
    "name": "Dubai TV HD Live",
    "type": "tv",
    "country": "AE",
    "countryName": "UAE & Middle East",
    "flag": "\ud83c\udde6\ud83c\uddea",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "United Arab Emirates national entertainment, cultural programs, and regional news.",
    "url": "https://dmilive2.akamaized.net/hls/live/2012015/dubaitv/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "saudi-quran-makkah",
    "name": "Holy Makkah Live 24/7 (Kaaba)",
    "type": "tv",
    "country": "SA",
    "countryName": "Saudi Arabia",
    "flag": "\ud83c\uddf8\ud83c\udde6",
    "category": "Devotional",
    "quality": "1080p FHD",
    "description": "Live 24x7 continuous broadcast from the Grand Mosque (Masjid al-Haram) in Makkah with continuous Quran recitation.",
    "url": "https://makkah-live.akamaized.net/hls/live/2034050/makkah/master.m3u8",
    "isFeatured": true
  },
  {
    "id": "saudi-sunnah-madinah",
    "name": "Holy Madinah Live 24/7 (Prophet Mosque)",
    "type": "tv",
    "country": "SA",
    "countryName": "Saudi Arabia",
    "flag": "\ud83c\uddf8\ud83c\udde6",
    "category": "Devotional",
    "quality": "1080p FHD",
    "description": "Live 24x7 continuous broadcast from the Prophet's Mosque (Al-Masjid an-Nabawi) in Madinah Munawwarah.",
    "url": "https://madinah-live.akamaized.net/hls/live/2034052/madinah/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "dw-deutsch",
    "name": "DW Deutsch Live",
    "type": "tv",
    "country": "DE",
    "countryName": "Germany",
    "flag": "\ud83c\udde9\ud83c\uddea",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Deutsche Welle flagship German international public broadcast with European insights.",
    "url": "https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "dw-english",
    "name": "DW English Live HD",
    "type": "tv",
    "country": "DE",
    "countryName": "Germany",
    "flag": "\ud83c\udde9\ud83c\uddea",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Germany's international broadcaster with global news, science, culture, and business.",
    "url": "https://dwamdstream104.akamaized.net/hls/live/2015530/dwstream104/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "euronews-de",
    "name": "Euronews German",
    "type": "tv",
    "country": "DE",
    "countryName": "Germany",
    "flag": "\ud83c\udde9\ud83c\uddea",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Pan-European multilingual news channel offering European perspectives in German.",
    "url": "https://euronews-de.akamaized.net/hls/live/2040355/euronewsde/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "france24-fr",
    "name": "France 24 Fran\u00e7ais",
    "type": "tv",
    "country": "FR",
    "countryName": "France",
    "flag": "\ud83c\uddeb\ud83c\uddf7",
    "category": "News",
    "quality": "1080p FHD",
    "description": "French international news channel with global political coverage and Paris cultural reports.",
    "url": "https://static.france24.com/live/F24_FR_HI_HLS/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "france24-en",
    "name": "France 24 English HD",
    "type": "tv",
    "country": "FR",
    "countryName": "France",
    "flag": "\ud83c\uddeb\ud83c\uddf7",
    "category": "News",
    "quality": "1080p FHD",
    "description": "French perspectives on world events, diplomacy, culture, and international affairs in English.",
    "url": "https://static.france24.com/live/F24_EN_HI_HLS/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "nhk-world-japan",
    "name": "NHK World Japan HD",
    "type": "tv",
    "country": "JP",
    "countryName": "Japan",
    "flag": "\ud83c\uddef\ud83c\uddf5",
    "category": "News & Culture",
    "quality": "1080p FHD",
    "description": "Japan's national public broadcaster in English: Tokyo news, tech innovations, anime, and travel.",
    "url": "https://nhkworld.akamaized.net/hls/live/2003458/nhkworld-tv/master.m3u8",
    "isFeatured": true
  },
  {
    "id": "arirang-korea",
    "name": "Arirang World (Korea)",
    "type": "tv",
    "country": "KR",
    "countryName": "South Korea",
    "flag": "\ud83c\uddf0\ud83c\uddf7",
    "category": "Culture & K-Pop",
    "quality": "1080p FHD",
    "description": "South Korea's global English network: K-Pop Simply K-Pop concerts, Seoul tech, and Korean dramas.",
    "url": "https://arirang.akamaized.net/hls/live/2040360/arirang/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "cbc-news-canada",
    "name": "CBC News Explore (Canada)",
    "type": "tv",
    "country": "CA",
    "countryName": "Canada",
    "flag": "\ud83c\udde8\ud83c\udde6",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Canadian Broadcasting Corporation live national news and environmental investigations.",
    "url": "https://cbclive.akamaized.net/hls/live/2040362/cbcnews/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "abc-news-australia",
    "name": "ABC News Australia Live",
    "type": "tv",
    "country": "AU",
    "countryName": "Australia",
    "flag": "\ud83c\udde6\ud83c\uddfa",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Australian Broadcasting Corporation 24/7 national news, Sydney/Melbourne updates, and Pacific reports.",
    "url": "https://abcnewsau.akamaized.net/hls/live/2040364/abcnewsau/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "geo-news-pk",
    "name": "Geo News Live (Pakistan)",
    "type": "tv",
    "country": "PK",
    "countryName": "Pakistan",
    "flag": "\ud83c\uddf5\ud83c\uddf0",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Pakistan's top Urdu news channel with Capital Talk and national bulletins.",
    "url": "https://geonews.akamaized.net/hls/live/2040366/geonews/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "ary-news-pk",
    "name": "ARY News Urdu Live",
    "type": "tv",
    "country": "PK",
    "countryName": "Pakistan",
    "flag": "\ud83c\uddf5\ud83c\uddf0",
    "category": "News",
    "quality": "1080p FHD",
    "description": "24x7 Urdu breaking news, talk shows, and political commentary.",
    "url": "https://arynews.akamaized.net/hls/live/2040368/arynews/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "somoy-tv-bd",
    "name": "Somoy TV Live (Bangladesh)",
    "type": "tv",
    "country": "BD",
    "countryName": "Bangladesh",
    "flag": "\ud83c\udde7\ud83c\udde9",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Leading 24-hour Bangla news channel from Dhaka, Bangladesh.",
    "url": "https://somoytv.akamaized.net/hls/live/2040370/somoy/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "kantipur-tv-np",
    "name": "Kantipur TV HD (Nepal)",
    "type": "tv",
    "country": "NP",
    "countryName": "Nepal",
    "flag": "\ud83c\uddf3\ud83c\uddf5",
    "category": "News & Entertainment",
    "quality": "1080p FHD",
    "description": "Nepal's most popular private TV channel with Kathmandu news, cultural shows, and music.",
    "url": "https://kantipurtv.akamaized.net/hls/live/2040372/kantipur/master.m3u8",
    "isFeatured": false
  }
];

const DEFAULT_LOCAL_MEDIA = [
  {
    id: 'sample_local_1',
    name: 'ISRO Chandrayaan-3 Special Mission Highlights.mp4',
    type: 'tv',
    country: 'Local',
    countryName: 'Device Storage',
    flag: '🎬',
    category: 'MP4 Video',
    quality: '1080p • 24.5 MB',
    description: 'Offline MP4 video on device',
    url: 'https://feeds.intoday.in/aajtak/api/aajtakhd/master.m3u8',
    duration: '24:18',
    isLocal: true
  },
  {
    id: 'sample_local_2',
    name: 'Bollywood Evergreen 90s Melodies Playlist.mp3',
    type: 'radio',
    country: 'Local',
    countryName: 'Device Storage',
    flag: '🎵',
    category: 'MP3 Audio',
    quality: '320 kbps • 8.2 MB',
    description: 'Offline MP3 audio track',
    url: 'https://air.pc.cdn.bitgravity.com/air/live/pbaudio034/playlist.m3u8',
    duration: '04:35',
    isLocal: true
  },
  {
    id: 'sample_local_3',
    name: 'Ancient Architecture & Temples of India.mp4',
    type: 'tv',
    country: 'Local',
    countryName: 'Device Storage',
    flag: '🎬',
    category: 'MP4 Video',
    quality: '1080p • 18.2 MB',
    description: 'Offline MP4 video on device',
    url: 'https://aasthatv.akamaized.net/hls/live/2034040/aastha/master.m3u8',
    duration: '18:40',
    isLocal: true
  },
  {
    id: 'sample_local_4',
    name: 'Morning Raagam Sangeet Sarita Classical.mp3',
    type: 'radio',
    country: 'Local',
    countryName: 'Device Storage',
    flag: '🎵',
    category: 'MP3 Audio',
    quality: 'AIR Classical • 5.4 MB',
    description: 'Offline MP3 audio track',
    url: 'https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudioragam/hlspbaudioragam_Auto.m3u8',
    duration: '06:12',
    isLocal: true
  }
];

const HERO_FEATURED_CHANNELS = [
  {
    id: 'aajtak',
    name: 'Aaj Tak HD Live',
    category: 'Hindi News • 1080p FHD',
    desc: "Watch India's leading 24x7 Hindi national breaking news, prime-time debates, and ground reports in Full HD.",
    bg: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80',
    tag: 'LIVE 24/7',
    quality: '1080p FHD'
  },
  {
    id: 'abp-news',
    name: 'ABP News Live',
    category: 'Breaking News • 1080p FHD',
    desc: "Top national political coverage, investigative ground reports, and live election coverage from across India.",
    bg: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&auto=format&fit=crop&q=80',
    tag: 'BREAKING',
    quality: '1080p FHD'
  },
  {
    id: 'ndtv-india',
    name: 'NDTV India HD',
    category: 'In-Depth News • 1080p FHD',
    desc: "Comprehensive special reports, primetime debates, economy and world news analysis in Hindi.",
    bg: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1200&auto=format&fit=crop&q=80',
    tag: 'PRIME TIME',
    quality: '1080p FHD'
  },
  {
    id: 'air-vividh-bharati-12',
    name: 'AIR Vividh Bharati 102.8 FM',
    category: 'All India Radio • 102.8 MHz',
    desc: "Evergreen Bollywood golden melodies, Sangeet Sarita, Chhaya Geet, and classic All India Radio broadcasts.",
    bg: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80',
    tag: 'AIR LIVE',
    quality: '32 kbps FM'
  },
  {
    id: 'aastha-tv',
    name: 'Aastha TV HD Live',
    category: 'Spiritual & Bhakti • 1080p',
    desc: "Vedic chants, continuous live Aarti, yoga sessions by Swami Ramdev, and spiritual discourses 24x7.",
    bg: 'https://images.unsplash.com/photo-1545239351-ef35f43d514b?w=1200&auto=format&fit=crop&q=80',
    tag: 'DEVOTIONAL',
    quality: '1080p FHD'
  },
  {
    id: 'dd-news-hd',
    name: 'DD News HD Live',
    category: 'Doordarshan National • 1080p',
    desc: "Official national public broadcaster of India with comprehensive governance news and Parliament bulletins.",
    bg: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80',
    tag: 'NATIONAL',
    quality: '1080p FHD'
  }
];

let channelsData = FALLBACK_CHANNELS;
let favorites = JSON.parse(localStorage.getItem('aakash_favs') || '["aajtak", "air-vividh-bharati-12"]');
let recentChannels = JSON.parse(localStorage.getItem('aakash_recents') || '[]');
let customLocalMedia = JSON.parse(localStorage.getItem('aakash_local_media') || 'null');
if (!customLocalMedia || customLocalMedia.length === 0) {
  customLocalMedia = DEFAULT_LOCAL_MEDIA;
}

let currentActivePage = 'home';
let currentPlayingChannel = null;
let isPlaying = false;
let isCCEnabled = localStorage.getItem('aakash_cc') === 'true';
let hlsInstance = null;
let ccInterval = null;
let playerHideTimeout = null;
let heroIndex = 0;
let heroInterval = null;

// Initialize Application
document.addEventListener('DOMContentLoaded', async () => {
  initParticles();
  initPlayerOverlayEvents();
  updateCCUI();
  await loadDatabase();
  renderAllPages();
  loadSettingsUI();
  startHeroRotator();

  if (channelsData && channelsData.length > 0) {
    loadChannelMedia(channelsData[0], false);
  }
});

async function loadDatabase() {
  if (window.location.protocol.startsWith('http')) {
    try {
      const res = await fetch('data/channels.json');
      if (res.ok) {
        channelsData = await res.json();
      }
    } catch (e) {
      channelsData = FALLBACK_CHANNELS;
    }
  }
}

function renderAllPages() {
  renderHomePage();
  renderLiveTVPage();
  renderRadioPage();
  renderLocalPage();
  renderFavoritesPage();
}

// ==========================================================
// PAGE ROUTING & NAVIGATION
// ==========================================================
window.switchPage = function(pageId) {
  currentActivePage = pageId;
  document.querySelectorAll('.page-view').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.dock-tab-btn').forEach(b => b.classList.remove('active'));

  const targetPage = document.getElementById('page-' + pageId);
  const targetTab = document.getElementById('tab-' + pageId);
  if (targetPage) targetPage.classList.add('active');
  if (targetTab) targetTab.classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (pageId === 'home') renderHomePage();
  if (pageId === 'live') renderLiveTVPage();
  if (pageId === 'radio') renderRadioPage();
  if (pageId === 'favs') renderFavoritesPage();
  if (pageId === 'local') renderLocalPage();
};

window.toggleMenuDrawer = function() {
  const drawer = document.getElementById('sideDrawerModal');
  if (drawer) drawer.classList.toggle('active');
};

window.openSettingsModal = function() {
  const modal = document.getElementById('settingsModal');
  if (modal) modal.classList.add('active');
};

window.closeSettingsModal = function() {
  const modal = document.getElementById('settingsModal');
  if (modal) modal.classList.remove('active');
};

// ==========================================================
// 1. HOME PAGE & HERO ROTATOR
// ==========================================================
function startHeroRotator() {
  clearInterval(heroInterval);
  updateHeroUI(HERO_FEATURED_CHANNELS[0]);
  heroInterval = setInterval(() => {
    heroIndex = (heroIndex + 1) % HERO_FEATURED_CHANNELS.length;
    updateHeroUI(HERO_FEATURED_CHANNELS[heroIndex]);
  }, 5500);
}

function updateHeroUI(item) {
  const heroBgImg = document.getElementById('heroBgImg');
  const heroTitle = document.getElementById('heroTitle');
  const heroDesc = document.getElementById('heroDesc');
  const heroTagBadge = document.getElementById('heroTagBadge');
  const heroQualityTag = document.getElementById('heroQualityTag');

  if (heroBgImg) {
    heroBgImg.style.opacity = '0.3';
    setTimeout(() => {
      heroBgImg.style.backgroundImage = "url('" + item.bg + "')";
      heroBgImg.style.opacity = '1';
    }, 300);
  }

  if (heroTitle) heroTitle.textContent = item.name;
  if (heroDesc) heroDesc.textContent = item.desc;
  if (heroTagBadge) heroTagBadge.innerHTML = '<span class="pulse-dot"></span> ' + item.tag;
  if (heroQualityTag) heroQualityTag.textContent = item.quality;
}

window.playCurrentHeroChannel = function() {
  const currentHero = HERO_FEATURED_CHANNELS[heroIndex];
  const ch = channelsData.find(c => c.id === currentHero.id) || channelsData[0];
  if (ch) playChannel(ch);
};

function renderHomePage() {
  const liveNowList = document.getElementById('homeLiveNowList');
  const continueList = document.getElementById('homeContinueList');
  const featMediaList = document.getElementById('homeFeaturedMediaList');

  // Live Channels Carousel
  if (liveNowList) {
    liveNowList.innerHTML = '';
    const liveStreams = channelsData.filter(c => c.type === 'tv').slice(0, 10);
    liveStreams.forEach((ch, idx) => {
      const viewers = ['18.4K', '14.2K', '12.8K', '9.5K', '8.1K', '6.4K', '5.2K', '4.7K', '3.9K', '3.1K'][idx % 10];
      const card = document.createElement('div');
      card.className = 'live-now-card';
      
      const thumbUrl = ch.id === 'aajtak' 
        ? 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&auto=format&fit=crop&q=80'
        : (ch.id === 'abp-news' 
          ? 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&auto=format&fit=crop&q=80'
          : (ch.id === 'nasa-tv-us'
            ? 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=600&auto=format&fit=crop&q=80'));

      card.innerHTML = `
        <div class="live-now-thumb">
          <img src="${thumbUrl}" alt="${ch.name}">
          <div class="live-viewer-chip">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="#ffb4ab"><path d="M12 4C7.58 4 4 7.58 4 12c0 2.21.89 4.21 2.34 5.66l1.41-1.41C6.62 15.12 6 13.62 6 12c0-3.31 2.69-6 6-6s6 2.69 6 6c0 1.62-.62 3.12-1.76 4.24l1.41 1.41C19.11 16.21 20 14.21 20 12c0-4.42-3.58-8-8-8zm0 4c-2.21 0-4 1.79-4 4 0 1.1.45 2.1 1.17 2.83l1.41-1.41C10.22 13.06 10 12.56 10 12c0-1.1.9-2 2-2s2 .9 2 2c0 .56-.22 1.06-.59 1.41l1.41 1.41C15.55 14.1 16 13.1 16 12c0-2.21-1.79-4-4-4zm0 3c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/></svg>
            <span>${viewers}</span>
          </div>
        </div>
        <h4 class="card-title-text">${ch.name}</h4>
        <p class="card-subtitle-text">${ch.countryName || 'Live'} • ${ch.quality}</p>
      `;
      card.onclick = () => playChannel(ch);
      liveNowList.appendChild(card);
    });
  }

  // Recently Played Grid
  if (continueList) {
    continueList.innerHTML = '';
    const recents = recentChannels.length > 0 
      ? recentChannels.map(id => channelsData.find(c => c.id === id)).filter(Boolean)
      : channelsData.slice(0, 4);

    recents.forEach((ch, idx) => {
      const progress = [80, 45, 65, 30][idx % 4];
      const item = document.createElement('div');
      item.className = 'continue-item-row';
      item.innerHTML = `
        <div class="continue-row-thumb">
          ${ch.type === 'radio' ? '📻' : (ch.flag || '📺')}
        </div>
        <div class="continue-row-info">
          <div>
            <h4 class="card-title-text">${ch.name}</h4>
            <p class="card-subtitle-text">${ch.countryName} • ${ch.category}</p>
          </div>
          <div class="obsidian-track-bar">
            <div class="obsidian-track-fill" style="width: ${progress}%;"></div>
          </div>
        </div>
      `;
      item.onclick = () => playChannel(ch);
      continueList.appendChild(item);
    });
  }

  // Trending Featured Media
  if (featMediaList) {
    featMediaList.innerHTML = '';
    const sampleFeatured = channelsData.filter(c => c.isFeatured).slice(0, 6);
    sampleFeatured.forEach(item => {
      featMediaList.appendChild(createChannelListItem(item));
    });
  }
}

// ==========================================================
// 2. LIVE TV PAGE RENDER & COUNTRY / GENRE FILTERS
// ==========================================================
let currentLiveCountry = 'ALL';
let currentLiveCategory = 'ALL';
let currentLiveSearch = '';

function renderLiveTVPage() {
  filterLiveChannels();
}

window.handleLiveSearch = function(val) {
  currentLiveSearch = val;
  filterLiveChannels();
};

window.filterLiveCountry = function(countryCode, btnEl) {
  currentLiveCountry = countryCode.toUpperCase();
  document.querySelectorAll('#liveCountryChips .lumina-chip').forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  filterLiveChannels();
};

window.filterLiveCategory = function(catId, btnEl) {
  currentLiveCategory = catId.toUpperCase();
  document.querySelectorAll('#liveCategoryChips .lumina-chip').forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  filterLiveChannels();
};

function filterLiveChannels() {
  const feed = document.getElementById('liveChannelsFeed');
  if (!feed) return;
  feed.innerHTML = '';

  let list = channelsData.filter(ch => ch.type === 'tv');

  // Filter by Country
  if (currentLiveCountry !== 'ALL') {
    list = list.filter(c => c.country && c.country.toUpperCase() === currentLiveCountry);
  }

  // Filter by Category
  if (currentLiveCategory !== 'ALL') {
    if (currentLiveCategory === 'NEWS') {
      list = list.filter(c => c.category && (c.category.toLowerCase().includes('news') || c.category.toLowerCase().includes('business')));
    } else if (currentLiveCategory === 'DEVOTIONAL') {
      list = list.filter(c => c.category && (c.category.toLowerCase().includes('devotional') || c.category.toLowerCase().includes('holy') || c.category.toLowerCase().includes('spiritual')));
    } else if (currentLiveCategory === 'ENTERTAINMENT') {
      list = list.filter(c => c.category && (c.category.toLowerCase().includes('entertainment') || c.category.toLowerCase().includes('culture') || c.category.toLowerCase().includes('movies') || c.category.toLowerCase().includes('sports')));
    } else if (currentLiveCategory === 'MUSIC') {
      list = list.filter(c => c.category && c.category.toLowerCase().includes('music'));
    } else if (currentLiveCategory === 'BUSINESS') {
      list = list.filter(c => c.category && c.category.toLowerCase().includes('business'));
    } else if (currentLiveCategory === 'SCIENCE') {
      list = list.filter(c => c.category && (c.category.toLowerCase().includes('science') || c.category.toLowerCase().includes('space')));
    }
  }

  // Filter by Search Query
  if (currentLiveSearch.trim() !== '') {
    const q = currentLiveSearch.toLowerCase();
    list = list.filter(c => {
      return (c.name && c.name.toLowerCase().includes(q)) ||
             (c.category && c.category.toLowerCase().includes(q)) ||
             (c.countryName && c.countryName.toLowerCase().includes(q)) ||
             (c.description && c.description.toLowerCase().includes(q));
    });
  }

  const countTitle = document.getElementById('liveChannelsCountTitle');
  if (countTitle) {
    countTitle.textContent = 'All Live Channels (' + list.length + ')';
  }

  if (list.length === 0) {
    feed.innerHTML = `
      <div style="text-align: center; padding: 40px 16px; color: #a3a3a3;">
        <div style="font-size: 32px; margin-bottom: 8px;">📡</div>
        <p style="font-size: 14px; font-weight: 600; color: #fff;">No channels matched your filter</p>
        <p style="font-size: 12px; color: #737373;">Try selecting 'All Countries' or 'All Genres'</p>
      </div>
    `;
    return;
  }

  list.forEach(ch => {
    feed.appendChild(createChannelListItem(ch));
  });
}

function createChannelListItem(ch) {
  const item = document.createElement('div');
  const isFav = favorites.includes(ch.id);
  const bitRatePct = Math.floor(Math.random() * 30) + 70;
  
  item.className = 'channel-list-item';
  item.innerHTML = `
    <div class="channel-avatar-box">
      ${ch.type === 'radio' ? '📻' : (ch.flag || '📺')}
    </div>
    <div class="channel-info-box">
      <div class="channel-header-row">
        <div class="channel-title-text">${ch.name}</div>
        <div class="badge-live-tag">
          <span class="live-red-dot" style="width: 5px; height: 5px;"></span>
          <span>LIVE</span>
        </div>
      </div>
      <div class="channel-sub-desc">${ch.countryName || 'Live'} • ${ch.category} • ${ch.quality}</div>
      <div class="channel-bitrate-bar">
        <div class="channel-bitrate-fill" style="width: ${bitRatePct}%;"></div>
      </div>
    </div>
    <div style="display: flex; align-items: center; gap: 4px;" onclick="event.stopPropagation()">
      <button class="icon-btn-plain" style="width: 34px; height: 34px;" onclick="copyVlcLink(event, '${ch.url}')" title="Copy VLC Link">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="#a3a3a3"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
      </button>
      <button class="icon-btn-plain" style="width: 34px; height: 34px;" onclick="toggleFav(event, '${ch.id}')" title="Bookmark">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="${isFav ? '#facc15' : '#737373'}"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>
      </button>
    </div>
  `;

  item.onclick = () => playChannel(ch);
  return item;
}

// ==========================================================
// 3. RADIO STATIONS PAGE RENDER
// ==========================================================
let currentRadioGenre = 'all';

function renderRadioPage() {
  const feed = document.getElementById('radioStationsFeed');
  if (!feed) return;
  feed.innerHTML = '';

  const radioStations = channelsData.filter(c => c.type === 'radio');
  radioStations.forEach(st => {
    feed.appendChild(createRadioCard(st));
  });
}

window.handleRadioSearch = function(val) {
  const q = val.toLowerCase().trim();
  const feed = document.getElementById('radioStationsFeed');
  if (!feed) return;
  
  const radioStations = channelsData.filter(c => c.type === 'radio');
  const filtered = radioStations.filter(st => {
    return st.name.toLowerCase().includes(q) || (st.description && st.description.toLowerCase().includes(q));
  });
  
  feed.innerHTML = '';
  filtered.forEach(st => feed.appendChild(createRadioCard(st)));
};

window.filterRadioGenre = function(genre, btnEl) {
  currentRadioGenre = genre;
  document.querySelectorAll('#radioFilterChips .lumina-chip').forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');

  const feed = document.getElementById('radioStationsFeed');
  if (!feed) return;

  const radioStations = channelsData.filter(c => c.type === 'radio');
  let filtered = radioStations;

  if (genre === 'fm') {
    filtered = radioStations.filter(s => s.name.toLowerCase().includes('fm') || s.quality.includes('FM'));
  } else if (genre === 'national') {
    filtered = radioStations.filter(s => s.name.toLowerCase().includes('national') || s.name.toLowerCase().includes('news') || s.name.toLowerCase().includes('vividh'));
  } else if (genre === 'classical') {
    filtered = radioStations.filter(s => s.name.toLowerCase().includes('raagam') || s.name.toLowerCase().includes('classical'));
  } else if (genre === 'bhakti') {
    filtered = radioStations.filter(s => s.name.toLowerCase().includes('aaradhana') || s.name.toLowerCase().includes('bhakti'));
  }

  feed.innerHTML = '';
  filtered.forEach(st => feed.appendChild(createRadioCard(st)));
};

function createRadioCard(st) {
  const card = document.createElement('div');
  card.className = 'obsidian-bento-item';
  card.style.height = '130px';
  card.style.padding = '12px';
  card.style.textAlign = 'center';

  card.innerHTML = `
    <div style="width: 42px; height: 42px; border-radius: 50%; background: #232323; display: flex; align-items: center; justify-content: center; font-size: 22px; margin-bottom: 4px;">
      📻
    </div>
    <div style="font-size: 13px; font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%;">${st.name}</div>
    <div class="mono" style="font-size: 10px; color: #E50914; font-weight: 700;">${st.quality}</div>
  `;

  card.onclick = () => playChannel(st);
  return card;
}

window.playStationDirect = function(stationId) {
  const ch = channelsData.find(c => c.id === stationId) || channelsData.find(c => c.type === 'radio');
  if (ch) playChannel(ch);
};

window.playLiveChannelById = function(channelId) {
  const ch = channelsData.find(c => c.id === channelId) || channelsData[0];
  if (ch) playChannel(ch);
};

// ==========================================================
// 4. LOCAL MEDIA LIBRARY (VIDEOS & AUDIO SECTIONS)
// ==========================================================
let currentLocalFilter = 'all';

window.filterLocalType = function(type, btnEl) {
  currentLocalFilter = type;
  document.querySelectorAll('#page-local .lumina-chip').forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');

  const vSec = document.getElementById('localVideosSection');
  const aSec = document.getElementById('localAudioSection');
  
  if (type === 'all') {
    if (vSec) vSec.style.display = 'block';
    if (aSec) aSec.style.display = 'block';
  } else if (type === 'videos') {
    if (vSec) vSec.style.display = 'block';
    if (aSec) aSec.style.display = 'none';
  } else if (type === 'audio') {
    if (vSec) vSec.style.display = 'none';
    if (aSec) aSec.style.display = 'block';
  }
};

function renderLocalPage() {
  const vFeed = document.getElementById('localVideosFeed');
  const aFeed = document.getElementById('localAudioFeed');
  const allCount = document.getElementById('localAllCount');
  const vidCount = document.getElementById('localVideosCount');
  const audCount = document.getElementById('localAudioCount');

  const videoFiles = customLocalMedia.filter(m => m.type === 'tv' || (m.name && m.name.match(/\.(mp4|mkv|mov|webm|avi)$/i)));
  const audioFiles = customLocalMedia.filter(m => m.type === 'radio' || (m.name && m.name.match(/\.(mp3|m4a|wav|aac|flac)$/i)));

  if (allCount) allCount.textContent = customLocalMedia.length;
  if (vidCount) vidCount.textContent = videoFiles.length;
  if (audCount) audCount.textContent = audioFiles.length;

  // Render Videos
  if (vFeed) {
    vFeed.innerHTML = '';
    if (videoFiles.length === 0) {
      vFeed.innerHTML = '<div style="font-size: 13px; color: #737373; padding: 16px; text-align: center;">No .mp4 video files found. Tap "Add Videos & Music" to load videos.</div>';
    } else {
      videoFiles.forEach(media => {
        const item = document.createElement('div');
        item.className = 'local-file-item';
        
        const thumbHtml = media.thumbUrl 
          ? `<img src="${media.thumbUrl}" alt="${media.name}">`
          : '<span style="font-size: 24px;">🎬</span>';

        item.innerHTML = `
          <div class="local-thumb-container">
            ${thumbHtml}
            <span class="local-duration-badge">${media.duration || 'VIDEO'}</span>
          </div>
          <div style="flex: 1; min-width: 0;">
            <h4 style="font-size: 14px; font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${media.name}</h4>
            <p style="font-size: 12px; color: #a3a3a3;">${media.quality} • MP4 Video</p>
          </div>
          <button class="icon-btn-plain" style="color: #E50914;" onclick="event.stopPropagation(); removeLocalMediaById('${media.id}')" title="Remove">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
        `;
        item.onclick = () => playChannel(media);
        vFeed.appendChild(item);
      });
    }
  }

  // Render Audio
  if (aFeed) {
    aFeed.innerHTML = '';
    if (audioFiles.length === 0) {
      aFeed.innerHTML = '<div style="font-size: 13px; color: #737373; padding: 16px; text-align: center;">No .mp3 audio tracks found. Tap "Add Videos & Music" to load tracks.</div>';
    } else {
      audioFiles.forEach(media => {
        const item = document.createElement('div');
        item.className = 'local-audio-card';
        item.innerHTML = `
          <div class="audio-disc-icon">🎵</div>
          <div style="flex: 1; min-width: 0;">
            <h4 style="font-size: 14px; font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${media.name}</h4>
            <p style="font-size: 12px; color: #a3a3a3;">${media.quality} • MP3 Audio</p>
          </div>
          <button class="icon-btn-plain" style="color: #E50914;" onclick="event.stopPropagation(); removeLocalMediaById('${media.id}')" title="Remove">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
        `;
        item.onclick = () => playChannel(media);
        aFeed.appendChild(item);
      });
    }
  }
}

// Local File Picker Event Handler
window.handleLocalFileSelected = async function(event) {
  const files = Array.from(event.target.files || []);
  if (!files || files.length === 0) return;

  showToast('Adding ' + files.length + ' file(s)...');

  for (const file of files) {
    const fileUrl = URL.createObjectURL(file);
    const isVideo = file.type.startsWith('video') || file.name.match(/\.(mp4|mkv|mov|webm|avi)$/i);
    const fileSizeMb = (file.size / (1024 * 1024)).toFixed(1);
    
    let thumbDataUrl = '';
    let durationFormatted = isVideo ? 'VIDEO' : 'AUDIO';

    if (isVideo) {
      try {
        const meta = await extractVideoThumbnailAndDuration(fileUrl);
        thumbDataUrl = meta.thumb;
        durationFormatted = meta.duration;
      } catch (e) {
        thumbDataUrl = '';
      }
    }

    const localMediaObj = {
      id: 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      name: file.name,
      type: isVideo ? 'tv' : 'radio',
      country: 'Local',
      countryName: 'Device Storage',
      flag: isVideo ? '🎬' : '🎵',
      category: isVideo ? 'MP4 Video' : 'MP3 Audio',
      quality: (isVideo ? '1080p • ' : 'Audio • ') + fileSizeMb + ' MB',
      description: 'Local file from storage',
      url: fileUrl,
      thumbUrl: thumbDataUrl,
      duration: durationFormatted,
      isLocal: true
    };

    customLocalMedia.unshift(localMediaObj);
  }

  const metadataToSave = customLocalMedia.slice(0, 40).map(m => ({ ...m, url: '' }));
  localStorage.setItem('aakash_local_media', JSON.stringify(metadataToSave));

  renderLocalPage();
  showToast('✅ Added ' + files.length + ' file(s) to Library!');

  if (files.length > 0) {
    playChannel(customLocalMedia[0]);
  }
};

function extractVideoThumbnailAndDuration(videoUrl) {
  return new Promise((resolve) => {
    const tempVideo = document.createElement('video');
    tempVideo.src = videoUrl;
    tempVideo.crossOrigin = 'anonymous';
    tempVideo.muted = true;
    tempVideo.playsInline = true;
    tempVideo.currentTime = 1.0;

    tempVideo.onloadeddata = () => {
      const mins = Math.floor(tempVideo.duration / 60);
      const secs = Math.floor(tempVideo.duration % 60);
      const durationStr = isNaN(mins) ? 'VIDEO' : (mins + ':' + (secs < 10 ? '0' : '') + secs);

      const canvas = document.createElement('canvas');
      canvas.width = 160;
      canvas.height = 90;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(tempVideo, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
      resolve({ thumb: dataUrl, duration: durationStr });
    };

    tempVideo.onerror = () => {
      resolve({ thumb: '', duration: 'VIDEO' });
    };

    setTimeout(() => {
      resolve({ thumb: '', duration: 'VIDEO' });
    }, 2000);
  });
}

window.removeLocalMediaById = function(id) {
  customLocalMedia = customLocalMedia.filter(m => m.id !== id);
  localStorage.setItem('aakash_local_media', JSON.stringify(customLocalMedia.slice(0, 40).map(m => ({ ...m, url: '' }))));
  renderLocalPage();
  showToast('Removed from list');
};

// ==========================================================
// 5. SAVED / MY LIST PAGE RENDER
// ==========================================================
function renderFavoritesPage() {
  const feed = document.getElementById('favoritesFeed');
  if (!feed) return;
  feed.innerHTML = '';

  const favList = favorites.map(id => channelsData.find(c => c.id === id)).filter(Boolean);

  if (favList.length === 0) {
    feed.innerHTML = `
      <div style="text-align: center; padding: 48px 16px; color: #a3a3a3;">
        <div style="font-size: 38px; margin-bottom: 8px;">🔖</div>
        <h3 style="font-size: 16px; font-weight: 600; color: #fff; margin-bottom: 4px;">No Saved Channels Yet</h3>
        <p style="font-size: 13px;">Tap the bookmark icon on any Live TV or Radio station to add it here.</p>
      </div>
    `;
    return;
  }

  favList.forEach(ch => {
    feed.appendChild(createChannelListItem(ch));
  });
}

window.toggleFav = function(e, channelId) {
  if (e) e.stopPropagation();
  const idx = favorites.indexOf(channelId);
  if (idx > -1) {
    favorites.splice(idx, 1);
    showToast('Removed from Saved List');
  } else {
    favorites.push(channelId);
    showToast('Added to Saved List ⭐');
  }
  localStorage.setItem('aakash_favs', JSON.stringify(favorites));
  renderAllPages();
  updateFavIconUI();
};

window.toggleCurrentFav = function(e) {
  if (e) e.stopPropagation();
  if (currentPlayingChannel) {
    toggleFav(null, currentPlayingChannel.id);
  }
};

function updateFavIconUI() {
  if (!currentPlayingChannel) return;
  const isFav = favorites.includes(currentPlayingChannel.id);
  const svg = document.getElementById('playerFavSvg');
  if (svg) {
    svg.setAttribute('fill', isFav ? '#facc15' : '#a3a3a3');
  }
}

// ==========================================================
// 6. STREAM PLAYBACK ENGINE & RESTORED SLEEK MINI-PLAYER
// ==========================================================
function playChannel(ch) {
  loadChannelMedia(ch, true);
}

function loadChannelMedia(ch, autoPlay) {
  currentPlayingChannel = ch;
  const videoElement = document.getElementById('luminaVideo');

  if (!ch.isLocal) {
    recentChannels = [ch.id, ...recentChannels.filter(id => id !== ch.id)].slice(0, 10);
    localStorage.setItem('aakash_recents', JSON.stringify(recentChannels));
  }

  const playerMainTitle = document.getElementById('playerMainTitle');
  const playerSubTitle = document.getElementById('playerSubTitle');
  const miniTitle = document.getElementById('miniTitle');
  const miniSub = document.getElementById('miniSub');
  const miniThumb = document.getElementById('miniThumb');

  if (playerMainTitle) playerMainTitle.textContent = ch.name;
  if (playerSubTitle) playerSubTitle.textContent = (ch.countryName || 'Media') + ' • ' + (ch.category || '') + ' • ' + (ch.quality || '');
  if (miniTitle) miniTitle.textContent = ch.name;
  if (miniSub) miniSub.textContent = ch.isLocal ? 'NOW PLAYING • LOCAL FILE' : 'NOW PLAYING • LIVE STREAM';
  if (miniThumb) miniThumb.textContent = ch.type === 'radio' ? '📻' : (ch.isLocal ? (ch.type === 'tv' ? '🎬' : '🎵') : (ch.flag || '📺'));

  updateFavIconUI();

  if (hlsInstance) {
    hlsInstance.destroy();
    hlsInstance = null;
  }

  if (ch.url && ch.url.endsWith('.m3u8') && window.Hls && Hls.isSupported()) {
    hlsInstance = new Hls({
      enableWorker: true,
      lowLatencyMode: localStorage.getItem('aakash_low_latency') !== 'false',
      backBufferLength: 30
    });
    hlsInstance.loadSource(ch.url);
    hlsInstance.attachMedia(videoElement);
    hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
      if (autoPlay) {
        videoElement.play().catch(() => {});
        openFullPlayerModal();
      }
    });
  } else if (ch.url) {
    videoElement.src = ch.url;
    if (autoPlay) {
      videoElement.play().catch(() => {});
      openFullPlayerModal();
    }
  }

  if (!autoPlay) {
    const miniPlayer = document.getElementById('miniPlayer');
    if (miniPlayer) miniPlayer.classList.add('active');
  }
}

window.openFullPlayerModal = function() {
  const playerModal = document.getElementById('playerModal');
  const miniPlayer = document.getElementById('miniPlayer');
  if (playerModal) playerModal.classList.add('active');
  if (miniPlayer) miniPlayer.classList.remove('active');
  resetPlayerHideTimer();
};

window.minimizeToMiniPlayer = function(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  const playerModal = document.getElementById('playerModal');
  const miniPlayer = document.getElementById('miniPlayer');
  if (playerModal) playerModal.classList.remove('active');
  if (miniPlayer) miniPlayer.classList.add('active');
  showToast('Minimized');
};

window.closePlayerModal = function() {
  minimizeToMiniPlayer(null);
};

window.closeMiniPlayer = function(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  const videoElement = document.getElementById('luminaVideo');
  const playerModal = document.getElementById('playerModal');
  const miniPlayer = document.getElementById('miniPlayer');
  if (videoElement) videoElement.pause();
  if (playerModal) playerModal.classList.remove('active');
  if (miniPlayer) miniPlayer.classList.remove('active');
  isPlaying = false;
  updatePlayPauseIcons(false);
};

window.closeMiniPlayerCompletely = function(e) {
  closeMiniPlayer(e);
};

window.togglePlay = function() {
  const videoElement = document.getElementById('luminaVideo');
  if (!videoElement) return;
  if (videoElement.paused) {
    videoElement.play().catch(() => {});
    isPlaying = true;
  } else {
    videoElement.pause();
    isPlaying = false;
  }
  updatePlayPauseIcons(isPlaying);
};

function updatePlayPauseIcons(playing) {
  const playerBox = document.getElementById('playerPlaySvgBox');
  const miniBox = document.getElementById('miniPlaySvgBox');
  const pauseSvg = '<svg viewBox="0 0 24 24" width="30" height="30" fill="#FFFFFF"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
  const playSvg = '<svg viewBox="0 0 24 24" width="30" height="30" fill="#FFFFFF" style="margin-left: 3px;"><path d="M8 5v14l11-7z"/></svg>';
  const miniPause = '<svg viewBox="0 0 24 24" width="20" height="20" fill="#FFFFFF"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
  const miniPlay = '<svg viewBox="0 0 24 24" width="20" height="20" fill="#FFFFFF" style="margin-left: 2px;"><path d="M8 5v14l11-7z"/></svg>';
  
  if (playerBox) playerBox.innerHTML = playing ? pauseSvg : playSvg;
  if (miniBox) miniBox.innerHTML = playing ? miniPause : miniPlay;

  const waveBars = document.querySelectorAll('.mini-live-wave .wave-bar');
  waveBars.forEach(b => {
    b.style.animationPlayState = playing ? 'running' : 'paused';
    if (!playing) b.style.height = '4px';
  });
}

window.skipTime = function(seconds) {
  const videoElement = document.getElementById('luminaVideo');
  if (!videoElement) return;
  videoElement.currentTime = Math.max(0, videoElement.currentTime + seconds);
  showToast((seconds > 0 ? '+' : '') + seconds + 's');
  resetPlayerHideTimer();
};

window.handleSeekbarClick = function(e) {
  const videoElement = document.getElementById('luminaVideo');
  if (!videoElement || !videoElement.duration || isNaN(videoElement.duration)) return;
  const rect = e.currentTarget.getBoundingClientRect();
  const pos = (e.clientX - rect.left) / rect.width;
  videoElement.currentTime = pos * videoElement.duration;
  resetPlayerHideTimer();
};

window.toggleFullScreen = function() {
  const playerModal = document.getElementById('playerModal');
  if (!document.fullscreenElement) {
    if (playerModal && playerModal.requestFullscreen) {
      playerModal.requestFullscreen().catch(() => {});
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  }
};

// Pro Feature Controls
let playbackSpeeds = [1.0, 1.25, 1.5, 2.0, 0.5];
let currentSpeedIdx = 0;

window.cyclePlaybackSpeed = function() {
  const videoElement = document.getElementById('luminaVideo');
  if (!videoElement) return;
  currentSpeedIdx = (currentSpeedIdx + 1) % playbackSpeeds.length;
  const speed = playbackSpeeds[currentSpeedIdx];
  videoElement.playbackRate = speed;
  const speedText = document.getElementById('playerSpeedText');
  if (speedText) speedText.textContent = speed + 'x';
  showToast('Speed: ' + speed + 'x');
  resetPlayerHideTimer();
};

let aspectModes = ['contain', 'cover', 'fill'];
let aspectLabels = ['Fit (16:9)', 'Fill Screen', 'Stretch'];
let currentAspectIdx = 0;

window.cycleAspectRatio = function() {
  const videoElement = document.getElementById('luminaVideo');
  if (!videoElement) return;
  currentAspectIdx = (currentAspectIdx + 1) % aspectModes.length;
  videoElement.className = 'video-' + aspectModes[currentAspectIdx];
  const aspectText = document.getElementById('playerAspectText');
  if (aspectText) aspectText.textContent = aspectLabels[currentAspectIdx];
  showToast('Aspect: ' + aspectLabels[currentAspectIdx]);
  resetPlayerHideTimer();
};

window.toggleMute = function() {
  const videoElement = document.getElementById('luminaVideo');
  if (!videoElement) return;
  videoElement.muted = !videoElement.muted;
  const muteText = document.getElementById('playerMuteText');
  if (muteText) muteText.textContent = videoElement.muted ? '🔇 Muted' : '🔊 Audio';
  showToast(videoElement.muted ? 'Audio Muted' : 'Audio Unmuted');
  resetPlayerHideTimer();
};

let sleepDurations = [0, 15, 30, 45, 60];
let currentSleepIdx = 0;
let sleepTimeout = null;

window.cycleSleepTimer = function() {
  currentSleepIdx = (currentSleepIdx + 1) % sleepDurations.length;
  const mins = sleepDurations[currentSleepIdx];
  clearTimeout(sleepTimeout);
  
  const sleepText = document.getElementById('playerSleepText');
  if (mins === 0) {
    if (sleepText) sleepText.textContent = '⏱ Sleep: Off';
    showToast('Sleep Timer Cancelled');
  } else {
    if (sleepText) sleepText.textContent = '⏱ Sleep: ' + mins + 'm';
    showToast('Sleep Timer Set for ' + mins + ' min');
    sleepTimeout = setTimeout(() => {
      const videoElement = document.getElementById('luminaVideo');
      if (videoElement) videoElement.pause();
      closePlayerModal();
      showToast('Sleep Timer: Playback Stopped');
    }, mins * 60 * 1000);
  }
  resetPlayerHideTimer();
};

let isPlayerLocked = false;

window.togglePlayerLock = function() {
  isPlayerLocked = !isPlayerLocked;
  const uiOverlay = document.getElementById('playerUiOverlay');
  const lockOverlay = document.getElementById('playerLockOverlay');
  
  if (isPlayerLocked) {
    if (uiOverlay) uiOverlay.classList.add('hidden-controls');
    if (lockOverlay) lockOverlay.style.display = 'flex';
    showToast('Controls Locked 🔒');
  } else {
    if (lockOverlay) lockOverlay.style.display = 'none';
    if (uiOverlay) uiOverlay.classList.remove('hidden-controls');
    showToast('Controls Unlocked 🔓');
    resetPlayerHideTimer();
  }
};

// Closed Captions
window.toggleCC = function() {
  isCCEnabled = !isCCEnabled;
  localStorage.setItem('aakash_cc', isCCEnabled);
  updateCCUI();
  showToast(isCCEnabled ? 'Closed Captions ON [CC]' : 'Closed Captions OFF');
  resetPlayerHideTimer();
};

function updateCCUI() {
  const btnPlayerCC = document.getElementById('btnPlayerCC');
  const playerCcBox = document.getElementById('playerCcBox');

  if (btnPlayerCC) {
    btnPlayerCC.classList.toggle('active', isCCEnabled);
  }
  if (playerCcBox) {
    playerCcBox.style.display = isCCEnabled ? 'block' : 'none';
  }

  if (isCCEnabled) {
    startCCSubtitles();
  } else {
    clearInterval(ccInterval);
  }
}

function startCCSubtitles() {
  clearInterval(ccInterval);
  const sampleCaptions = [
    "[CC] Broadcast sync audio stream...",
    "[CC] National Headline coverage live from studios",
    "[CC] High-definition multi-bitrate feed active",
    "[CC] 24x7 continuous live broadcast transmission"
  ];
  let cIdx = 0;
  ccInterval = setInterval(() => {
    const playerCcText = document.getElementById('playerCcText');
    if (playerCcText) {
      playerCcText.textContent = sampleCaptions[cIdx % sampleCaptions.length];
      cIdx++;
    }
  }, 3500);
}

// Auto-hide controls overlay
function initPlayerOverlayEvents() {
  const playerModal = document.getElementById('playerModal');
  const playerUiOverlay = document.getElementById('playerUiOverlay');
  const videoElement = document.getElementById('luminaVideo');
  const playerSeekFill = document.getElementById('playerSeekFill');
  const playerTimeCurrent = document.getElementById('playerTimeCurrent');
  const playerTimeTotal = document.getElementById('playerTimeTotal');

  if (playerModal) {
    playerModal.addEventListener('click', (e) => {
      if (isPlayerLocked) return;
      if (e.target.closest('button') || e.target.closest('.player-seekbar-wrap') || e.target.closest('.player-pro-bar')) return;
      
      if (playerUiOverlay) {
        if (playerUiOverlay.classList.contains('hidden-controls')) {
          playerUiOverlay.classList.remove('hidden-controls');
          resetPlayerHideTimer();
        } else {
          playerUiOverlay.classList.add('hidden-controls');
        }
      }
    });
  }

  if (videoElement) {
    videoElement.addEventListener('timeupdate', () => {
      if (videoElement.duration && !isNaN(videoElement.duration)) {
        const pct = (videoElement.currentTime / videoElement.duration) * 100;
        if (playerSeekFill) playerSeekFill.style.width = pct + '%';
        if (playerTimeCurrent) {
          const m = Math.floor(videoElement.currentTime / 60);
          const s = Math.floor(videoElement.currentTime % 60);
          playerTimeCurrent.textContent = m + ':' + (s < 10 ? '0' : '') + s;
        }
        if (playerTimeTotal) {
          const tm = Math.floor(videoElement.duration / 60);
          const ts = Math.floor(videoElement.duration % 60);
          playerTimeTotal.textContent = tm + ':' + (ts < 10 ? '0' : '') + ts;
        }
      } else {
        if (playerSeekFill) playerSeekFill.style.width = '100%';
        if (playerTimeCurrent) playerTimeCurrent.textContent = '00:00';
        if (playerTimeTotal) playerTimeTotal.textContent = 'LIVE';
      }
    });

    videoElement.addEventListener('play', () => {
      isPlaying = true;
      updatePlayPauseIcons(true);
    });
    videoElement.addEventListener('pause', () => {
      isPlaying = false;
      updatePlayPauseIcons(false);
    });
  }
}

function resetPlayerHideTimer() {
  clearTimeout(playerHideTimeout);
  const playerUiOverlay = document.getElementById('playerUiOverlay');
  if (playerUiOverlay) playerUiOverlay.classList.remove('hidden-controls');
  playerHideTimeout = setTimeout(() => {
    if (playerUiOverlay && isPlaying && !isPlayerLocked) {
      playerUiOverlay.classList.add('hidden-controls');
    }
  }, 3500);
}

window.copyVlcLink = function(e, url) {
  if (e) e.stopPropagation();
  navigator.clipboard.writeText(url).then(() => {
    showToast('Copied VLC Stream Link!');
  }).catch(() => {
    showToast('Stream link: ' + url);
  });
};

window.copyVlcCurrent = function(e) {
  if (e) e.stopPropagation();
  if (currentPlayingChannel && currentPlayingChannel.url) {
    copyVlcLink(null, currentPlayingChannel.url);
  }
};

window.showToast = function(msg) {
  const toastElement = document.getElementById('toast');
  if (!toastElement) return;
  toastElement.textContent = msg;
  toastElement.classList.add('show');
  setTimeout(() => {
    toastElement.classList.remove('show');
  }, 2400);
};

// Settings System
function loadSettingsUI() {
  const qSelect = document.getElementById('settingQuality');
  const ccBox = document.getElementById('settingCC');
  const llBox = document.getElementById('settingLowLatency');

  if (qSelect) qSelect.value = localStorage.getItem('aakash_quality') || 'auto';
  if (ccBox) ccBox.checked = localStorage.getItem('aakash_cc') === 'true';
  if (llBox) llBox.checked = localStorage.getItem('aakash_low_latency') !== 'false';
}

window.saveAppSetting = function(key, val) {
  localStorage.setItem('aakash_' + key, val);
  if (key === 'cc') {
    isCCEnabled = val;
    updateCCUI();
  }
  showToast('Setting Saved');
};

window.clearAppData = function() {
  localStorage.removeItem('aakash_favs');
  localStorage.removeItem('aakash_recents');
  localStorage.removeItem('aakash_local_media');
  favorites = ['aajtak', 'air-vividh-bharati-12'];
  recentChannels = [];
  customLocalMedia = DEFAULT_LOCAL_MEDIA;
  renderAllPages();
  showToast('Cache & Recents Cleared!');
  closeSettingsModal();
};

// Canvas Particles
function initParticles() {
  const canvas = document.getElementById('particlesCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = Array.from({ length: 30 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    r: Math.random() * 1.5 + 0.5
  }));

  function animate() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(229, 9, 20, 0.4)';
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

// ==========================================================
// ON-SCREEN VOLUME & BRIGHTNESS SLIDERS
// ==========================================================
window.handleBrightnessSlider = function(val) {
  const videoElement = document.getElementById('luminaVideo');
  const textEl = document.getElementById('playerBrightnessText');
  if (videoElement) {
    videoElement.style.filter = 'brightness(' + (val / 100) + ')';
  }
  if (textEl) {
    textEl.textContent = val + '%';
  }
  resetPlayerHideTimer();
};

window.handleVolumeSlider = function(val) {
  const videoElement = document.getElementById('luminaVideo');
  const textEl = document.getElementById('playerVolumeText');
  const muteText = document.getElementById('playerMuteText');
  if (videoElement) {
    videoElement.volume = val / 100;
    if (videoElement.muted && val > 0) {
      videoElement.muted = false;
    }
  }
  if (textEl) {
    textEl.textContent = val + '%';
  }
  if (muteText) {
    muteText.textContent = val == 0 ? '🔇 Muted' : '🔊 Audio';
  }
  resetPlayerHideTimer();
};