// ==========================================================
// AAKASHSTREAM - CORE APPLICATION & MEDIA ENGINE
// ==========================================================

const FALLBACK_CHANNELS = [
  {
    "id": "aajtak-hd",
    "name": "Aaj Tak HD Live",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "India's premier 24x7 Hindi national breaking news and prime-time debates.",
    "url": "https://feeds.intoday.in/aajtak/api/aajtakhd/master.m3u8",
    "backupUrls": [
      "https://live-aajtak.akamaized.net/hls/live/2003835/aajtak/master.m3u8"
    ],
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
    "description": "In-depth investigative reports, prime time news, and national coverage.",
    "url": "https://ndtvindiaelemarchana.akamaized.net/hls/live/2003679/ndtvindia/master.m3u8",
    "backupUrls": [
      "https://ndtvindiaelemarchana.akamaized.net/hls/live/2003679/ndtvindia/live_1080p.m3u8"
    ],
    "isFeatured": true
  },
  {
    "id": "nasa-tv-uhd",
    "name": "NASA TV HD (Space)",
    "type": "tv",
    "country": "US",
    "countryName": "USA",
    "flag": "\ud83c\uddfa\ud83c\uddf8",
    "category": "Science & Space",
    "quality": "4K UHD / 1080p",
    "description": "Live views from the International Space Station and Artemis rocket launches.",
    "url": "https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8",
    "backupUrls": [
      "https://nasa-i.akamaihd.net/hls/live/253565/NTV-Media/master.m3u8"
    ],
    "isFeatured": true
  },
  {
    "id": "al-jazeera-en",
    "name": "Al Jazeera World News HD",
    "type": "tv",
    "country": "QA",
    "countryName": "Qatar / Global",
    "flag": "\ud83c\udf10",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Award-winning global breaking news and in-depth investigative reports.",
    "url": "https://live-hls-web-aje.getaj.net/AJE/03.m3u8",
    "backupUrls": [
      "https://live-hls-web-aje.getaj.net/AJE/index.m3u8"
    ],
    "isFeatured": true
  },
  {
    "id": "dw-english",
    "name": "DW News HD (Germany)",
    "type": "tv",
    "country": "DE",
    "countryName": "Germany",
    "flag": "\ud83c\udde9\ud83c\uddea",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Deutsche Welle international broadcast with European perspectives.",
    "url": "https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8",
    "backupUrls": [],
    "isFeatured": true
  },
  {
    "id": "makkah-live-hd",
    "name": "Holy Makkah 24/7 Live HD",
    "type": "tv",
    "country": "SA",
    "countryName": "Saudi Arabia",
    "flag": "\ud83c\uddf8\ud83c\udde6",
    "category": "Devotional",
    "quality": "1080p FHD",
    "description": "Continuous 24/7 live HD broadcast from the Grand Mosque in Holy Makkah.",
    "url": "https://win.holymakkah.gov.sa/live/smil:makkah.smil/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": true
  },
  {
    "id": "madinah-live-hd",
    "name": "Holy Madinah 24/7 Live HD",
    "type": "tv",
    "country": "SA",
    "countryName": "Saudi Arabia",
    "flag": "\ud83c\uddf8\ud83c\udde6",
    "category": "Devotional",
    "quality": "1080p FHD",
    "description": "Continuous 24/7 live HD broadcast from the Prophet's Mosque in Holy Madinah.",
    "url": "https://win.holymakkah.gov.sa/live/smil:madinah.smil/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": true
  },
  {
    "id": "air-vividh-bharati",
    "name": "AIR Vividh Bharati 102.8 FM",
    "type": "radio",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Music & Songs",
    "quality": "HD Audio",
    "description": "Evergreen Bollywood golden melodies and classic All India Radio broadcasts.",
    "url": "https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudioragam/hlspbaudioragam_Auto.m3u8",
    "backupUrls": [],
    "isFeatured": true
  },
  {
    "id": "air-gold-fm",
    "name": "AIR FM Gold Delhi",
    "type": "radio",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Music & Songs",
    "quality": "HD Audio",
    "description": "Retro Hindi classics, ghazals, and national news bulletin updates.",
    "url": "https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudiofmgold/hlspbaudiofmgold_Auto.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "air-rainbow-fm",
    "name": "AIR FM Rainbow",
    "type": "radio",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Music & Songs",
    "quality": "HD Audio",
    "description": "Youth music, contemporary Bollywood hits, and infotainment.",
    "url": "https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudiofmrainbow/hlspbaudiofmrainbow_Auto.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_1",
    "name": "Bollywood HD Russia",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Bollywood HD Russia",
    "url": "https://xykt-fix.github.io/cinerama_edge01/hls/BOLLYWOOD_RU/Movie009.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_2",
    "name": "9X Jalwa",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Music & Songs",
    "quality": "1080p FHD",
    "description": "Live online broadcast of 9X Jalwa",
    "url": "https://b.jsrdn.com/strm/channels/9xjalwa/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_3",
    "name": "Aastha Prime 1",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Aastha Prime 1",
    "url": "https://aasthaott.akamaized.net/110923/smil:aasthaprime1.smil/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_4",
    "name": "DD Kashir",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of DD Kashir",
    "url": "https://d3qs3d2rkhfqrt.cloudfront.net/out/v1/8a59a828e80c49d0958925950cec0204/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_5",
    "name": "DD Haryana",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of DD Haryana",
    "url": "https://d2lk5u59tns74c.cloudfront.net/out/v1/950fc69666474351bde0a32b9600c804/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_6",
    "name": "DD National HD",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of DD National HD",
    "url": "https://d3qs3d2rkhfqrt.cloudfront.net/out/v1/40492a64c1db4a1385ba1a397d357d3a/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_7",
    "name": "DD Manipur",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of DD Manipur",
    "url": "https://d2lk5u59tns74c.cloudfront.net/out/v1/8b75afc6576f450e8f554b6c877681d2/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_8",
    "name": "DD Himachal Pradesh",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of DD Himachal Pradesh",
    "url": "https://d3qs3d2rkhfqrt.cloudfront.net/out/v1/afd2e335b0ba40eb9bdf1096118c6ede/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_9",
    "name": "DD Jharkhand",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of DD Jharkhand",
    "url": "https://d3qs3d2rkhfqrt.cloudfront.net/out/v1/e8c3741f8c154d3185831f4e31777fb2/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_10",
    "name": "DD News HD",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Live online broadcast of DD News HD",
    "url": "https://d3qs3d2rkhfqrt.cloudfront.net/out/v1/0811cd8c37ca4c409d5385a6cd2fa18b/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_11",
    "name": "DD Sports SD",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of DD Sports SD",
    "url": "https://d3qs3d2rkhfqrt.cloudfront.net/out/v1/b17adfe543354fdd8d189b110617cddd/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_12",
    "name": "ABP Ganga",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of ABP Ganga",
    "url": "https://d2l4ar6y3mrs4k.cloudfront.net/live-streaming/ganga-livetv/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_13",
    "name": "DD Arun Prabha",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of DD Arun Prabha",
    "url": "https://d2lk5u59tns74c.cloudfront.net/out/v1/308556d9fd1246adb479ef012a39bbfe/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_14",
    "name": "CNBC Awaaz",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of CNBC Awaaz",
    "url": "https://n18syndication.akamaized.net/bpk-tv/CNBC_Awaaz_NW18_MOB/output01/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_15",
    "name": "Colors MENA HD",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Colors MENA HD",
    "url": "https://da86m1sqpm3o0.cloudfront.net/28072023/smil:colorsme.smil/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_16",
    "name": "ABP News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Live online broadcast of ABP News",
    "url": "https://d1rc86nwwc9fag.cloudfront.net/vglive-sk-472500/abpnews/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_17",
    "name": "Dheeran TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Dheeran TV",
    "url": "https://live.we2live.in/dheerantv/dheerantv/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_18",
    "name": "like Gecko) Chrome/130.0.0.0 Safari/537.36 VLC/3.0.18 LibVLC/3.0.18\" group-title=\"Classic;Movies\",Bollywood Classic Romania",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of like Gecko) Chrome/130.0.0.0 Safari/537.36 VLC/3.0.18 LibVLC/3.0.18\" group-title=\"Classic;Movies\",Bollywood Classic Romania",
    "url": "https://flash1.bogulus1.cfd/boly/usergenr9j8s2t.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_19",
    "name": "&TV International",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of &TV International",
    "url": "https://amg01117-amg01117c1-amgplt0029.playout.now3.amagi.tv/playlist/amg01117-amg01117c1-amgplt0029/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_20",
    "name": "like Gecko) Chrome/130.0.0.0 Safari/537.36\" group-title=\"Entertainment\",Colors HD",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of like Gecko) Chrome/130.0.0.0 Safari/537.36\" group-title=\"Entertainment\",Colors HD",
    "url": "http://59.103.38.46:8000/play/a00b/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_21",
    "name": "Colors Rishtey Americas",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Colors Rishtey Americas",
    "url": "https://manatv.akamaized.net/090823/smil:ristheyamerica.smil/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_22",
    "name": "Aastha",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Aastha",
    "url": "https://aasthaott.akamaized.net/110923/smil:aasthatv.smil/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_23",
    "name": "Channel Divya",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Channel Divya",
    "url": "https://vg-pitaaratvlive.akamaized.net/v1/vglive-sk-906482/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_24",
    "name": "Epic Crimes",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Epic Crimes",
    "url": "https://cc-wsuyg2uxeak04.akamaized.net/v1/master/3722c60a815c199d9c0ef36c5b73da68a62b09d1/cc-wsuyg2uxeak04/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_25",
    "name": "Epic Music Digital",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Music & Songs",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Epic Music Digital",
    "url": "https://cc-3cyxq80qusspd.akamaized.net/v1/master/3722c60a815c199d9c0ef36c5b73da68a62b09d1/cc-3cyxq80qusspd/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_26",
    "name": "Awaaz India TV [Not 24/7]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Awaaz India TV [Not 24/7]",
    "url": "https://awaazindia.livebox.co.in/AwaazIndaTVhls/Live.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_27",
    "name": "Good News Today",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "720p HD",
    "description": "Live online broadcast of Good News Today",
    "url": "https://aajtaklive.vgcdn.net/v1/master/611d79b11b77e2f571934fd80ca1413453772ac7/3196cced-ce29-4219-9809-f07ccdaa02b9/vglive-sk-848805/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_28",
    "name": "India Voice",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of India Voice",
    "url": "https://d1msejlow1t3l4.cloudfront.net/fta/indiavoice/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_29",
    "name": "INH 24x7",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of INH 24x7",
    "url": "https://d1msejlow1t3l4.cloudfront.net/fta/inh24x7/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_30",
    "name": "Jan TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Jan TV",
    "url": "https://d1msejlow1t3l4.cloudfront.net/fta/jantv/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_31",
    "name": "India TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of India TV",
    "url": "https://pl-indiatvnews.akamaized.net/out/v1/db79179b608641ceaa5a4d0dd0dca8da/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_32",
    "name": "India TV Speed News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Live online broadcast of India TV Speed News",
    "url": "https://cc-lyf4c0hwzg5dd.akamaized.net/v1/master/3722c60a815c199d9c0ef36c5b73da68a62b09d1/cc-lyf4c0hwzg5dd/v1/vglive-sk-479089/main.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_33",
    "name": "Janta TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Janta TV",
    "url": "https://live.jswk.online/IK_RTPM/live/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_34",
    "name": "India TV Aap Ki Adalat [Geo-blocked]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of India TV Aap Ki Adalat [Geo-blocked]",
    "url": "https://amg01550-amg01550c6-samsung-in-4679.playouts.now.amagi.tv/playlist/amg01550-indiatvfast-indiatvakasamsung-samsungin/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_35",
    "name": "Hare Krsna TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Hare Krsna TV",
    "url": "https://hktv.harekrsnatv.com/HKTV/HKWebApp/manifest.mpd",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_36",
    "name": "Lighting Lives Blessing Nations TV South Asia (LLBN)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Lighting Lives Blessing Nations TV South Asia (LLBN)",
    "url": "https://brightstar-southasia-pull-secure.akamaized.net/brightstarsouthasia/stream.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_37",
    "name": "like Gecko) Chrome/130.0.0.0 Safari/537.36\" group-title=\"Entertainment\",MTV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of like Gecko) Chrome/130.0.0.0 Safari/537.36\" group-title=\"Entertainment\",MTV",
    "url": "https://da86m1sqpm3o0.cloudfront.net/28072023/smil:mtvindia.smil/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_38",
    "name": "Epic TV Digital",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Epic TV Digital",
    "url": "https://cc-czbq30x55knit.akamaized.net/v1/master/3722c60a815c199d9c0ef36c5b73da68a62b09d1/cc-czbq30x55knit/DIYC/PMSL/IN10/Epic_TV_IN_B/Epic_TV_IN_B.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_39",
    "name": "Anjan TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Anjan TV",
    "url": "https://anjan.vstream.online/anjanorg/ngrp:anjan_hdall/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_40",
    "name": "DD Kisan",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of DD Kisan",
    "url": "https://cdn-6.pishow.tv/live/9/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_41",
    "name": "DD Urdu",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of DD Urdu",
    "url": "https://cdn-4.pishow.tv/live/8/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_42",
    "name": "22Scope News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Live online broadcast of 22Scope News",
    "url": "https://thelegitpro.in/HDlive/22scope/index.fmp4.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_43",
    "name": "Adhyatm TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Adhyatm TV",
    "url": "https://mumbai-edge.smartplaytv.in/AdhyatmTV/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_44",
    "name": "ANB News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "720p HD",
    "description": "Live online broadcast of ANB News",
    "url": "https://server.livelegitpro.in:9899/anbnews/anbnews/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_45",
    "name": "Aryan TV National",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Aryan TV National",
    "url": "https://mumt04.tangotv.in/m18aqlK4ARYANTVNATIONAL/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_46",
    "name": "Hindi Khabar",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Hindi Khabar",
    "url": "https://mumt04.tangotv.in/m18aqlK4HINDIKHABAR/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_47",
    "name": "E 24",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of E 24",
    "url": "https://mumt04.tangotv.in/m18aqlK4E24/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_48",
    "name": "Argus News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of Argus News",
    "url": "https://mumt05.tangotv.in/87NeALx2ARGUSNEWS/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_49",
    "name": "Khabar Fast",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Khabar Fast",
    "url": "https://mumt04.tangotv.in/m18aqlK4KHABARFAST/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_50",
    "name": "Anand TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Anand TV",
    "url": "https://live.legitpro.co.in/anandtv/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_51",
    "name": "Jantantra TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Jantantra TV",
    "url": "https://mumt05.tangotv.in/87NeALx2JANTANTRA/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_52",
    "name": "Andy Haryana",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Music & Songs",
    "quality": "HD Quality",
    "description": "Live online broadcast of Andy Haryana",
    "url": "https://mumt03.tangotv.in/Dsly5z3HANDYHARYANA/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_53",
    "name": "Epic Music",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Music & Songs",
    "quality": "HD Quality",
    "description": "Live online broadcast of Epic Music",
    "url": "https://mumt04.tangotv.in/m18aqlK4EPICMUSIC/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_54",
    "name": "Khabrain Abhi Tak",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Khabrain Abhi Tak",
    "url": "https://mumt05.tangotv.in/87NeALx2KHABRAINABHITAK/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_55",
    "name": "Aadinath TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Aadinath TV",
    "url": "https://mumt01.tangotv.in/O5aw8Zn3AADINATHTV/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_56",
    "name": "DD News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of DD News",
    "url": "https://streams.tangotv.in/DDNEWS/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_57",
    "name": "APN",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of APN",
    "url": "https://mumt01.tangotv.in/O5aw8Zn3APN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_58",
    "name": "Darshan 24",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Darshan 24",
    "url": "https://mumt05.tangotv.in/87NeALx2DARSHAN24/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_59",
    "name": "like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0\" group-title=\"News\",Bharat24",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Live online broadcast of like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0\" group-title=\"News\",Bharat24",
    "url": "https://cdn.ottlive.co.in/bharat24/index.fmp4.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_60",
    "name": "Bharat Samachar",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Bharat Samachar",
    "url": "https://mumt03.tangotv.in/Dsly5z3HBHARATSAMACHAR/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_61",
    "name": "IBC 24",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of IBC 24",
    "url": "https://mumt05.tangotv.in/87NeALx2IBC24/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_62",
    "name": "Awakening TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Awakening TV",
    "url": "https://mumt03.tangotv.in/Dsly5z3HAWAKENINGTV/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_63",
    "name": "Manoranjan Grand",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Manoranjan Grand",
    "url": "https://cdn-1.pishow.tv/live/1011/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_64",
    "name": "DD National SD",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of DD National SD",
    "url": "https://cdn-1.pishow.tv/live/11/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_65",
    "name": "DD Uttar Pradesh",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of DD Uttar Pradesh",
    "url": "https://cdn-1.pishow.tv/live/36/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_66",
    "name": "DD Madhya Pradesh",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of DD Madhya Pradesh",
    "url": "https://cdn-1.pishow.tv/live/31/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_67",
    "name": "Dharm Sandesh",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Dharm Sandesh",
    "url": "https://cdn-2.pishow.tv/live/1455/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_68",
    "name": "DD Chhattisgarh",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of DD Chhattisgarh",
    "url": "https://cdn-1.pishow.tv/live/15/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_69",
    "name": "Aradana TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Aradana TV",
    "url": "https://cdn-1.pishow.tv/live/961/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_70",
    "name": "B4U Music",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Music & Songs",
    "quality": "HD Quality",
    "description": "Live online broadcast of B4U Music",
    "url": "https://cdn-2.pishow.tv/live/415/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_71",
    "name": "DD Rajasthan",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of DD Rajasthan",
    "url": "https://cdn-1.pishow.tv/live/34/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_72",
    "name": "News 11",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of News 11",
    "url": "https://d1msejlow1t3l4.cloudfront.net/fta/news11bharat/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_73",
    "name": "News18 Rajasthan",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Live online broadcast of News18 Rajasthan",
    "url": "https://n18syndication.akamaized.net/bpk-tv/News18_Rajasthan_NW18_MOB/output01/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_74",
    "name": "Republic Bharat",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Republic Bharat",
    "url": "https://raw.githubusercontent.com/amazeyourself/adaptive-streams/refs/heads/main/streams/in/YuppTV/RepublicBharat.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_75",
    "name": "News18 Bihar Jharkhand",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Live online broadcast of News18 Bihar Jharkhand",
    "url": "https://n18syndication.akamaized.net/bpk-tv/News18_Bihar_Jharkhand_NW18_MOB/output01/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_76",
    "name": "News18 Delhi NCR JK",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Live online broadcast of News18 Delhi NCR JK",
    "url": "https://n18syndication.akamaized.net/bpk-tv/News18_JKLH_NW18_MOB/output01/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_77",
    "name": "News18 India",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Live online broadcast of News18 India",
    "url": "https://n18syndication.akamaized.net/bpk-tv/News18_India_NW18_MOB/output01/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_78",
    "name": "News18 Madhya Pradesh/Chhattisgarh",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Live online broadcast of News18 Madhya Pradesh/Chhattisgarh",
    "url": "https://n18syndication.akamaized.net/bpk-tv/News18_MP_Chhattisgarh_NW18_MOB/output01/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_79",
    "name": "News18 Punjab/Haryana/Himachal",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Live online broadcast of News18 Punjab/Haryana/Himachal",
    "url": "https://n18syndication.akamaized.net/bpk-tv/News18_Punjab_Haryana_HP_NW18_MOB/output01/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_80",
    "name": "News18 Uttar Pradesh Uttarakhand",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Live online broadcast of News18 Uttar Pradesh Uttarakhand",
    "url": "https://n18syndication.akamaized.net/bpk-tv/News18_UP_Uttarakhand_NW18_MOB/output01/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_81",
    "name": "News Nation",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Live online broadcast of News Nation",
    "url": "https://d3qs3d2rkhfqrt.cloudfront.net/out/v1/6cd2f649739a45ca9de1daf81cc7d0f2/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_82",
    "name": "Epic Bharat Digital",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Epic Bharat Digital",
    "url": "https://cc-p1izg43bk7sj5.akamaized.net/v1/master/3722c60a815c199d9c0ef36c5b73da68a62b09d1/cc-p1izg43bk7sj5/DIYC/PMSL/IN10/Nazara_IN_B/Nazara_IN_B.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_83",
    "name": "Peace of Mind TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Peace of Mind TV",
    "url": "https://yuppnimrestreammum.akamaized.net/181224/smil:peaceofmind.smil/playlist.m3u8?hdnts=st=1735898689~exp=1835898688~acl=*~hmac=f5fe24724fe05481e3841f9eb5ab8efdee0a3dd83645ae9dcf45703f525bab7b",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_84",
    "name": "Channel Y [Not 24/7]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Channel Y [Not 24/7]",
    "url": "http://cdn19.live247stream.com/channely/tv/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_85",
    "name": "Fateh TV [Not 24/7]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Fateh TV [Not 24/7]",
    "url": "https://ott.livelegitpro.in/fatehtv/fatehtv/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_86",
    "name": "Sansad TV 2",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Sansad TV 2",
    "url": "https://d2lk5u59tns74c.cloudfront.net/out/v1/e4182054dce340da9e0ff38b6b3658a4/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_87",
    "name": "Sansad TV 1 HD",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Sansad TV 1 HD",
    "url": "https://d2lk5u59tns74c.cloudfront.net/out/v1/fff8f20221d5456e8922e689d71dedc3/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_88",
    "name": "Food Food",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Food Food",
    "url": "https://mumt03.tangotv.in/Dsly5z3HFOODFOOD/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_89",
    "name": "Sanskar Web TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Sanskar Web TV",
    "url": "https://deatfcv3xdvi3.cloudfront.net/out/v1/7a43dd2f64e34ec28da1b4bd6923251a/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_90",
    "name": "Epic Kids Digital",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Epic Kids Digital",
    "url": "https://cc-t8lqe1o99pszu.akamaized.net/v1/master/3722c60a815c199d9c0ef36c5b73da68a62b09d1/cc-t8lqe1o99pszu/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_91",
    "name": "First India News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of First India News",
    "url": "https://mumt03.tangotv.in/Dsly5z3H1STINDIANEWS/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_92",
    "name": "Satsang TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Satsang TV",
    "url": "https://d2vfwvjxwtwq1t.cloudfront.net/out/v1/6b24239d5517495b986e7705490c6e65/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_93",
    "name": "NDTV Madhya Pradesh Chhattisgarh",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of NDTV Madhya Pradesh Chhattisgarh",
    "url": "https://ndtvregional.akamaized.net/hls/live/2102726-b/ndtvmpcg/master_1.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_94",
    "name": "Sanskar TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Sanskar TV",
    "url": "https://d26idhjf0y1p2g.cloudfront.net/out/v1/cd66dd25b9774cb29943bab54bbf3e2f/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_95",
    "name": "Satsang Web TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Satsang Web TV",
    "url": "https://d1ji7e9jbzm5g8.cloudfront.net/out/v1/769f22f64d80442889306b9c4abea63c/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_96",
    "name": "Sanskar UK",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Sanskar UK",
    "url": "https://d34z4embz0hjf6.cloudfront.net/out/v1/7ac2789ff9a544a49337d1ffc54ce61c/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_97",
    "name": "Sanskar USA",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Sanskar USA",
    "url": "https://d2netiedy8cz3x.cloudfront.net/out/v1/9bf6fa4ac8d6432cb98da13b121ba3c2/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_98",
    "name": "Gangaur TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Gangaur TV",
    "url": "https://pbgangaur.wiseplayout.com/Gangaur/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_99",
    "name": "NDTV Rajasthan",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of NDTV Rajasthan",
    "url": "https://ndtvregional.akamaized.net/hls/live/2102726-b/ndtvraj/master_1.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_100",
    "name": "ABN TV India",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of ABN TV India",
    "url": "https://mediaserver.abnvideos.com/streams/abntvindia.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_101",
    "name": "Shubh Cinema TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Shubh Cinema TV",
    "url": "https://d393sxaxig6bax.cloudfront.net/out/v1/589cf2cf44bf42bb941e817a2240d62e/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_102",
    "name": "Shemaroo TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Shemaroo TV",
    "url": "https://airtelapp.shemaroo.com/shemarootv/smil:shemarootvadp.smil/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_103",
    "name": "Goldmines 2",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Goldmines 2",
    "url": "https://cdn-2.pishow.tv/live/1460/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_104",
    "name": "Shubh TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Shubh TV",
    "url": "https://d2g1vdc6ozl2o8.cloudfront.net/out/v1/0a0dc7d7911b4fddbb4dfc963fdd4b9e/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_105",
    "name": "Shemaroo Umang",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Shemaroo Umang",
    "url": "https://airtelapp.shemaroo.com/shemarooumang/smil:shemarooumangadp.smil/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_106",
    "name": "Diya TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Diya TV",
    "url": "https://stream.diyatvinc.com/diya.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_107",
    "name": "Bansal News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "720p HD",
    "description": "Live online broadcast of Bansal News",
    "url": "https://8yzmq2gbdvax-hls-live.wmncdn.net/bansalnewstv1/live1.stream/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_108",
    "name": "DD Bihar",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of DD Bihar",
    "url": "https://cdn-4.pishow.tv/live/35/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_109",
    "name": "Cnews Bharat",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "720p HD",
    "description": "Live online broadcast of Cnews Bharat",
    "url": "https://legitpro.co.in/cnews/cnews/index.fmp4.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_110",
    "name": "Bhakti Sagar",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Bhakti Sagar",
    "url": "https://mumt05.tangotv.in/87NeALx2BHAKTISAGAR/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_111",
    "name": "Sony Entertainment Television HD",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Sony Entertainment Television HD",
    "url": "http://38.96.178.205/SONYHD/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_112",
    "name": "Apna Punjab TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Apna Punjab TV",
    "url": "https://plus.gigabitcdn.net/live-stream/apna-punjab-H3sE/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_113",
    "name": "South Station",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of South Station",
    "url": "https://cc-yw7ztecy8do3q.akamaized.net/v1/master/3722c60a815c199d9c0ef36c5b73da68a62b09d1/cc-yw7ztecy8do3q/SS_IN.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_114",
    "name": "DD Uttarakhand",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of DD Uttarakhand",
    "url": "https://cdn-1.pishow.tv/live/17/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_115",
    "name": "God Stands TV Hindi",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of God Stands TV Hindi",
    "url": "https://online.godstands.tv:5443/WebRTCApp/streams/HindiStreaming.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_116",
    "name": "Gyandarshan",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Gyandarshan",
    "url": "https://cdn-6.pishow.tv/live/14/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_117",
    "name": "StarPlus HD (1080i)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of StarPlus HD (1080i)",
    "url": "http://202.70.146.135:8000/play/a009/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_118",
    "name": "Sony Max 1",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Sony Max 1",
    "url": "http://103.159.180.34:5001/live/3418.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_119",
    "name": "Jinvani Channel",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Jinvani Channel",
    "url": "https://cdn-2.pishow.tv/live/989/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_120",
    "name": "Kashish News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "720p HD",
    "description": "Live online broadcast of Kashish News",
    "url": "https://server.thelegitpro.in/kashishnews/kashishnews/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_121",
    "name": "NDTV Good Times",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of NDTV Good Times",
    "url": "https://amg01448-samsungin-ndtvgoodtimes-samsungin-ad-gp.amagi.tv/playlist/amg01448-samsungin-ndtvgoodtimes-samsungin/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_122",
    "name": "Maha Movie",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Maha Movie",
    "url": "https://cdn-6.pishow.tv/live/10007/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_123",
    "name": "HNN 24x7",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of HNN 24x7",
    "url": "https://ott.livelegitpro.in:9899/hnnnews/hnnnews/tracks-v1/index.fmp4.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_124",
    "name": "Taaza TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Taaza TV",
    "url": "https://live.we2live.in/taazatv/live/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_125",
    "name": "Star Sports 2 HD",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Star Sports 2 HD",
    "url": "http://tvsen5.aynascope.net/cXPB2LKkErN9/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_126",
    "name": "Kanshi TV [Not 24/7]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Kanshi TV [Not 24/7]",
    "url": "https://live.kanshitv.co.uk/mobile/kanshitvkey.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_127",
    "name": "Times Now Navbharat",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Times Now Navbharat",
    "url": "https://raw.githubusercontent.com/amazeyourself/adaptive-streams/refs/heads/main/streams/in/YuppTV/TimesNowNavbharat.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_128",
    "name": "Hosanna TV Hindi",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Hosanna TV Hindi",
    "url": "https://ktismaservers.in:3466/live/hosannattvhindhilive.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_129",
    "name": "GurSikh Sabha TV [Not 24/7]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of GurSikh Sabha TV [Not 24/7]",
    "url": "http://cdn12.henico.net:8080/live/gsctv/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_130",
    "name": "Times Now [Geo-blocked]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Times Now [Geo-blocked]",
    "url": "https://dztlhgid9me95.cloudfront.net/live-tv/Vidgyor/timesnow/timesnow_master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_131",
    "name": "Total Bhakti",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Total Bhakti",
    "url": "https://d34z4embz0hjf6.cloudfront.net/out/v1/d55b3323a9f142638f897378f0b526fe/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_132",
    "name": "Travelxp HD [Geo-blocked]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Travelxp HD [Geo-blocked]",
    "url": "https://amg00416-amg00416c9-samsung-in-4882.playouts.now.amagi.tv/playlist/amg00416-travelxp-travelxphd-samsungin/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_133",
    "name": "9XM",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Music & Songs",
    "quality": "1080p FHD",
    "description": "Live online broadcast of 9XM",
    "url": "https://9xjio.wiseplayout.com/9XM/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_134",
    "name": "MBC Bollywood [Geo-blocked]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of MBC Bollywood [Geo-blocked]",
    "url": "https://shd-gcp-live.edgenextcdn.net/live/bitmovin-mbc-bollywood/546eb40d7dcf9a209255dd2496903764/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_135",
    "name": "India Daily Live",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of India Daily Live",
    "url": "https://indiadaily.ottlive.co.in/indiadailylive/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_136",
    "name": "Ind 24",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Ind 24",
    "url": "https://mumt06.tangotv.in/qYyB8fXVIND24/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_137",
    "name": "Travelxp 4K HDR [Geo-blocked]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Travelxp 4K HDR [Geo-blocked]",
    "url": "https://deltatesttatasky.akamaized.net/out/i/968284.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_138",
    "name": "TV9 Bharatvarsh",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of TV9 Bharatvarsh",
    "url": "https://dyjmyiv3bp2ez.cloudfront.net/pub-iotv9hinjzgtpe/liveabr/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_139",
    "name": "Utsav Plus",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Utsav Plus",
    "url": "https://raw.githubusercontent.com/amazeyourself/adaptive-streams/refs/heads/main/streams/gb/YuppTV/UtsavPlus.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_140",
    "name": "Utsav Bharat",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Utsav Bharat",
    "url": "https://d1taaads3ztvmu.cloudfront.net/120723/smil:lifeokuk.smil/playlist.m3u8?hdnts=st=1735898689~exp=1835898688~acl=*~hmac=f5fe24724fe05481e3841f9eb5ab8efdee0a3dd83645ae9dcf45703f525bab7b",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_141",
    "name": "Ishwar Bhakti TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Ishwar Bhakti TV",
    "url": "https://6n3yow8pl9ok-hls-live.5centscdn.com/ishwartvlive/tv.stream/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_142",
    "name": "Mercy TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Mercy TV",
    "url": "https://5dd3981940faa.streamlock.net/mercytv/mercytv/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_143",
    "name": "Kaumudy TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Kaumudy TV",
    "url": "https://oqgdrkxby4rm-hls-live.5centscdn.com/kaumudytv/live.stream/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_144",
    "name": "like Gecko) Chrome/130.0.0.0 Safari/537.36\" group-title=\"Sports\",Unite8 Sports 1",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of like Gecko) Chrome/130.0.0.0 Safari/537.36\" group-title=\"Sports\",Unite8 Sports 1",
    "url": "http://59.103.38.46:8000/play/a125/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_145",
    "name": "MH One Shraddha",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of MH One Shraddha",
    "url": "https://mumt01.tangotv.in/O5aw8Zn3MHONESHRADDHA/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_146",
    "name": "Hyder TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Hyder TV",
    "url": "https://cdn.live247stream.com/hyder/tv/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_147",
    "name": "MTA2 Europe",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of MTA2 Europe",
    "url": "https://chlivemta1.akamaized.net/hls/live/2008145/mta2/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_148",
    "name": "WOW Kidz",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of WOW Kidz",
    "url": "https://yuppparoriglin.akamaized.net/181224/smil:wowkidzhindi.smil/playlist.m3u8?hdnts=st=1735898689~exp=1835898688~acl=*~hmac=f5fe24724fe05481e3841f9eb5ab8efdee0a3dd83645ae9dcf45703f525bab7b",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_149",
    "name": "Namdhari [Not 24/7]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Namdhari [Not 24/7]",
    "url": "https://namdhari.tv/live/sbs1.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_150",
    "name": "Nagaland TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Nagaland TV",
    "url": "https://mumt06.tangotv.in/qYyB8fXVNAGALANDTV/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_151",
    "name": "Music India [Not 24/7]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Music & Songs",
    "quality": "720p HD",
    "description": "Live online broadcast of Music India [Not 24/7]",
    "url": "https://cdn-2.pishow.tv/live/226/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_152",
    "name": "Zee Cinema",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Zee Cinema",
    "url": "https://d1g8wgjurz8via.cloudfront.net/bpk-tv/NGCHD/default/NGCHD.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_153",
    "name": "Zee Business",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Zee Business",
    "url": "https://dwby15d04agvq.cloudfront.net/index_5.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_154",
    "name": "Weatherspy",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Weatherspy",
    "url": "https://jukin-weatherspy-2-in.samsung.wurl.tv/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_155",
    "name": "Zee Bharat",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Zee Bharat",
    "url": "https://vg-zeefta.akamaized.net/ptnr-yupptv/title-zeehindustan/v1/master/611d79b11b77e2f571934fd80ca1413453772ac7/96bbab12-582e-4540-af70-510ab6824581/main.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_156",
    "name": "Zee Cine Classic",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Zee Cine Classic",
    "url": "https://amg00862-amg00862c8-amgplt0173.playout.now3.amagi.tv/playlist/amg00862-amg00862c8-amgplt0173/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_157",
    "name": "Zee Comedy Nation",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Zee Comedy Nation",
    "url": "https://amg00862-amg00862c5-amgplt0173.playout.now3.amagi.tv/playlist/amg00862-amg00862c5-amgplt0173/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_158",
    "name": "Zee Dil Se",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Zee Dil Se",
    "url": "https://amg00862-amg00862c6-amgplt0173.playout.now3.amagi.tv/playlist/amg00862-amg00862c6-amgplt0173/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_159",
    "name": "Zee Uttar Pradesh/Uttarakhand",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Zee Uttar Pradesh/Uttarakhand",
    "url": "https://duw35ict5q7th.cloudfront.net/index_3.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_160",
    "name": "Zee News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Zee News",
    "url": "https://dknttpxmr0dwf.cloudfront.net/index_57.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_161",
    "name": "MTA7 Asia",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of MTA7 Asia",
    "url": "https://livemtaasia.akamaized.net/hls/live/2039224/mtaasia2/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_162",
    "name": "Zee Delhi NCR Haryana",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Zee Delhi NCR Haryana",
    "url": "https://vg-zeefta.akamaized.net/ptnr-yupptv/title-zeedelhincr/v1/master/611d79b11b77e2f571934fd80ca1413453772ac7/cc483a15-1b39-4642-872d-5d08d362ed01/main.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_163",
    "name": "Zee Horror Nights",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Zee Horror Nights",
    "url": "https://amg00862-amg00862c7-amgplt0173.playout.now3.amagi.tv/playlist/amg00862-amg00862c7-amgplt0173/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_164",
    "name": "Zee Madhya Pradesh Chhattisgarh",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Zee Madhya Pradesh Chhattisgarh",
    "url": "https://vg-zeefta.akamaized.net/ptnr-yupptv/title-zeemadhyachhattisgarh/v1/master/611d79b11b77e2f571934fd80ca1413453772ac7/2ab17056-6187-4f0e-a34d-f436ac479d6c/main.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_165",
    "name": "YRF Music",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Music & Songs",
    "quality": "1080p FHD",
    "description": "Live online broadcast of YRF Music",
    "url": "https://cdn-uw2-prod.tsv2.amagi.tv/linear/amg01412-xiaomiasia-yrfmusic-xiaomi/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_166",
    "name": "Zee Rajasthan",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Zee Rajasthan",
    "url": "https://vg-zeefta.akamaized.net/ptnr-yupptv/title-zeerajashthannews/v1/master/611d79b11b77e2f571934fd80ca1413453772ac7/8e864b9a-1681-41a0-99a6-387490bc5b24/main.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_167",
    "name": "9XM",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of 9XM",
    "url": "https://epiconvh.akamaized.net/live/9XM/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_168",
    "name": "Zoom",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Music & Songs",
    "quality": "720p HD",
    "description": "Live online broadcast of Zoom",
    "url": "https://dai.google.com/linear/hls/event/JCAm25qkRXiKcK1AJMlvKQ/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_169",
    "name": "9XM",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of 9XM",
    "url": "https://b.jsrdn.com/strm/channels/9xm/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_170",
    "name": "Zee South Flix",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Zee South Flix",
    "url": "https://amg00862-amg00862c9-amgplt0173.playout.now3.amagi.tv/playlist/amg00862-amg00862c9-amgplt0173/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_171",
    "name": "Aaj Tak",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Aaj Tak",
    "url": "https://aajtaklive-amd.akamaized.net/hls/live/2014416/aajtak/aajtaklive/live_404p/chunks.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_172",
    "name": "Aamar Bangla",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Aamar Bangla",
    "url": "https://app.ncare.live/c3VydmVyX8RpbEU9Mi8xNy8yMDE0GIDU6RgzQ6NTAgdEoaeFzbF92YWxIZTO0U0ezN1IzMyfvcGVMZEJCTEFWeVN3PTOmdFsaWRtaW51aiPhnPTI/amarbanglatv.stream/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_173",
    "name": "Aaj Tak",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Aaj Tak",
    "url": "https://d1rc86nwwc9fag.cloudfront.net/vglive-sk-791258/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_174",
    "name": "Aastha Telugu",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Aastha Telugu",
    "url": "https://aasthaott.akamaized.net/110923/smil:aasthatelugu.smil/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_175",
    "name": "Zee Cinema ME [Geo-blocked]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Zee Cinema ME [Geo-blocked]",
    "url": "https://ev-eu-hw-fast-mpd.starzplayarabia.com/Zee_Cinema/dash/drm/index.mpd",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_176",
    "name": "ABP Ananda",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of ABP Ananda",
    "url": "https://d2l4ar6y3mrs4k.cloudfront.net/live-streaming/ananda-livetv/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_177",
    "name": "Aastha Bhajan",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Aastha Bhajan",
    "url": "https://aasthaott.akamaized.net/110923/smil:bhajan.smil/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_178",
    "name": "Aastha Gujarati",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Aastha Gujarati",
    "url": "https://aasthaott.akamaized.net/110923/smil:aasthagujrati.smil/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_179",
    "name": "Aastha Tamil",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Aastha Tamil",
    "url": "https://aasthaott.akamaized.net/110923/smil:aasthatamil.smil/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_180",
    "name": "ABP Asmita",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of ABP Asmita",
    "url": "https://d2l4ar6y3mrs4k.cloudfront.net/live-streaming/asmita-livetv/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_181",
    "name": "ABP Majha",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of ABP Majha",
    "url": "https://yupprestreamliveus.akamaized.net/vglive-sk-355289/majha/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_182",
    "name": "ABP News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Live online broadcast of ABP News",
    "url": "https://d2l4ar6y3mrs4k.cloudfront.net/live-streaming/abpnews-livetv/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_183",
    "name": "Amrita TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Amrita TV",
    "url": "https://ddash74r36xqp.cloudfront.net/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_184",
    "name": "Angel TV Africa",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Angel TV Africa",
    "url": "https://janya-digimix.akamaized.net/vglive-sk-904559/africa/ngrp:angelafrica_all/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_185",
    "name": "Angel TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Angel TV",
    "url": "https://janya-digimix.akamaized.net/vglive-sk-394914/india/ngrp:angelindia_all/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_186",
    "name": "Angel TV America",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Angel TV America",
    "url": "https://janya-digimix.akamaized.net/vglive-sk-374850/america/ngrp:angelamerica_all/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_187",
    "name": "Angel TV Arabia",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Angel TV Arabia",
    "url": "https://janya-digimix.akamaized.net/vglive-sk-213167/arabia/ngrp:angelarabia_all/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_188",
    "name": "Angel TV Australia",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Angel TV Australia",
    "url": "https://janya-digimix.akamaized.net/vglive-sk-310787/australia/ngrp:angelaustralia_all/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_189",
    "name": "Angel TV Chinese",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Angel TV Chinese",
    "url": "https://janya-digimix.akamaized.net/vglive-sk-999451/chinese/ngrp:angelchinese_all/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_190",
    "name": "Angel TV Europe",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Angel TV Europe",
    "url": "https://janya-digimix.akamaized.net/vglive-sk-512011/europe/ngrp:angeleurope_all/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_191",
    "name": "Angel TV Hebrew",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Angel TV Hebrew",
    "url": "https://janya-digimix.akamaized.net/vglive-sk-150533/hebrew/ngrp:angelhebrew_all/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_192",
    "name": "Angel TV Nepal",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Angel TV Nepal",
    "url": "https://janya-digimix.akamaized.net/vglive-sk-109639/nepali/ngrp:angelnepali_all/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_193",
    "name": "Angel TV Indonesia",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Angel TV Indonesia",
    "url": "https://janya-digimix.akamaized.net/vglive-sk-234616/indonesia/ngrp:angelindonesia_all/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_194",
    "name": "Angel TV Indo-China",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Angel TV Indo-China",
    "url": "https://janya-digimix.akamaized.net/vglive-sk-703035/indochina/ngrp:angelindochina_all/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_195",
    "name": "Angel TV FarEast",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Angel TV FarEast",
    "url": "https://janya-digimix.akamaized.net/vglive-sk-438760/fareast/ngrp:angelfareast_all/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_196",
    "name": "AmarUjala",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of AmarUjala",
    "url": "https://amarujala.ottlive.co.in/amarujala/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_197",
    "name": "Angel TV Portuguese",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Angel TV Portuguese",
    "url": "https://janya-digimix.akamaized.net/vglive-sk-382409/portuese/ngrp:angelportuguese_all/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_198",
    "name": "Angel TV Russian",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Angel TV Russian",
    "url": "https://janya-digimix.akamaized.net/vglive-sk-955415/russia/ngrp:angelrussia_all/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_199",
    "name": "Angel TV Spanish",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Angel TV Spanish",
    "url": "https://janya-digimix.akamaized.net/vglive-sk-351398/spanish/ngrp:angelspanish_all/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_200",
    "name": "Tehzeeb TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Tehzeeb TV",
    "url": "https://cdn-4.pishow.tv/live/239/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_201",
    "name": "News Daily 24",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of News Daily 24",
    "url": "https://cdn-6.pishow.tv/live/10009/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_202",
    "name": "News India 24x7",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of News India 24x7",
    "url": "https://cdn-3.pishow.tv/live/273/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_203",
    "name": "News 24 MP & Chhattisgarh",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of News 24 MP & Chhattisgarh",
    "url": "https://mumt04.tangotv.in/m18aqlK4NEWS24MPCG/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_204",
    "name": "Network 10",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Network 10",
    "url": "https://mumt01.tangotv.in/O5aw8Zn3NETWORK10/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_205",
    "name": "News 1 India",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of News 1 India",
    "url": "https://mumt07.tangotv.in/zHjX9OFlNEWS1INDIA/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_206",
    "name": "Paras Gold",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Paras Gold",
    "url": "https://mumt04.tangotv.in/m18aqlK4PARASGOLD/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_207",
    "name": "Aastha Kannada",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Aastha Kannada",
    "url": "https://aasthaott.akamaized.net/110923/smil:aasthakannada.smil/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_208",
    "name": "Raftaar Media",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Raftaar Media",
    "url": "https://mumt04.tangotv.in/m18aqlK4RAFTAARMEDIA/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_209",
    "name": "Sansad TV 1",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Sansad TV 1",
    "url": "https://playhls.media.nic.in/hls/live/lstv/lstv.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_210",
    "name": "Saam TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Saam TV",
    "url": "https://cdn-3.pishow.tv/live/437/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_211",
    "name": "Sadhna News Madhya Pradesh/Chhattisgarh",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of Sadhna News Madhya Pradesh/Chhattisgarh",
    "url": "https://mumt04.tangotv.in/m18aqlK4SADHNEWSPMRAJ/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_212",
    "name": "Sadhna TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Sadhna TV",
    "url": "https://mumt05.tangotv.in/87NeALx2SADHNATV/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_213",
    "name": "Arputhar Yesu TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Arputhar Yesu TV",
    "url": "https://account33.livebox.co.in/jesushelpshls/live.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_214",
    "name": "Asianet Suvarna News [Not 24/7]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Asianet Suvarna News [Not 24/7]",
    "url": "https://asianetnews.vgcdn.net/vglive-sk-335835/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_215",
    "name": "like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0\" group-title=\"News\",Northeast Live",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "720p HD",
    "description": "Live online broadcast of like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0\" group-title=\"News\",Northeast Live",
    "url": "https://server.thelegitpro.in/northeastlive/northeastlive/index.fmp4.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_216",
    "name": "Asianet News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of Asianet News",
    "url": "https://asianetnews.vgcdn.net/vglive-sk-917600/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_217",
    "name": "Samachar Plus 24x7",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Samachar Plus 24x7",
    "url": "https://mumt05.tangotv.in/87NeALx2VERTENTSAMACHARPLUS/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_218",
    "name": "Rongeen TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Rongeen TV",
    "url": "https://server.thelegitpro.in/rongeentv/rongeentv/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_219",
    "name": "Asianet News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Asianet News",
    "url": "https://amg13737-amg13737c1-amgplt0016.playout.now3.amagi.tv/playlist/amg13737-amg13737c1-amgplt0016/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_220",
    "name": "Bharat Samachar",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Bharat Samachar",
    "url": "https://d1msejlow1t3l4.cloudfront.net/fta/bharatsamachar/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_221",
    "name": "Sansad TV 2",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Sansad TV 2",
    "url": "https://cdn-2.pishow.tv/live/39/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_222",
    "name": "Sharnam TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Sharnam TV",
    "url": "https://mumt06.tangotv.in/qYyB8fXVSHARNAMTV/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_223",
    "name": "Santvani Channel",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Santvani Channel",
    "url": "https://cdn-2.pishow.tv/live/475/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_224",
    "name": "Bharat Samachar",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Bharat Samachar",
    "url": "https://idvd.multitvsolution.com/idvo/bharatsamachar.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_225",
    "name": "Bhojpuri Cinema",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Bhojpuri Cinema",
    "url": "https://live-bhojpuri.akamaized.net/liveabr/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_226",
    "name": "Bharat Express",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Bharat Express",
    "url": "https://stream1.livebox.co.in/VCAREhls/live.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_227",
    "name": "Asianet News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Asianet News",
    "url": "https://asianet-samsung.vgcdn.net/ptnr-monitoring/vglive-sk-906908/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_228",
    "name": "Big TV 24x7 (576i)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Big TV 24x7 (576i)",
    "url": "https://d2gvyg6lvauoko.cloudfront.net/230226/bigtvmalyalam/chunks.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_229",
    "name": "Big TV 24x7 (576i)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Big TV 24x7 (576i)",
    "url": "https://d2gvyg6lvauoko.cloudfront.net/230226/bigtvmalyalam/playlist.m3u8?hdnts=st=1735898689~exp=1835898688~acl=*~hmac=f5fe24724fe05481e3841f9eb5ab8efdee0a3dd83645ae9dcf45703f525bab7b",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_230",
    "name": "B4U Bhojpuri",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of B4U Bhojpuri",
    "url": "https://cdnb4u.wiseplayout.com/B4U_Bhojpuri/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_231",
    "name": "Ayush TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Ayush TV",
    "url": "https://cdn-6.pishow.tv/live/221/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_232",
    "name": "Soham TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Soham TV",
    "url": "https://mumt03.tangotv.in/Dsly5z3HSOHAMTV/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_233",
    "name": "CNBC TV18",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of CNBC TV18",
    "url": "https://n18syndication.akamaized.net/bpk-tv/CNBC_TV18_NW18_MOB/output01/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_234",
    "name": "News 24",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "720p HD",
    "description": "Live online broadcast of News 24",
    "url": "https://vidcdn.vidgyor.com/news24-origin/liveabr/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_235",
    "name": "CNBC Bajar",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of CNBC Bajar",
    "url": "https://n18syndication.akamaized.net/bpk-tv/CNBC_Bazaar_NW18_MOB/output01/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_236",
    "name": "CNBC TV18 Prime HD",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of CNBC TV18 Prime HD",
    "url": "https://n18syndication.akamaized.net/bpk-tv/CNBC_Tv18_Prime_HD_NW18_MOB/output01/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_237",
    "name": "Chardikla Gurbaani TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Chardikla Gurbaani TV",
    "url": "https://chardikalatimestv.gigabitcdn.net/in-chardikala/chardikala-gurbani-tv/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_238",
    "name": "Chardikla Time TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Chardikla Time TV",
    "url": "https://chardikalagurbanitv.gigabitcdn.net/in-chardikala/chardikala-timetv/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_239",
    "name": "Chardikla Time TV North America",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Chardikla Time TV North America",
    "url": "https://chardikalanorthamerica.gigabitcdn.net/in-chardikala/chardikala-north-usa/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_240",
    "name": "Sudarshan News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Sudarshan News",
    "url": "https://ott.livelegitpro.in/sudarshannews/sudarshannews/tracks-v1/index.fmp4.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_241",
    "name": "Subharti TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Subharti TV",
    "url": "https://mumt04.tangotv.in/m18aqlK4SUBHARTITV/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_242",
    "name": "Sadhna Plus News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "720p HD",
    "description": "Live online broadcast of Sadhna Plus News",
    "url": "https://6n3yow8pl9ok-hls-live.5centscdn.com/sadhananewstv/live.stream/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_243",
    "name": "Star Sports 2 Hindi",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Star Sports 2 Hindi",
    "url": "https://tvsen5.aynaott.com/cXPB2LKkErN9/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_244",
    "name": "Sadhna",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Sadhna",
    "url": "https://6n3yow8pl9ok-hls-live.5centscdn.com/sadhanalivetv/live.stream/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_245",
    "name": "Dangal 2",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Dangal 2",
    "url": "https://live-dangal2.akamaized.net/liveabr/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_246",
    "name": "Swaraj Express SMBC [Not 24/7]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Swaraj Express SMBC [Not 24/7]",
    "url": "https://cdn-2.pishow.tv/live/477/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_247",
    "name": "Steelbird Music [Not 24/7]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Music & Songs",
    "quality": "720p HD",
    "description": "Live online broadcast of Steelbird Music [Not 24/7]",
    "url": "https://cdn2.in/SteelbirdMusicTVhls/live.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_248",
    "name": "Dangal TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Dangal TV",
    "url": "https://live-dangal.akamaized.net/liveabr/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_249",
    "name": "Shubhsandesh TV [Not 24/7]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Shubhsandesh TV [Not 24/7]",
    "url": "https://6284rn2xr7xv-hls-live.wmncdn.net/shubhsandeshtv1/live123.stream/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_250",
    "name": "Sony KAL Hindi",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Sony KAL Hindi",
    "url": "https://wurlsonypicturestv.global.transmit.live/hls/68deeb1c0238cda82df543dd/v1/spt_sonykal_1/lg_us/latest/main/hls/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_251",
    "name": "DD India",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of DD India",
    "url": "https://d2gvyg6lvauoko.cloudfront.net/230226/ddindia/chunks.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_252",
    "name": "9X Jhakaas",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of 9X Jhakaas",
    "url": "https://amg01281-9xmediapvtltd-9xjhakaas-samsungin-ci2cs.amagi.tv/playlist/amg01281-9xmediapvtltd-9xjhakaas-samsungin/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_253",
    "name": "9X Tashan",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of 9X Tashan",
    "url": "https://amg01281-9xmediapvtltd-9xtashan-samsungin-xz1sd.amagi.tv/playlist/amg01281-9xmediapvtltd-9xtashan-samsungin/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_254",
    "name": "Sony Wah [Geo-blocked]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Sony Wah [Geo-blocked]",
    "url": "https://sl.vodep39240327.workers.dev/channel/SONY+WAH.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_255",
    "name": "Sony Pix HD [Geo-blocked]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Sony Pix HD [Geo-blocked]",
    "url": "https://sl.vodep39240327.workers.dev/channel/SONY+PIX+HD.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_256",
    "name": "SVBC 4",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of SVBC 4",
    "url": "https://player.mslivestream.net/mslive/13a2927187b9700ae7ea82d7841d5b68.sdp/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_257",
    "name": "Colors Tamil HD",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Colors Tamil HD",
    "url": "https://da86m1sqpm3o0.cloudfront.net/28072023/smil:colorstamilhd11.smil/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_258",
    "name": "Dharsan TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Dharsan TV",
    "url": "https://cable91tataplay.akamaized.net/live/dharshantv/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_259",
    "name": "The Movie Club +2",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of The Movie Club +2",
    "url": "https://d3gnyty2vddhsg.cloudfront.net/v1/master/3722c60a815c199d9c0ef36c5b73da68a62b09d1/pb-ytipwjqub3kf8/TMC2_IN.m3u8?ads.ads_cdn=cf&ads.cdn=cf",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_260",
    "name": "ET Now [Geo-blocked]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of ET Now [Geo-blocked]",
    "url": "https://dztlhgid9me95.cloudfront.net/live-tv/Vidgyor/etnow/etnow_master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_261",
    "name": "Swadesh News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "720p HD",
    "description": "Live online broadcast of Swadesh News",
    "url": "https://cdn-2.pishow.tv/live/465/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_262",
    "name": "The Movie Club",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of The Movie Club",
    "url": "https://sis-global.prod.samsungtv.plus/v1/tvpprd/sc-mp2ar4ca425xo.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_263",
    "name": "TAG TV [Not 24/7]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of TAG TV [Not 24/7]",
    "url": "http://cdn11.live247stream.com/tag/tv/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_264",
    "name": "ETV Cinema",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of ETV Cinema",
    "url": "https://yupplivegcpusa.yuppcdn.net/100823/smil:etvcinema.smil/playlist.m3u8?hdnts=st=1735898689~exp=1835898688~acl=*~hmac=f5fe24724fe05481e3841f9eb5ab8efdee0a3dd83645ae9dcf45703f525bab7b",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_265",
    "name": "TNP News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Live online broadcast of TNP News",
    "url": "https://server.thelegitpro.in/tnpnews/tnpnews/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_266",
    "name": "Total TV Haryana",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Total TV Haryana",
    "url": "https://cdn-2.pishow.tv/live/1522/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_267",
    "name": "ETV Andhra Pradesh",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of ETV Andhra Pradesh",
    "url": "https://d1g35elx8qnif3.cloudfront.net/v1/master/9d43eacaed199f8d5883927e7aef514a8a08e108/ETV_AP_H264_cloud_in/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_268",
    "name": "DocuBay TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of DocuBay TV",
    "url": "https://cc-mgr91yrk4pehy.akamaized.net/v1/master/3722c60a815c199d9c0ef36c5b73da68a62b09d1/cc-mgr91yrk4pehy/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_269",
    "name": "ETV Abhiruchi",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of ETV Abhiruchi",
    "url": "https://dg3721c3ez5m0.cloudfront.net/v1/master/9d43eacaed199f8d5883927e7aef514a8a08e108/ETV_ABHIRUCHI_H264_cloud-in/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_270",
    "name": "ETV Plus",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of ETV Plus",
    "url": "https://yupplivegcpusa.yuppcdn.net/100823/smil:etvplus.smil/playlist.m3u8?hdnts=st=1735898689~exp=1835898688~acl=*~hmac=f5fe24724fe05481e3841f9eb5ab8efdee0a3dd83645ae9dcf45703f525bab7b",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_271",
    "name": "ETV Cinema HD",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of ETV Cinema HD",
    "url": "https://d27zlkxhgwrfgo.cloudfront.net/v1/master/9d43eacaed199f8d5883927e7aef514a8a08e108/ETV_CINEMA_H264_cloud_in/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_272",
    "name": "ETV Telugu HD",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of ETV Telugu HD",
    "url": "https://d27zlkxhgwrfgo.cloudfront.net/v1/master/9d43eacaed199f8d5883927e7aef514a8a08e108/ETV_HD_H264_cloud_in/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_273",
    "name": "ETV Plus HD",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of ETV Plus HD",
    "url": "https://d12ee3o8yfkkhd.cloudfront.net/c6a4b411295f47f48c908d2ac0605bad/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_274",
    "name": "ETV Music",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Music & Songs",
    "quality": "1080p FHD",
    "description": "Live online broadcast of ETV Music",
    "url": "https://cc-szivnms4rlah6.akamaized.net/WWBI/Amagi/ETV_Music_IN/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_275",
    "name": "ETV Life",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of ETV Life",
    "url": "https://d2cj1h11htct8o.cloudfront.net/v1/master/9d43eacaed199f8d5883927e7aef514a8a08e108/ETV_LIFE_H264_cloud_in/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_276",
    "name": "ETV Telugu USA",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of ETV Telugu USA",
    "url": "https://livegeorouus.akamaized.net/100823/etvhd_2500/playlist.m3u8?hdnts=st=1735898689~exp=1835898688~acl=*~hmac=f5fe24724fe05481e3841f9eb5ab8efdee0a3dd83645ae9dcf45703f525bab7b",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_277",
    "name": "ETV Telangana",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of ETV Telangana",
    "url": "https://d37d7pfp7vjqhh.cloudfront.net/v1/master/9d43eacaed199f8d5883927e7aef514a8a08e108/ETV_TS_H264_cloud_in/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_278",
    "name": "Vedic",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Vedic",
    "url": "https://mumt05.tangotv.in/87NeALx2VEDIC/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_279",
    "name": "TBN TV [Not 24/7]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of TBN TV [Not 24/7]",
    "url": "https://live.suricloud.com/hls/tbntv/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_280",
    "name": "Good News Today",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "720p HD",
    "description": "Live online broadcast of Good News Today",
    "url": "https://cc-89m9zu7a2upfe.akamaized.net/hls/live/2016145/gnt/gntlive/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_281",
    "name": "ETV Josh",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of ETV Josh",
    "url": "https://cc-uyh1ow5zouoio.akamaized.net/WWBI/Amagi/ETV_Josh_IN/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_282",
    "name": "ET Now Swadesh",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of ET Now Swadesh",
    "url": "https://d32gxr3r1ksq2p.cloudfront.net/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_283",
    "name": "GTC News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Live online broadcast of GTC News",
    "url": "https://vglivessai.akamaized.net/sg/v1/master/611d79b11b77e2f571934fd80ca1413453772ac7/921cca59-daee-4f89-8c38-7ffe8de44f4c/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_284",
    "name": "Hare Krsna TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Hare Krsna TV",
    "url": "https://airtelapp.shemaroo.com/harekrsnatv/smil:harekrsnatvadp.smil/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_285",
    "name": "GTC Punjabi",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of GTC Punjabi",
    "url": "https://gtc-yupp.vgcdn.net/vglive-sk-254807/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_286",
    "name": "VTU",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of VTU",
    "url": "https://lbgo.bozztv.com/ssh101/ssh101/afghantheatretv/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_287",
    "name": "9X Jhakaas",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of 9X Jhakaas",
    "url": "https://mumt03.tangotv.in/Dsly5z3H9XJHAKAAS/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_288",
    "name": "9X Jalwa",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of 9X Jalwa",
    "url": "https://mumt03.tangotv.in/Dsly5z3H9XJALWA/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_289",
    "name": "7S Music",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Music & Songs",
    "quality": "HD Quality",
    "description": "Live online broadcast of 7S Music",
    "url": "https://mumt03.tangotv.in/Dsly5z3H7SMUSIC/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_290",
    "name": "9X Tashan",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of 9X Tashan",
    "url": "https://mumt01.tangotv.in/O5aw8Zn39XTASHAN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_291",
    "name": "9X Tashan",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of 9X Tashan",
    "url": "https://cdn-2.pishow.tv/live/1613/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_292",
    "name": "Hindi Khabar",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Hindi Khabar",
    "url": "https://d1msejlow1t3l4.cloudfront.net/fta/hindikhabar/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_293",
    "name": "24 News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of 24 News",
    "url": "https://segment.yuppcdn.net/110322/channel24/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_294",
    "name": "Aaj Tak",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Aaj Tak",
    "url": "https://feeds.intoday.in/aajtak/api/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_295",
    "name": "History TV18 HD",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of History TV18 HD",
    "url": "https://raw.githubusercontent.com/amazeyourself/adaptive-streams/refs/heads/main/streams/in/HistoryTV18HD.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_296",
    "name": "Aaj Tak HD",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Aaj Tak HD",
    "url": "https://livehub-voidnet.onrender.com/cluster/streamcore/in/AAJTAK_REDIS.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_297",
    "name": "Hebron TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Hebron TV",
    "url": "https://account20.livebox.co.in/charleshls/live.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_298",
    "name": "10 TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of 10 TV",
    "url": "https://mumbai-edge.smartplaytv.in/10TV/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_299",
    "name": "24 News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of 24 News",
    "url": "https://mumt07.tangotv.in/zHjX9OFlTWENTYFOURNEWS/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_300",
    "name": "History TV18 HD Hindi [Geo-blocked]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of History TV18 HD Hindi [Geo-blocked]",
    "url": "https://amg01448-amg01448c16-samsung-in-3495.playouts.now.amagi.tv/ts-ap-s1-n1/playlist/amg01448-samsungindia-historychannelhindi-samsungin/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_301",
    "name": "Hornbill TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Hornbill TV",
    "url": "https://d1msejlow1t3l4.cloudfront.net/fta/hornbilltv/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_302",
    "name": "Aakaash Aath",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Aakaash Aath",
    "url": "http://tvsen5.aynascope.net/Wm9Lv2RjZGT6/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_303",
    "name": "Aaryaa TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Aaryaa TV",
    "url": "https://stream.ottlive.co.in/aryatvtamil/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_304",
    "name": "Aakaash Aath",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Aakaash Aath",
    "url": "https://mumt03.tangotv.in/Dsly5z3HAAKASHAATH/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_305",
    "name": "Aastha Bhajan",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Aastha Bhajan",
    "url": "https://mumt05.tangotv.in/87NeALx2AASTHABHAJAN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_306",
    "name": "Aaseervatham TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Aaseervatham TV",
    "url": "https://mumt04.tangotv.in/m18aqlK4AASEERVATHAMTV/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_307",
    "name": "Aastha Gujarati",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Aastha Gujarati",
    "url": "https://mumt04.tangotv.in/m18aqlK4AASTHAGUJARATI/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_308",
    "name": "India Today [Not 24/7]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of India Today [Not 24/7]",
    "url": "https://indiatodaylive.akamaized.net/hls/live/2014320/indiatoday/indiatodaylive/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_309",
    "name": "History TV18 HD [Geo-blocked]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of History TV18 HD [Geo-blocked]",
    "url": "https://amg01448-amg01448c16-samsung-in-3495.playouts.now.amagi.tv/playlist/amg01448-samsungindia-historychannelenglish-samsungin/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_310",
    "name": "Aastha Kannada",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Aastha Kannada",
    "url": "https://cdn-3.pishow.tv/live/234/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_311",
    "name": "Jaihind TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Jaihind TV",
    "url": "https://yuppnimrestreammum.akamaized.net/260723/smil:jaihind1.smil/playlist.m3u8?hdnts=st=1735898689~exp=1835898688~acl=*~hmac=f5fe24724fe05481e3841f9eb5ab8efdee0a3dd83645ae9dcf45703f525bab7b",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_312",
    "name": "Aastha",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Aastha",
    "url": "https://cdn-1.pishow.tv/live/1454/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_313",
    "name": "India Today",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of India Today",
    "url": "https://d1rc86nwwc9fag.cloudfront.net/vglive-sk-293160/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_314",
    "name": "ABN Andhra Jyoti",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of ABN Andhra Jyoti",
    "url": "https://mumbai-edge.smartplaytv.in/ABNAJ/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_315",
    "name": "India Today [Geo-blocked]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of India Today [Geo-blocked]",
    "url": "https://amg00644-amg00644c1-ondemandkorea-amesia-10266.playouts.now.amagi.tv/playlist/amg00644-tvtodaynetworkltdfast-indiatoday-ondemandkoreaamesia/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_316",
    "name": "Aastha Telugu",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Aastha Telugu",
    "url": "https://cdn-1.pishow.tv/live/262/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_317",
    "name": "Janam TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Janam TV",
    "url": "https://yuppmedtaorire.akamaized.net/v1/master/a0d007312bfd99c47f76b77ae26b1ccdaae76cb1/janamtv_nim_https/140622/janamtv/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_318",
    "name": "High News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of High News",
    "url": "https://highmedia.livebox.co.in/HIGHNEWShls/LIVE.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_319",
    "name": "AKD Calcutta News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Live online broadcast of AKD Calcutta News",
    "url": "https://live.legitpro.co.in/cnnnews/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_320",
    "name": "Kalaignar Murasu",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Kalaignar Murasu",
    "url": "https://yuppmedtaorire.akamaized.net/v1/master/a0d007312bfd99c47f76b77ae26b1ccdaae76cb1/murasu_nim_https/050522/murasu/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_321",
    "name": "Arputhar Yesu TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Arputhar Yesu TV",
    "url": "https://arputharyesutv.arputharyesutv.com/live/md/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_322",
    "name": "Assam Talks",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Assam Talks",
    "url": "http://tvsen7.aynascope.net/AssamTalks/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_323",
    "name": "Asianet Middle East",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Asianet Middle East",
    "url": "https://mumt03.tangotv.in/Dsly5z3HASIANETMIDDLEEAST/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_324",
    "name": "Balle Balle",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Balle Balle",
    "url": "https://cdn-4.pishow.tv/live/987/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_325",
    "name": "B4U Kadak",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of B4U Kadak",
    "url": "https://cdn-2.pishow.tv/live/227/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_326",
    "name": "B4U Movies",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of B4U Movies",
    "url": "https://cdn-2.pishow.tv/live/419/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_327",
    "name": "Khabrain Abhi Tak",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Khabrain Abhi Tak",
    "url": "https://d1msejlow1t3l4.cloudfront.net/fta/khabreinabhitak/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_328",
    "name": "BT TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of BT TV",
    "url": "https://feeds.intoday.in/bttv/itgd.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_329",
    "name": "Bhojpuri Cinema",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Bhojpuri Cinema",
    "url": "https://cdn-4.pishow.tv/live/1033/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_330",
    "name": "Bharat Express",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Bharat Express",
    "url": "https://cdn-2.pishow.tv/live/1139/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_331",
    "name": "Brio TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Brio TV",
    "url": "https://mumt03.tangotv.in/Dsly5z3HBRIOTV/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_332",
    "name": "JTBS Classic",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of JTBS Classic",
    "url": "https://jtbsclassic.dpdns.org/live.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_333",
    "name": "Chardikla Time TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Chardikla Time TV",
    "url": "https://cdn-4.pishow.tv/live/1627/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_334",
    "name": "Madhimugam TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Madhimugam TV",
    "url": "https://yuppparoriglin.akamaized.net/181224/smil:mathimugam.smil/playlist.m3u8?hdnts=st=1735898689~exp=1835898688~acl=*~hmac=f5fe24724fe05481e3841f9eb5ab8efdee0a3dd83645ae9dcf45703f525bab7b",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_335",
    "name": "Gulistan News [Not 24/7]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "720p HD",
    "description": "Live online broadcast of Gulistan News [Not 24/7]",
    "url": "https://live.gulistannews.in/hls/gul.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_336",
    "name": "Life TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Life TV",
    "url": "https://lifetv.livebox.co.in/lifetvhls/lifetv.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_337",
    "name": "Joy TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Joy TV",
    "url": "https://ktismaservers.in:3412/live/joytvlive.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_338",
    "name": "Mango Mobile TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Mango Mobile TV",
    "url": "https://amg01911-mangotv-amg01911c1-xiaomi-in-1270.playouts.now.amagi.tv/playlist/amg01911-mangomassmedia-mangotv-xiaomiin/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_339",
    "name": "CTVN AKD Plus",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of CTVN AKD Plus",
    "url": "https://live.legitpro.co.in/ctvnakdplus/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_340",
    "name": "Ayush TV [Not 24/7]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Ayush TV [Not 24/7]",
    "url": "https://95eryw39dwn4-hls-live.wmncdn.net/Ayushu/271ddf829afeece44d8732757fba1a66.sdp/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_341",
    "name": "KCL TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of KCL TV",
    "url": "https://kcltv.livebox.co.in/kclhls/live.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_342",
    "name": "CCV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of CCV",
    "url": "https://5a1178b42cc03.streamlock.net/8212/8212/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_343",
    "name": "DD Arun Prabha",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of DD Arun Prabha",
    "url": "https://cdn-4.pishow.tv/live/32/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_344",
    "name": "DD Bangla",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of DD Bangla",
    "url": "https://cdn-4.pishow.tv/live/37/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_345",
    "name": "DD Chandana",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of DD Chandana",
    "url": "https://cdn-3.pishow.tv/live/28/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_346",
    "name": "Mathrubhumi News [Not 24/7]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of Mathrubhumi News [Not 24/7]",
    "url": "https://yuppmedtaorire.akamaized.net/v1/master/a0d007312bfd99c47f76b77ae26b1ccdaae76cb1/mathrubhuminews_nim_https/110322/mathrubhuminews/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_347",
    "name": "DD Malayalam",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of DD Malayalam",
    "url": "https://cdn-3.pishow.tv/live/27/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_348",
    "name": "Mazhavil Manorama",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Mazhavil Manorama",
    "url": "https://yuppmedtaorire.akamaized.net/v1/master/a0d007312bfd99c47f76b77ae26b1ccdaae76cb1/mazhavilmanorama_nim_https/050522/mazhavilmanorama/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_349",
    "name": "DD Jharkhand",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of DD Jharkhand",
    "url": "https://cdn-1.pishow.tv/live/1617/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_350",
    "name": "Manorama News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Manorama News",
    "url": "https://mmtvnews1.akamaized.net/v1/master/673630b269b766886555eebfddd4f27f3de3ab50/mmtvNewsCampaign1/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_351",
    "name": "DD National HD",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of DD National HD",
    "url": "https://mumt01.tangotv.in/O5aw8Zn3DDNATIONALHD/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_352",
    "name": "DD Sahyadri",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of DD Sahyadri",
    "url": "https://cdn-3.pishow.tv/live/30/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_353",
    "name": "DD Punjabi",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of DD Punjabi",
    "url": "https://cdn-4.pishow.tv/live/24/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_354",
    "name": "Malai Murasu TV [Geo-blocked]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Malai Murasu TV [Geo-blocked]",
    "url": "https://amg17783-amg17783c1-amgplt0173.playout.now3.amagi.tv/playlist/amg17783-amg17783c1-amgplt0173/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_355",
    "name": "DD News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of DD News",
    "url": "https://cdn-2.pishow.tv/live/12/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_356",
    "name": "Divyavani TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Divyavani TV",
    "url": "https://mumbai-edge.smartplaytv.in/Divyavani/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_357",
    "name": "DY 365",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of DY 365",
    "url": "https://cdn.smartstream.video/smartstream-us/dy365/dy365/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_358",
    "name": "Mathrubhumi News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of Mathrubhumi News",
    "url": "https://mathrubhumicdn.vidgyor.com/mathrubhumi-origin/liveabr/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_359",
    "name": "Mh 1 News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of Mh 1 News",
    "url": "https://livestream.jswk.online/mhonenews/live/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_360",
    "name": "DD Tamil HD",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of DD Tamil HD",
    "url": "https://cdn-2.pishow.tv/live/26/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_361",
    "name": "NDTV 24x7",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of NDTV 24x7",
    "url": "https://raw.githubusercontent.com/amazeyourself/adaptive-streams/refs/heads/main/streams/in/YuppTV/NDTV24x7.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_362",
    "name": "NDTV Good Times",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of NDTV Good Times",
    "url": "https://d2gvyg6lvauoko.cloudfront.net/230226/ndtvgoodtimes/chunks.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_363",
    "name": "NDTV India",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of NDTV India",
    "url": "https://raw.githubusercontent.com/amazeyourself/adaptive-streams/refs/heads/main/streams/in/YuppTV/NDTVIndia.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_364",
    "name": "NDTV 24X7 [Not 24/7]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of NDTV 24X7 [Not 24/7]",
    "url": "https://ndtv24x7elemarchana.akamaized.net/hls/live/2003678/ndtv24x7/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_365",
    "name": "Mirror Now",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Mirror Now",
    "url": "https://pubads.g.doubleclick.net/ssai/event/DXkHhH2QSnma-HnE3QJqlA/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_366",
    "name": "Nepal 1",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Nepal 1",
    "url": "https://d1msejlow1t3l4.cloudfront.net/fta/nepal1/chunks.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_367",
    "name": "Ekamra Bharat Odia",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Ekamra Bharat Odia",
    "url": "https://live.ekamraott.com/bharat/bharat/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_368",
    "name": "NDTV Profit",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of NDTV Profit",
    "url": "https://ndtvprofit.akamaized.net/hls/live/2107404/ndtvprofit/master_1.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_369",
    "name": "NDTV Profit",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of NDTV Profit",
    "url": "https://ndtvprofit.akamaized.net/hls/live/2107404/ndtvprofit/chunklist_5.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_370",
    "name": "NDTV Marathi",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of NDTV Marathi",
    "url": "https://web-ndtv-marathi.akamaized.net/hls/live/2110470/ndtvmarathi/master_1.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_371",
    "name": "MNTV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of MNTV",
    "url": "https://mntv.livebox.co.in/mntvhls/live.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_372",
    "name": "Enterr 10 Bangla",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Enterr 10 Bangla",
    "url": "https://cdn-4.pishow.tv/live/241/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_373",
    "name": "Mirror Now",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Mirror Now",
    "url": "https://dai.google.com/linear/hls/event/ClPOullTQky5vGPf7fMZ8g/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_374",
    "name": "News 1 India",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of News 1 India",
    "url": "https://d1msejlow1t3l4.cloudfront.net/fta/news1india/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_375",
    "name": "Epic Bhojpuri",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Epic Bhojpuri",
    "url": "https://mumt01.tangotv.in/O5aw8Zn3EPICBHOJPURI/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_376",
    "name": "News18 Kerala [Geo-blocked]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Live online broadcast of News18 Kerala [Geo-blocked]",
    "url": "https://nw18live.cdn.jio.com/bpk-tv/News18_Kerala_NW18_MOB/output01/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_377",
    "name": "News18 Kannada",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Live online broadcast of News18 Kannada",
    "url": "https://n18syndication.akamaized.net/bpk-tv/News18_Kannada_NW18_MOB/output01/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_378",
    "name": "News18 Gujarati",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Live online broadcast of News18 Gujarati",
    "url": "https://n18syndication.akamaized.net/bpk-tv/News18_Gujarati_NW18_MOB/output01/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_379",
    "name": "News18 Assam North-East",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Live online broadcast of News18 Assam North-East",
    "url": "https://n18syndication.akamaized.net/bpk-tv/News18_Assam_North_East_NW18_MOB/output01/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_380",
    "name": "News18 Marathi",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Live online broadcast of News18 Marathi",
    "url": "https://n18syndication.akamaized.net/bpk-tv/News18_Lokmat_NW18_MOB/output01/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_381",
    "name": "News9Live",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Live online broadcast of News9Live",
    "url": "https://amg01106-amg01106c3-amgplt0844.playout.now3.amagi.tv/ts-ap-s1-n1/playlist/amg01106-amg01106c3-amgplt0844/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_382",
    "name": "VIP News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of VIP News",
    "url": "https://live.vipnews24x7.co.in/vipnews24x7/d0dbe915091d400bd8ee7f27f0791303.sdp/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_383",
    "name": "News9Live",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "720p HD",
    "description": "Live online broadcast of News9Live",
    "url": "https://vg-tv9yupp.vgcdn.net/vglive-sk-526536/v1/019e01ace8511ea540a871e333268/019e01ad3da31ea55784752988551/main.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_384",
    "name": "News18 Bangla",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Live online broadcast of News18 Bangla",
    "url": "https://n18syndication.akamaized.net/bpk-tv/News18_Bangla_NW18_MOB/output01/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_385",
    "name": "News18 Kerala",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Live online broadcast of News18 Kerala",
    "url": "https://n18syndication.akamaized.net/bpk-tv/News18_Kerala_NW18_MOB/output01/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_386",
    "name": "Desi Channel",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Desi Channel",
    "url": "https://livestream.unlimitedcdn.com/agm-dc/desi-channel/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_387",
    "name": "News18 Odia",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Live online broadcast of News18 Odia",
    "url": "https://n18syndication.akamaized.net/bpk-tv/News18_Odia_NW18_MOB/output01/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_388",
    "name": "ETV Comedy",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of ETV Comedy",
    "url": "https://cc-wie8j8y69d2uy.akamaized.net/WWBI/Amagi/ETV_Comedy_IN/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_389",
    "name": "News18 Urdu",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Live online broadcast of News18 Urdu",
    "url": "https://n18syndication.akamaized.net/bpk-tv/News18_Urdu_NW18_MOB/output01/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_390",
    "name": "News18 Tamil Nadu",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Live online broadcast of News18 Tamil Nadu",
    "url": "https://n18syndication.akamaized.net/bpk-tv/News18_Tamil_Nadu_NW18_MOB/output01/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_391",
    "name": "Global Punjab",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Global Punjab",
    "url": "https://server.livelegitpro.in/globalpunjab/globalpunjab/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_392",
    "name": "Goldmines Bollywood",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Goldmines Bollywood",
    "url": "https://mumt03.tangotv.in/Dsly5z3HGOLDMINESBOLLYWOOD/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_393",
    "name": "Goldmines Bollywood",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Goldmines Bollywood",
    "url": "https://mumt03.tangotv.in/Dsly5z3HGOLDMINESBOLLYWOOD/tracks-v2a1/mono.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_394",
    "name": "Gangaur TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Gangaur TV",
    "url": "https://cdn-2.pishow.tv/live/1221/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_395",
    "name": "Nick HD+",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Nick HD+",
    "url": "http://116.90.120.157:8000/play/a0i3/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_396",
    "name": "ETV News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Live online broadcast of ETV News",
    "url": "https://cc-3448kp65yhc5w.akamaized.net/WWBI/Amagi/ETV_News_IN/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_397",
    "name": "Gospel TV India",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Gospel TV India",
    "url": "https://server.livelegitpro.in:9899/gospeltv/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_398",
    "name": "GS TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of GS TV",
    "url": "https://cdn-4.pishow.tv/live/1462/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_399",
    "name": "Network 10",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Network 10",
    "url": "https://network10.livebox.co.in/network10hls/live.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_400",
    "name": "Pasand TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Pasand TV",
    "url": "https://d1msejlow1t3l4.cloudfront.net/fta/pasand/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_401",
    "name": "EET TV [Not 24/7]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of EET TV [Not 24/7]",
    "url": "https://live.streamjo.com/eetlive/eettv.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_402",
    "name": "NTV Telugu",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of NTV Telugu",
    "url": "https://yuppmedtaorire.akamaized.net/v1/master/a0d007312bfd99c47f76b77ae26b1ccdaae76cb1/ntv_nim_https/110322/ntv/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_403",
    "name": "Guarantee News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Guarantee News",
    "url": "https://guaranteenews.in:8443/live/gnews/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_404",
    "name": "First India News [Not 24/7]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of First India News [Not 24/7]",
    "url": "https://xlbor37ydvaj-hls-live.wmncdn.net/firstindianewstv1/live.stream/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_405",
    "name": "Hi Dost!",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Hi Dost!",
    "url": "https://mumt03.tangotv.in/Dsly5z3HHIDOST/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_406",
    "name": "Pitaara",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Pitaara",
    "url": "https://vg-pitaaratvlive.akamaized.net/v1/master/611d79b11b77e2f571934fd80ca1413453772ac7/vglive-sk-583798/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_407",
    "name": "India Today",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of India Today",
    "url": "https://livehub-voidnet.onrender.com/cluster/streamcore/in/INDIATODAY_StreamOrchestrator.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_408",
    "name": "India TV Speed News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Live online broadcast of India TV Speed News",
    "url": "https://cc-lyf4c0hwzg5dd.akamaized.net/v1/vglive-sk-479089/main.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_409",
    "name": "India Ahead",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of India Ahead",
    "url": "https://mumt05.tangotv.in/87NeALx2INDIAAHEAD/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_410",
    "name": "Isai Aruvi",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Isai Aruvi",
    "url": "https://segment.yuppcdn.net/140622/isaiaruvi/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_411",
    "name": "GoodNews TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "720p HD",
    "description": "Live online broadcast of GoodNews TV",
    "url": "https://bpgdlwwar3ze-hls-live.wmncdn.net/goodnews/live.stream/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_412",
    "name": "India TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of India TV",
    "url": "https://cdn-2.pishow.tv/live/1043/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_413",
    "name": "Janam TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Janam TV",
    "url": "https://cdn-3.pishow.tv/live/1466/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_414",
    "name": "Janam TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Janam TV",
    "url": "https://mumt03.tangotv.in/Dsly5z3HJANAMTV/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_415",
    "name": "Ishwar Bhakti TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Ishwar Bhakti TV",
    "url": "https://cdn-2.pishow.tv/live/1464/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_416",
    "name": "Isai Aruvi",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Isai Aruvi",
    "url": "http://ptuf.ridsys.in/riptv/live/KALAIGNAR_ISAI_ARUVI/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_417",
    "name": "Jonack TV [Not 24/7]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Jonack TV [Not 24/7]",
    "url": "https://cdn.smartstream.video/smartstream-us/jonakk/jonakk/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_418",
    "name": "PTC Music",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Music & Songs",
    "quality": "720p HD",
    "description": "Live online broadcast of PTC Music",
    "url": "https://d2lk5u59tns74c.cloudfront.net/out/v1/f913cf893c594f73b114216e74a2efbc/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_419",
    "name": "Jonack",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Jonack",
    "url": "https://cdn-6.pishow.tv/live/10006/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_420",
    "name": "Harvest TV Keralam",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Harvest TV Keralam",
    "url": "https://7mbd4ogkr3gx-hls-live.wmncdn.net/harvestenglish/d1796a22d24e8696c7d5d0b5c349fdd2.sdp/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_421",
    "name": "Harvest TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Harvest TV",
    "url": "https://7mbd4ogkr3gx-hls-live.wmncdn.net/harvesttvlive1/bbb19eae240ec100af921d511efc86a0.sdp/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_422",
    "name": "Prudent Media",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Prudent Media",
    "url": "https://prudentmcdn.rixcast.com/prudentm.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_423",
    "name": "PTC Punjabi Gold",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of PTC Punjabi Gold",
    "url": "https://d3qs3d2rkhfqrt.cloudfront.net/out/v1/6e14bac6d0384e129521a4d005188bfb/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_424",
    "name": "Kalaignar Murasu [Not 24/7]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Kalaignar Murasu [Not 24/7]",
    "url": "https://segment.yuppcdn.net/050522/murasu/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_425",
    "name": "PTC Punjabi HD",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of PTC Punjabi HD",
    "url": "https://d3qs3d2rkhfqrt.cloudfront.net/out/v1/3e22a9c278db4e3eb779afd42e41b0a6/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_426",
    "name": "Kairali TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Kairali TV",
    "url": "https://mumt01.tangotv.in/O5aw8Zn3KAIRALI/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_427",
    "name": "Harvest USA",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Harvest USA",
    "url": "https://7mbd4ogkr3gx-hls-live.wmncdn.net/harvestusa/d57ffba6564caea2fee3f4085f19a098.sdp/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_428",
    "name": "Mazhavil Manorama HD",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Mazhavil Manorama HD",
    "url": "https://mumt07.tangotv.in/zHjX9OFlMAZHAVILMANORAMAHD/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_429",
    "name": "INH 24x7",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of INH 24x7",
    "url": "https://7epd6o8edk9b-hls-live.wmncdn.net/inh24/live.stream/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_430",
    "name": "Kalaignar TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Kalaignar TV",
    "url": "https://segment.yuppcdn.net/240122/kalaignartv/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_431",
    "name": "Kalinga TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Kalinga TV",
    "url": "https://cdn-4.pishow.tv/live/1470/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_432",
    "name": "Kashish News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of Kashish News",
    "url": "https://cdn-7.pishow.tv/live/1471/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_433",
    "name": "Punjabi Shorts",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Punjabi Shorts",
    "url": "https://vglivessai.akamaized.net/ptnr-yupptv/title-Punjabi_Shorts/in/v1/master/611d79b11b77e2f571934fd80ca1413453772ac7/27c3fd7a-b01f-4b00-ac03-557ac77acd47/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_434",
    "name": "Kaumudy TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Kaumudy TV",
    "url": "https://cdn-3.pishow.tv/live/1237/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_435",
    "name": "Living India News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Living India News",
    "url": "https://stream.ottlive.co.in/livingindia/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_436",
    "name": "Kolkata TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Kolkata TV",
    "url": "https://cdn.ottlive.co.in/kolkatatv/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_437",
    "name": "KTV Bangla",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of KTV Bangla",
    "url": "https://server.livelegitpro.in:9899/tribetv/tribetv/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_438",
    "name": "Madha TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Madha TV",
    "url": "https://cdn-3.pishow.tv/live/1265/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_439",
    "name": "Maha Punjabi",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Maha Punjabi",
    "url": "https://cdn-4.pishow.tv/live/1521/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_440",
    "name": "Madhimugam TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Madhimugam TV",
    "url": "https://mumt01.tangotv.in/O5aw8Zn3MATHIMUGAMTV/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_441",
    "name": "Mahaa Bhakti",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Mahaa Bhakti",
    "url": "https://mumbai-edge.smartplaytv.in/MahaBhakthi/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_442",
    "name": "KITE Victers (Kerala) [Not 24/7]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of KITE Victers (Kerala) [Not 24/7]",
    "url": "https://932y4x26ljv8-hls-live.5centscdn.com/victers/tv.stream/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_443",
    "name": "Mahaa News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of Mahaa News",
    "url": "https://cdn-1.pishow.tv/live/401/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_444",
    "name": "News Tamil 24x7",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of News Tamil 24x7",
    "url": "https://cdn-3.pishow.tv/live/1433/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_445",
    "name": "Nambikkai TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Nambikkai TV",
    "url": "https://cdn-3.pishow.tv/live/1389/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_446",
    "name": "News 7 Tamil",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of News 7 Tamil",
    "url": "https://cdn-3.pishow.tv/live/1498/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_447",
    "name": "Polimer News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of Polimer News",
    "url": "https://cdn-3.pishow.tv/live/1245/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_448",
    "name": "News Malayalam 24x7",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of News Malayalam 24x7",
    "url": "https://cdn-3.pishow.tv/live/1629/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_449",
    "name": "Puthiya Thalaimurai",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Puthiya Thalaimurai",
    "url": "https://cdn-3.pishow.tv/live/1261/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_450",
    "name": "PTC Music",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Music & Songs",
    "quality": "HD Quality",
    "description": "Live online broadcast of PTC Music",
    "url": "https://cdn-3.pishow.tv/live/1501/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_451",
    "name": "Mazhavil Manorama",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Mazhavil Manorama",
    "url": "https://cdn-3.pishow.tv/live/1479/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_452",
    "name": "Rengoni",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Rengoni",
    "url": "https://d1msejlow1t3l4.cloudfront.net/fta/rengonitv/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_453",
    "name": "Republic TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Republic TV",
    "url": "https://raw.githubusercontent.com/amazeyourself/adaptive-streams/refs/heads/main/streams/in/YuppTV/RepublicTV.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_454",
    "name": "Republic TV [Geo-blocked]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Republic TV [Geo-blocked]",
    "url": "https://d3qs3d2rkhfqrt.cloudfront.net/out/v1/2e31d831f08640ff92f65003bdc89991/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_455",
    "name": "Republic Kannada",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Republic Kannada",
    "url": "https://vg-republictvlive.akamaized.net/ptnr-republicweb/title-Republic_TV_Kannada/v1/master/611d79b11b77e2f571934fd80ca1413453772ac7/1acd1ce1-c6a7-4ae4-afa1-133ffb111ebb/main.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_456",
    "name": "Republic Bharat [Geo-blocked]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Republic Bharat [Geo-blocked]",
    "url": "https://vg-republictvlive.akamaized.net/v1/master/611d79b11b77e2f571934fd80ca1413453772ac7/vglive-sk-275673/main.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_457",
    "name": "Republic Bangla",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Republic Bangla",
    "url": "https://vg-republictvlive.akamaized.net/v1/master/611d79b11b77e2f571934fd80ca1413453772ac7/vglive-sk-456368/main.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_458",
    "name": "Manoranjan Prime",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Manoranjan Prime",
    "url": "https://cdn-4.pishow.tv/live/1474/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_459",
    "name": "RT India",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of RT India",
    "url": "https://rt-india.rttv.com/dvr/rtindia/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_460",
    "name": "Sakshi TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Sakshi TV",
    "url": "https://yuppmedtaorire.akamaized.net/v1/master/a0d007312bfd99c47f76b77ae26b1ccdaae76cb1/sakshi_nim_https/240122/sakshi/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_461",
    "name": "Makkal TV (576i)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Makkal TV (576i)",
    "url": "https://5k8q87azdy4v-hls-live.wmncdn.net/MAKKAL/271ddf829afeece44d8732757fba1a66.sdp/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_462",
    "name": "Salaam TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Salaam TV",
    "url": "https://d2o3r1shda7xvv.cloudfront.net/index_5.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_463",
    "name": "Metro TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Metro TV",
    "url": "https://mercury.streambridge.link:8042/telugu/metrotv/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_464",
    "name": "Salaam TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Salaam TV",
    "url": "https://vg-zeefta.akamaized.net/ptnr-yupptv/title-zeesalaam/v1/manifest/611d79b11b77e2f571934fd80ca1413453772ac7/426c6db7-595e-4aa8-859c-7e86ed2811d0/af896be5-4743-41fc-8b6a-eb05e44f3a6e/3.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_465",
    "name": "Moon TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Moon TV",
    "url": "https://cdn-4.pishow.tv/live/1121/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_466",
    "name": "News 7 Tamil",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of News 7 Tamil",
    "url": "https://segment.yuppcdn.net/240122/news7/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_467",
    "name": "Nepal 1",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Nepal 1",
    "url": "https://cdn-6.pishow.tv/live/1490/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_468",
    "name": "Shalom",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Shalom",
    "url": "https://d2c4zqo2rb5uf1.cloudfront.net/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_469",
    "name": "Shalom Global",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Shalom Global",
    "url": "https://d28xtgmk9tfk6b.cloudfront.net/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_470",
    "name": "News 24",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of News 24",
    "url": "http://tvsen5.aynascope.net/News24/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_471",
    "name": "News 24",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of News 24",
    "url": "https://mumt01.tangotv.in/O5aw8Zn3NEWS24/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_472",
    "name": "Shemaroo Josh",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Shemaroo Josh",
    "url": "https://airtelapp.shemaroo.com/shemarooChumbakTV/smil:shemarooChumbakTVadp.smil/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_473",
    "name": "NK TV Bangla",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of NK TV Bangla",
    "url": "https://nktv.smartstream.video/smartstream-us/nkbangla/nkbangla/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_474",
    "name": "NK TV 24x7",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of NK TV 24x7",
    "url": "https://nktv.smartstream.video/smartstream-us/nktvplus/nktvplus/chunks.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_475",
    "name": "News 24",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of News 24",
    "url": "https://tvsen5.aynaott.com/News24/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_476",
    "name": "NKR TV Kannada",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of NKR TV Kannada",
    "url": "https://stream.ottlive.co.in/nkrtv/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_477",
    "name": "NKR TV Kannada",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of NKR TV Kannada",
    "url": "https://mumt05.tangotv.in/87NeALx2NKRTV/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_478",
    "name": "News Nation",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of News Nation",
    "url": "https://cdn-2.pishow.tv/live/1493/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_479",
    "name": "Sana TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Sana TV",
    "url": "https://vglivessai.akamaized.net/us/v1/master/611d79b11b77e2f571934fd80ca1413453772ac7/b6d9e864-ec16-410a-804d-ccf8f720bfaa/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_480",
    "name": "NTV Telugu",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of NTV Telugu",
    "url": "https://mumbai-edge.smartplaytv.in/NTVTelugu/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_481",
    "name": "Songdew TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Songdew TV",
    "url": "https://yuppnimrestreammum.akamaized.net/181224/smil:songdewtv.smil/playlist.m3u8?hdnts=st=1735898689~exp=1835898688~acl=*~hmac=f5fe24724fe05481e3841f9eb5ab8efdee0a3dd83645ae9dcf45703f525bab7b",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_482",
    "name": "Odisha TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Odisha TV",
    "url": "https://livetv.tarangplus.in/otv-origin/live/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_483",
    "name": "Oli TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Oli TV",
    "url": "https://live.olidigital.in/olitv/olitv/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_484",
    "name": "One Paschima",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of One Paschima",
    "url": "https://live.ekamraott.com/onepaschima/onepaschima/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_485",
    "name": "NTV Telugu",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of NTV Telugu",
    "url": "https://cdn-1.pishow.tv/live/383/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_486",
    "name": "Odisha TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Odisha TV",
    "url": "https://cdn-2.pishow.tv/live/1600/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_487",
    "name": "Oscar Movies Bhojpuri",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Oscar Movies Bhojpuri",
    "url": "https://mumt05.tangotv.in/87NeALx2OSCARMOVIESBHOJPURI/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_488",
    "name": "NTC TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of NTC TV",
    "url": "https://galaxyott.live/hls/ntv.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_489",
    "name": "Pear TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Pear TV",
    "url": "https://mumt01.tangotv.in/O5aw8Zn3PEARTV/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_490",
    "name": "Pasand TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Pasand TV",
    "url": "https://mumt01.tangotv.in/O5aw8Zn3PASANDTV/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_491",
    "name": "Sudarshan News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of Sudarshan News",
    "url": "https://d1msejlow1t3l4.cloudfront.net/fta/sudarshan/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_492",
    "name": "Peques TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Peques TV",
    "url": "https://live-evg7.tv360.bitel.com.pe/bitel/pequestv/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_493",
    "name": "Pitaara",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Pitaara",
    "url": "https://mumt04.tangotv.in/m18aqlK4PITAARA/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_494",
    "name": "Polimer News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of Polimer News",
    "url": "https://segment.yuppcdn.net/110322/polimernews/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_495",
    "name": "Prarthana TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Prarthana TV",
    "url": "https://livetv.tarangplus.in/prarthana-origin/live/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_496",
    "name": "Pratham Khabar 24x7",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Pratham Khabar 24x7",
    "url": "https://livelegitpro.in/hls2/newstime/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_497",
    "name": "Power TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Power TV",
    "url": "https://powertvkannada.com/hls/stream.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_498",
    "name": "Pratidin Time",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Pratidin Time",
    "url": "https://server.thelegitpro.in/pratidintime/pratidintime/index.fmp4.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_499",
    "name": "Tabbar Hits",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Tabbar Hits",
    "url": "https://vglivessai.akamaized.net/sg/v1/master/611d79b11b77e2f571934fd80ca1413453772ac7/e11b0319-52e8-4190-ab03-3931cc68eac9/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_500",
    "name": "PTC Punjabi",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of PTC Punjabi",
    "url": "https://cdn-2.pishow.tv/live/1604/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_501",
    "name": "PTC Punjabi Gold",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of PTC Punjabi Gold",
    "url": "https://cdn-7.pishow.tv/live/450/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_502",
    "name": "PTC Simran",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of PTC Simran",
    "url": "https://cdn-6.pishow.tv/live/1503/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_503",
    "name": "Pravasi Channel",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Pravasi Channel",
    "url": "https://m6gdavepdn93-hls-live.5centscdn.com/pravasi/d0dbe915091d400bd8ee7f27f0791303.sdp/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_504",
    "name": "Public Movies",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Public Movies",
    "url": "https://mumt04.tangotv.in/m18aqlK4PUBLICMOVIES/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_505",
    "name": "Times Now Navbharat [Geo-blocked]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Times Now Navbharat [Geo-blocked]",
    "url": "https://dztlhgid9me95.cloudfront.net/live-tv/Vidgyor/navbharat/navbharat_master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_506",
    "name": "Telugu One",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Telugu One",
    "url": "https://teluguone-yupptv.vgcdn.net/v1/019be9e3f04d1ea55784338b5c3e89/019be9e4474415fc60e93459e1e808/teluguone_2500k.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_507",
    "name": "Total TV Haryana",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Total TV Haryana",
    "url": "https://d1msejlow1t3l4.cloudfront.net/fta/totaltv/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_508",
    "name": "Punjabi Hits",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Punjabi Hits",
    "url": "https://stream.ottlive.co.in/punjabihits/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_509",
    "name": "PMC Telugu",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of PMC Telugu",
    "url": "https://mumbai-edge.smartplaytv.in/PMC/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_510",
    "name": "Puthiya Thalaimurai",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Puthiya Thalaimurai",
    "url": "https://segment.yuppcdn.net/240122/puthiya/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_511",
    "name": "Puthiya Thalaimurai",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Puthiya Thalaimurai",
    "url": "https://mumt07.tangotv.in/zHjX9OFlPUTHIYAEXPRESS/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_512",
    "name": "Times Now [Geo-blocked]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Times Now [Geo-blocked]",
    "url": "https://pubads.g.doubleclick.net/ssai/event/1mR1QUQ3Tg-VuKfiyjwNuA/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_513",
    "name": "Pulari TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Pulari TV",
    "url": "https://royalstarindia.co.in/pularitv_hls/pularitv.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_514",
    "name": "TV9 Bangla",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of TV9 Bangla",
    "url": "https://dyjmyiv3bp2ez.cloudfront.net/pub-iotv9banaen8yq/liveabr/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_515",
    "name": "TV5 News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of TV5 News",
    "url": "https://yuppmedtaorire.akamaized.net/v1/master/a0d007312bfd99c47f76b77ae26b1ccdaae76cb1/tv5_nim_https/110322/tv5/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_516",
    "name": "TV9 Gujarati",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of TV9 Gujarati",
    "url": "https://dyjmyiv3bp2ez.cloudfront.net/pub-iotv9guj3ki8lu/liveabr/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_517",
    "name": "Puthuyugam TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Puthuyugam TV",
    "url": "https://mumt04.tangotv.in/m18aqlK4PUTHUYUGAMTV/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_518",
    "name": "TV9 Bharatvarsh",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of TV9 Bharatvarsh",
    "url": "https://vg-tv9yupp.vgcdn.net/vglive-sk-468570/v1/019dfce4b3371ea55784752988544/019dfce515ea1ea540a871e333259/main.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_519",
    "name": "TV9 Kannada [Not 24/7]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of TV9 Kannada [Not 24/7]",
    "url": "https://dyjmyiv3bp2ez.cloudfront.net/pub-iotv9kanmo6oiq/liveabr/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_520",
    "name": "TV9 Marathi",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of TV9 Marathi",
    "url": "https://dyjmyiv3bp2ez.cloudfront.net/pub-iotv9marlygv8h/liveabr/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_521",
    "name": "TV9 Telugu",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of TV9 Telugu",
    "url": "https://dyjmyiv3bp2ez.cloudfront.net/pub-iotv9telcmjhcs/liveabr/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_522",
    "name": "Unite8 Sports 2",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Unite8 Sports 2",
    "url": "http://59.103.38.46:8000/play/a126/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_523",
    "name": "R Plus",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of R Plus",
    "url": "https://thelegitpro.in/pntv/rplusnews24x7/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_524",
    "name": "V6 News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of V6 News",
    "url": "https://yuppmedtaorire.akamaized.net/v1/master/a0d007312bfd99c47f76b77ae26b1ccdaae76cb1/v6news_nim_https/140622/v6news/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_525",
    "name": "Raftaar Media",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Raftaar Media",
    "url": "https://6n3yorwpy9ok-hls-live.5centscdn.com/raftaarmedia/243bd1ce0387f18005abfc43b001646a.sdp/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_526",
    "name": "Raj Musix Tamil",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Raj Musix Tamil",
    "url": "https://livestream.rajtv.tv/hlslive/Admin/px08241087/live/Raj_Musix/master_1.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_527",
    "name": "Reporter TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Reporter TV",
    "url": "https://segment.yuppcdn.net/050522/reporter/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_528",
    "name": "Ramdhenu",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Ramdhenu",
    "url": "https://cdn-7.pishow.tv/live/10016/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_529",
    "name": "Rang",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Rang",
    "url": "https://cdn-7.pishow.tv/live/10017/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_530",
    "name": "Raj TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Raj TV",
    "url": "https://livestream.rajtv.tv/hlslive/Admin/px08241087/live/RAJTV/master_1.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_531",
    "name": "Raj Digital Plus",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Raj Digital Plus",
    "url": "https://livestream.rajtv.tv/hlslive/Admin/px08241087/live/RajTV_Digital_plus/master_1.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_532",
    "name": "Republic Bangla",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Republic Bangla",
    "url": "https://cdn-4.pishow.tv/live/270/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_533",
    "name": "Republic TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Republic TV",
    "url": "https://samsung-republictv.amagi.tv/ts-ap-s1-n1/playlist/samsungin-republictv-samsungindia/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_534",
    "name": "Vision",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Vision",
    "url": "http://103.85.204.205:1935/VISIONMEDIA/live/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_535",
    "name": "TOI Global",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of TOI Global",
    "url": "https://live.sli.ke/live/npnhm84gz9/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_536",
    "name": "Rongeen TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Rongeen TV",
    "url": "http://tvsen5.aynascope.net/RongeenTV/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_537",
    "name": "Republic Kannada",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Republic Kannada",
    "url": "https://cdn-3.pishow.tv/live/298/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_538",
    "name": "Reporter TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Reporter TV",
    "url": "https://cdn-2.pishow.tv/live/1510/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_539",
    "name": "Rongeen TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Rongeen TV",
    "url": "https://cdn-4.pishow.tv/live/1029/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_540",
    "name": "Sony Marathi [Geo-blocked]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Sony Marathi [Geo-blocked]",
    "url": "https://sl.vodep39240327.workers.dev/channel/SONY+MARATHI.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_541",
    "name": "Rozana Spokesman",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Rozana Spokesman",
    "url": "https://live1.ottlive.co.in/spokesman/spokesman/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_542",
    "name": "Republic Bharat",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Republic Bharat",
    "url": "https://cdn-2.pishow.tv/live/1053/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_543",
    "name": "WION",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of WION",
    "url": "https://d7x8z4yuq42qn.cloudfront.net/index_1.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_544",
    "name": "WION",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of WION",
    "url": "https://d7x8z4yuq42qn.cloudfront.net/index_4.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_545",
    "name": "WION",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of WION",
    "url": "https://d7x8z4yuq42qn.cloudfront.net/index_7.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_546",
    "name": "WION",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of WION",
    "url": "https://d7x8z4yuq42qn.cloudfront.net/index_3.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_547",
    "name": "WION",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of WION",
    "url": "https://d7x8z4yuq42qn.cloudfront.net/index_5.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_548",
    "name": "WION",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of WION",
    "url": "https://d7x8z4yuq42qn.cloudfront.net/index_2.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_549",
    "name": "Rupasi Bangla",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Rupasi Bangla",
    "url": "https://mumt05.tangotv.in/87NeALx2RUPASIBANGLA/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_550",
    "name": "Safari TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Safari TV",
    "url": "https://cdn-6.pishow.tv/live/1513/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_551",
    "name": "Vedic",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Vedic",
    "url": "https://aasthaott.akamaized.net/110923/smil:vedic.smil/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_552",
    "name": "Zee 24 Ghanta",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Zee 24 Ghanta",
    "url": "https://d2dsoyvkr33m05.cloudfront.net/index_4.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_553",
    "name": "Vijay Takkar APAC",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Vijay Takkar APAC",
    "url": "https://tglmp01.akamaized.net/out/v1/c1071012b73f4f189b202e1529e8f802/manifest.mpd",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_554",
    "name": "Sai TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Sai TV",
    "url": "https://cdn-3.pishow.tv/live/1235/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_555",
    "name": "Zee 24 Taas",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Zee 24 Taas",
    "url": "https://dgrvlduwztkd4.cloudfront.net/index_5.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_556",
    "name": "Zee Bangla Sonar",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Zee Bangla Sonar",
    "url": "https://d1g8wgjurz8via.cloudfront.net/bpk-tv/ColorsHD/default/ColorsHD.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_557",
    "name": "WION",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of WION",
    "url": "http://vg-zeefta.akamaized.net/ptnr-yupptv/title-wion/v1/master/611d79b11b77e2f571934fd80ca1413453772ac7/20c3c0d9-0256-43fe-bca6-70fdd490b957/main.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_558",
    "name": "Zainabia Channel",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Zainabia Channel",
    "url": "https://zainabia.livebox.co.in/ZainabiaChannelhls/channel.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_559",
    "name": "WION (Adaptive)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of WION (Adaptive)",
    "url": "https://raw.githubusercontent.com/Alstruit/adaptive-streams/alstruit-10_23_in/streams/in/WION.in.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_560",
    "name": "Zee 24 Kalak",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Zee 24 Kalak",
    "url": "https://vg-zeefta.akamaized.net/ptnr-yupptv/title-zee24kalak/v1/manifest/611d79b11b77e2f571934fd80ca1413453772ac7/497f7199-758d-495d-9d2f-a5489231c428/14b7c8ec-16da-47f2-8d7e-5bbaec67b3e2/3.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_561",
    "name": "Sairam TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Sairam TV",
    "url": "https://cdn-3.pishow.tv/live/1611/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_562",
    "name": "Sada TV [Not 24/7]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Sada TV [Not 24/7]",
    "url": "http://cdn12.henico.net:8080/live/sadatv/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_563",
    "name": "Zee Business",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Zee Business",
    "url": "https://dwby15d04agvq.cloudfront.net/index_1.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_564",
    "name": "Sai TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Sai TV",
    "url": "https://account31.livebox.co.in/saitvhls/live.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_565",
    "name": "Zee Bihar Jharkhand",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Zee Bihar Jharkhand",
    "url": "https://raw.githubusercontent.com/amazeyourself/adaptive-streams/refs/heads/main/streams/in/YuppTV/ZeeBiharJharkhand.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_566",
    "name": "Zee Bangla HD",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Zee Bangla HD",
    "url": "https://raw.githubusercontent.com/amazeyourself/adaptive-streams/refs/heads/main/streams/in/YuppTV/ZeeBanglaHD.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_567",
    "name": "Zee Kannada News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "720p HD",
    "description": "Live online broadcast of Zee Kannada News",
    "url": "https://d3vzwoqcbpfm8p.cloudfront.net/index_4.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_568",
    "name": "Sakshi TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Sakshi TV",
    "url": "https://cdn-1.pishow.tv/live/409/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_569",
    "name": "Zee Bihar Jharkhand",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Zee Bihar Jharkhand",
    "url": "https://vg-zeefta.akamaized.net/ptnr-yupptv/title-zeebiharjharkhand/v1/master/611d79b11b77e2f571934fd80ca1413453772ac7/28077955-07d7-4ae2-8b11-9f318cd69420/main.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_570",
    "name": "Real News Kerala [Not 24/7]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Real News Kerala [Not 24/7]",
    "url": "https://bk7l298nyx53-hls-live.5centscdn.com/realnews/e7dee419f91aa9e65939d3677fb9c4f5.sdp/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_571",
    "name": "Zee Cinema APAC",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Zee Cinema APAC",
    "url": "https://raw.githubusercontent.com/amazeyourself/adaptive-streams/refs/heads/main/streams/sg/YuppTV/ZeeCinemaAPAC.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_572",
    "name": "Zee News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Zee News",
    "url": "https://dt3lrqnyx3dks.cloudfront.net/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_573",
    "name": "RDX Goa [Geo-blocked]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of RDX Goa [Geo-blocked]",
    "url": "https://g5nl6xoalpq6-hls-live.5centscdn.com/rdxgoa/d0dbe915091d400bd8ee7f27f0791303.sdp/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_574",
    "name": "Zee Kannada HD",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Zee Kannada HD",
    "url": "https://yuppnimresmum.akamaized.net/28072023/smil:zeekannadahd.smil/playlist.m3u8?hdnts=st=1735898689~exp=1835898688~acl=*~hmac=f5fe24724fe05481e3841f9eb5ab8efdee0a3dd83645ae9dcf45703f525bab7b",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_575",
    "name": "Samay Kolkata",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Samay Kolkata",
    "url": "https://server.livelegitpro.in/samaykolkata/samaykolkata/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_576",
    "name": "Zee Marathi HD",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Zee Marathi HD",
    "url": "https://raw.githubusercontent.com/amazeyourself/adaptive-streams/refs/heads/main/streams/in/YuppTV/ZeeMarathiHD.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_577",
    "name": "Zee Telugu News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "720p HD",
    "description": "Live online broadcast of Zee Telugu News",
    "url": "https://d116gfrn8orazi.cloudfront.net/index.m3u8?akes=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NjcxOTc5NzJ9.O4qmdMPbHwKrCg6hFXvD70vjSPWKQd0a7NrjmFdeMB8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_578",
    "name": "India Ahead",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of India Ahead",
    "url": "https://cdn-2.pishow.tv/live/269/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_579",
    "name": "Zee News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "720p HD",
    "description": "Live online broadcast of Zee News",
    "url": "https://vg-zeefta.akamaized.net/ptnr-yupptv/title-zeenews/v1/master/611d79b11b77e2f571934fd80ca1413453772ac7/8744f9fb-d696-4204-9795-5215ad930c39/main.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_580",
    "name": "Zee Tamil News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "720p HD",
    "description": "Live online broadcast of Zee Tamil News",
    "url": "https://raw.githubusercontent.com/amazeyourself/adaptive-streams/refs/heads/main/streams/in/ZMCL/ZeeTamilNews.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_581",
    "name": "Zee Punjab Haryana Himachal",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Zee Punjab Haryana Himachal",
    "url": "https://vg-zeefta.akamaized.net/ptnr-yupptv/title-zeepunjabharyanahima/v1/master/611d79b11b77e2f571934fd80ca1413453772ac7/65eed269-2f3a-4dd0-ac89-d18959af28e3/main.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_582",
    "name": "Zoom",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Zoom",
    "url": "https://d2esfk1pb9cdob.cloudfront.net/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_583",
    "name": "Republic TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Republic TV",
    "url": "https://cdn-2.pishow.tv/live/271/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_584",
    "name": "Safari TV [Not 24/7]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Safari TV [Not 24/7]",
    "url": "https://j78dp346yq5r-hls-live.5centscdn.com/safari/live.stream/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_585",
    "name": "Colors Gujarati",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Colors Gujarati",
    "url": "https://raw.githubusercontent.com/amazeyourself/adaptive-streams/refs/heads/main/streams/in/YuppTV/ColorsGujarati.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_586",
    "name": "Sana Plus",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Sana Plus",
    "url": "https://mumbai-edge.smartplaytv.in/SanaPlusHD/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_587",
    "name": "Sirippoli TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Sirippoli TV",
    "url": "https://segment.yuppcdn.net/240122/siripoli/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_588",
    "name": "9X Tashan",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of 9X Tashan",
    "url": "https://wiselp.wiseplayout.com/9X_Tashan/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_589",
    "name": "9X Jalwa",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of 9X Jalwa",
    "url": "https://wiselp.wiseplayout.com/9X_Jalwa/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_590",
    "name": "9X Jhakaas",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of 9X Jhakaas",
    "url": "https://wiselp.wiseplayout.com/9X_Jhakaas/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_591",
    "name": "9XM",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of 9XM",
    "url": "https://wiselp.wiseplayout.com/9XM/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_592",
    "name": "Sansad TV 2",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Sansad TV 2",
    "url": "https://playhls.media.nic.in/hls/live/rstv/rstv.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_593",
    "name": "Sana Plus [Not 24/7]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Sana Plus [Not 24/7]",
    "url": "https://galaxyott.live/hls/sanaplus.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_594",
    "name": "Shemaroo Filmi Gaane",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Shemaroo Filmi Gaane",
    "url": "https://prod-runn.cdn.runn.tv/shemaroo/stream/smrfgn/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_595",
    "name": "Shekinah TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Shekinah TV",
    "url": "https://livetv.timeiptv.in/ShekinahNewsIndia/955ad3298db330b5ee880c2c9e6f23a0.sdp/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_596",
    "name": "Siri Kannada All Time",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Siri Kannada All Time",
    "url": "https://mumt07.tangotv.in/zHjX9OFlSIRIKANNADAALLTIME/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_597",
    "name": "Siri Kannada",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Siri Kannada",
    "url": "https://mumt03.tangotv.in/Dsly5z3HSIRIKANNADA/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_598",
    "name": "Salvation TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Salvation TV",
    "url": "https://ktismaservers.in:3902/live/salvationtvlive.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_599",
    "name": "Shubhsandesh TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Shubhsandesh TV",
    "url": "https://cdn-2.pishow.tv/live/457/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_600",
    "name": "Spondon",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Spondon",
    "url": "https://nktv.smartstream.video/smartstream-us/spondon/spondon/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_601",
    "name": "Sirippoli TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Sirippoli TV",
    "url": "http://ptuf.ridsys.in/riptv/live/KALAIGNAR_SIRIPOLI/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_602",
    "name": "Spondon",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Spondon",
    "url": "https://cdn-7.pishow.tv/live/10019/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_603",
    "name": "Star Sports Select 2 HD",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Star Sports Select 2 HD",
    "url": "http://tvsen7.aynascope.net/ssport2hd/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_604",
    "name": "Star Sports 2 HD",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Star Sports 2 HD",
    "url": "https://tvsen7.aynaott.com/ssport2hd/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_605",
    "name": "Studio Yuva",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Studio Yuva",
    "url": "https://mumt01.tangotv.in/O5aw8Zn3STUDIOYUVA/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_606",
    "name": "Star Family [Not 24/7]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Star Family [Not 24/7]",
    "url": "http://c0.cdn.trinity-tv.net/stream/zfmjgma9zn46fa797ez9fgkw7msh9mj4tppspg23gey6mmx5fqiy7ky3jqx4uhgsfsrd8r76si8ykb2anw9442g4qkq5fzpdvwdqf5te24ixu9zrx3aesm9fzt59q5y2s8qwgbqhvf6d3z5bjy3qb2t4.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_607",
    "name": "Subhavaartha TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Subhavaartha TV",
    "url": "https://cdn-1.pishow.tv/live/278/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_608",
    "name": "Suriya TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Suriya TV",
    "url": "https://stream.ottlive.co.in/suryatvtamil/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_609",
    "name": "Sudarshan News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of Sudarshan News",
    "url": "https://cdn-2.pishow.tv/live/1516/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_610",
    "name": "Subin TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Subin TV",
    "url": "https://stream.galaxyott.live/live/subintv/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_611",
    "name": "Starnet",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Starnet",
    "url": "https://5a1178b42cc03.streamlock.net/8220/8220/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_612",
    "name": "SVBC 4",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of SVBC 4",
    "url": "https://cdn-2.pishow.tv/live/1607/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_613",
    "name": "Subhavaartha TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Subhavaartha TV",
    "url": "https://2mk9qae4rwyb-hls-live.wmncdn.net/shubhavartha/live.stream/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_614",
    "name": "Swatantra TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Swatantra TV",
    "url": "https://mumbai-edge.smartplaytv.in/SwatantraTV/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_615",
    "name": "Tamil Janam",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Tamil Janam",
    "url": "https://mumt01.tangotv.in/O5aw8Zn3JANAMTVTAMIL/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_616",
    "name": "Tarang Music",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Music & Songs",
    "quality": "720p HD",
    "description": "Live online broadcast of Tarang Music",
    "url": "https://livetv.tarangplus.in/tarangmusic-origin/live/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_617",
    "name": "Tarang TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Tarang TV",
    "url": "https://livetv.tarangplus.in/tarangtv-origin/live/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_618",
    "name": "SVBC 2",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of SVBC 2",
    "url": "https://player.mslivestream.net/tamil/ac206e74d75b285755ee4924df87d951.sdp/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_619",
    "name": "Thanthi One",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Thanthi One",
    "url": "https://mumt07.tangotv.in/zHjX9OFlTHANTHIONE/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_620",
    "name": "SVBC 3",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of SVBC 3",
    "url": "https://player.mslivestream.net/svbc/2e628d7e1b65d31254fd7705ff7ee64d.sdp/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_621",
    "name": "SVBC Sri Venkateswara Bhakti Channel",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of SVBC Sri Venkateswara Bhakti Channel",
    "url": "https://player.mslivestream.net/telugu/5d076e5c3d34cb8bb08e54a4bb7e223e.sdp/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_622",
    "name": "TV5 News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of TV5 News",
    "url": "https://cdn-1.pishow.tv/live/387/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_623",
    "name": "Ultimate TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Ultimate TV",
    "url": "https://stream.ottlive.co.in/utvtamil/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_624",
    "name": "Ultimate TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Ultimate TV",
    "url": "https://mumbai-edge.smartplaytv.in/utv/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_625",
    "name": "Unique TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Unique TV",
    "url": "https://mumt05.tangotv.in/87NeALx2UNIQUETV/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_626",
    "name": "Vasanth TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Vasanth TV",
    "url": "https://mumt04.tangotv.in/m18aqlK4VASANTHTV/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_627",
    "name": "Fateh TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Fateh TV",
    "url": "http://180.188.254.253/live/FATEHTVHD.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_628",
    "name": "Vyas NIC",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Vyas NIC",
    "url": "https://playhls.media.nic.in/hls/live/vyas/vyas.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_629",
    "name": "Vaanavil TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Vaanavil TV",
    "url": "https://6n3yope4d9ok-hls-live.5centscdn.com/vaanavil/TV.stream/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_630",
    "name": "Village TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Village TV",
    "url": "https://villagetv.applelive.in/villagetv/villagetv/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_631",
    "name": "TV Punjab [Geo-blocked]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of TV Punjab [Geo-blocked]",
    "url": "https://932y483pdjv8-hls-live.5centscdn.com/stream/deb10bae362f810630ec3abedcae5894.sdp/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_632",
    "name": "ZB Music",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Music & Songs",
    "quality": "720p HD",
    "description": "Live online broadcast of ZB Music",
    "url": "https://server.zillarbarta.com/zbmusic/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_633",
    "name": "ZB Cartoon",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of ZB Cartoon",
    "url": "https://server.zillarbarta.com/zbcatun/video.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_634",
    "name": "ZB Bhakti",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of ZB Bhakti",
    "url": "https://server.zillarbarta.com/zbbhakti/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_635",
    "name": "UTV Palakkad",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of UTV Palakkad",
    "url": "https://em4qj6nedyvg-hls-live.wmncdn.net/liveunit/89b1e919eed04e59383cf820d644c20e.sdp/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_636",
    "name": "VCV [Not 24/7]",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of VCV [Not 24/7]",
    "url": "https://5a1178b42cc03.streamlock.net/8210/8210/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_637",
    "name": "Dangal 2",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Dangal 2",
    "url": "https://streams.tangotv.in/DANGAL2/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_638",
    "name": "Shemaroo TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Shemaroo TV",
    "url": "https://streams.tangotv.in/SHEMAROOTV/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_639",
    "name": "Dangal TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Dangal TV",
    "url": "https://streams.tangotv.in/DANGAL/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_640",
    "name": "Shemaroo Umang",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Shemaroo Umang",
    "url": "https://streams.tangotv.in/SHEMAROOUMANG/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_641",
    "name": "Manoranjan Grand",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Manoranjan Grand",
    "url": "https://streams.tangotv.in/MANORANJANGRAND/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_642",
    "name": "Manoranjan TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Manoranjan TV",
    "url": "https://streams.tangotv.in/MANORANJANTV/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_643",
    "name": "DD National HD",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of DD National HD",
    "url": "https://streams.tangotv.in/DDNATIONALHD/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_644",
    "name": "Epic Bharat",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Epic Bharat",
    "url": "https://mumt06.tangotv.in/qYyB8fXVEPICTV/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_645",
    "name": "Shemaroo Josh",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Shemaroo Josh",
    "url": "https://mumt04.tangotv.in/m18aqlK4SHEMAROOJOSH/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_646",
    "name": "Goldmines",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Goldmines",
    "url": "https://streams.tangotv.in/GOLDMINES/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_647",
    "name": "Anjan TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Anjan TV",
    "url": "https://mumt06.tangotv.in/qYyB8fXVANJANTV/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_648",
    "name": "Manoranjan Prime",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Manoranjan Prime",
    "url": "https://mumt06.tangotv.in/qYyB8fXVMANORANJANPRIME/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_649",
    "name": "Gangaur TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Gangaur TV",
    "url": "https://mumt04.tangotv.in/m18aqlK4GANGAURTV/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_650",
    "name": "Goldmines Bollywood",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Goldmines Bollywood",
    "url": "https://streams.tangotv.in/GOLDMINESBOLLYWOOD/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_651",
    "name": "Goldmines Movies",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Goldmines Movies",
    "url": "https://streams.tangotv.in/GOLDMINEMOVIES/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_652",
    "name": "ZillarBarta News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of ZillarBarta News",
    "url": "https://server.zillarbarta.com/zillarbarta/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_653",
    "name": "B4U Movies",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of B4U Movies",
    "url": "https://streams.tangotv.in/B4UMOVIES/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_654",
    "name": "B4U Kadak",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of B4U Kadak",
    "url": "https://streams.tangotv.in/B4UKADAK/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_655",
    "name": "Manoranjan Movies",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Manoranjan Movies",
    "url": "https://mumt04.tangotv.in/m18aqlK4MANORANJANMOVIES/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_656",
    "name": "Music India",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Music & Songs",
    "quality": "HD Quality",
    "description": "Live online broadcast of Music India",
    "url": "https://streams.tangotv.in/MUSICINDIA/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_657",
    "name": "Epic Music",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Music & Songs",
    "quality": "HD Quality",
    "description": "Live online broadcast of Epic Music",
    "url": "https://streams.tangotv.in/EPICMUSIC/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_658",
    "name": "9XM",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of 9XM",
    "url": "https://streams.tangotv.in/9XM/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_659",
    "name": "B4U Music",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Music & Songs",
    "quality": "HD Quality",
    "description": "Live online broadcast of B4U Music",
    "url": "https://streams.tangotv.in/B4UMUSIC/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_660",
    "name": "Insync",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Insync",
    "url": "https://mumt04.tangotv.in/m18aqlK4INSYNC/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_661",
    "name": "Times Now Navbharat",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Times Now Navbharat",
    "url": "https://streams.tangotv.in/TIMESNOWNAVBHARAT/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_662",
    "name": "TV9 Bharatvarsh",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of TV9 Bharatvarsh",
    "url": "https://streams.tangotv.in/TV9BHARATVARSH/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_663",
    "name": "News Nation",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of News Nation",
    "url": "https://streams.tangotv.in/NEWSNATION/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_664",
    "name": "Republic Bharat",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Republic Bharat",
    "url": "https://streams.tangotv.in/REPUBLICBHARAT/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_665",
    "name": "India TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of India TV",
    "url": "https://streams.tangotv.in/INDIATV/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_666",
    "name": "Bharat24",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Bharat24",
    "url": "https://streams.tangotv.in/BHARAT24/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_667",
    "name": "News 24",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of News 24",
    "url": "https://streams.tangotv.in/NEWS24/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_668",
    "name": "Sudarshan News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of Sudarshan News",
    "url": "https://streams.tangotv.in/SUDARSHANNEWS/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_669",
    "name": "Swaraj Express SMBC",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Swaraj Express SMBC",
    "url": "https://mumt04.tangotv.in/m18aqlK4SWARAJEXPRESS/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_670",
    "name": "Bharat Express",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Bharat Express",
    "url": "https://mumt07.tangotv.in/zHjX9OFlBHARATEXPRESS/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_671",
    "name": "ANB News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of ANB News",
    "url": "https://mumt05.tangotv.in/87NeALx2ANBNEWSNATIONAL/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_672",
    "name": "Bansal News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of Bansal News",
    "url": "https://mumt07.tangotv.in/zHjX9OFlBANSALNEWS/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_673",
    "name": "IBC 24",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of IBC 24",
    "url": "https://mumt03.tangotv.in/Dsly5z3HC10/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_674",
    "name": "Republic TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Republic TV",
    "url": "https://streams.tangotv.in/REPUBLICTV/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_675",
    "name": "Public First",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Public First",
    "url": "https://mumt06.tangotv.in/qYyB8fXVPUBLICFIRST/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_676",
    "name": "NewsX",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of NewsX",
    "url": "https://mumt01.tangotv.in/O5aw8Zn3NEWSX/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_677",
    "name": "NewsX World",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of NewsX World",
    "url": "https://mumt03.tangotv.in/Dsly5z3HNEWSXWORLD/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_678",
    "name": "Aastha SD",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Aastha SD",
    "url": "https://mumt05.tangotv.in/87NeALx2AASTHA/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_679",
    "name": "DD India",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of DD India",
    "url": "https://mumt05.tangotv.in/87NeALx2DDINDIA/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_680",
    "name": "PTC Punjabi",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of PTC Punjabi",
    "url": "https://streams.tangotv.in/PTCPUNJABI/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_681",
    "name": "Channel Divya",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Channel Divya",
    "url": "https://streams.tangotv.in/DIVYA/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_682",
    "name": "Ishwar Bhakti TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Ishwar Bhakti TV",
    "url": "https://mumt05.tangotv.in/87NeALx2ISHWARBHAKTI/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_683",
    "name": "Hope Channel India",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Hope Channel India",
    "url": "https://mumt01.tangotv.in/O5aw8Zn3HOPECHANNELINDIA/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_684",
    "name": "Hare Krsna TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Hare Krsna TV",
    "url": "https://mumt05.tangotv.in/87NeALx2HAREKRSNA/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_685",
    "name": "PTC Punjabi Gold",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of PTC Punjabi Gold",
    "url": "https://streams.tangotv.in/PTCPUNJABIGOLD/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_686",
    "name": "Pitaara",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Pitaara",
    "url": "https://streams.tangotv.in/PITAARA/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_687",
    "name": "PTC Music",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Music & Songs",
    "quality": "HD Quality",
    "description": "Live online broadcast of PTC Music",
    "url": "https://mumt04.tangotv.in/m18aqlK4PTCMUSIC/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_688",
    "name": "9X Tashan",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of 9X Tashan",
    "url": "https://streams.tangotv.in/9XTASHAN/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_689",
    "name": "PTC Chakde",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of PTC Chakde",
    "url": "https://mumt06.tangotv.in/qYyB8fXVPTCCHAKDE/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_690",
    "name": "Balle Balle",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Balle Balle",
    "url": "https://streams.tangotv.in/BALLEBALLE/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_691",
    "name": "PTC News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of PTC News",
    "url": "https://streams.tangotv.in/PTCNEWS/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_692",
    "name": "Tabbar Hits",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Tabbar Hits",
    "url": "https://streams.tangotv.in/TABBARHITS/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_693",
    "name": "Living India News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of Living India News",
    "url": "https://streams.tangotv.in/LIVINGINDIANEWS/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_694",
    "name": "Chardikla Time TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Chardikla Time TV",
    "url": "https://streams.tangotv.in/CHARDIKALATIMETV/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_695",
    "name": "Chardikla Time TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Chardikla Time TV",
    "url": "https://streams.tangotv.in/PTCSIMRAN/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_696",
    "name": "TV9 Gujarati",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of TV9 Gujarati",
    "url": "https://streams.tangotv.in/TV9GUJARATI/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_697",
    "name": "Gujarat First",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Gujarat First",
    "url": "https://mumt03.tangotv.in/Dsly5z3HGUJARATFIRST/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_698",
    "name": "TV9 Marathi",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of TV9 Marathi",
    "url": "https://streams.tangotv.in/TV9MARATHI/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_699",
    "name": "Sangeet Marathi",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Sangeet Marathi",
    "url": "https://mumt07.tangotv.in/zHjX9OFlSANGEETMARATHI/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_700",
    "name": "Fakt Marathi",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Fakt Marathi",
    "url": "https://mumt07.tangotv.in/zHjX9OFlFAKTMARATHI/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_701",
    "name": "B4U Bhojpuri",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of B4U Bhojpuri",
    "url": "https://streams.tangotv.in/B4UBHOJPURI/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_702",
    "name": "Bhojpuri Cinema",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Bhojpuri Cinema",
    "url": "https://streams.tangotv.in/BHOJPURICINEMA/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_703",
    "name": "Sangeet Bhojpuri",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Sangeet Bhojpuri",
    "url": "https://mumt01.tangotv.in/O5aw8Zn3SANGEETBHOJPURI/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_704",
    "name": "Peppers TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Peppers TV",
    "url": "https://mumt07.tangotv.in/zHjX9OFlPEPPERS/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_705",
    "name": "Pudhari News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of Pudhari News",
    "url": "https://streams.tangotv.in/PUDHARINEWS/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_706",
    "name": "Malai Murasu TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Malai Murasu TV",
    "url": "https://streams.tangotv.in/MALAIMURASUSEITHIGAL/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_707",
    "name": "Puthiya Thalaimurai",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Puthiya Thalaimurai",
    "url": "https://streams.tangotv.in/PUTHIYATHALAIMURAI/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_708",
    "name": "Polimer TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Polimer TV",
    "url": "https://mumt04.tangotv.in/m18aqlK4POLIMERTV/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_709",
    "name": "News 7 Tamil",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of News 7 Tamil",
    "url": "https://streams.tangotv.in/NEWS7TAMIL/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_710",
    "name": "Thanthi TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Thanthi TV",
    "url": "https://streams.tangotv.in/THANTHITV/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_711",
    "name": "News Tamil 24x7",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of News Tamil 24x7",
    "url": "https://streams.tangotv.in/NEWSTAMIL24X7/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_712",
    "name": "Polimer News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of Polimer News",
    "url": "https://streams.tangotv.in/POLIMERNEWS/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_713",
    "name": "OM TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of OM TV",
    "url": "https://mumt01.tangotv.in/O5aw8Zn3OMTV/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_714",
    "name": "Sai TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Sai TV",
    "url": "https://mumt03.tangotv.in/Dsly5z3HSAITV/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_715",
    "name": "Angel TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Angel TV",
    "url": "https://mumt01.tangotv.in/O5aw8Zn3ANGELTVHD/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_716",
    "name": "Vissa TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Vissa TV",
    "url": "https://mumt07.tangotv.in/zHjX9OFlVISSATV/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_717",
    "name": "Raj Musix Telugu",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Raj Musix Telugu",
    "url": "https://mumt07.tangotv.in/zHjX9OFlRAJMUSIXTELUGU/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_718",
    "name": "Madha TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Madha TV",
    "url": "https://mumt07.tangotv.in/zHjX9OFlMADHATV/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_719",
    "name": "Mahaa Max",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Mahaa Max",
    "url": "https://mumt03.tangotv.in/Dsly5z3HMAHAAMAX/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_720",
    "name": "Prime9 News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of Prime9 News",
    "url": "https://mumt01.tangotv.in/O5aw8Zn3PRIME9NEWS/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_721",
    "name": "Sakshi TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Sakshi TV",
    "url": "https://mumt07.tangotv.in/zHjX9OFlSAKSHITV/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_722",
    "name": "CVR English",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of CVR English",
    "url": "https://yuppnimrestreammum.akamaized.net/181224/smil:cvrnewseng.smil/playlist.m3u8?hdnts=st=1735898689~exp=1835898688~acl=*~hmac=f5fe24724fe05481e3841f9eb5ab8efdee0a3dd83645ae9dcf45703f525bab7b",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_723",
    "name": "APN",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of APN",
    "url": "https://d1msejlow1t3l4.cloudfront.net/fta/apnnews/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_724",
    "name": "Bansal News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of Bansal News",
    "url": "https://d1msejlow1t3l4.cloudfront.net/fta/bansalnews/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_725",
    "name": "Kashish News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of Kashish News",
    "url": "https://d1msejlow1t3l4.cloudfront.net/fta/kashishnews/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_726",
    "name": "Network 10",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Network 10",
    "url": "https://d1msejlow1t3l4.cloudfront.net/fta/network10/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_727",
    "name": "TV9 Telugu",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of TV9 Telugu",
    "url": "https://streams.tangotv.in/TV9TELUGU/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_728",
    "name": "TV5 News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of TV5 News",
    "url": "https://mumt07.tangotv.in/zHjX9OFlTV5NEWS/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_729",
    "name": "V6 News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of V6 News",
    "url": "https://mumt05.tangotv.in/87NeALx2V6NEWS/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_730",
    "name": "Jantantra TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Jantantra TV",
    "url": "https://d1msejlow1t3l4.cloudfront.net/fta/jantantratv/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_731",
    "name": "Swaraj Express SMBC",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Swaraj Express SMBC",
    "url": "https://d1msejlow1t3l4.cloudfront.net/fta/swarajexpresssmbc/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_732",
    "name": "Subharti TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Subharti TV",
    "url": "https://d1msejlow1t3l4.cloudfront.net/fta/subhartitv/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_733",
    "name": "Vanitha TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Vanitha TV",
    "url": "https://mumt01.tangotv.in/O5aw8Zn3VANITHA/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_734",
    "name": "Insync",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Insync",
    "url": "https://d1msejlow1t3l4.cloudfront.net/fta/insync/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_735",
    "name": "Moon TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Moon TV",
    "url": "https://d1msejlow1t3l4.cloudfront.net/fta/moontv/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_736",
    "name": "Jai Maharashtra",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Jai Maharashtra",
    "url": "https://d1msejlow1t3l4.cloudfront.net/fta/jaimaharashtra/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_737",
    "name": "Studio Yuva",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Studio Yuva",
    "url": "https://d2gvyg6lvauoko.cloudfront.net/230226/studioyuva/playlist.m3u8?hdnts=st=1735898689~exp=1835898688~acl=*~hmac=f5fe24724fe05481e3841f9eb5ab8efdee0a3dd83645ae9dcf45703f525bab7b",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_738",
    "name": "6 TV Telugu",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of 6 TV Telugu",
    "url": "https://yuppparoriglin.akamaized.net/181224/smil:6tv.smil/playlist.m3u8?hdnts=st=1735898689~exp=1835898688~acl=*~hmac=f5fe24724fe05481e3841f9eb5ab8efdee0a3dd83645ae9dcf45703f525bab7b",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_739",
    "name": "Ayush TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Ayush TV",
    "url": "http://d1msejlow1t3l4.cloudfront.net/fta/ayushtv/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_740",
    "name": "CVR OM Spiritual",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of CVR OM Spiritual",
    "url": "https://yuppnimrestreammum.akamaized.net/181224/smil:cvrom1.smil/playlist.m3u8?hdnts=st=1735898689~exp=1835898688~acl=*~hmac=f5fe24724fe05481e3841f9eb5ab8efdee0a3dd83645ae9dcf45703f525bab7b",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_741",
    "name": "Mahaa News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of Mahaa News",
    "url": "https://mumt07.tangotv.in/zHjX9OFlMAHAANEWS/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_742",
    "name": "Hindu Dharmam",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Hindu Dharmam",
    "url": "https://mumt01.tangotv.in/O5aw8Zn3HINDUDHARMAM/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_743",
    "name": "Mahaa Max",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Mahaa Max",
    "url": "https://d1msejlow1t3l4.cloudfront.net/fta/mahaamax/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_744",
    "name": "Mahaa Bhakti",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Mahaa Bhakti",
    "url": "https://d1msejlow1t3l4.cloudfront.net/fta/mahaabhakti/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_745",
    "name": "News 1st",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of News 1st",
    "url": "https://d1msejlow1t3l4.cloudfront.net/fta/News1st/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_746",
    "name": "Mantavya News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of Mantavya News",
    "url": "https://d1msejlow1t3l4.cloudfront.net/fta/mantavya/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_747",
    "name": "V6 News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of V6 News",
    "url": "https://d1rc86nwwc9fag.cloudfront.net/140622/v6newsdev/playlist.m3u8?hdnts=st=1735898689~exp=1835898688~acl=*~hmac=f5fe24724fe05481e3841f9eb5ab8efdee0a3dd83645ae9dcf45703f525bab7b",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_748",
    "name": "T News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of T News",
    "url": "https://yuppnimresmum.akamaized.net/120723/smil:tnews.smil/playlist.m3u8?hdnts=st=1735898689~exp=1835898688~acl=*~hmac=f5fe24724fe05481e3841f9eb5ab8efdee0a3dd83645ae9dcf45703f525bab7b",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_749",
    "name": "TV5 News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of TV5 News",
    "url": "https://yuppnimresmum.akamaized.net/110322/tv5/playlist.m3u8?hdnts=st=1735898689~exp=1835898688~acl=*~hmac=f5fe24724fe05481e3841f9eb5ab8efdee0a3dd83645ae9dcf45703f525bab7b",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_750",
    "name": "INews",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of INews",
    "url": "https://yuppnimresmum.akamaized.net/28072023/smil:inews.smil/playlist.m3u8?hdnts=st=1735898689~exp=1835898688~acl=*~hmac=f5fe24724fe05481e3841f9eb5ab8efdee0a3dd83645ae9dcf45703f525bab7b",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_751",
    "name": "Darshana TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Darshana TV",
    "url": "https://yuppparoriglin.akamaized.net/181224/smil:darshanatv.smil/playlist.m3u8?hdnts=st=1735898689~exp=1835898688~acl=*~hmac=f5fe24724fe05481e3841f9eb5ab8efdee0a3dd83645ae9dcf45703f525bab7b",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_752",
    "name": "Kappa TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Kappa TV",
    "url": "https://d1msejlow1t3l4.cloudfront.net/fta/kappatv/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_753",
    "name": "Kairali TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Kairali TV",
    "url": "https://streams.tangotv.in/KAIRALI/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_754",
    "name": "Kappa TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Kappa TV",
    "url": "https://mumt03.tangotv.in/Dsly5z3HKAPPATV/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_755",
    "name": "Amrita TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Amrita TV",
    "url": "https://mumt07.tangotv.in/zHjX9OFlAMRITATV/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_756",
    "name": "Kairali We",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Kairali We",
    "url": "https://streams.tangotv.in/WETV/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_757",
    "name": "Rupasi Bangla",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Rupasi Bangla",
    "url": "https://da86m1sqpm3o0.cloudfront.net/28072023/smil:rupashibangla.smil/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_758",
    "name": "Manorama News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of Manorama News",
    "url": "https://streams.tangotv.in/MANORAMANEWSNORTH/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_759",
    "name": "Mathrubhumi News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of Mathrubhumi News",
    "url": "https://streams.tangotv.in/MATHRUBHUMINEWS/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_760",
    "name": "Mazhavil Manorama",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Mazhavil Manorama",
    "url": "https://mumt03.tangotv.in/Dsly5z3HMAZHAVILMANORAMAINT/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_761",
    "name": "Kairali News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of Kairali News",
    "url": "https://mumt01.tangotv.in/O5aw8Zn3KAIRALINEWS/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_762",
    "name": "Star Vijay",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Star Vijay",
    "url": "https://da86m1sqpm3o0.cloudfront.net/28072023/smil:starvijayuk.smil/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_763",
    "name": "Asianet Movies HD",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Asianet Movies HD",
    "url": "https://da86m1sqpm3o0.cloudfront.net/28072023/smil:asianetmovies1.smil/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_764",
    "name": "Zee Tamil HD",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Zee Tamil HD",
    "url": "https://da86m1sqpm3o0.cloudfront.net/28072023/smil:zeetamil1.smil/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_765",
    "name": "WOW Kidz",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of WOW Kidz",
    "url": "https://yuppparoriglin.akamaized.net/181224/smil:wowkidztelgu.smil/playlist.m3u8?hdnts=st=1735898689~exp=1835898688~acl=*~hmac=f5fe24724fe05481e3841f9eb5ab8efdee0a3dd83645ae9dcf45703f525bab7b",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_766",
    "name": "WOW Kidz Tamil",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of WOW Kidz Tamil",
    "url": "https://yuppparoriglin.akamaized.net/181224/smil:wowkidztam.smil/playlist.m3u8?hdnts=st=1735898689~exp=1835898688~acl=*~hmac=f5fe24724fe05481e3841f9eb5ab8efdee0a3dd83645ae9dcf45703f525bab7b",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_767",
    "name": "Colors Kannada HD (1080i)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Colors Kannada HD (1080i)",
    "url": "https://da86m1sqpm3o0.cloudfront.net/28072023/smil:colorskannadahd1.smil/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_768",
    "name": "Jaihind TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Jaihind TV",
    "url": "https://mumt03.tangotv.in/Dsly5z3HJAIHIND/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_769",
    "name": "R Plus Gold",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of R Plus Gold",
    "url": "https://vglivessai.akamaized.net/sg/v1/master/611d79b11b77e2f571934fd80ca1413453772ac7/cf883da3-f9f5-4c70-b0ef-b3ac2e2ad1e3/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_770",
    "name": "Media One",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Media One",
    "url": "https://streams.tangotv.in/MEDIAONETV/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_771",
    "name": "Darshana TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Darshana TV",
    "url": "https://mumt04.tangotv.in/m18aqlK4DARSHANATV/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_772",
    "name": "Reporter TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Reporter TV",
    "url": "https://mumt07.tangotv.in/zHjX9OFlREPORTERTV/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_773",
    "name": "Epic Bharat Digital",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Epic Bharat Digital",
    "url": "https://epiconvh.akamaized.net/live/nazara/master.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_774",
    "name": "Public Music",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Music & Songs",
    "quality": "HD Quality",
    "description": "Live online broadcast of Public Music",
    "url": "https://mumt04.tangotv.in/m18aqlK4PUBLICMUSIC/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_775",
    "name": "Public TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Public TV",
    "url": "https://streams.tangotv.in/PUBLICTV/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_776",
    "name": "Republic Kannada",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Republic Kannada",
    "url": "https://streams.tangotv.in/REPUBLICKANNADA/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_777",
    "name": "TV9 Kannada",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of TV9 Kannada",
    "url": "https://streams.tangotv.in/TV9KANNADA/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_778",
    "name": "Guarantee News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of Guarantee News",
    "url": "https://mumt03.tangotv.in/Dsly5z3HGAURANTEENEWS/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_779",
    "name": "TV5 Kannada",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of TV5 Kannada",
    "url": "https://mumt07.tangotv.in/zHjX9OFlTV5KANNADA/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_780",
    "name": "Power TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Power TV",
    "url": "https://mumt06.tangotv.in/qYyB8fXVPOWERTV/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_781",
    "name": "Raj News Kannada",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of Raj News Kannada",
    "url": "https://mumt03.tangotv.in/Dsly5z3HRAJNEWSKANDA/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_782",
    "name": "Sangeet Bangla",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Sangeet Bangla",
    "url": "https://mumt05.tangotv.in/87NeALx2SANGEETBANGLA/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_783",
    "name": "Enterr 10 Bangla",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Enterr 10 Bangla",
    "url": "https://mumt07.tangotv.in/zHjX9OFlENTERR10BANGLA/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_784",
    "name": "Khushboo Bangla",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Khushboo Bangla",
    "url": "https://mumt01.tangotv.in/O5aw8Zn3KHUSHBOOTVBANGLA/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_785",
    "name": "Republic Bangla",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Republic Bangla",
    "url": "https://streams.tangotv.in/RBANGLA/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_786",
    "name": "Rongeen TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Rongeen TV",
    "url": "https://mumt05.tangotv.in/87NeALx2RONGEENTV/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_787",
    "name": "Dhoom Music",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Music & Songs",
    "quality": "HD Quality",
    "description": "Live online broadcast of Dhoom Music",
    "url": "https://mumt06.tangotv.in/qYyB8fXVDHOOMMUSIC/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_788",
    "name": "Hosanna TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Hosanna TV",
    "url": "https://asia.mslivestream.net/mslive/bfba54c5c96a6359e2da0ca35f4998af.sdp/playlist.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_789",
    "name": "Star Maa HD",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Star Maa HD",
    "url": "https://da86m1sqpm3o0.cloudfront.net/28072023/smil:starmaa1.smil/chunklist_b2628000.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_790",
    "name": "Asianet HD",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Asianet HD",
    "url": "https://raw.githubusercontent.com/amazeyourself/adaptive-streams/refs/heads/main/streams/in/YuppTV/AsianetHD.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_791",
    "name": "Star Maa Movies HD",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Star Maa Movies HD",
    "url": "https://da86m1sqpm3o0.cloudfront.net/28072023/smil:maamovies.smil/chunklist_b2628000.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_792",
    "name": "Star Jalsha HD",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Star Jalsha HD",
    "url": "https://da86m1sqpm3o0.cloudfront.net/28072023/smil:starjalsha.smil/chunklist_b1928000.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_793",
    "name": "TV9 Bangla",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of TV9 Bangla",
    "url": "https://streams.tangotv.in/TV9BANGLA/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_794",
    "name": "Kalinga TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Kalinga TV",
    "url": "https://mumt01.tangotv.in/O5aw8Zn3KALINGATV/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_795",
    "name": "Prameya News7",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of Prameya News7",
    "url": "https://mumt03.tangotv.in/Dsly5z3HPRAMEYANEWS7/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_796",
    "name": "Star Pravah HD",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of Star Pravah HD",
    "url": "https://da86m1sqpm3o0.cloudfront.net/28072023/smil:starpravah.smil/chunklist_b1928000.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_797",
    "name": "Odisha TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Odisha TV",
    "url": "https://streams.tangotv.in/OTVLIVE24X7/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_798",
    "name": "Rengoni",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Rengoni",
    "url": "https://streams.tangotv.in/RENGONI/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_799",
    "name": "Spondon",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Spondon",
    "url": "https://mumt05.tangotv.in/87NeALx2SPONDON/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_800",
    "name": "Rang",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Rang",
    "url": "https://streams.tangotv.in/RANG/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_801",
    "name": "Ramdhenu",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Ramdhenu",
    "url": "https://mumt01.tangotv.in/O5aw8Zn3RAMDHENU/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_802",
    "name": "News Live",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of News Live",
    "url": "https://mumt06.tangotv.in/qYyB8fXVINDRADHANU/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_803",
    "name": "Nandighosha TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Nandighosha TV",
    "url": "https://mumt05.tangotv.in/87NeALx2NANDIGHOSHATV/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_804",
    "name": "Northeast Live",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Northeast Live",
    "url": "https://mumt01.tangotv.in/O5aw8Zn3NORTHEASTLIVE/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_805",
    "name": "Tehzeeb TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Tehzeeb TV",
    "url": "https://mumt05.tangotv.in/87NeALx2TEHZEEBTV/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_806",
    "name": "Channel WIN",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Channel WIN",
    "url": "https://mumt05.tangotv.in/87NeALx2CHANNELWIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_807",
    "name": "Pratidin Time",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Pratidin Time",
    "url": "https://streams.tangotv.in/PROTIDINTIME/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_808",
    "name": "Prag News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of Prag News",
    "url": "https://streams.tangotv.in/PRAGNEWS/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_809",
    "name": "Assam Talks",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Assam Talks",
    "url": "https://mumt05.tangotv.in/87NeALx2ASSAMTALKS/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_810",
    "name": "Nepal 1",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Nepal 1",
    "url": "https://mumt05.tangotv.in/87NeALx2NEPAL1/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_811",
    "name": "Hornbill TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Hornbill TV",
    "url": "https://mumt01.tangotv.in/O5aw8Zn3HORNBILLTV/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_812",
    "name": "9X Jalwa",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of 9X Jalwa",
    "url": "https://tvsen6.aynaott.com/CiPT1VTG8bVekeAZiibd/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_813",
    "name": "Salaam TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Salaam TV",
    "url": "https://mumt07.tangotv.in/zHjX9OFlZEESALAM/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_814",
    "name": "Rupasi Bangla",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Rupasi Bangla",
    "url": "https://tvsen6.aynaott.com/a4L7Tcqv/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_815",
    "name": "Goldmines Bollywood",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Goldmines Bollywood",
    "url": "https://tvsen6.aynaott.com/55xNrLdf/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_816",
    "name": "Network 10",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Network 10",
    "url": "https://tvsen6.aynaott.com/3Cb2WLFz/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_817",
    "name": "Zee 24 Ghanta",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Zee 24 Ghanta",
    "url": "https://tvsen6.aynaott.com/DpPnXP9r/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_818",
    "name": "B4U Music",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Music & Songs",
    "quality": "HD Quality",
    "description": "Live online broadcast of B4U Music",
    "url": "https://mumbai-edge.smartplaytv.in/B4uMusic/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_819",
    "name": "Village TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Village TV",
    "url": "https://live.villagetv.net/villagetv/hd/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_820",
    "name": "Zee Bharat",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Zee Bharat",
    "url": "https://mumt03.tangotv.in/Dsly5z3HZEEBHARAT/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_821",
    "name": "Zee 24 Taas",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Zee 24 Taas",
    "url": "https://streams.tangotv.in/ZEE24TAAS/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_822",
    "name": "Win TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Win TV",
    "url": "https://mumt06.tangotv.in/qYyB8fXVWINTV/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_823",
    "name": "Zee News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of Zee News",
    "url": "https://mumt07.tangotv.in/zHjX9OFlZEENEWS/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_824",
    "name": "Zee Uttar Pradesh/Uttarakhand",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Zee Uttar Pradesh/Uttarakhand",
    "url": "https://mumt07.tangotv.in/zHjX9OFlZEEUPUK/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_825",
    "name": "Kairali We",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Kairali We",
    "url": "https://mumt01.tangotv.in/O5aw8Zn3WETV/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_826",
    "name": "Vaanavil TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Vaanavil TV",
    "url": "https://mumt01.tangotv.in/O5aw8Zn3VAANAVILTV/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_827",
    "name": "SVBC",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of SVBC",
    "url": "https://mumt04.tangotv.in/m18aqlK4SVBCTELUGU/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_828",
    "name": "Velicham TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Velicham TV",
    "url": "https://mumt05.tangotv.in/87NeALx2VALICHAMPLUS/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_829",
    "name": "T News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of T News",
    "url": "https://mumt03.tangotv.in/Dsly5z3HTNEWS/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_830",
    "name": "Vendhar TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Vendhar TV",
    "url": "https://mumt04.tangotv.in/m18aqlK4VENDHARTV/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_831",
    "name": "Thanthi TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Thanthi TV",
    "url": "https://mumt03.tangotv.in/Dsly5z3HTHANTHITV/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_832",
    "name": "Tamilan TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Tamilan TV",
    "url": "https://mumt04.tangotv.in/m18aqlK4TAMILANTELEVISION/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_833",
    "name": "Swadesh News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of Swadesh News",
    "url": "https://mumt03.tangotv.in/Dsly5z3HSWADESHNEWS/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_834",
    "name": "Sankara TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Sankara TV",
    "url": "https://mumt05.tangotv.in/87NeALx2SRISANKARA/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_835",
    "name": "SVBC 3",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of SVBC 3",
    "url": "https://mumt01.tangotv.in/O5aw8Zn3SVBC3KANNADA/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_836",
    "name": "Subhavaartha TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Subhavaartha TV",
    "url": "https://mumt05.tangotv.in/87NeALx2SUBHAVAARTHATV/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_837",
    "name": "Zodiak TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "1080p FHD",
    "description": "Live online broadcast of Zodiak TV",
    "url": "https://ranacable.duckdns.org/ZodiakTv/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_838",
    "name": "Suvarna News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "HD Quality",
    "description": "Live online broadcast of Suvarna News",
    "url": "https://streams.tangotv.in/SUVARNANEWS/ORIGIN/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_839",
    "name": "Studio One +",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Studio One +",
    "url": "https://mumt04.tangotv.in/m18aqlK4STUDIOONEPLUS/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_840",
    "name": "SVBC 4",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of SVBC 4",
    "url": "https://mumt05.tangotv.in/87NeALx2SVBC4HINDI/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_841",
    "name": "SVBC 2",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of SVBC 2",
    "url": "https://mumt03.tangotv.in/Dsly5z3HSVBC2TAMIL/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_842",
    "name": "Hosanna TV Global",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Hosanna TV Global",
    "url": "https://ktismaservers.in:3349/live/hosannatvlive.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_843",
    "name": "Shekinah TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Shekinah TV",
    "url": "https://mumt03.tangotv.in/Dsly5z3HSHEKINAHTV/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_844",
    "name": "Shubh TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Shubh TV",
    "url": "https://mumt03.tangotv.in/Dsly5z3HSHUBHTV/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_845",
    "name": "Shubh Cinema TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Shubh Cinema TV",
    "url": "https://mumt03.tangotv.in/Dsly5z3HSHUBHCINEMA/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_846",
    "name": "YET Max",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of YET Max",
    "url": "https://live.yettelevision.com:5443/LiveApp/streams/yettv2.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_847",
    "name": "YET TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "720p HD",
    "description": "Live online broadcast of YET TV",
    "url": "https://live.yettelevision.com:5443/LiveApp/streams/yettv.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_848",
    "name": "Shubhsandesh TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Shubhsandesh TV",
    "url": "https://mumt03.tangotv.in/Dsly5z3HSHUBHSANDESH/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_849",
    "name": "Shalom",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Shalom",
    "url": "https://mumt01.tangotv.in/O5aw8Zn3SHALOMTVINDIA/index.m3u8",
    "backupUrls": [],
    "isFeatured": false
  },
  {
    "id": "live_ch_850",
    "name": "Shemaroo Marathi Bana",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Entertainment",
    "quality": "HD Quality",
    "description": "Live online broadcast of Shemaroo Marathi Bana",
    "url": "https://mumt07.tangotv.in/zHjX9OFlSHEMAROOMARATHIBANA/index.m3u8",
    "backupUrls": [],
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
    id: 'aajtak-hd',
    name: 'Aaj Tak HD Live',
    category: 'Hindi News • 1080p FHD',
    desc: "Watch India's leading 24x7 Hindi national breaking news, prime-time debates, and ground reports in Full HD.",
    bg: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80',
    tag: 'LIVE 24/7',
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
    id: 'nasa-tv-uhd',
    name: 'NASA TV HD (Space)',
    category: 'Science & Space • 4K UHD',
    desc: "Live views from the International Space Station, spacewalks, and Artemis rocket launches.",
    bg: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
    tag: 'NASA LIVE',
    quality: '4K UHD'
  },
  {
    id: 'al-jazeera-en',
    name: 'Al Jazeera World News HD',
    category: 'World News • 1080p FHD',
    desc: "Award-winning global breaking news, international headlines, and in-depth investigative reports.",
    bg: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&auto=format&fit=crop&q=80',
    tag: 'GLOBAL LIVE',
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
    if (typeof svg.setAttribute === 'function') {
      svg.setAttribute('fill', isFav ? '#facc15' : '#FFFFFF');
    }
    if (svg.style) {
      svg.style.fill = isFav ? '#facc15' : '#FFFFFF';
    }
  }
}

