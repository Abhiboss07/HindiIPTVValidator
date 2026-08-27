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
    "isFeatured": true,
    "backupUrls": [
      "https://feeds.intoday.in/aajtak/api/aajtakhd/master.m3u8",
      "https://aajtaklive-amd.akamaized.net/hls/live/2003835/aajtak/playlist.m3u8",
      "https://live-aajtak.akamaized.net/hls/live/2003835/aajtak/master.m3u8"
    ]
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
    "isFeatured": true,
    "backupUrls": [
      "https://abpnews.akamaized.net/hls/live/2040313/abpnews/playlist.m3u8",
      "https://abplive.akamaized.net/hls/live/2040313/abpnews/master.m3u8"
    ]
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
    "isFeatured": true,
    "backupUrls": [
      "https://ndtvindiaelemarchana.akamaized.net/hls/live/2003679/ndtvindia/master.m3u8",
      "https://ndtvindiaelemarchana.akamaized.net/hls/live/2003679/ndtvindia/live_1080p.m3u8"
    ]
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
    "isFeatured": false,
    "backupUrls": [
      "https://indiatvnews.akamaized.net/hls/live/2040315/indiatv/playlist.m3u8",
      "https://indiatvlive-lh.akamaihd.net/i/indiatvlive_1@174989/master.m3u8"
    ]
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
    "isFeatured": true,
    "backupUrls": [
      "https://ddnews.akamaized.net/hls/live/2040317/ddnews/master.m3u8",
      "https://ddnewslive.akamaized.net/hls/live/2040317/ddnews/playlist.m3u8"
    ]
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
    "isFeatured": true,
    "backupUrls": [
      "https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8",
      "https://nasa-i.akamaihd.net/hls/live/253565/NTV-Media/master.m3u8"
    ]
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
    "isFeatured": false,
    "backupUrls": [
      "https://live-hls-web-aje.getaj.net/AJE/03.m3u8",
      "https://live-hls-web-aje.getaj.net/AJE/index.m3u8"
    ]
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
  },
  {
    "id": "9x_jalwa__1080p_1",
    "name": "9X Jalwa (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Music",
    "quality": "HD Live",
    "description": "Live streaming broadcast of 9X Jalwa (1080p)",
    "url": "https://b.jsrdn.com/strm/channels/9xjalwa/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "9xm__1080p_2",
    "name": "9XM (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Music",
    "quality": "HD Live",
    "description": "Live streaming broadcast of 9XM (1080p)",
    "url": "https://9xjio.wiseplayout.com/9XM/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "22scope_news__1080p_3",
    "name": "22Scope News (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of 22Scope News (1080p)",
    "url": "https://thelegitpro.in/HDlive/22scope/index.fmp4.m3u8",
    "isFeatured": false
  },
  {
    "id": "flix_hd__1080p_4",
    "name": "&flix HD (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Movies",
    "quality": "HD Live",
    "description": "Live streaming broadcast of &flix HD (1080p)",
    "url": "http://103.72.101.252:8080/live/1322.m3u8",
    "isFeatured": false
  },
  {
    "id": "pictures__720p_5",
    "name": "&pictures (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Movies",
    "quality": "HD Live",
    "description": "Live streaming broadcast of &pictures (720p)",
    "url": "https://tvsen3.aynaott.com/jzT482XQ/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "pictures_hd__1080p_6",
    "name": "&pictures HD (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Movies",
    "quality": "HD Live",
    "description": "Live streaming broadcast of &pictures HD (1080p)",
    "url": "http://103.72.101.252:8080/live/185.m3u8",
    "isFeatured": false
  },
  {
    "id": "tv_international__1080p_7",
    "name": "&TV International (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Movies",
    "quality": "HD Live",
    "description": "Live streaming broadcast of &TV International (1080p)",
    "url": "https://amg01117-amg01117c1-amgplt0029.playout.now3.amagi.tv/playlist/amg01117-amg01117c1-amgplt0029/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "xplor_hd__1080p_8",
    "name": "&xplor HD (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Movies",
    "quality": "HD Live",
    "description": "Live streaming broadcast of &xplor HD (1080p)",
    "url": "http://149.71.34.166:8000/play/a001/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "aadinath_tv__576p_9",
    "name": "Aadinath TV (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Religious",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Aadinath TV (576p)",
    "url": "https://mumt01.tangotv.in/O5aw8Zn3AADINATHTV/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "aaj_tak__1080p_10",
    "name": "Aaj Tak (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Aaj Tak (1080p)",
    "url": "http://103.213.31.109:90/AajtakHD/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "aastha__720p_12",
    "name": "Aastha (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Religious",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Aastha (720p)",
    "url": "https://aasthaott.akamaized.net/110923/smil:aasthatv.smil/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "aastha__720p_13",
    "name": "Aastha (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Religious",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Aastha (720p)",
    "url": "http://103.213.31.109:90/AasthaSD/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "aastha_prime_1__720p_14",
    "name": "Aastha Prime 1 (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Religious",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Aastha Prime 1 (720p)",
    "url": "https://aasthaott.akamaized.net/110923/smil:aasthaprime1.smil/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "abn_tv_india__540p_15",
    "name": "ABN TV India (540p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Religious",
    "quality": "HD Live",
    "description": "Live streaming broadcast of ABN TV India (540p)",
    "url": "https://mediaserver.abnvideos.com/streams/abntvindia.m3u8",
    "isFeatured": false
  },
  {
    "id": "abp_ganga__1080p_16",
    "name": "ABP Ganga (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of ABP Ganga (1080p)",
    "url": "https://d2l4ar6y3mrs4k.cloudfront.net/live-streaming/ganga-livetv/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "abp_news__1080p_17",
    "name": "ABP News (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of ABP News (1080p)",
    "url": "https://d1rc86nwwc9fag.cloudfront.net/vglive-sk-472500/abpnews/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "adhyatm_tv__720p_18",
    "name": "Adhyatm TV (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Religious",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Adhyatm TV (720p)",
    "url": "https://mumbai-edge.smartplaytv.in/AdhyatmTV/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "amarujala__1080p_19",
    "name": "AmarUjala (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of AmarUjala (1080p)",
    "url": "https://amarujala.ottlive.co.in/amarujala/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "anand_tv__1080p_20",
    "name": "Anand TV (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Religious",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Anand TV (1080p)",
    "url": "https://live.legitpro.co.in/anandtv/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "anb_news__720p_21",
    "name": "ANB News (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of ANB News (720p)",
    "url": "https://server.livelegitpro.in:9899/anbnews/anbnews/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "andy_haryana__576p_22",
    "name": "Andy Haryana (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Culture;Music",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Andy Haryana (576p)",
    "url": "https://mumt03.tangotv.in/Dsly5z3HANDYHARYANA/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "anjan_tv__720p_23",
    "name": "Anjan TV (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Anjan TV (720p)",
    "url": "https://anjan.vstream.online/anjanorg/ngrp:anjan_hdall/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "apn__576p_24",
    "name": "APN (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of APN (576p)",
    "url": "https://mumt01.tangotv.in/O5aw8Zn3APN/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "apna_punjab_tv__720p_25",
    "name": "Apna Punjab TV (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Apna Punjab TV (720p)",
    "url": "https://plus.gigabitcdn.net/live-stream/apna-punjab-H3sE/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "aradana_tv__576p_26",
    "name": "Aradana TV (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Religious",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Aradana TV (576p)",
    "url": "https://cdn-1.pishow.tv/live/961/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "argus_news__576p_27",
    "name": "Argus News (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Argus News (576p)",
    "url": "https://mumt05.tangotv.in/87NeALx2ARGUSNEWS/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "aryan_tv_national__576p_28",
    "name": "Aryan TV National (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Undefined",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Aryan TV National (576p)",
    "url": "https://mumt04.tangotv.in/m18aqlK4ARYANTVNATIONAL/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "awaaz_india_tv__720p___not_24_7_29",
    "name": "Awaaz India TV (720p) [Not 24/7]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Awaaz India TV (720p) [Not 24/7]",
    "url": "https://awaazindia.livebox.co.in/AwaazIndaTVhls/Live.m3u8",
    "isFeatured": false
  },
  {
    "id": "awakening_tv__576p_30",
    "name": "Awakening TV (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Religious",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Awakening TV (576p)",
    "url": "https://mumt03.tangotv.in/Dsly5z3HAWAKENINGTV/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "b4u_hitz__576p_31",
    "name": "B4U Hitz (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Music",
    "quality": "HD Live",
    "description": "Live streaming broadcast of B4U Hitz (576p)",
    "url": "http://115.42.65.142:9981/stream/channelid/1099703605",
    "isFeatured": false
  },
  {
    "id": "b4u_kadak__1080p___not_24_7_32",
    "name": "B4U Kadak (1080p) [Not 24/7]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Movies",
    "quality": "HD Live",
    "description": "Live streaming broadcast of B4U Kadak (1080p) [Not 24/7]",
    "url": "https://cdnb4u.wiseplayout.com/B4U_Kadak/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "b4u_movies_apac__720p_33",
    "name": "B4U Movies APAC (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Movies",
    "quality": "HD Live",
    "description": "Live streaming broadcast of B4U Movies APAC (720p)",
    "url": "https://s3.itcnbd.live/channel/129d01070adb9ee3.m3u8",
    "isFeatured": false
  },
  {
    "id": "b4u_music__576p_34",
    "name": "B4U Music (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Music",
    "quality": "HD Live",
    "description": "Live streaming broadcast of B4U Music (576p)",
    "url": "https://cdn-2.pishow.tv/live/415/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "b4u_music_apac__720p_35",
    "name": "B4U Music APAC (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Music",
    "quality": "HD Live",
    "description": "Live streaming broadcast of B4U Music APAC (720p)",
    "url": "https://s3.itcnbd.live/channel/6f6b7b6d25fbd0e6.m3u8",
    "isFeatured": false
  },
  {
    "id": "balle_balle__720p_36",
    "name": "Balle Balle (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Music",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Balle Balle (720p)",
    "url": "https://mcncdndigital.com/balleballetv/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "bansal_news__720p_37",
    "name": "Bansal News (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Bansal News (720p)",
    "url": "https://8yzmq2gbdvax-hls-live.wmncdn.net/bansalnewstv1/live1.stream/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "bhakti_sagar__576p_38",
    "name": "Bhakti Sagar (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Religious",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Bhakti Sagar (576p)",
    "url": "https://mumt05.tangotv.in/87NeALx2BHAKTISAGAR/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "bharat_samachar__576p_39",
    "name": "Bharat Samachar (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Bharat Samachar (576p)",
    "url": "https://mumt03.tangotv.in/Dsly5z3HBHARATSAMACHAR/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "bollywood_hd_russia__576p_40",
    "name": "Bollywood HD Russia (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Movies",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Bollywood HD Russia (576p)",
    "url": "https://xykt-fix.github.io/cinerama_edge01/hls/BOLLYWOOD_RU/Movie009.m3u8",
    "isFeatured": false
  },
  {
    "id": "channel_divya__1080p_41",
    "name": "Channel Divya (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Religious",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Channel Divya (1080p)",
    "url": "https://vg-pitaaratvlive.akamaized.net/v1/vglive-sk-906482/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "channel_y__720p___not_24_7_42",
    "name": "Channel Y (720p) [Not 24/7]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Channel Y (720p) [Not 24/7]",
    "url": "http://cdn19.live247stream.com/channely/tv/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "cnbc_awaaz__1080p_43",
    "name": "CNBC Awaaz (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Business",
    "quality": "HD Live",
    "description": "Live streaming broadcast of CNBC Awaaz (1080p)",
    "url": "https://n18syndication.akamaized.net/bpk-tv/CNBC_Awaaz_NW18_MOB/output01/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "cnews_bharat__720p_44",
    "name": "Cnews Bharat (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Cnews Bharat (720p)",
    "url": "https://legitpro.co.in/cnews/cnews/index.fmp4.m3u8",
    "isFeatured": false
  },
  {
    "id": "colors_cineplex__576p_45",
    "name": "Colors Cineplex (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Movies",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Colors Cineplex (576p)",
    "url": "http://103.122.249.134:8000/play/a058",
    "isFeatured": false
  },
  {
    "id": "colors_cineplex_bollywood__576p_46",
    "name": "Colors Cineplex Bollywood (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Movies",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Colors Cineplex Bollywood (576p)",
    "url": "http://103.72.101.252:8080/live/1763.m3u8",
    "isFeatured": false
  },
  {
    "id": "colors_cineplex_hd__1080p_47",
    "name": "Colors Cineplex HD (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Movies",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Colors Cineplex HD (1080p)",
    "url": "http://149.71.34.166:8000/play/a00b/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "colors_cineplex_superhits__576p_48",
    "name": "Colors Cineplex Superhits (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Movies",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Colors Cineplex Superhits (576p)",
    "url": "http://103.72.101.252:8080/live/1450.m3u8",
    "isFeatured": false
  },
  {
    "id": "colors_mena_hd__720p_49",
    "name": "Colors MENA HD (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Colors MENA HD (720p)",
    "url": "https://da86m1sqpm3o0.cloudfront.net/28072023/smil:colorsme.smil/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "colors_rishtey_americas__396p_50",
    "name": "Colors Rishtey Americas (396p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "General",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Colors Rishtey Americas (396p)",
    "url": "https://manatv.akamaized.net/090823/smil:ristheyamerica.smil/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "dangal_2__720p_51",
    "name": "Dangal 2 (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Dangal 2 (720p)",
    "url": "http://103.213.31.109:90/Dangal2/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "dangal_tv__720p_52",
    "name": "Dangal TV (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "General",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Dangal TV (720p)",
    "url": "http://103.213.31.109:90/Dangal/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "darshan_24__576p_53",
    "name": "Darshan 24 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Religious",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Darshan 24 (576p)",
    "url": "https://mumt05.tangotv.in/87NeALx2DARSHAN24/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "dd_arun_prabha__360p_54",
    "name": "DD Arun Prabha (360p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "General",
    "quality": "HD Live",
    "description": "Live streaming broadcast of DD Arun Prabha (360p)",
    "url": "https://d2lk5u59tns74c.cloudfront.net/out/v1/308556d9fd1246adb479ef012a39bbfe/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "dd_bharati__720p_55",
    "name": "DD Bharati (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Culture",
    "quality": "HD Live",
    "description": "Live streaming broadcast of DD Bharati (720p)",
    "url": "http://103.213.31.109:90/DDBharati/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "dd_bihar__720p_56",
    "name": "DD Bihar (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "General",
    "quality": "HD Live",
    "description": "Live streaming broadcast of DD Bihar (720p)",
    "url": "https://cdn-4.pishow.tv/live/35/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "dd_chhattisgarh__720p_57",
    "name": "DD Chhattisgarh (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "General",
    "quality": "HD Live",
    "description": "Live streaming broadcast of DD Chhattisgarh (720p)",
    "url": "https://cdn-1.pishow.tv/live/15/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "dd_haryana__504p_58",
    "name": "DD Haryana (504p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "General",
    "quality": "HD Live",
    "description": "Live streaming broadcast of DD Haryana (504p)",
    "url": "https://d2lk5u59tns74c.cloudfront.net/out/v1/950fc69666474351bde0a32b9600c804/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "dd_himachal_pradesh__504p_59",
    "name": "DD Himachal Pradesh (504p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "General",
    "quality": "HD Live",
    "description": "Live streaming broadcast of DD Himachal Pradesh (504p)",
    "url": "https://d3qs3d2rkhfqrt.cloudfront.net/out/v1/afd2e335b0ba40eb9bdf1096118c6ede/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "dd_jharkhand__504p_60",
    "name": "DD Jharkhand (504p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "General",
    "quality": "HD Live",
    "description": "Live streaming broadcast of DD Jharkhand (504p)",
    "url": "https://d3qs3d2rkhfqrt.cloudfront.net/out/v1/e8c3741f8c154d3185831f4e31777fb2/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "dd_kashir__504p_61",
    "name": "DD Kashir (504p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "General",
    "quality": "HD Live",
    "description": "Live streaming broadcast of DD Kashir (504p)",
    "url": "https://d3qs3d2rkhfqrt.cloudfront.net/out/v1/8a59a828e80c49d0958925950cec0204/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "dd_kisan__720p_62",
    "name": "DD Kisan (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Education;Outdoor",
    "quality": "HD Live",
    "description": "Live streaming broadcast of DD Kisan (720p)",
    "url": "https://cdn-6.pishow.tv/live/9/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "dd_madhya_pradesh__720p_63",
    "name": "DD Madhya Pradesh (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "General",
    "quality": "HD Live",
    "description": "Live streaming broadcast of DD Madhya Pradesh (720p)",
    "url": "https://cdn-1.pishow.tv/live/31/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "dd_manipur__504p_64",
    "name": "DD Manipur (504p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "General",
    "quality": "HD Live",
    "description": "Live streaming broadcast of DD Manipur (504p)",
    "url": "https://d2lk5u59tns74c.cloudfront.net/out/v1/8b75afc6576f450e8f554b6c877681d2/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "dd_national_hd__1080p_65",
    "name": "DD National HD (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Live",
    "description": "Live streaming broadcast of DD National HD (1080p)",
    "url": "https://d3qs3d2rkhfqrt.cloudfront.net/out/v1/40492a64c1db4a1385ba1a397d357d3a/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "dd_national_sd__576p_66",
    "name": "DD National SD (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Live",
    "description": "Live streaming broadcast of DD National SD (576p)",
    "url": "https://cdn-1.pishow.tv/live/11/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "dd_news__576p_67",
    "name": "DD News (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of DD News (576p)",
    "url": "https://streams.tangotv.in/DDNEWS/ORIGIN/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "dd_news_hd__1080p_68",
    "name": "DD News HD (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of DD News HD (1080p)",
    "url": "https://d3qs3d2rkhfqrt.cloudfront.net/out/v1/0811cd8c37ca4c409d5385a6cd2fa18b/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "dd_rajasthan__720p_69",
    "name": "DD Rajasthan (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "General",
    "quality": "HD Live",
    "description": "Live streaming broadcast of DD Rajasthan (720p)",
    "url": "https://cdn-1.pishow.tv/live/34/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "dd_sports_sd__1080p_70",
    "name": "DD Sports SD (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Sports",
    "quality": "HD Live",
    "description": "Live streaming broadcast of DD Sports SD (1080p)",
    "url": "https://d3qs3d2rkhfqrt.cloudfront.net/out/v1/b17adfe543354fdd8d189b110617cddd/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "dd_urdu__720p_71",
    "name": "DD Urdu (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "General",
    "quality": "HD Live",
    "description": "Live streaming broadcast of DD Urdu (720p)",
    "url": "https://cdn-4.pishow.tv/live/8/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "dd_uttar_pradesh__720p_72",
    "name": "DD Uttar Pradesh (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "General",
    "quality": "HD Live",
    "description": "Live streaming broadcast of DD Uttar Pradesh (720p)",
    "url": "https://cdn-1.pishow.tv/live/36/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "dd_uttarakhand__720p_73",
    "name": "DD Uttarakhand (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "General",
    "quality": "HD Live",
    "description": "Live streaming broadcast of DD Uttarakhand (720p)",
    "url": "https://cdn-1.pishow.tv/live/17/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "dharm_sandesh_74",
    "name": "Dharm Sandesh",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Religious",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Dharm Sandesh",
    "url": "https://cdn-2.pishow.tv/live/1455/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "dheeran_tv__576p_75",
    "name": "Dheeran TV (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Religious",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Dheeran TV (576p)",
    "url": "https://live.we2live.in/dheerantv/dheerantv/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "digi_shala__576p_76",
    "name": "Digi Shala (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Education",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Digi Shala (576p)",
    "url": "http://103.72.101.252:8080/live/1227.m3u8",
    "isFeatured": false
  },
  {
    "id": "disney_junior__576p_77",
    "name": "Disney Junior (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Kids",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Disney Junior (576p)",
    "url": "http://149.71.34.166:8000/play/a00l/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "diya_tv__1080p_78",
    "name": "Diya TV (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "General",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Diya TV (1080p)",
    "url": "https://stream.diyatvinc.com/diya.m3u8",
    "isFeatured": false
  },
  {
    "id": "e_24__576p_79",
    "name": "E 24 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Live",
    "description": "Live streaming broadcast of E 24 (576p)",
    "url": "https://mumt04.tangotv.in/m18aqlK4E24/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "e_vidya_1__576p_80",
    "name": "E-Vidya 1 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Education",
    "quality": "HD Live",
    "description": "Live streaming broadcast of E-Vidya 1 (576p)",
    "url": "http://103.72.101.252:8080/live/400.m3u8",
    "isFeatured": false
  },
  {
    "id": "e_vidya_2__576p_81",
    "name": "E-Vidya 2 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Education",
    "quality": "HD Live",
    "description": "Live streaming broadcast of E-Vidya 2 (576p)",
    "url": "http://103.72.101.252:8080/live/402.m3u8",
    "isFeatured": false
  },
  {
    "id": "e_vidya_3__576p_82",
    "name": "E-Vidya 3 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Education",
    "quality": "HD Live",
    "description": "Live streaming broadcast of E-Vidya 3 (576p)",
    "url": "http://103.72.101.252:8080/live/405.m3u8",
    "isFeatured": false
  },
  {
    "id": "e_vidya_4__576p_83",
    "name": "E-Vidya 4 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Education",
    "quality": "HD Live",
    "description": "Live streaming broadcast of E-Vidya 4 (576p)",
    "url": "http://103.72.101.252:8080/live/406.m3u8",
    "isFeatured": false
  },
  {
    "id": "e_vidya_5__576p_84",
    "name": "E-Vidya 5 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Education",
    "quality": "HD Live",
    "description": "Live streaming broadcast of E-Vidya 5 (576p)",
    "url": "http://103.72.101.252:8080/live/407.m3u8",
    "isFeatured": false
  },
  {
    "id": "e_vidya_6__576p_85",
    "name": "E-Vidya 6 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Education",
    "quality": "HD Live",
    "description": "Live streaming broadcast of E-Vidya 6 (576p)",
    "url": "http://103.72.101.252:8080/live/408.m3u8",
    "isFeatured": false
  },
  {
    "id": "e_vidya_7__576p_86",
    "name": "E-Vidya 7 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Education",
    "quality": "HD Live",
    "description": "Live streaming broadcast of E-Vidya 7 (576p)",
    "url": "http://103.72.101.252:8080/live/404.m3u8",
    "isFeatured": false
  },
  {
    "id": "e_vidya_8__576p_87",
    "name": "E-Vidya 8 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Education",
    "quality": "HD Live",
    "description": "Live streaming broadcast of E-Vidya 8 (576p)",
    "url": "http://103.72.101.252:8080/live/409.m3u8",
    "isFeatured": false
  },
  {
    "id": "e_vidya_9__576p_88",
    "name": "E-Vidya 9 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Education",
    "quality": "HD Live",
    "description": "Live streaming broadcast of E-Vidya 9 (576p)",
    "url": "http://103.72.101.252:8080/live/410.m3u8",
    "isFeatured": false
  },
  {
    "id": "e_vidya_10__576p_89",
    "name": "E-Vidya 10 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Education",
    "quality": "HD Live",
    "description": "Live streaming broadcast of E-Vidya 10 (576p)",
    "url": "http://103.72.101.252:8080/live/411.m3u8",
    "isFeatured": false
  },
  {
    "id": "e_vidya_11__576p_90",
    "name": "E-Vidya 11 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Education",
    "quality": "HD Live",
    "description": "Live streaming broadcast of E-Vidya 11 (576p)",
    "url": "http://103.72.101.252:8080/live/1410.m3u8",
    "isFeatured": false
  },
  {
    "id": "e_vidya_12__576p_91",
    "name": "E-Vidya 12 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Education",
    "quality": "HD Live",
    "description": "Live streaming broadcast of E-Vidya 12 (576p)",
    "url": "http://103.72.101.252:8080/live/1532.m3u8",
    "isFeatured": false
  },
  {
    "id": "epic_bharat_digital__1080p_92",
    "name": "Epic Bharat Digital (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Epic Bharat Digital (1080p)",
    "url": "https://cc-p1izg43bk7sj5.akamaized.net/v1/master/3722c60a815c199d9c0ef36c5b73da68a62b09d1/cc-p1izg43bk7sj5/DIYC/PMSL/IN10/Nazara_IN_B/Nazara_IN_B.m3u8",
    "isFeatured": false
  },
  {
    "id": "epic_crimes__1080p_93",
    "name": "Epic Crimes (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Documentary",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Epic Crimes (1080p)",
    "url": "https://cc-wsuyg2uxeak04.akamaized.net/v1/master/3722c60a815c199d9c0ef36c5b73da68a62b09d1/cc-wsuyg2uxeak04/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "epic_kids_digital__1080p_94",
    "name": "Epic Kids Digital (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Kids",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Epic Kids Digital (1080p)",
    "url": "https://cc-t8lqe1o99pszu.akamaized.net/v1/master/3722c60a815c199d9c0ef36c5b73da68a62b09d1/cc-t8lqe1o99pszu/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "epic_music__576p_95",
    "name": "Epic Music (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Music",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Epic Music (576p)",
    "url": "https://mumt04.tangotv.in/m18aqlK4EPICMUSIC/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "epic_music_digital__1080p_96",
    "name": "Epic Music Digital (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Music",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Epic Music Digital (1080p)",
    "url": "https://cc-3cyxq80qusspd.akamaized.net/v1/master/3722c60a815c199d9c0ef36c5b73da68a62b09d1/cc-3cyxq80qusspd/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "epic_tv__576p_97",
    "name": "Epic TV (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Epic TV (576p)",
    "url": "http://149.71.34.166:8000/play/a00m/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "epic_tv_digital__1080p_98",
    "name": "Epic TV Digital (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Epic TV Digital (1080p)",
    "url": "https://cc-czbq30x55knit.akamaized.net/v1/master/3722c60a815c199d9c0ef36c5b73da68a62b09d1/cc-czbq30x55knit/DIYC/PMSL/IN10/Epic_TV_IN_B/Epic_TV_IN_B.m3u8",
    "isFeatured": false
  },
  {
    "id": "fateh_tv__1080p___not_24_7_99",
    "name": "Fateh TV (1080p) [Not 24/7]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Religious",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Fateh TV (1080p) [Not 24/7]",
    "url": "https://ott.livelegitpro.in/fatehtv/fatehtv/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "first_india_news__576p_100",
    "name": "First India News (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of First India News (576p)",
    "url": "https://mumt03.tangotv.in/Dsly5z3H1STINDIANEWS/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "food_food__576p_101",
    "name": "Food Food (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Cooking;Lifestyle",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Food Food (576p)",
    "url": "https://mumt03.tangotv.in/Dsly5z3HFOODFOOD/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "gangaur_tv__1080p_102",
    "name": "Gangaur TV (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Gangaur TV (1080p)",
    "url": "https://pbgangaur.wiseplayout.com/Gangaur/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "god_stands_tv_hindi_103",
    "name": "God Stands TV Hindi",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Religious",
    "quality": "HD Live",
    "description": "Live streaming broadcast of God Stands TV Hindi",
    "url": "https://online.godstands.tv:5443/WebRTCApp/streams/HindiStreaming.m3u8",
    "isFeatured": false
  },
  {
    "id": "goldmines_2__576p_104",
    "name": "Goldmines 2 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Movies",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Goldmines 2 (576p)",
    "url": "https://cdn-2.pishow.tv/live/1460/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "goldmines_movies__720p_105",
    "name": "Goldmines Movies (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Movies",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Goldmines Movies (720p)",
    "url": "http://103.213.31.109:90/GoldminesMovies/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "good_news_today__720p_106",
    "name": "Good News Today (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Good News Today (720p)",
    "url": "https://aajtaklive.vgcdn.net/v1/master/611d79b11b77e2f571934fd80ca1413453772ac7/3196cced-ce29-4219-9809-f07ccdaa02b9/vglive-sk-848805/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "gursikh_sabha_tv__720p___not_24_7_107",
    "name": "GurSikh Sabha TV (720p) [Not 24/7]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Religious",
    "quality": "HD Live",
    "description": "Live streaming broadcast of GurSikh Sabha TV (720p) [Not 24/7]",
    "url": "http://cdn12.henico.net:8080/live/gsctv/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "gyandarshan__720p_108",
    "name": "Gyandarshan (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Education",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Gyandarshan (720p)",
    "url": "https://cdn-6.pishow.tv/live/14/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "hare_krsna_tv__1080p_109",
    "name": "Hare Krsna TV (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Religious",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Hare Krsna TV (1080p)",
    "url": "https://hktv.harekrsnatv.com/HKTV/HKWebApp/manifest.mpd",
    "isFeatured": false
  },
  {
    "id": "hindi_khabar__576p_110",
    "name": "Hindi Khabar (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Hindi Khabar (576p)",
    "url": "https://mumt04.tangotv.in/m18aqlK4HINDIKHABAR/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "history_tv18__576p_111",
    "name": "History TV18 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Documentary",
    "quality": "HD Live",
    "description": "Live streaming broadcast of History TV18 (576p)",
    "url": "http://103.72.101.252:8080/live/1471.m3u8",
    "isFeatured": false
  },
  {
    "id": "history_tv18_hd__1080p_112",
    "name": "History TV18 HD (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Documentary",
    "quality": "HD Live",
    "description": "Live streaming broadcast of History TV18 HD (1080p)",
    "url": "http://103.154.3.101:5001/live/577.m3u8",
    "isFeatured": false
  },
  {
    "id": "hnn_24x7__576p_113",
    "name": "HNN 24x7 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of HNN 24x7 (576p)",
    "url": "https://ott.livelegitpro.in:9899/hnnnews/hnnnews/tracks-v1/index.fmp4.m3u8",
    "isFeatured": false
  },
  {
    "id": "hosanna_tv_hindi_114",
    "name": "Hosanna TV Hindi",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Religious",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Hosanna TV Hindi",
    "url": "https://ktismaservers.in:3466/live/hosannattvhindhilive.m3u8",
    "isFeatured": false
  },
  {
    "id": "hyder_tv__720p_115",
    "name": "Hyder TV (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Culture",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Hyder TV (720p)",
    "url": "https://cdn.live247stream.com/hyder/tv/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "ibc_24__576p_116",
    "name": "IBC 24 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of IBC 24 (576p)",
    "url": "https://mumt05.tangotv.in/87NeALx2IBC24/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "ind_24__576p_117",
    "name": "Ind 24 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Ind 24 (576p)",
    "url": "https://mumt06.tangotv.in/qYyB8fXVIND24/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "india_daily_live__1080p_118",
    "name": "India Daily Live (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of India Daily Live (1080p)",
    "url": "https://indiadaily.ottlive.co.in/indiadailylive/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "india_news_madhya_pradesh_chhattisgarh__576p_119",
    "name": "India News Madhya Pradesh/Chhattisgarh (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of India News Madhya Pradesh/Chhattisgarh (576p)",
    "url": "https://livetv.newsx.com/itv/itvnetwork7/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "india_tv__720p_120",
    "name": "India TV (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of India TV (720p)",
    "url": "https://pl-indiatvnews.akamaized.net/out/v1/db79179b608641ceaa5a4d0dd0dca8da/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "india_tv_aap_ki_adalat__1080p___geo_blocked_121",
    "name": "India TV Aap Ki Adalat (1080p) [Geo-blocked]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Documentary;News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of India TV Aap Ki Adalat (1080p) [Geo-blocked]",
    "url": "https://amg01550-amg01550c6-samsung-in-4679.playouts.now.amagi.tv/playlist/amg01550-indiatvfast-indiatvakasamsung-samsungin/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "india_tv_speed_news__1080p_122",
    "name": "India TV Speed News (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of India TV Speed News (1080p)",
    "url": "https://cc-lyf4c0hwzg5dd.akamaized.net/v1/master/3722c60a815c199d9c0ef36c5b73da68a62b09d1/cc-lyf4c0hwzg5dd/v1/vglive-sk-479089/main.m3u8",
    "isFeatured": false
  },
  {
    "id": "india_voice__576p_123",
    "name": "India Voice (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of India Voice (576p)",
    "url": "https://d1msejlow1t3l4.cloudfront.net/fta/indiavoice/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "inh_24x7__396p_124",
    "name": "INH 24x7 (396p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of INH 24x7 (396p)",
    "url": "https://d1msejlow1t3l4.cloudfront.net/fta/inh24x7/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "ishwar_bhakti_tv__720p_125",
    "name": "Ishwar Bhakti TV (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Religious",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Ishwar Bhakti TV (720p)",
    "url": "https://6n3yow8pl9ok-hls-live.5centscdn.com/ishwartvlive/tv.stream/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "jan_tv__576p_126",
    "name": "Jan TV (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "General",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Jan TV (576p)",
    "url": "https://d1msejlow1t3l4.cloudfront.net/fta/jantv/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "janta_tv__1080p_127",
    "name": "Janta TV (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Janta TV (1080p)",
    "url": "https://live.jswk.online/IK_RTPM/live/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "jantantra_tv__576p_128",
    "name": "Jantantra TV (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Jantantra TV (576p)",
    "url": "https://mumt05.tangotv.in/87NeALx2JANTANTRA/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "jinvani_channel__720p_129",
    "name": "Jinvani Channel (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Religious",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Jinvani Channel (720p)",
    "url": "https://cdn-2.pishow.tv/live/989/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "jk_24x7_news__720p___not_24_7_130",
    "name": "JK 24x7 News (720p) [Not 24/7]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of JK 24x7 News (720p) [Not 24/7]",
    "url": "https://live.gulistannews.in/hls/jk.m3u8",
    "isFeatured": false
  },
  {
    "id": "jus_hindi__1080p_131",
    "name": "Jus Hindi (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Culture",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Jus Hindi (1080p)",
    "url": "http://103.154.3.101:5001/live/960.m3u8",
    "isFeatured": false
  },
  {
    "id": "jus_one__1080p_132",
    "name": "Jus One (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Culture",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Jus One (1080p)",
    "url": "http://103.154.3.101:5001/live/961.m3u8",
    "isFeatured": false
  },
  {
    "id": "kanshi_tv__720p___not_24_7_133",
    "name": "Kanshi TV (720p) [Not 24/7]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Religious",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Kanshi TV (720p) [Not 24/7]",
    "url": "https://live.kanshitv.co.uk/mobile/kanshitvkey.m3u8",
    "isFeatured": false
  },
  {
    "id": "kashish_news__720p_134",
    "name": "Kashish News (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Kashish News (720p)",
    "url": "https://server.thelegitpro.in/kashishnews/kashishnews/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "kaumudy_tv__720p_135",
    "name": "Kaumudy TV (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "General",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Kaumudy TV (720p)",
    "url": "https://oqgdrkxby4rm-hls-live.5centscdn.com/kaumudytv/live.stream/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "khabar_fast__576p_136",
    "name": "Khabar Fast (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Khabar Fast (576p)",
    "url": "https://mumt04.tangotv.in/m18aqlK4KHABARFAST/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "khabrain_abhi_tak__576p_137",
    "name": "Khabrain Abhi Tak (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Khabrain Abhi Tak (576p)",
    "url": "https://mumt05.tangotv.in/87NeALx2KHABRAINABHITAK/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "lighting_lives_blessing_nations_tv_south_asia__llbn___480p_138",
    "name": "Lighting Lives Blessing Nations TV South Asia (LLBN) (480p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Religious",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Lighting Lives Blessing Nations TV South Asia (LLBN) (480p)",
    "url": "https://brightstar-southasia-pull-secure.akamaized.net/brightstarsouthasia/stream.m3u8",
    "isFeatured": false
  },
  {
    "id": "maha_movie__576p_139",
    "name": "Maha Movie (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Movies",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Maha Movie (576p)",
    "url": "https://cdn-6.pishow.tv/live/10007/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "manoranjan_grand__720p_140",
    "name": "Manoranjan Grand (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Movies",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Manoranjan Grand (720p)",
    "url": "https://cdn-1.pishow.tv/live/1011/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "manoranjan_tv__720p_141",
    "name": "Manoranjan TV (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Manoranjan TV (720p)",
    "url": "http://103.213.31.109:90/ManoranjanTv/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "mbc_bollywood__1080p___geo_blocked_142",
    "name": "MBC Bollywood (1080p) [Geo-blocked]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Movies",
    "quality": "HD Live",
    "description": "Live streaming broadcast of MBC Bollywood (1080p) [Geo-blocked]",
    "url": "https://shd-gcp-live.edgenextcdn.net/live/bitmovin-mbc-bollywood/546eb40d7dcf9a209255dd2496903764/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "mercy_tv__1080p_143",
    "name": "Mercy TV (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Religious",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Mercy TV (1080p)",
    "url": "https://5dd3981940faa.streamlock.net/mercytv/mercytv/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "mh_one_shraddha__576p_144",
    "name": "MH One Shraddha (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Religious",
    "quality": "HD Live",
    "description": "Live streaming broadcast of MH One Shraddha (576p)",
    "url": "https://mumt01.tangotv.in/O5aw8Zn3MHONESHRADDHA/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "mta2_europe__720p_145",
    "name": "MTA2 Europe (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Religious",
    "quality": "HD Live",
    "description": "Live streaming broadcast of MTA2 Europe (720p)",
    "url": "https://chlivemta1.akamaized.net/hls/live/2008145/mta2/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "mta7_asia__1080p_146",
    "name": "MTA7 Asia (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Religious",
    "quality": "HD Live",
    "description": "Live streaming broadcast of MTA7 Asia (1080p)",
    "url": "https://livemtaasia.akamaized.net/hls/live/2039224/mtaasia2/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "music_india__720p___not_24_7_147",
    "name": "Music India (720p) [Not 24/7]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Music",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Music India (720p) [Not 24/7]",
    "url": "https://cdn-2.pishow.tv/live/226/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "nagaland_tv__576p_148",
    "name": "Nagaland TV (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Nagaland TV (576p)",
    "url": "https://mumt06.tangotv.in/qYyB8fXVNAGALANDTV/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "namdhari__404p___not_24_7_149",
    "name": "Namdhari (404p) [Not 24/7]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Religious",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Namdhari (404p) [Not 24/7]",
    "url": "https://namdhari.tv/live/sbs1.m3u8",
    "isFeatured": false
  },
  {
    "id": "national_geographic_hd__576p_150",
    "name": "National Geographic HD (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Documentary",
    "quality": "HD Live",
    "description": "Live streaming broadcast of National Geographic HD (576p)",
    "url": "http://149.71.34.166:8002/play/a013/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "national_geographic_wild_hd__1080p_151",
    "name": "National Geographic Wild HD (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Documentary",
    "quality": "HD Live",
    "description": "Live streaming broadcast of National Geographic Wild HD (1080p)",
    "url": "http://149.71.34.166:8002/play/a012/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "ndtv_good_times__1080p_152",
    "name": "NDTV Good Times (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Lifestyle",
    "quality": "HD Live",
    "description": "Live streaming broadcast of NDTV Good Times (1080p)",
    "url": "https://amg01448-samsungin-ndtvgoodtimes-samsungin-ad-gp.amagi.tv/playlist/amg01448-samsungin-ndtvgoodtimes-samsungin/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "ndtv_india__720p_153",
    "name": "NDTV India (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of NDTV India (720p)",
    "url": "http://103.213.31.109:90/StarUtsavMovies/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "ndtv_madhya_pradesh_chhattisgarh__1080p_154",
    "name": "NDTV Madhya Pradesh Chhattisgarh (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of NDTV Madhya Pradesh Chhattisgarh (1080p)",
    "url": "https://ndtvregional.akamaized.net/hls/live/2102726-b/ndtvmpcg/master_1.m3u8",
    "isFeatured": false
  },
  {
    "id": "ndtv_rajasthan__1080p_155",
    "name": "NDTV Rajasthan (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of NDTV Rajasthan (1080p)",
    "url": "https://ndtvregional.akamaized.net/hls/live/2102726-b/ndtvraj/master_1.m3u8",
    "isFeatured": false
  },
  {
    "id": "network_10__576p_156",
    "name": "Network 10 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "General",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Network 10 (576p)",
    "url": "https://mumt01.tangotv.in/O5aw8Zn3NETWORK10/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "news_1_india__576p_157",
    "name": "News 1 India (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of News 1 India (576p)",
    "url": "https://mumt07.tangotv.in/zHjX9OFlNEWS1INDIA/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "news_11__396p_158",
    "name": "News 11 (396p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "General",
    "quality": "HD Live",
    "description": "Live streaming broadcast of News 11 (396p)",
    "url": "https://d1msejlow1t3l4.cloudfront.net/fta/news11bharat/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "news18_bihar_jharkhand__1080p_159",
    "name": "News18 Bihar Jharkhand (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of News18 Bihar Jharkhand (1080p)",
    "url": "https://n18syndication.akamaized.net/bpk-tv/News18_Bihar_Jharkhand_NW18_MOB/output01/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "news18_delhi_ncr_jk__1080p_160",
    "name": "News18 Delhi NCR JK (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of News18 Delhi NCR JK (1080p)",
    "url": "https://n18syndication.akamaized.net/bpk-tv/News18_JKLH_NW18_MOB/output01/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "news18_india__1080p_161",
    "name": "News18 India (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of News18 India (1080p)",
    "url": "https://n18syndication.akamaized.net/bpk-tv/News18_India_NW18_MOB/output01/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "news18_madhya_pradesh_chhattisgarh__1080p_162",
    "name": "News18 Madhya Pradesh/Chhattisgarh (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of News18 Madhya Pradesh/Chhattisgarh (1080p)",
    "url": "https://n18syndication.akamaized.net/bpk-tv/News18_MP_Chhattisgarh_NW18_MOB/output01/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "news18_punjab_haryana_himachal__1080p_163",
    "name": "News18 Punjab/Haryana/Himachal (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of News18 Punjab/Haryana/Himachal (1080p)",
    "url": "https://n18syndication.akamaized.net/bpk-tv/News18_Punjab_Haryana_HP_NW18_MOB/output01/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "news18_rajasthan__1080p_164",
    "name": "News18 Rajasthan (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of News18 Rajasthan (1080p)",
    "url": "https://n18syndication.akamaized.net/bpk-tv/News18_Rajasthan_NW18_MOB/output01/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "news18_uttar_pradesh_uttarakhand__1080p_165",
    "name": "News18 Uttar Pradesh Uttarakhand (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of News18 Uttar Pradesh Uttarakhand (1080p)",
    "url": "https://n18syndication.akamaized.net/bpk-tv/News18_UP_Uttarakhand_NW18_MOB/output01/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "news_24__720p_166",
    "name": "News 24 (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of News 24 (720p)",
    "url": "https://vidcdn.vidgyor.com/news24-origin/liveabr/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "news_24_mp___chhattisgarh__576p_167",
    "name": "News 24 MP & Chhattisgarh (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of News 24 MP & Chhattisgarh (576p)",
    "url": "https://mumt04.tangotv.in/m18aqlK4NEWS24MPCG/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "news_daily_24__576p_168",
    "name": "News Daily 24 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of News Daily 24 (576p)",
    "url": "https://cdn-6.pishow.tv/live/10009/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "news_india_24x7_169",
    "name": "News India 24x7",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of News India 24x7",
    "url": "https://cdn-3.pishow.tv/live/273/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "news_nation__1080p_170",
    "name": "News Nation (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of News Nation (1080p)",
    "url": "https://d3qs3d2rkhfqrt.cloudfront.net/out/v1/6cd2f649739a45ca9de1daf81cc7d0f2/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "paras_gold__576p_171",
    "name": "Paras Gold (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Religious",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Paras Gold (576p)",
    "url": "https://mumt04.tangotv.in/m18aqlK4PARASGOLD/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "peace_of_mind_tv__576p_172",
    "name": "Peace of Mind TV (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Religious",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Peace of Mind TV (576p)",
    "url": "https://yuppnimrestreammum.akamaized.net/181224/smil:peaceofmind.smil/playlist.m3u8?hdnts=st=1735898689~exp=1835898688~acl=*~hmac=f5fe24724fe05481e3841f9eb5ab8efdee0a3dd83645ae9dcf45703f525bab7b",
    "isFeatured": false
  },
  {
    "id": "prime_news__576p_173",
    "name": "Prime News (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Prime News (576p)",
    "url": "https://mumt02.tangotv.in/PRIMENEWS/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "punjabi_zindabad__360p___not_24_7_174",
    "name": "Punjabi Zindabad (360p) [Not 24/7]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Undefined",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Punjabi Zindabad (360p) [Not 24/7]",
    "url": "http://stream.pztv.online/pztv/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "raftaar_media__576p_175",
    "name": "Raftaar Media (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Undefined",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Raftaar Media (576p)",
    "url": "https://mumt04.tangotv.in/m18aqlK4RAFTAARMEDIA/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "raj_pariwar__576p_176",
    "name": "Raj Pariwar (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Raj Pariwar (576p)",
    "url": "http://103.72.101.252:8080/live/533.m3u8",
    "isFeatured": false
  },
  {
    "id": "republic_bharat__1080p_177",
    "name": "Republic Bharat (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Republic Bharat (1080p)",
    "url": "https://raw.githubusercontent.com/amazeyourself/adaptive-streams/refs/heads/main/streams/in/YuppTV/RepublicBharat.m3u8",
    "isFeatured": false
  },
  {
    "id": "rongeen_tv__720p_178",
    "name": "Rongeen TV (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Undefined",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Rongeen TV (720p)",
    "url": "https://server.thelegitpro.in/rongeentv/rongeentv/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "saam_tv_179",
    "name": "Saam TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Undefined",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Saam TV",
    "url": "https://cdn-3.pishow.tv/live/437/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "sadhna__720p_180",
    "name": "Sadhna (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Religious",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Sadhna (720p)",
    "url": "https://6n3yow8pl9ok-hls-live.5centscdn.com/sadhanalivetv/live.stream/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "sadhna_news_madhya_pradesh_chhattisgarh__576p_181",
    "name": "Sadhna News Madhya Pradesh/Chhattisgarh (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Sadhna News Madhya Pradesh/Chhattisgarh (576p)",
    "url": "https://mumt04.tangotv.in/m18aqlK4SADHNEWSPMRAJ/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "sadhna_plus_news__720p_182",
    "name": "Sadhna Plus News (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Sadhna Plus News (720p)",
    "url": "https://6n3yow8pl9ok-hls-live.5centscdn.com/sadhananewstv/live.stream/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "sadhna_tv__576p_183",
    "name": "Sadhna TV (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Religious",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Sadhna TV (576p)",
    "url": "https://mumt05.tangotv.in/87NeALx2SADHNATV/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "samachar_plus_24x7__576p_184",
    "name": "Samachar Plus 24x7 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Samachar Plus 24x7 (576p)",
    "url": "https://mumt05.tangotv.in/87NeALx2VERTENTSAMACHARPLUS/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "sansad_tv_1_hd__1080p_185",
    "name": "Sansad TV 1 HD (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Legislative",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Sansad TV 1 HD (1080p)",
    "url": "https://d2lk5u59tns74c.cloudfront.net/out/v1/fff8f20221d5456e8922e689d71dedc3/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "sansad_tv_2__1080p_186",
    "name": "Sansad TV 2 (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Legislative",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Sansad TV 2 (1080p)",
    "url": "https://d2lk5u59tns74c.cloudfront.net/out/v1/e4182054dce340da9e0ff38b6b3658a4/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "sansad_tv_2_187",
    "name": "Sansad TV 2",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Legislative",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Sansad TV 2",
    "url": "https://cdn-2.pishow.tv/live/39/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "sanskar_tv__1080p_188",
    "name": "Sanskar TV (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Culture;Religious",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Sanskar TV (1080p)",
    "url": "https://d26idhjf0y1p2g.cloudfront.net/out/v1/cd66dd25b9774cb29943bab54bbf3e2f/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "sanskar_uk__1080p_189",
    "name": "Sanskar UK (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Religious",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Sanskar UK (1080p)",
    "url": "https://d34z4embz0hjf6.cloudfront.net/out/v1/7ac2789ff9a544a49337d1ffc54ce61c/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "sanskar_usa__1080p_190",
    "name": "Sanskar USA (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Religious",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Sanskar USA (1080p)",
    "url": "https://d2netiedy8cz3x.cloudfront.net/out/v1/9bf6fa4ac8d6432cb98da13b121ba3c2/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "sanskar_web_tv__1080p_191",
    "name": "Sanskar Web TV (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Religious",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Sanskar Web TV (1080p)",
    "url": "https://deatfcv3xdvi3.cloudfront.net/out/v1/7a43dd2f64e34ec28da1b4bd6923251a/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "santvani_channel__576p_192",
    "name": "Santvani Channel (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Undefined",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Santvani Channel (576p)",
    "url": "https://cdn-2.pishow.tv/live/475/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "sarv_dharam_sangam__576p_193",
    "name": "Sarv Dharam Sangam (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Undefined",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Sarv Dharam Sangam (576p)",
    "url": "http://103.72.101.252:8080/live/972.m3u8",
    "isFeatured": false
  },
  {
    "id": "satsang_tv__1080p_194",
    "name": "Satsang TV (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Religious",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Satsang TV (1080p)",
    "url": "https://d2vfwvjxwtwq1t.cloudfront.net/out/v1/6b24239d5517495b986e7705490c6e65/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "satsang_web_tv__1080p_195",
    "name": "Satsang Web TV (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Religious",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Satsang Web TV (1080p)",
    "url": "https://d1ji7e9jbzm5g8.cloudfront.net/out/v1/769f22f64d80442889306b9c4abea63c/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "sharnam_tv__576p_196",
    "name": "Sharnam TV (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Undefined",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Sharnam TV (576p)",
    "url": "https://mumt06.tangotv.in/qYyB8fXVSHARNAMTV/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "shemaroo_filmi_gaane__1080p_197",
    "name": "Shemaroo Filmi Gaane (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Movies;Music",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Shemaroo Filmi Gaane (1080p)",
    "url": "http://103.213.31.109:90/ShemarooFilmiGaane/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "shemaroo_josh__720p_198",
    "name": "Shemaroo Josh (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Movies",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Shemaroo Josh (720p)",
    "url": "http://103.213.31.109:90/ChumbakTv/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "shemaroo_tv__720p_199",
    "name": "Shemaroo TV (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Shemaroo TV (720p)",
    "url": "https://airtelapp.shemaroo.com/shemarootv/smil:shemarootvadp.smil/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "shemaroo_umang__720p_200",
    "name": "Shemaroo Umang (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Shemaroo Umang (720p)",
    "url": "https://airtelapp.shemaroo.com/shemarooumang/smil:shemarooumangadp.smil/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "shubh_cinema_tv__720p_201",
    "name": "Shubh Cinema TV (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Movies",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Shubh Cinema TV (720p)",
    "url": "https://d393sxaxig6bax.cloudfront.net/out/v1/589cf2cf44bf42bb941e817a2240d62e/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "shubh_tv__1080p_202",
    "name": "Shubh TV (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Undefined",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Shubh TV (1080p)",
    "url": "https://d2g1vdc6ozl2o8.cloudfront.net/out/v1/0a0dc7d7911b4fddbb4dfc963fdd4b9e/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "shubhsandesh_tv__720p___not_24_7_203",
    "name": "Shubhsandesh TV (720p) [Not 24/7]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Religious",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Shubhsandesh TV (720p) [Not 24/7]",
    "url": "https://6284rn2xr7xv-hls-live.wmncdn.net/shubhsandeshtv1/live123.stream/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "soham_tv__576p_204",
    "name": "Soham TV (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Religious",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Soham TV (576p)",
    "url": "https://mumt03.tangotv.in/Dsly5z3HSOHAMTV/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "songdew_tv__576p_205",
    "name": "Songdew TV (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Music",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Songdew TV (576p)",
    "url": "http://103.72.101.252:8080/live/1411.m3u8",
    "isFeatured": false
  },
  {
    "id": "sony_entertainment_television_hd__1080p_206",
    "name": "Sony Entertainment Television HD (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Sony Entertainment Television HD (1080p)",
    "url": "http://38.96.178.205/SONYHD/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "sony_kal_hindi__1080p_207",
    "name": "Sony KAL Hindi (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Undefined",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Sony KAL Hindi (1080p)",
    "url": "https://wurlsonypicturestv.global.transmit.live/hls/68deeb1c0238cda82df543dd/v1/spt_sonykal_1/lg_us/latest/main/hls/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "sony_max_1__720p_208",
    "name": "Sony Max 1 (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Movies",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Sony Max 1 (720p)",
    "url": "http://103.159.180.34:5001/live/3418.m3u8",
    "isFeatured": false
  },
  {
    "id": "sony_max_2__576p_209",
    "name": "Sony Max 2 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Movies",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Sony Max 2 (576p)",
    "url": "http://149.71.34.166:8000/play/a00z/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "sony_pix_hd__1080p___geo_blocked_210",
    "name": "Sony Pix HD (1080p) [Geo-blocked]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Movies",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Sony Pix HD (1080p) [Geo-blocked]",
    "url": "https://sl.vodep39240327.workers.dev/channel/SONY+PIX+HD.m3u8",
    "isFeatured": false
  },
  {
    "id": "sony_wah__1080p___geo_blocked_211",
    "name": "Sony Wah (1080p) [Geo-blocked]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Movies",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Sony Wah (1080p) [Geo-blocked]",
    "url": "https://sl.vodep39240327.workers.dev/channel/SONY+WAH.m3u8",
    "isFeatured": false
  },
  {
    "id": "sony_yay_212",
    "name": "Sony Yay!",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Animation;Kids",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Sony Yay!",
    "url": "https://s3.itcnbd.live/channel/b22941f1341d7243.m3u8",
    "isFeatured": false
  },
  {
    "id": "south_station__1080p_213",
    "name": "South Station (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Movies",
    "quality": "HD Live",
    "description": "Live streaming broadcast of South Station (1080p)",
    "url": "https://cc-yw7ztecy8do3q.akamaized.net/v1/master/3722c60a815c199d9c0ef36c5b73da68a62b09d1/cc-yw7ztecy8do3q/SS_IN.m3u8",
    "isFeatured": false
  },
  {
    "id": "star_bharat__576p_214",
    "name": "Star Bharat (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Star Bharat (576p)",
    "url": "http://103.253.18.58:8000/play/a00u",
    "isFeatured": false
  },
  {
    "id": "star_gold_2__576p_215",
    "name": "Star Gold 2 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Movies",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Star Gold 2 (576p)",
    "url": "http://103.253.18.58:8000/play/a00r",
    "isFeatured": false
  },
  {
    "id": "star_gold_hd__1080p___not_24_7_216",
    "name": "Star Gold HD (1080p) [Not 24/7]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Movies",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Star Gold HD (1080p) [Not 24/7]",
    "url": "http://103.253.18.58:8000/play/a00q",
    "isFeatured": false
  },
  {
    "id": "star_gold_romance__576p_217",
    "name": "Star Gold Romance (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Movies",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Star Gold Romance (576p)",
    "url": "http://103.253.18.58:8000/play/a017",
    "isFeatured": false
  },
  {
    "id": "star_gold_select_hd__1080p_218",
    "name": "Star Gold Select HD (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Movies",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Star Gold Select HD (1080p)",
    "url": "http://103.253.18.58:8000/play/a02u",
    "isFeatured": false
  },
  {
    "id": "star_movies_hd__1080p_219",
    "name": "Star Movies HD (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Movies",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Star Movies HD (1080p)",
    "url": "http://149.71.34.166:8000/play/a01f/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "star_movies_select_hd__1080p_220",
    "name": "Star Movies Select HD (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Movies",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Star Movies Select HD (1080p)",
    "url": "http://149.71.34.166:8000/play/a01g/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "star_sports_1_hindi__576p_221",
    "name": "Star Sports 1 Hindi (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Sports",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Star Sports 1 Hindi (576p)",
    "url": "http://103.253.18.58:8000/play/a03o",
    "isFeatured": false
  },
  {
    "id": "star_sports_1_hindi_hd_222",
    "name": "Star Sports 1 Hindi HD",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Sports",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Star Sports 1 Hindi HD",
    "url": "http://103.253.18.58:8000/play/a00t",
    "isFeatured": false
  },
  {
    "id": "star_sports_2_hd__720p_223",
    "name": "Star Sports 2 HD (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Sports",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Star Sports 2 HD (720p)",
    "url": "http://tvsen5.aynascope.net/cXPB2LKkErN9/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "star_sports_2_hindi__720p_224",
    "name": "Star Sports 2 Hindi (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Sports",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Star Sports 2 Hindi (720p)",
    "url": "https://tvsen5.aynaott.com/cXPB2LKkErN9/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "star_sports_2_hindi_hd__1080p_225",
    "name": "Star Sports 2 Hindi HD (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Sports",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Star Sports 2 Hindi HD (1080p)",
    "url": "http://103.157.248.140:8000/play/a01m/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "star_sports_select_1_hd__720p_226",
    "name": "Star Sports Select 1 HD (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Sports",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Star Sports Select 1 HD (720p)",
    "url": "http://tvsen7.aynascope.net/sspts1/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "star_utsav_movies__576p_227",
    "name": "Star Utsav Movies (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Movies",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Star Utsav Movies (576p)",
    "url": "http://149.71.34.166:8000/play/a059/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "starplus_hd__1080i_228",
    "name": "StarPlus HD (1080i)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Live",
    "description": "Live streaming broadcast of StarPlus HD (1080i)",
    "url": "http://202.70.146.135:8000/play/a009/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "steelbird_music__720p___not_24_7_229",
    "name": "Steelbird Music (720p) [Not 24/7]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Music",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Steelbird Music (720p) [Not 24/7]",
    "url": "https://cdn2.in/SteelbirdMusicTVhls/live.m3u8",
    "isFeatured": false
  },
  {
    "id": "subharti_tv__576p_230",
    "name": "Subharti TV (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Undefined",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Subharti TV (576p)",
    "url": "https://mumt04.tangotv.in/m18aqlK4SUBHARTITV/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "sudarshan_news__1080p_231",
    "name": "Sudarshan News (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Sudarshan News (1080p)",
    "url": "https://ott.livelegitpro.in/sudarshannews/sudarshannews/tracks-v1/index.fmp4.m3u8",
    "isFeatured": false
  },
  {
    "id": "svbc_4__1080p_232",
    "name": "SVBC 4 (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Religious",
    "quality": "HD Live",
    "description": "Live streaming broadcast of SVBC 4 (1080p)",
    "url": "https://player.mslivestream.net/mslive/13a2927187b9700ae7ea82d7841d5b68.sdp/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "swadesh_news__720p_233",
    "name": "Swadesh News (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Swadesh News (720p)",
    "url": "https://cdn-2.pishow.tv/live/465/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "swaraj_express_smbc__720p___not_24_7_234",
    "name": "Swaraj Express SMBC (720p) [Not 24/7]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Swaraj Express SMBC (720p) [Not 24/7]",
    "url": "https://cdn-2.pishow.tv/live/477/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "swayam_prabha_1__576p_235",
    "name": "Swayam Prabha 1 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Education",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Swayam Prabha 1 (576p)",
    "url": "http://103.72.101.252:8080/live/980.m3u8",
    "isFeatured": false
  },
  {
    "id": "swayam_prabha_3__576p_236",
    "name": "Swayam Prabha 3 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Education",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Swayam Prabha 3 (576p)",
    "url": "http://103.72.101.252:8080/live/982.m3u8",
    "isFeatured": false
  },
  {
    "id": "swayam_prabha_4__576p_237",
    "name": "Swayam Prabha 4 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Education",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Swayam Prabha 4 (576p)",
    "url": "http://103.72.101.252:8080/live/984.m3u8",
    "isFeatured": false
  },
  {
    "id": "swayam_prabha_5__576p_238",
    "name": "Swayam Prabha 5 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Education",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Swayam Prabha 5 (576p)",
    "url": "http://103.72.101.252:8080/live/986.m3u8",
    "isFeatured": false
  },
  {
    "id": "swayam_prabha_6__576p_239",
    "name": "Swayam Prabha 6 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Education",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Swayam Prabha 6 (576p)",
    "url": "http://103.72.101.252:8080/live/987.m3u8",
    "isFeatured": false
  },
  {
    "id": "swayam_prabha_7__576p_240",
    "name": "Swayam Prabha 7 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Education",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Swayam Prabha 7 (576p)",
    "url": "http://103.72.101.252:8080/live/985.m3u8",
    "isFeatured": false
  },
  {
    "id": "swayam_prabha_8__576p_241",
    "name": "Swayam Prabha 8 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Education",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Swayam Prabha 8 (576p)",
    "url": "http://103.72.101.252:8080/live/983.m3u8",
    "isFeatured": false
  },
  {
    "id": "swayam_prabha_9__576p_242",
    "name": "Swayam Prabha 9 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Education",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Swayam Prabha 9 (576p)",
    "url": "http://103.72.101.252:8080/live/988.m3u8",
    "isFeatured": false
  },
  {
    "id": "swayam_prabha_10__576p_243",
    "name": "Swayam Prabha 10 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Education",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Swayam Prabha 10 (576p)",
    "url": "http://103.72.101.252:8080/live/989.m3u8",
    "isFeatured": false
  },
  {
    "id": "swayam_prabha_11__576p_244",
    "name": "Swayam Prabha 11 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Education",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Swayam Prabha 11 (576p)",
    "url": "http://103.72.101.252:8080/live/990.m3u8",
    "isFeatured": false
  },
  {
    "id": "swayam_prabha_12__576p_245",
    "name": "Swayam Prabha 12 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Education",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Swayam Prabha 12 (576p)",
    "url": "http://103.72.101.252:8080/live/991.m3u8",
    "isFeatured": false
  },
  {
    "id": "swayam_prabha_13__576p_246",
    "name": "Swayam Prabha 13 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Education",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Swayam Prabha 13 (576p)",
    "url": "http://103.72.101.252:8080/live/992.m3u8",
    "isFeatured": false
  },
  {
    "id": "swayam_prabha_14__576p_247",
    "name": "Swayam Prabha 14 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Education",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Swayam Prabha 14 (576p)",
    "url": "http://103.72.101.252:8080/live/993.m3u8",
    "isFeatured": false
  },
  {
    "id": "swayam_prabha_15__576p_248",
    "name": "Swayam Prabha 15 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Education",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Swayam Prabha 15 (576p)",
    "url": "http://103.72.101.252:8080/live/995.m3u8",
    "isFeatured": false
  },
  {
    "id": "swayam_prabha_16__576p_249",
    "name": "Swayam Prabha 16 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Education",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Swayam Prabha 16 (576p)",
    "url": "http://103.72.101.252:8080/live/994.m3u8",
    "isFeatured": false
  },
  {
    "id": "swayam_prabha_17__576p_250",
    "name": "Swayam Prabha 17 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Education",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Swayam Prabha 17 (576p)",
    "url": "http://103.72.101.252:8080/live/996.m3u8",
    "isFeatured": false
  },
  {
    "id": "swayam_prabha_18__576p_251",
    "name": "Swayam Prabha 18 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Education",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Swayam Prabha 18 (576p)",
    "url": "http://103.72.101.252:8080/live/999.m3u8",
    "isFeatured": false
  },
  {
    "id": "swayam_prabha_19__576p_252",
    "name": "Swayam Prabha 19 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Education",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Swayam Prabha 19 (576p)",
    "url": "http://103.72.101.252:8080/live/401.m3u8",
    "isFeatured": false
  },
  {
    "id": "swayam_prabha_20__576p_253",
    "name": "Swayam Prabha 20 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Education",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Swayam Prabha 20 (576p)",
    "url": "http://103.72.101.252:8080/live/403.m3u8",
    "isFeatured": false
  },
  {
    "id": "swayam_prabha_21__576p_254",
    "name": "Swayam Prabha 21 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Education",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Swayam Prabha 21 (576p)",
    "url": "http://103.72.101.252:8080/live/997.m3u8",
    "isFeatured": false
  },
  {
    "id": "swayam_prabha_22__576p_255",
    "name": "Swayam Prabha 22 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Education",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Swayam Prabha 22 (576p)",
    "url": "http://103.72.101.252:8080/live/998.m3u8",
    "isFeatured": false
  },
  {
    "id": "taaza_tv__720p_256",
    "name": "Taaza TV (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Undefined",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Taaza TV (720p)",
    "url": "https://live.we2live.in/taazatv/live/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "tag_tv__1080p___not_24_7_257",
    "name": "TAG TV (1080p) [Not 24/7]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Undefined",
    "quality": "HD Live",
    "description": "Live streaming broadcast of TAG TV (1080p) [Not 24/7]",
    "url": "http://cdn11.live247stream.com/tag/tv/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "tbn_tv__720p___not_24_7_258",
    "name": "TBN TV (720p) [Not 24/7]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Culture",
    "quality": "HD Live",
    "description": "Live streaming broadcast of TBN TV (720p) [Not 24/7]",
    "url": "https://live.suricloud.com/hls/tbntv/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "tehzeeb_tv__720p_259",
    "name": "Tehzeeb TV (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Undefined",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Tehzeeb TV (720p)",
    "url": "https://cdn-4.pishow.tv/live/239/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "the_movie_club__1080p_260",
    "name": "The Movie Club (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Movies",
    "quality": "HD Live",
    "description": "Live streaming broadcast of The Movie Club (1080p)",
    "url": "https://sis-global.prod.samsungtv.plus/v1/tvpprd/sc-mp2ar4ca425xo.m3u8",
    "isFeatured": false
  },
  {
    "id": "the_movie_club__2__1080p_261",
    "name": "The Movie Club +2 (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Movies",
    "quality": "HD Live",
    "description": "Live streaming broadcast of The Movie Club +2 (1080p)",
    "url": "https://d3gnyty2vddhsg.cloudfront.net/v1/master/3722c60a815c199d9c0ef36c5b73da68a62b09d1/pb-ytipwjqub3kf8/TMC2_IN.m3u8?ads.ads_cdn=cf&ads.cdn=cf",
    "isFeatured": false
  },
  {
    "id": "times_now_navbharat__1080p_262",
    "name": "Times Now Navbharat (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Times Now Navbharat (1080p)",
    "url": "https://raw.githubusercontent.com/amazeyourself/adaptive-streams/refs/heads/main/streams/in/YuppTV/TimesNowNavbharat.m3u8",
    "isFeatured": false
  },
  {
    "id": "tnp_news__1080p_263",
    "name": "TNP News (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of TNP News (1080p)",
    "url": "https://server.thelegitpro.in/tnpnews/tnpnews/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "total_bhakti__1080p_264",
    "name": "Total Bhakti (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Religious",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Total Bhakti (1080p)",
    "url": "https://d34z4embz0hjf6.cloudfront.net/out/v1/d55b3323a9f142638f897378f0b526fe/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "total_tv_haryana__576p_265",
    "name": "Total TV Haryana (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Undefined",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Total TV Haryana (576p)",
    "url": "https://cdn-2.pishow.tv/live/1522/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "travelxp_4k_hdr__2160p___geo_blocked_266",
    "name": "Travelxp 4K HDR (2160p) [Geo-blocked]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Travel",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Travelxp 4K HDR (2160p) [Geo-blocked]",
    "url": "https://deltatesttatasky.akamaized.net/out/i/968284.m3u8",
    "isFeatured": false
  },
  {
    "id": "travelxp_hd__1080p___geo_blocked_267",
    "name": "Travelxp HD (1080p) [Geo-blocked]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Travel",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Travelxp HD (1080p) [Geo-blocked]",
    "url": "https://amg00416-amg00416c9-samsung-in-4882.playouts.now.amagi.tv/playlist/amg00416-travelxp-travelxphd-samsungin/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "tv2__1080p_268",
    "name": "TV2 (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "General",
    "quality": "HD Live",
    "description": "Live streaming broadcast of TV2 (1080p)",
    "url": "https://live.mana2.my/Tv2/index.m3u8?auth_key=1745177833-e4f0090e3d3b4ed1b2b4f5df87a24d34-0-d43f8be1101f9bb00363d62de6514e4d&token=1745177833-e4f0090e3d3b4ed1b2b4f5df87a24d34-0-d43f8be1101f9bb00363d62de6514e4d",
    "isFeatured": false
  },
  {
    "id": "tv9_bharatvarsh__720p_269",
    "name": "TV9 Bharatvarsh (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of TV9 Bharatvarsh (720p)",
    "url": "https://dyjmyiv3bp2ez.cloudfront.net/pub-iotv9hinjzgtpe/liveabr/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "utsav_bharat__720p_270",
    "name": "Utsav Bharat (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Undefined",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Utsav Bharat (720p)",
    "url": "https://d1taaads3ztvmu.cloudfront.net/120723/smil:lifeokuk.smil/playlist.m3u8?hdnts=st=1735898689~exp=1835898688~acl=*~hmac=f5fe24724fe05481e3841f9eb5ab8efdee0a3dd83645ae9dcf45703f525bab7b",
    "isFeatured": false
  },
  {
    "id": "utsav_plus__720p_271",
    "name": "Utsav Plus (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Undefined",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Utsav Plus (720p)",
    "url": "https://raw.githubusercontent.com/amazeyourself/adaptive-streams/refs/heads/main/streams/gb/YuppTV/UtsavPlus.m3u8",
    "isFeatured": false
  },
  {
    "id": "vande_gujarat_1__576p_272",
    "name": "Vande Gujarat 1 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Education",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Vande Gujarat 1 (576p)",
    "url": "http://103.72.101.252:8080/live/1069.m3u8",
    "isFeatured": false
  },
  {
    "id": "vande_gujarat_2__576p_273",
    "name": "Vande Gujarat 2 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Education",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Vande Gujarat 2 (576p)",
    "url": "http://103.72.101.252:8080/live/1070.m3u8",
    "isFeatured": false
  },
  {
    "id": "vande_gujarat_3__576p_274",
    "name": "Vande Gujarat 3 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Education",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Vande Gujarat 3 (576p)",
    "url": "http://103.72.101.252:8080/live/1082.m3u8",
    "isFeatured": false
  },
  {
    "id": "vande_gujarat_4__576p_275",
    "name": "Vande Gujarat 4 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Education",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Vande Gujarat 4 (576p)",
    "url": "http://103.72.101.252:8080/live/1071.m3u8",
    "isFeatured": false
  },
  {
    "id": "vande_gujarat_5__576p_276",
    "name": "Vande Gujarat 5 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Education",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Vande Gujarat 5 (576p)",
    "url": "http://103.72.101.252:8080/live/1083.m3u8",
    "isFeatured": false
  },
  {
    "id": "vande_gujarat_6__576p_277",
    "name": "Vande Gujarat 6 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Education",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Vande Gujarat 6 (576p)",
    "url": "http://103.72.101.252:8080/live/1084.m3u8",
    "isFeatured": false
  },
  {
    "id": "vande_gujarat_7__576p_278",
    "name": "Vande Gujarat 7 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Education",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Vande Gujarat 7 (576p)",
    "url": "http://103.72.101.252:8080/live/1085.m3u8",
    "isFeatured": false
  },
  {
    "id": "vande_gujarat_8__576p_279",
    "name": "Vande Gujarat 8 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Education",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Vande Gujarat 8 (576p)",
    "url": "http://103.72.101.252:8080/live/1086.m3u8",
    "isFeatured": false
  },
  {
    "id": "vande_gujarat_9__576p_280",
    "name": "Vande Gujarat 9 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Education",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Vande Gujarat 9 (576p)",
    "url": "http://103.72.101.252:8080/live/1087.m3u8",
    "isFeatured": false
  },
  {
    "id": "vande_gujarat_10__576p_281",
    "name": "Vande Gujarat 10 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Education",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Vande Gujarat 10 (576p)",
    "url": "http://103.72.101.252:8080/live/1088.m3u8",
    "isFeatured": false
  },
  {
    "id": "vande_gujarat_11__576p_282",
    "name": "Vande Gujarat 11 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Education",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Vande Gujarat 11 (576p)",
    "url": "http://103.72.101.252:8080/live/1089.m3u8",
    "isFeatured": false
  },
  {
    "id": "vande_gujarat_12__576p_283",
    "name": "Vande Gujarat 12 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Education",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Vande Gujarat 12 (576p)",
    "url": "http://103.72.101.252:8080/live/1090.m3u8",
    "isFeatured": false
  },
  {
    "id": "vande_gujarat_13__576p_284",
    "name": "Vande Gujarat 13 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Education",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Vande Gujarat 13 (576p)",
    "url": "http://103.72.101.252:8080/live/1091.m3u8",
    "isFeatured": false
  },
  {
    "id": "vande_gujarat_14__576p_285",
    "name": "Vande Gujarat 14 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Education",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Vande Gujarat 14 (576p)",
    "url": "http://103.72.101.252:8080/live/1092.m3u8",
    "isFeatured": false
  },
  {
    "id": "vande_gujarat_15__576p_286",
    "name": "Vande Gujarat 15 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Education",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Vande Gujarat 15 (576p)",
    "url": "http://103.72.101.252:8080/live/1093.m3u8",
    "isFeatured": false
  },
  {
    "id": "vande_gujarat_16__576p_287",
    "name": "Vande Gujarat 16 (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Education",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Vande Gujarat 16 (576p)",
    "url": "http://103.72.101.252:8080/live/1094.m3u8",
    "isFeatured": false
  },
  {
    "id": "vedic__576p_288",
    "name": "Vedic (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Religious",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Vedic (576p)",
    "url": "https://mumt05.tangotv.in/87NeALx2VEDIC/index.m3u8",
    "isFeatured": false
  },
  {
    "id": "vip_news__360p_289",
    "name": "VIP News (360p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of VIP News (360p)",
    "url": "https://live.vipnews24x7.co.in/vipnews24x7/d0dbe915091d400bd8ee7f27f0791303.sdp/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "vtu__1080p_290",
    "name": "VTU (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Undefined",
    "quality": "HD Live",
    "description": "Live streaming broadcast of VTU (1080p)",
    "url": "https://lbgo.bozztv.com/ssh101/ssh101/afghantheatretv/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "weatherspy_291",
    "name": "Weatherspy",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Weather",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Weatherspy",
    "url": "https://jukin-weatherspy-2-in.samsung.wurl.tv/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "wow_kidz__720p_292",
    "name": "WOW Kidz (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Animation;Kids",
    "quality": "HD Live",
    "description": "Live streaming broadcast of WOW Kidz (720p)",
    "url": "https://yuppparoriglin.akamaized.net/181224/smil:wowkidzhindi.smil/playlist.m3u8?hdnts=st=1735898689~exp=1835898688~acl=*~hmac=f5fe24724fe05481e3841f9eb5ab8efdee0a3dd83645ae9dcf45703f525bab7b",
    "isFeatured": false
  },
  {
    "id": "yrf_music__1080p_293",
    "name": "YRF Music (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Music",
    "quality": "HD Live",
    "description": "Live streaming broadcast of YRF Music (1080p)",
    "url": "https://cdn-uw2-prod.tsv2.amagi.tv/linear/amg01412-xiaomiasia-yrfmusic-xiaomi/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "zee_bharat__720p_294",
    "name": "Zee Bharat (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Zee Bharat (720p)",
    "url": "https://vg-zeefta.akamaized.net/ptnr-yupptv/title-zeehindustan/v1/master/611d79b11b77e2f571934fd80ca1413453772ac7/96bbab12-582e-4540-af70-510ab6824581/main.m3u8",
    "isFeatured": false
  },
  {
    "id": "zee_bollywood__580p_295",
    "name": "Zee Bollywood (580p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Movies",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Zee Bollywood (580p)",
    "url": "https://s3.itcnbd.live/channel/a5979fd53c01d1b2.m3u8",
    "isFeatured": false
  },
  {
    "id": "zee_business__720p_296",
    "name": "Zee Business (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Business",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Zee Business (720p)",
    "url": "https://dwby15d04agvq.cloudfront.net/index_5.m3u8",
    "isFeatured": false
  },
  {
    "id": "zee_cine_classic__1080p_297",
    "name": "Zee Cine Classic (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Classic",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Zee Cine Classic (1080p)",
    "url": "https://amg00862-amg00862c8-amgplt0173.playout.now3.amagi.tv/playlist/amg00862-amg00862c8-amgplt0173/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "zee_cinema__576p_298",
    "name": "Zee Cinema (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Movies",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Zee Cinema (576p)",
    "url": "https://d1g8wgjurz8via.cloudfront.net/bpk-tv/NGCHD/default/NGCHD.m3u8",
    "isFeatured": false
  },
  {
    "id": "zee_cinema_apac__1080p___geo_blocked_299",
    "name": "Zee Cinema APAC (1080p) [Geo-blocked]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Movies",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Zee Cinema APAC (1080p) [Geo-blocked]",
    "url": "https://amg17931-zee-amg17931c5-samsung-au-8873.playouts.now.amagi.tv/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "zee_cinema_hd__1080p_300",
    "name": "Zee Cinema HD (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Movies",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Zee Cinema HD (1080p)",
    "url": "http://103.72.101.252:8080/live/165.m3u8",
    "isFeatured": false
  },
  {
    "id": "zee_cinema_me__432p___geo_blocked_301",
    "name": "Zee Cinema ME (432p) [Geo-blocked]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Movies",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Zee Cinema ME (432p) [Geo-blocked]",
    "url": "https://ev-eu-hw-fast-mpd.starzplayarabia.com/Zee_Cinema/dash/drm/index.mpd",
    "isFeatured": false
  },
  {
    "id": "zee_classic__576p_302",
    "name": "Zee Classic (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Classic",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Zee Classic (576p)",
    "url": "http://103.72.101.252:8080/live/1691.m3u8",
    "isFeatured": false
  },
  {
    "id": "zee_comedy_nation__1080p_303",
    "name": "Zee Comedy Nation (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Comedy",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Zee Comedy Nation (1080p)",
    "url": "https://amg00862-amg00862c5-amgplt0173.playout.now3.amagi.tv/playlist/amg00862-amg00862c5-amgplt0173/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "zee_delhi_ncr_haryana__720p_304",
    "name": "Zee Delhi NCR Haryana (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Zee Delhi NCR Haryana (720p)",
    "url": "https://vg-zeefta.akamaized.net/ptnr-yupptv/title-zeedelhincr/v1/master/611d79b11b77e2f571934fd80ca1413453772ac7/cc483a15-1b39-4642-872d-5d08d362ed01/main.m3u8",
    "isFeatured": false
  },
  {
    "id": "zee_dil_se__1080p_305",
    "name": "Zee Dil Se (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Zee Dil Se (1080p)",
    "url": "https://amg00862-amg00862c6-amgplt0173.playout.now3.amagi.tv/playlist/amg00862-amg00862c6-amgplt0173/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "zee_horror_nights__1080p_306",
    "name": "Zee Horror Nights (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Zee Horror Nights (1080p)",
    "url": "https://amg00862-amg00862c7-amgplt0173.playout.now3.amagi.tv/playlist/amg00862-amg00862c7-amgplt0173/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "zee_madhya_pradesh_chhattisgarh__720p_307",
    "name": "Zee Madhya Pradesh Chhattisgarh (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Zee Madhya Pradesh Chhattisgarh (720p)",
    "url": "https://vg-zeefta.akamaized.net/ptnr-yupptv/title-zeemadhyachhattisgarh/v1/master/611d79b11b77e2f571934fd80ca1413453772ac7/2ab17056-6187-4f0e-a34d-f436ac479d6c/main.m3u8",
    "isFeatured": false
  },
  {
    "id": "zee_news__1080p_308",
    "name": "Zee News (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Zee News (1080p)",
    "url": "https://dknttpxmr0dwf.cloudfront.net/index_57.m3u8",
    "isFeatured": false
  },
  {
    "id": "zee_rajasthan__720p_309",
    "name": "Zee Rajasthan (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Zee Rajasthan (720p)",
    "url": "https://vg-zeefta.akamaized.net/ptnr-yupptv/title-zeerajashthannews/v1/master/611d79b11b77e2f571934fd80ca1413453772ac7/8e864b9a-1681-41a0-99a6-387490bc5b24/main.m3u8",
    "isFeatured": false
  },
  {
    "id": "zee_south_flix__1080p_310",
    "name": "Zee South Flix (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Movies",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Zee South Flix (1080p)",
    "url": "https://amg00862-amg00862c9-amgplt0173.playout.now3.amagi.tv/playlist/amg00862-amg00862c9-amgplt0173/playlist.m3u8",
    "isFeatured": false
  },
  {
    "id": "zee_uttar_pradesh_uttarakhand__720p_311",
    "name": "Zee Uttar Pradesh/Uttarakhand (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Zee Uttar Pradesh/Uttarakhand (720p)",
    "url": "https://duw35ict5q7th.cloudfront.net/index_3.m3u8",
    "isFeatured": false
  },
  {
    "id": "zee_zest_hd__1080p_312",
    "name": "Zee Zest HD (1080p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Lifestyle",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Zee Zest HD (1080p)",
    "url": "http://103.72.101.252:8080/live/2757.m3u8",
    "isFeatured": false
  },
  {
    "id": "zing___576p_313",
    "name": "Zing! (576p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Music",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Zing! (576p)",
    "url": "http://103.72.101.252:8080/live/585.m3u8",
    "isFeatured": false
  },
  {
    "id": "zoom__720p_314",
    "name": "Zoom (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Music",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Zoom (720p)",
    "url": "https://dai.google.com/linear/hls/event/JCAm25qkRXiKcK1AJMlvKQ/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "zoom_global__720p_315",
    "name": "Zoom Global (720p)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Music",
    "quality": "HD Live",
    "description": "Live streaming broadcast of Zoom Global (720p)",
    "url": "https://d14c63magvk61v.cloudfront.net/strm/channels/zoom/master.m3u8",
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
    folder: 'movies',
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
    folder: 'music',
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
    folder: 'movies',
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
    folder: 'music',
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

// Gestures State (Left = Brightness, Right = Volume)
let currentVolume = 100;
let currentBrightness = 100;
let touchStartY = 0;
let touchStartX = 0;
let touchStartVal = 0;
let activeGestureType = null;
let hudHideTimeout = null;

// Initialize Application
document.addEventListener('DOMContentLoaded', async () => {
  initParticles();
  initPlayerOverlayEvents();
  initPlayerSwipeGestures();
  updateCCUI();
  await loadDatabase();
  renderAllPages();
  setTimeout(() => { autoScanDeviceMedia(); }, 300);
  loadSettingsUI();
  startHeroRotator();

  
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
    const liveStreams = channelsData.filter(c => c.type === 'tv').slice(0, 12);
    liveStreams.forEach((ch, idx) => {
      const viewers = ['18.4K', '14.2K', '12.8K', '9.5K', '8.1K', '6.4K', '5.2K', '4.7K', '3.9K', '3.1K', '2.8K', '2.4K'][idx % 12];
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
          <img src="${thumbUrl}" alt="${ch.name}" loading="lazy">
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
    const sampleFeatured = channelsData.filter(c => c.isFeatured).slice(0, 8);
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
      list = list.filter(c => c.category && (c.category.toLowerCase().includes('devotional') || c.category.toLowerCase().includes('holy') || c.category.toLowerCase().includes('spiritual') || c.category.toLowerCase().includes('religious')));
    } else if (currentLiveCategory === 'ENTERTAINMENT') {
      list = list.filter(c => c.category && (c.category.toLowerCase().includes('entertainment') || c.category.toLowerCase().includes('culture') || c.category.toLowerCase().includes('movies') || c.category.toLowerCase().includes('sports') || c.category.toLowerCase().includes('general')));
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
// 4. LOCAL MEDIA LIBRARY (AUTO-SCAN & DYNAMIC FOLDERS)
// ==========================================================
let currentLocalFolder = 'all';
let detectedFolderNames = ['all', 'movies', 'music', 'downloads'];

window.autoScanDeviceMedia = function() {
  const statusText = document.getElementById('autoScanStatusText');
  if (window.AndroidMedia && window.AndroidMedia.scanDeviceMedia) {
    if (statusText) statusText.textContent = 'Scanning storage for videos & music...';
    try {
      const rawJson = window.AndroidMedia.scanDeviceMedia();
      const files = JSON.parse(rawJson || '[]');
      if (files && files.length > 0) {
        customLocalMedia = files;
        localStorage.setItem('aakash_local_media', JSON.stringify(files.slice(0, 100).map(m => ({ ...m, url: m.url }))));
        if (statusText) statusText.textContent = 'Found ' + files.length + ' videos & songs on device!';
        showToast('✅ Found ' + files.length + ' local media files!');
      } else {
        if (statusText) statusText.textContent = 'No media found or permission needed. Tap to scan.';
        window.AndroidMedia.requestStoragePermission();
      }
    } catch (e) {
      if (statusText) statusText.textContent = 'Auto-scan complete';
    }
  } else {
    if (statusText) statusText.textContent = 'Device Media Scanner ready';
  }
  renderLocalPage();
};

window.selectLocalFolder = function(folderKey, cardEl) {
  currentLocalFolder = folderKey;
  document.querySelectorAll('#localFoldersGrid .folder-card-item').forEach(b => b.classList.remove('active'));
  if (cardEl) cardEl.classList.add('active');
  renderLocalFolderFeed();
};

function renderLocalPage() {
  updateDynamicFolderCards();
  renderLocalFolderFeed();
}

function updateDynamicFolderCards() {
  const grid = document.getElementById('localFoldersGrid');
  if (!grid) return;

  const vFiles = customLocalMedia.filter(m => m.type === 'tv' || (m.name && m.name.match(/\.(mp4|mkv|mov|webm|avi)$/i)));
  const aFiles = customLocalMedia.filter(m => m.type === 'radio' || (m.name && m.name.match(/\.(mp3|m4a|wav|aac|flac)$/i)));

  // Extract unique folder names from customLocalMedia
  const folderMap = {};
  customLocalMedia.forEach(m => {
    const f = m.folder || 'Other';
    folderMap[f] = (folderMap[f] || 0) + 1;
  });

  let folderCardsHtml = `
    <div class="folder-card-item ${currentLocalFolder === 'all' ? 'active' : ''}" onclick="selectLocalFolder('all', this)">
      <div class="folder-icon-circle" style="background: rgba(229, 9, 20, 0.15); color: #E50914;">📂</div>
      <div class="folder-card-meta">
        <h4 class="folder-name">All Media</h4>
        <p class="folder-count">${customLocalMedia.length} files</p>
      </div>
    </div>

    <div class="folder-card-item ${currentLocalFolder === 'movies' ? 'active' : ''}" onclick="selectLocalFolder('movies', this)">
      <div class="folder-icon-circle" style="background: rgba(59, 130, 246, 0.15); color: #60a5fa;">🎬</div>
      <div class="folder-card-meta">
        <h4 class="folder-name">All Videos</h4>
        <p class="folder-count">${vFiles.length} videos</p>
      </div>
    </div>

    <div class="folder-card-item ${currentLocalFolder === 'music' ? 'active' : ''}" onclick="selectLocalFolder('music', this)">
      <div class="folder-icon-circle" style="background: rgba(16, 185, 129, 0.15); color: #34d399;">🎵</div>
      <div class="folder-card-meta">
        <h4 class="folder-name">All Music</h4>
        <p class="folder-count">${aFiles.length} songs</p>
      </div>
    </div>
  `;

  // Add individual detected folders
  const colors = [
    { bg: 'rgba(234, 179, 8, 0.15)', fg: '#facc15', icon: '📁' },
    { bg: 'rgba(168, 85, 247, 0.15)', fg: '#c084fc', icon: '📸' },
    { bg: 'rgba(236, 72, 153, 0.15)', fg: '#f472b6', icon: '💬' },
    { bg: 'rgba(20, 184, 166, 0.15)', fg: '#2dd4bf', icon: '📥' }
  ];

  let cIdx = 0;
  for (const [folderName, count] of Object.entries(folderMap)) {
    if (folderName.toLowerCase() === 'movies' || folderName.toLowerCase() === 'music') continue;
    const color = colors[cIdx % colors.length];
    cIdx++;
    folderCardsHtml += `
      <div class="folder-card-item ${currentLocalFolder === folderName ? 'active' : ''}" onclick="selectLocalFolder('${folderName.replace(/'/g, "\'")}', this)">
        <div class="folder-icon-circle" style="background: ${color.bg}; color: ${color.fg};">${color.icon}</div>
        <div class="folder-card-meta">
          <h4 class="folder-name">${folderName}</h4>
          <p class="folder-count">${count} items</p>
        </div>
      </div>
    `;
  }

  grid.innerHTML = folderCardsHtml;
}

function renderLocalFolderFeed() {
  const feed = document.getElementById('localMediaFolderFeed');
  const titleEl = document.getElementById('activeFolderNameTitle');
  if (!feed) return;
  feed.innerHTML = '';

  let list = customLocalMedia;
  let titleText = 'All Media Files';

  if (currentLocalFolder === 'movies') {
    list = customLocalMedia.filter(m => m.type === 'tv' || (m.name && m.name.match(/\.(mp4|mkv|mov|webm|avi)$/i)));
    titleText = '🎬 All Video Files (' + list.length + ')';
  } else if (currentLocalFolder === 'music') {
    list = customLocalMedia.filter(m => m.type === 'radio' || (m.name && m.name.match(/\.(mp3|m4a|wav|aac|flac)$/i)));
    titleText = '🎵 All Music & Songs (' + list.length + ')';
  } else if (currentLocalFolder !== 'all') {
    list = customLocalMedia.filter(m => m.folder === currentLocalFolder);
    titleText = '📁 ' + currentLocalFolder + ' (' + list.length + ')';
  } else {
    titleText = '📂 All Media Files (' + list.length + ')';
  }

  if (titleEl) titleEl.textContent = titleText;

  if (list.length === 0) {
    feed.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px 16px; color: #a3a3a3;">
        <div style="font-size: 32px; margin-bottom: 8px;">📂</div>
        <p style="font-size: 14px; font-weight: 600; color: #fff;">No media in this folder</p>
        <p style="font-size: 12px; color: #737373;">Tap 'Auto-Scan Phone Storage' to refresh</p>
      </div>
    `;
    return;
  }

  list.forEach(media => {
    const isVideo = media.type === 'tv' || (media.name && media.name.match(/\.(mp4|mkv|mov|webm|avi)$/i));
    const card = document.createElement('div');
    card.className = 'local-grid-card';
    
    const thumbHtml = media.thumbUrl 
      ? `<img src="${media.thumbUrl}" alt="${media.name}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
         <div style="display: none; width: 100%; height: 100%; align-items: center; justify-content: center; font-size: 32px; background: #202020;">${isVideo ? '🎬' : '🎵'}</div>`
      : `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 32px; background: #202020;">${isVideo ? '🎬' : '🎵'}</div>`;

    card.innerHTML = `
      <div class="local-grid-thumb-box">
        ${thumbHtml}
        <span class="local-grid-badge">${media.duration || (isVideo ? 'VIDEO' : 'AUDIO')}</span>
      </div>
      <div class="local-grid-info">
        <h4 class="local-grid-title" title="${media.name}">${media.name}</h4>
        <div class="local-grid-meta">${media.countryName || media.folder || 'Storage'} • ${media.quality || (isVideo ? '1080p' : 'Audio')}</div>
      </div>
    `;
    card.onclick = () => playChannel(media);
    feed.appendChild(card);
  });
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
      folder: isVideo ? 'movies' : 'music',
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
  setTimeout(() => { autoScanDeviceMedia(); }, 300);
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
let currentBackupIdx = 0;

function playChannel(ch) {
  currentBackupIdx = 0;
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

  let streamUrl = ch.url;
  if (ch.backupUrls && ch.backupUrls.length > 0 && currentBackupIdx < ch.backupUrls.length) {
    streamUrl = ch.backupUrls[currentBackupIdx];
  }

  if (streamUrl && streamUrl.endsWith('.m3u8') && window.Hls && Hls.isSupported()) {
    hlsInstance = new Hls({
      enableWorker: true,
      lowLatencyMode: localStorage.getItem('aakash_low_latency') !== 'false',
      backBufferLength: 30,
      maxBufferLength: 60,
      manifestLoadingMaxRetry: 3,
      levelLoadingMaxRetry: 3
    });

    hlsInstance.loadSource(streamUrl);
    hlsInstance.attachMedia(videoElement);

    hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
      if (autoPlay) {
        videoElement.play().catch(() => {});
        openFullPlayerModal();
      }
    });

    hlsInstance.on(Hls.Events.ERROR, (event, data) => {
      if (data.fatal) {
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            // Try backup stream mirror if available
            if (ch.backupUrls && currentBackupIdx + 1 < ch.backupUrls.length) {
              currentBackupIdx++;
              showToast('Connecting backup stream mirror...');
              loadChannelMedia(ch, true);
            } else {
              hlsInstance.startLoad();
            }
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            hlsInstance.recoverMediaError();
            break;
          default:
            hlsInstance.destroy();
            break;
        }
      }
    });
  } else if (streamUrl) {
    videoElement.src = streamUrl;
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
  if (playerModal) {
    playerModal.classList.add('active');
    playerModal.style.display = 'flex';
  }
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
  if (playerModal) {
    playerModal.classList.remove('active');
    playerModal.style.display = 'none';
  }
  if (miniPlayer && currentPlayingChannel) {
    miniPlayer.classList.add('active');
  }
  showToast('Minimized to Mini Player');
};

window.closePlayerModal = function() {
  minimizeToMiniPlayer(null);
};

window.closePlayerModalCompletely = function(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  closeMiniPlayer(e);
};

window.closeMiniPlayer = function(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  const videoElement = document.getElementById('luminaVideo');
  const playerModal = document.getElementById('playerModal');
  const miniPlayer = document.getElementById('miniPlayer');
  
  if (videoElement) {
    videoElement.pause();
    videoElement.removeAttribute('src');
    videoElement.load();
  }
  
  if (hlsInstance) {
    hlsInstance.destroy();
    hlsInstance = null;
  }
  
  if (playerModal) {
    playerModal.classList.remove('active');
    playerModal.style.display = 'none';
  }
  
  if (miniPlayer) {
    miniPlayer.classList.remove('active');
  }
  
  isPlaying = false;
  currentPlayingChannel = null;
  updatePlayPauseIcons(false);
  showToast('Playback Closed');
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

// ==========================================================
// SWIPE GESTURE ENGINE (Left = Brightness, Right = Volume)
// ==========================================================
function initPlayerSwipeGestures() {
  const playerModal = document.getElementById('playerModal');
  const videoElement = document.getElementById('luminaVideo');
  const hud = document.getElementById('playerSwipeHud');
  const hudIcon = document.getElementById('playerSwipeHudIcon');
  const hudTitle = document.getElementById('playerSwipeHudTitle');
  const hudPct = document.getElementById('playerSwipeHudPct');
  const hudFill = document.getElementById('playerSwipeHudFill');

  if (!playerModal) return;

  playerModal.addEventListener('touchstart', (e) => {
    if (isPlayerLocked || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const rect = playerModal.getBoundingClientRect();
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;

    if (touchStartX < rect.width / 2) {
      activeGestureType = 'brightness';
      touchStartVal = currentBrightness;
      if (hud) hud.className = 'player-swipe-hud-pill hud-left';
    } else {
      activeGestureType = 'volume';
      if (window.AndroidMedia && window.AndroidMedia.getSystemVolume) {
        touchStartVal = window.AndroidMedia.getSystemVolume();
      } else {
        touchStartVal = videoElement ? Math.round(videoElement.volume * 100) : currentVolume;
      }
      if (hud) hud.className = 'player-swipe-hud-pill hud-right';
    }
  }, { passive: true });

  playerModal.addEventListener('touchmove', (e) => {
    if (activeGestureType) e.preventDefault();
    if (!activeGestureType || isPlayerLocked || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const deltaY = touchStartY - touch.clientY;
    const sensitivity = 0.5;

    clearTimeout(hudHideTimeout);

    if (activeGestureType === 'brightness') {
      currentBrightness = Math.max(20, Math.min(150, Math.round(touchStartVal + deltaY * sensitivity)));
      if (videoElement) {
        videoElement.style.filter = 'brightness(' + (currentBrightness / 100) + ')';
      }
      const normPct = Math.round(((currentBrightness - 20) / 130) * 100);
      if (hudIcon) hudIcon.textContent = '☀️';
      if (hudTitle) hudTitle.textContent = 'Brightness';
      if (hudPct) hudPct.textContent = currentBrightness + '%';
      
    } else if (activeGestureType === 'volume') {
      currentVolume = Math.max(0, Math.min(100, Math.round(touchStartVal + deltaY * sensitivity)));
      if (window.AndroidMedia && window.AndroidMedia.setSystemVolume) {
        window.AndroidMedia.setSystemVolume(currentVolume);
      }
      if (videoElement) {
        videoElement.volume = currentVolume / 100;
        if (videoElement.muted && currentVolume > 0) {
          videoElement.muted = false;
        }
      }
      if (hudIcon) hudIcon.textContent = currentVolume === 0 ? '🔇' : (currentVolume > 50 ? '🔊' : '🔉');
      if (hudTitle) hudTitle.textContent = 'Volume';
      if (hudPct) hudPct.textContent = currentVolume + '%';
      
    }

    if (hud) hud.classList.add('active');
  }, { passive: true });

  playerModal.addEventListener('touchend', () => {
    if (!activeGestureType) return;
    activeGestureType = null;
    hudHideTimeout = setTimeout(() => {
      if (hud) hud.classList.remove('active');
    }, 1200);
  }, { passive: true });
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
  setTimeout(() => { autoScanDeviceMedia(); }, 300);
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