// ==========================================================
// 6. STREAM PLAYBACK ENGINE & RESTORED SLEEK MINI-PLAYER
// ==========================================================
let currentBackupIdx = 0;
let streamWatchdogTimeout = null;

function showBufferingSpinner(msg) {
  const spinner = document.getElementById('playerBufferingSpinner');
  if (spinner) {
    if (msg) {
      const txt = spinner.querySelector('.spinner-text');
      if (txt) txt.textContent = msg;
    }
    spinner.style.display = 'flex';
  }
}

function hideBufferingSpinner() {
  const spinner = document.getElementById('playerBufferingSpinner');
  if (spinner) spinner.style.display = 'none';
}

function updateAudioArtwork() {
  const artwork = document.getElementById('playerAudioArtwork');
  const backdropImg = document.getElementById('playerBackdropImg');
  const videoElement = document.getElementById('luminaVideo');
  if (!artwork) return;
  if (!currentPlayingChannel) {
    artwork.style.display = 'none';
    if (backdropImg) backdropImg.style.backgroundImage = 'none';
    if (videoElement) videoElement.style.opacity = '1';
    return;
  }
  
  const isAudio = currentPlayingChannel.type === 'radio' || 
                  (currentPlayingChannel.isLocal && currentPlayingChannel.type !== 'tv') ||
                  (currentPlayingChannel.url && /\.(mp3|m4a|wav|aac|flac|ogg|opus)(\?|$)/i.test(currentPlayingChannel.url));
  
  const thumb = currentPlayingChannel.thumbUrl || currentPlayingChannel.logo || '';
  if (backdropImg) {
    if (thumb) {
      backdropImg.style.backgroundImage = `url("${thumb}")`;
      backdropImg.style.display = 'block';
    } else {
      backdropImg.style.backgroundImage = 'none';
    }
  }

  if (isAudio) {
    artwork.style.display = 'flex';
    if (videoElement) videoElement.style.opacity = '0';
    const titleEl = document.getElementById('audioArtworkTitle');
    const subEl = document.getElementById('audioArtworkSub');
    const coverEl = document.getElementById('audioArtworkCover');
    const iconEl = document.getElementById('audioArtworkIcon');
    const cleanTitle = currentPlayingChannel.name ? currentPlayingChannel.name.replace(/\.(mp4|mkv|mov|webm|avi|flv|ts|3gp|mp3|m4a|wav|aac|flac|ogg|opus)$/i, '').replace(/[._]/g, ' ').replace(/\s+/g, ' ').trim() : 'Now Playing';
    if (titleEl) titleEl.textContent = cleanTitle || 'Now Playing';
    if (subEl) {
      if (currentPlayingChannel.isLocal) {
        subEl.textContent = '📂 ' + (currentPlayingChannel.folder || 'Device Storage') + (currentPlayingChannel.quality ? ' • ' + currentPlayingChannel.quality : '');
      } else {
        subEl.textContent = (currentPlayingChannel.countryName || 'Radio') + ' • ' + (currentPlayingChannel.category || 'Audio Stream');
      }
    }
    if (coverEl && iconEl) {
      if (thumb) {
        coverEl.style.backgroundImage = `url("${thumb}")`;
        iconEl.style.display = 'none';
      } else {
        coverEl.style.backgroundImage = 'none';
        iconEl.style.display = 'block';
        iconEl.textContent = currentPlayingChannel.flag || (currentPlayingChannel.type === 'radio' ? '📻' : '🎵');
      }
    }
  } else {
    artwork.style.display = 'none';
    if (videoElement) videoElement.style.opacity = '1';
  }
}

function playChannel(ch) {
  currentBackupIdx = -1;
  openFullPlayerModal();
  loadChannelMedia(ch, true);
}

function loadChannelMedia(ch, autoPlay) {
  currentPlayingChannel = ch;
  const videoElement = document.getElementById('luminaVideo');
  clearTimeout(streamWatchdogTimeout);

  if (autoPlay) {
    openFullPlayerModal();
    showBufferingSpinner('Connecting Stream...');
  }

  if (!ch.isLocal) {
    recentChannels = [ch.id, ...recentChannels.filter(id => id !== ch.id)].slice(0, 10);
    localStorage.setItem('aakash_recents', JSON.stringify(recentChannels));
  }

  const playerMainTitle = document.getElementById('playerMainTitle');
  const playerSubTitle = document.getElementById('playerSubTitle');
  const miniTitle = document.getElementById('miniTitle');
  const miniSub = document.getElementById('miniSub');
  const miniThumb = document.getElementById('miniThumb');

  const cleanTitle = ch.name ? ch.name.replace(/\.(mp4|mkv|mov|webm|avi|flv|ts|3gp|mp3|m4a|wav|aac|flac|ogg|opus)$/i, '').replace(/[._]/g, ' ').replace(/\s+/g, ' ').trim() : 'Media Stream';

  if (playerMainTitle) playerMainTitle.textContent = cleanTitle || ch.name;
  if (playerSubTitle) {
    if (ch.isLocal) {
      playerSubTitle.textContent = '📂 ' + (ch.folder || 'Storage') + ' • ' + (ch.type === 'tv' ? 'Local Video' : 'Local Audio') + (ch.quality ? ' • ' + ch.quality : '');
    } else {
      playerSubTitle.textContent = (ch.flag ? ch.flag + ' ' : '') + (ch.countryName || 'Live') + ' • ' + (ch.category || 'Stream') + ' • ' + (ch.quality || 'HD');
    }
  }
  if (miniTitle) miniTitle.textContent = cleanTitle || ch.name;
  if (miniSub) miniSub.textContent = ch.isLocal ? 'OFFLINE • ' + (ch.folder || 'STORAGE') : 'LIVE STREAM • ' + (ch.quality || 'HD');
  if (miniThumb) miniThumb.textContent = ch.type === 'radio' ? '📻' : (ch.isLocal ? (ch.type === 'tv' ? '🎬' : '🎵') : (ch.flag || '📺'));

  updateFavIconUI();
  updateAudioArtwork();

  // Cleanly detach any previous HLS stream
  if (hlsInstance) {
    try {
      hlsInstance.detachMedia();
      hlsInstance.destroy();
    } catch (e) {}
    hlsInstance = null;
  }

  if (videoElement) {
    videoElement.pause();
  }

  let streamUrl = ch.url;
  if (currentBackupIdx >= 0 && ch.backupUrls && ch.backupUrls.length > 0 && currentBackupIdx < ch.backupUrls.length) {
    streamUrl = ch.backupUrls[currentBackupIdx];
  }

  // Check saved resume point for offline/local media
  const resumeKey = 'aakash_resume_' + ch.id;
  const savedResumeTime = ch.isLocal ? parseInt(localStorage.getItem(resumeKey) || '0', 10) : 0;

  // Bind video element events for spinner with multiple safety nets
  if (videoElement) {
    videoElement.onwaiting = () => showBufferingSpinner('Buffering...');
    videoElement.onloadeddata = () => {
      clearTimeout(streamWatchdogTimeout);
      hideBufferingSpinner();
    };
    videoElement.onloadedmetadata = () => {
      clearTimeout(streamWatchdogTimeout);
      hideBufferingSpinner();
    };
    videoElement.onplaying = () => {
      clearTimeout(streamWatchdogTimeout);
      hideBufferingSpinner();
      isPlaying = true;
      updatePlayPauseIcons(true);
    };
    videoElement.oncanplay = () => {
      clearTimeout(streamWatchdogTimeout);
      hideBufferingSpinner();
    };
    videoElement.onerror = () => {
      clearTimeout(streamWatchdogTimeout);
      if (ch.backupUrls && currentBackupIdx + 1 < ch.backupUrls.length) {
        currentBackupIdx++;
        showToast('Connecting backup stream mirror...');
        loadChannelMedia(ch, true);
      } else {
        hideBufferingSpinner();
        showToast('Stream is currently offline. Please try another channel.');
      }
    };
  }

  // Fast-start ABR HLS Configuration for instant mobile loading
  if (streamUrl && (streamUrl.endsWith('.m3u8') || streamUrl.includes('m3u8')) && window.Hls && Hls.isSupported() && !ch.isLocal) {
    hlsInstance = new Hls({
      enableWorker: true,
      autoStartLoad: true,
      lowLatencyMode: false,
      maxBufferLength: 30,
      maxMaxBufferLength: 60,
      manifestLoadingTimeOut: 8000,
      fragLoadingTimeOut: 10000
    });

    hlsInstance.loadSource(streamUrl);
    hlsInstance.attachMedia(videoElement);

    hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
      if (autoPlay && videoElement) {
        const p = videoElement.play();
        if (p !== undefined) {
          p.then(() => {
            hideBufferingSpinner();
            isPlaying = true;
            updatePlayPauseIcons(true);
          }).catch(() => {});
        }
      }
    });

    hlsInstance.on(Hls.Events.LEVEL_LOADED, () => {
      clearTimeout(streamWatchdogTimeout);
      hideBufferingSpinner();
    });

    hlsInstance.on(Hls.Events.FRAG_BUFFERED, () => {
      clearTimeout(streamWatchdogTimeout);
      hideBufferingSpinner();
    });

    hlsInstance.on(Hls.Events.FRAG_LOADED, () => {
      clearTimeout(streamWatchdogTimeout);
      hideBufferingSpinner();
    });

    hlsInstance.on(Hls.Events.ERROR, (event, data) => {
      if (!hlsInstance) return;
      if (data.fatal) {
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            if (ch.backupUrls && currentBackupIdx + 1 < ch.backupUrls.length) {
              currentBackupIdx++;
              showToast('⚡ Connecting high-speed stream mirror...');
              loadChannelMedia(ch, true);
            } else if (hlsInstance) {
              hlsInstance.startLoad();
            }
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            if (hlsInstance) {
              hlsInstance.recoverMediaError();
            }
            break;
          default:
            if (hlsInstance) {
              hlsInstance.destroy();
              hlsInstance = null;
            }
            break;
        }
      }
    });

    // Stream Speed Watchdog (5s auto-failover if stream hangs)
    if (autoPlay && ch.backupUrls && ch.backupUrls.length > 0) {
      streamWatchdogTimeout = setTimeout(() => {
        if (videoElement && (videoElement.paused || videoElement.readyState < 2)) {
          if (currentBackupIdx + 1 < ch.backupUrls.length) {
            currentBackupIdx++;
            showToast('⚡ Switching to high-speed stream mirror...');
            loadChannelMedia(ch, true);
          }
        }
      }, 5000);
    }

  } else if (streamUrl) {
    if (videoElement) {
      videoElement.src = streamUrl;
      
      if (savedResumeTime > 5) {
        const onLoaded = function() {
          videoElement.removeEventListener('loadedmetadata', onLoaded);
          if (videoElement.duration && savedResumeTime < videoElement.duration - 5) {
            videoElement.currentTime = savedResumeTime;
            showToast('Resumed at ' + formatSeekTime(savedResumeTime));
          }
        };
        videoElement.addEventListener('loadedmetadata', onLoaded);
      }

      if (autoPlay) {
        const startPlayback = () => {
          const p = videoElement.play();
          if (p !== undefined) {
            p.then(() => {
              hideBufferingSpinner();
              isPlaying = true;
              updatePlayPauseIcons(true);
            }).catch(() => {});
          }
        };
        startPlayback();
        videoElement.addEventListener('canplay', startPlayback, { once: true });
      }
    }
  }

  // Safety fallback: unconditionally hide spinner after 2s
  setTimeout(hideBufferingSpinner, 2000);

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
  
  // Native Android: immersive fullscreen + keep screen on
  try {
    if (window.AndroidMedia) {
      if (window.AndroidMedia.setFullscreen) window.AndroidMedia.setFullscreen(true);
      if (window.AndroidMedia.keepScreenOn) window.AndroidMedia.keepScreenOn(true);
      // Auto-rotate to landscape for video content, free rotation for audio
      if (currentPlayingChannel && (currentPlayingChannel.type === 'tv' || currentPlayingChannel.type === 'video')) {
        if (window.AndroidMedia.setOrientation) window.AndroidMedia.setOrientation('landscape');
      } else {
        if (window.AndroidMedia.setOrientation) window.AndroidMedia.setOrientation('auto');
      }
    }
  } catch (e) {}

  // Show/hide audio artwork based on content type
  updateAudioArtwork();
  
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
  
  // Restore orientation and screen state
  try {
    if (window.AndroidMedia) {
      if (window.AndroidMedia.setOrientation) window.AndroidMedia.setOrientation('auto');
      if (window.AndroidMedia.keepScreenOn) window.AndroidMedia.keepScreenOn(false);
    }
  } catch (e2) {}
  
  // Hide audio artwork
  const artwork = document.getElementById('playerAudioArtwork');
  if (artwork) artwork.style.display = 'none';
  
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
  
  clearTimeout(streamWatchdogTimeout);

  if (videoElement) {
    videoElement.pause();
    videoElement.removeAttribute('src');
    videoElement.load();
  }
  
  if (hlsInstance) {
    try {
      hlsInstance.destroy();
    } catch (e) {}
    hlsInstance = null;
  }
  
  if (playerModal) {
    playerModal.classList.remove('active');
    playerModal.style.display = 'none';
  }
  
  if (miniPlayer) {
    miniPlayer.classList.remove('active');
  }

  // Restore orientation and screen state
  try {
    if (window.AndroidMedia) {
      if (window.AndroidMedia.setOrientation) window.AndroidMedia.setOrientation('auto');
      if (window.AndroidMedia.keepScreenOn) window.AndroidMedia.keepScreenOn(false);
    }
  } catch (e2) {}
  
  // Hide audio artwork
  const artwork = document.getElementById('playerAudioArtwork');
  if (artwork) artwork.style.display = 'none';
  
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

function showSeekRipple(seconds) {
  const playerModal = document.getElementById('playerModal');
  if (!playerModal) return;
  const isFwd = seconds > 0;
  const ripple = document.createElement('div');
  ripple.className = 'seek-ripple-feedback ' + (isFwd ? 'right' : 'left');
  ripple.innerHTML = `
    <div class="seek-ripple-circle"></div>
    <span class="seek-ripple-text">${isFwd ? '⏩ +' + Math.abs(seconds) + 's' : '⏪ -' + Math.abs(seconds) + 's'}</span>
  `;
  playerModal.appendChild(ripple);
  setTimeout(() => {
    if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
  }, 600);
}

window.skipTime = function(seconds) {
  const videoElement = document.getElementById('luminaVideo');
  if (!videoElement) return;
  videoElement.currentTime = Math.max(0, videoElement.currentTime + seconds);
  showSeekRipple(seconds);
  showToast((seconds > 0 ? '+' : '') + seconds + 's');
  resetPlayerHideTimer();
};

window.handleSeekbarClick = function(e) {
  const videoElement = document.getElementById('luminaVideo');
  if (!videoElement || !videoElement.duration || isNaN(videoElement.duration)) return;
  const rect = e.currentTarget.getBoundingClientRect();
  const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : null);
  if (clientX === null) return;
  const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  videoElement.currentTime = pos * videoElement.duration;
  showToast('Seek: ' + formatSeekTime(videoElement.currentTime));
  resetPlayerHideTimer();
};

let orientationModes = ['auto', 'landscape', 'portrait'];
let orientationLabels = ['🔄 Auto-Rotate', '🔄 Landscape', '🔄 Portrait'];
let currentOrientIdx = 0;

window.cycleOrientation = function() {
  currentOrientIdx = (currentOrientIdx + 1) % orientationModes.length;
  const mode = orientationModes[currentOrientIdx];
  if (window.AndroidMedia && window.AndroidMedia.setOrientation) {
    window.AndroidMedia.setOrientation(mode);
  }
  const btnText = document.getElementById('playerRotateText');
  if (btnText) btnText.textContent = orientationLabels[currentOrientIdx];
  showToast(orientationLabels[currentOrientIdx]);
  resetPlayerHideTimer();
};

window.toggleFullScreen = function() {
  const isLandscape = window.innerWidth > window.innerHeight;
  const targetMode = isLandscape ? 'portrait' : 'landscape';
  
  if (window.AndroidMedia && window.AndroidMedia.setOrientation) {
    window.AndroidMedia.setOrientation(targetMode);
  }
  if (window.AndroidMedia && window.AndroidMedia.setFullscreen) {
    window.AndroidMedia.setFullscreen(true);
  }

  const btnText = document.getElementById('playerRotateText');
  if (btnText) {
    btnText.textContent = targetMode === 'landscape' ? '🔄 Landscape' : '🔄 Portrait';
  }

  // Also try native fullscreen API as fallback for non-Android
  try {
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
  } catch (e) {}
  showToast(targetMode === 'landscape' ? 'Fullscreen (Landscape)' : 'Portrait Mode');
  resetPlayerHideTimer();
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

// Auto-hide controls overlay & Double-Tap detection
let lastTapTime = 0;
let lastTapX = 0;

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
      if (e.target.closest('button') || e.target.closest('.player-seekbar-wrap') || e.target.closest('.player-pro-bar') || e.target.closest('.player-doubletap-zone')) return;
      
      const now = Date.now();
      const clickX = e.clientX;
      const rect = playerModal.getBoundingClientRect();

      // Double-click/double-tap detection on left or right third of screen
      if (now - lastTapTime < 300 && Math.abs(clickX - lastTapX) < 60) {
        if (clickX < rect.width * 0.35) {
          skipTime(-10);
          lastTapTime = 0;
          return;
        } else if (clickX > rect.width * 0.65) {
          skipTime(10);
          lastTapTime = 0;
          return;
        }
      }
      lastTapTime = now;
      lastTapX = clickX;

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
        // Save resume position for offline / local media
        if (currentPlayingChannel && currentPlayingChannel.isLocal && videoElement.currentTime > 5) {
          try {
            localStorage.setItem('aakash_resume_' + currentPlayingChannel.id, Math.floor(videoElement.currentTime));
          } catch (e) {}
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
// DUAL-AXIS CINEMATIC SWIPE GESTURES:
// Horizontal = Seek Forward / Backward (⏩ / ⏪)
// Left Vertical = Brightness (☀️)
// Right Vertical = Volume (🔊)
// ==========================================================
let rafSwipePending = false;
let targetSeekTime = 0;
let isSeekingGesture = false;

function formatSeekTime(secs) {
  if (isNaN(secs) || secs < 0) secs = 0;
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  const h = Math.floor(m / 60);
  const remM = m % 60;
  if (h > 0) {
    return h + ':' + (remM < 10 ? '0' : '') + remM + ':' + (s < 10 ? '0' : '') + s;
  }
  return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
}

let initialPinchDist = 0;
let pinchTriggered = false;

function initPlayerSwipeGestures() {
  const playerModal = document.getElementById('playerModal');
  const brightOverlay = document.getElementById('playerBrightnessOverlay');
  const hud = document.getElementById('playerSwipeHud');
  const hudIcon = document.getElementById('playerSwipeHudIcon');
  const hudTitle = document.getElementById('playerSwipeHudTitle');
  const hudPct = document.getElementById('playerSwipeHudPct');

  if (!playerModal) return;

  playerModal.addEventListener('touchstart', (e) => {
    if (isPlayerLocked) return;
    
    // 2-Finger Pinch Detection (VLC-style aspect zoom)
    if (e.touches.length === 2) {
      initialPinchDist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      pinchTriggered = false;
      activeGestureType = null;
      return;
    }

    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    activeGestureType = null;
    isSeekingGesture = false;
    targetSeekTime = 0;
    initialPinchDist = 0;
  }, { passive: true });

  playerModal.addEventListener('touchmove', (e) => {
    if (isPlayerLocked) return;

    // Handle 2-finger pinch zoom
    if (e.touches.length === 2 && initialPinchDist > 0 && !pinchTriggered) {
      const currentDist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      const pinchDiff = currentDist - initialPinchDist;
      if (Math.abs(pinchDiff) > 55) {
        pinchTriggered = true;
        cycleAspectRatio();
      }
      return;
    }

    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    const dx = touch.clientX - touchStartX;
    const dy = touchStartY - touch.clientY;
    const rect = playerModal.getBoundingClientRect();
    const videoElement = document.getElementById('luminaVideo');

    // 1. Identify gesture axis on initial threshold
    if (!activeGestureType) {
      if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy)) {
        // Horizontal Swipe -> Seeking
        activeGestureType = 'seek';
        isSeekingGesture = true;
        touchStartVal = videoElement ? videoElement.currentTime : 0;
        if (hud) hud.className = 'player-swipe-hud-pill hud-center';
      } else if (Math.abs(dy) > 12 && Math.abs(dy) > Math.abs(dx)) {
        // Vertical Swipe -> Left (Brightness) or Right (Volume)
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
      }
    }

    if (!activeGestureType) return;
    if (e.cancelable) {
      e.preventDefault();
    }
    clearTimeout(hudHideTimeout);

    if (!rafSwipePending) {
      rafSwipePending = true;
      requestAnimationFrame(() => {
        rafSwipePending = false;
        if (!activeGestureType) return;

        // A. Horizontal Seeking
        if (activeGestureType === 'seek') {
          const duration = videoElement && videoElement.duration && !isNaN(videoElement.duration) && videoElement.duration !== Infinity 
            ? videoElement.duration 
            : 0;

          // Scale seek step based on swipe distance (up to +-120s or proportional)
          const seekRange = duration > 0 ? Math.min(300, duration * 0.4) : 90;
          const seekOffset = (dx / (rect.width * 0.7)) * seekRange;
          
          targetSeekTime = Math.max(0, touchStartVal + seekOffset);
          if (duration > 0 && targetSeekTime > duration) targetSeekTime = duration;

          const diffSecs = targetSeekTime - touchStartVal;
          const isFwd = diffSecs >= 0;

          if (hudIcon) hudIcon.textContent = isFwd ? '⏩' : '⏪';
          if (hudTitle) {
            hudTitle.textContent = (isFwd ? '+' : '') + Math.round(diffSecs) + 's (' + formatSeekTime(targetSeekTime) + ')';
          }
          if (hudPct) {
            hudPct.textContent = duration > 0 ? formatSeekTime(duration) : 'SEEK';
          }

        // B. Left Vertical Brightness
        } else if (activeGestureType === 'brightness') {
          currentBrightness = Math.max(20, Math.min(150, Math.round(touchStartVal + dy * 0.45)));
          
          if (brightOverlay) {
            if (currentBrightness < 100) {
              brightOverlay.style.background = '#000000';
              brightOverlay.style.opacity = ((100 - currentBrightness) / 100 * 0.8).toFixed(2);
            } else {
              brightOverlay.style.background = '#FFFFFF';
              brightOverlay.style.opacity = ((currentBrightness - 100) / 100 * 0.35).toFixed(2);
            }
          }
          if (hudIcon) hudIcon.textContent = '☀️';
          if (hudTitle) hudTitle.textContent = 'Brightness';
          if (hudPct) hudPct.textContent = currentBrightness + '%';

        // C. Right Vertical Volume
        } else if (activeGestureType === 'volume') {
          currentVolume = Math.max(0, Math.min(100, Math.round(touchStartVal + dy * 0.45)));
          
          if (window.AndroidMedia && window.AndroidMedia.setSystemVolume) {
            window.AndroidMedia.setSystemVolume(currentVolume);
          }
          if (videoElement) {
            videoElement.volume = currentVolume / 100;
            if (videoElement.muted && currentVolume > 0) videoElement.muted = false;
          }
          if (hudIcon) hudIcon.textContent = currentVolume === 0 ? '🔇' : (currentVolume > 50 ? '🔊' : '🔉');
          if (hudTitle) hudTitle.textContent = 'Volume';
          if (hudPct) hudPct.textContent = currentVolume + '%';
        }

        if (hud) hud.classList.add('active');
      });
    }
  }, { passive: false });

  playerModal.addEventListener('touchend', () => {
    initialPinchDist = 0;
    pinchTriggered = false;

    if (!activeGestureType) return;
    
    // If seek gesture finished, apply the target seek position
    if (activeGestureType === 'seek') {
      const videoElement = document.getElementById('luminaVideo');
      if (videoElement && targetSeekTime >= 0) {
        try {
          videoElement.currentTime = targetSeekTime;
        } catch (e) {}
      }
    }

    activeGestureType = null;
    isSeekingGesture = false;
    hudHideTimeout = setTimeout(() => {
      if (hud) hud.classList.remove('active');
    }, 1100);
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

// Canvas Particles (Disabled for optimal 60fps GPU performance on mobile)
function initParticles() {}

// ==========================================================
// ANDROID HARDWARE BACK BUTTON & MODAL DISMISS HANDLER
// ==========================================================
let lastBackPressTime = 0;

window.handleAndroidBackPressed = function() {
  const playerModal = document.getElementById('playerModal');
  const drawer = document.getElementById('sideDrawerModal');
  const settings = document.getElementById('settingsModal');

  // 1. If Video Player is open, close/minimize video and stay in app
  if (playerModal && playerModal.classList.contains('active')) {
    closePlayerModalCompletely(null);
    return true;
  }

  // 2. If Side Navigation Drawer is open, close drawer
  if (drawer && drawer.classList.contains('active')) {
    toggleMenuDrawer();
    return true;
  }

  // 3. If Settings Modal is open, close settings
  if (settings && settings.classList.contains('active')) {
    closeSettingsModal();
    return true;
  }

  // 4. If on another page, navigate back to Home
  if (currentActivePage !== 'home') {
    switchPage('home');
    return true;
  }

  // 5. If at Home page with no modals, require double-tap to exit
  const now = Date.now();
  if (now - lastBackPressTime < 2000) {
    return false; // Exit app
  } else {
    lastBackPressTime = now;
    showToast('Press back again to exit app');
    return true;
  }
};