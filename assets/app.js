// ==========================================================
// AAKASHSTREAM - CORE APPLICATION & MEDIA ENGINE
// ==========================================================

const FALLBACK_CHANNELS = [
  {
    "id": "aajtak",
    "name": "Aaj Tak HD",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Sabse Tez \u2022 24x7 National Hindi Breaking News",
    "url": "https://feeds.intoday.in/aajtak/api/aajtakhd/master.m3u8",
    "isFeatured": true
  },
  {
    "id": "abp-news",
    "name": "ABP News",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "720p HD",
    "description": "Desh Ko Rakhe Aagey \u2022 Comprehensive National News",
    "url": "https://abp-i.akamaized.net/hls/live/765529/abpnews/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "ndtv-india",
    "name": "NDTV India",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Khabron Ki Khabar \u2022 Leading In-Depth Journalism",
    "url": "https://ndtvindiaelemarchana.akamaized.net/hls/live/2003679-b/ndtvindia/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "india-tv",
    "name": "India TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "720p HD",
    "description": "Aap Ki Adalat with Rajat Sharma & Prime News",
    "url": "https://indiatvnews-lh.akamaihd.net/i/ITV_1@179378/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "dd-news",
    "name": "DD News HD",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Doordarshan National Public Service News",
    "url": "https://ddnewsstream.akamaized.net/hls/live/2034031/ddnews/master.m3u8",
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
    "description": "Achhi Khabar, Sachhi Khabar from India Today",
    "url": "https://feeds.intoday.in/gnt/api/gnthd/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "dilli-aajtak",
    "name": "Dilli Aaj Tak",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "720p HD",
    "description": "Delhi NCR Local & Regional News Live",
    "url": "https://feeds.intoday.in/dilliaajtak/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "sansad-tv-1",
    "name": "Sansad TV 1 (Lok Sabha)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Live Proceedings of Lok Sabha Parliament",
    "url": "https://sansadtv.akamaized.net/hls/live/2034034/sansad1/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "sansad-tv-2",
    "name": "Sansad TV 2 (Rajya Sabha)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Live Proceedings of Rajya Sabha Parliament",
    "url": "https://sansadtv.akamaized.net/hls/live/2034035/sansad2/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "zee-business",
    "name": "Zee Business",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Business",
    "quality": "720p HD",
    "description": "Stock Markets, Mutual Funds & Personal Finance",
    "url": "https://zeebiz.akamaized.net/hls/live/2034036/zeebiz/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "cnbc-awaaz",
    "name": "CNBC Awaaz",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Business",
    "quality": "720p HD",
    "description": "Share Bazaar & Indian Economy Live Coverage",
    "url": "https://cnbcawaaz.akamaized.net/hls/live/2034037/cnbcawaaz/master.m3u8",
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
    "quality": "720p HD",
    "description": "Khabrein Jo Banti Hain Mudda \u2022 National News",
    "url": "https://newsnation.akamaized.net/hls/live/2034038/newsnation/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "news24",
    "name": "News 24 Hindi",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "News",
    "quality": "720p HD",
    "description": "Rashtriya & Antarrashtriya Breaking Samachar",
    "url": "https://news24.akamaized.net/hls/live/2034039/news24/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "aastha-tv",
    "name": "Aastha TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Devotional",
    "quality": "720p HD",
    "description": "Sanatan Vedic Pravachan, Yoga & Daily Aarti",
    "url": "https://aasthatv.akamaized.net/hls/live/2034040/aastha/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "sanskar-tv",
    "name": "Sanskar TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Devotional",
    "quality": "720p HD",
    "description": "Shri Ram Katha, Krishna Bhajans & Mandir Darshan",
    "url": "https://sanskartv.akamaized.net/hls/live/2034041/sanskar/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "sadhna-tv",
    "name": "Sadhna TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Devotional",
    "quality": "720p HD",
    "description": "Spiritual Enlightenment, Morning Stotras & Katha",
    "url": "https://sadhnatv.akamaized.net/hls/live/2034042/sadhna/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "arihant-tv",
    "name": "Arihant TV (Jain)",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Devotional",
    "quality": "720p HD",
    "description": "Jain Darshan, Jinendra Pooja & Muni Pravachan",
    "url": "https://arihanttv.akamaized.net/hls/live/2034043/arihant/master.m3u8",
    "isFeatured": false
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
    "description": "Doordarshan Flagship Serials, Documentaries & Drama",
    "url": "https://ddnational.akamaized.net/hls/live/2034030/ddnational/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "dd-sports",
    "name": "DD Sports HD",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Sports",
    "quality": "1080p FHD",
    "description": "Live Cricket, Asian Games, Olympics & National Sports",
    "url": "https://ddsports.akamaized.net/hls/live/2034033/ddsports/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "mastiii-music",
    "name": "Mastiii TV",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Music",
    "quality": "720p HD",
    "description": "Non-Stop Bollywood Superhits & Music Countdown",
    "url": "https://mastiii.akamaized.net/hls/live/2034044/mastiii/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "9x-jalwa",
    "name": "9X Jalwa",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Music",
    "quality": "720p HD",
    "description": "Forever Young 90s & 2000s Bollywood Hit Songs",
    "url": "https://9xjalwa.akamaized.net/hls/live/2034045/9xjalwa/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "b4u-music",
    "name": "B4U Music",
    "type": "tv",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Music",
    "quality": "720p HD",
    "description": "Latest Hindi Songs, Movie Trailers & Pop Music",
    "url": "https://b4umusic.akamaized.net/hls/live/2034046/b4umusic/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "air-vividh-bharati-12",
    "name": "AIR Vividh Bharati",
    "type": "radio",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Radio",
    "quality": "32 kbps (FM 102.8)",
    "description": "Evergreen Hindi Songs, Sangeet Sarita, Chhayageet & Jaimala",
    "url": "https://air.pc.cdn.bitgravity.com/air/live/pbaudio034/playlist.m3u8",
    "isFeatured": true
  },
  {
    "id": "air-fm-gold-delhi-13",
    "name": "AIR FM Gold Delhi",
    "type": "radio",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Radio",
    "quality": "32 kbps (FM 106.4)",
    "description": "Golden Hindi Melodies & Hourly News Bulletins",
    "url": "https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio005/hlspbaudio005_Auto.m3u8",
    "isFeatured": false
  },
  {
    "id": "air-fm-rainbow-delhi-14",
    "name": "AIR FM Rainbow Delhi",
    "type": "radio",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Radio",
    "quality": "32 kbps (FM 102.6)",
    "description": "Contemporary Youth Music, Hits & RJ Shows",
    "url": "https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio004/hlspbaudio004_Auto.m3u8",
    "isFeatured": false
  },
  {
    "id": "air-live-news-24x7-15",
    "name": "AIR Live News 24x7",
    "type": "radio",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Radio",
    "quality": "32 kbps",
    "description": "National Hindi & English Radio News 24 Hours",
    "url": "https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio002/hlspbaudio002_Auto.m3u8",
    "isFeatured": false
  },
  {
    "id": "air-raagam-classical-16",
    "name": "AIR Raagam (Classical)",
    "type": "radio",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Radio",
    "quality": "32 kbps",
    "description": "Pure Hindustani & Carnatic Classical Sangeet",
    "url": "https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudioragam/hlspbaudioragam_Auto.m3u8",
    "isFeatured": false
  },
  {
    "id": "akashvani-aaradhana-17",
    "name": "Akashvani Aaradhana",
    "type": "radio",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Radio",
    "quality": "32 kbps",
    "description": "Devotional Bhajans, Mantras & Spiritual Chants",
    "url": "https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio003/hlspbaudio003_Auto.m3u8",
    "isFeatured": false
  },
  {
    "id": "air-indraprastha-18",
    "name": "AIR Indraprastha",
    "type": "radio",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Radio",
    "quality": "32 kbps",
    "description": "Delhi Capital Cultural Service & Talk Shows",
    "url": "https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio006/hlspbaudio006_Auto.m3u8",
    "isFeatured": false
  },
  {
    "id": "air-fm-rainbow-mumbai",
    "name": "AIR FM Rainbow Mumbai",
    "type": "radio",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Radio",
    "quality": "32 kbps (FM 107.1)",
    "description": "Aamchi Mumbai Music, Hindi-Marathi Hits & RJs",
    "url": "https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio010/hlspbaudio010_Auto.m3u8",
    "isFeatured": false
  },
  {
    "id": "air-fm-gold-mumbai",
    "name": "AIR FM Gold Mumbai",
    "type": "radio",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Radio",
    "quality": "32 kbps (FM 100.1)",
    "description": "Vintage Mumbai Radio Studio Melodies & News",
    "url": "https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio011/hlspbaudio011_Auto.m3u8",
    "isFeatured": false
  },
  {
    "id": "air-urdu-service",
    "name": "AIR Urdu Service",
    "type": "radio",
    "country": "IN",
    "countryName": "India",
    "flag": "\ud83c\uddee\ud83c\uddf3",
    "category": "Radio",
    "quality": "32 kbps",
    "description": "Urdu Ghazals, Nazm, Drama & Literary Discussions",
    "url": "https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio008/hlspbaudio008_Auto.m3u8",
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
    "description": "Punjabi Lok Geet, Gurbani & Regional Broadcasts",
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
    "description": "Marathi Bhavgeet, Natyasangeet & Sahitya",
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
    "description": "Gujarati Sugam Sangeet, Garba & Prantiya Seva",
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
    "description": "Rabindrasangeet, Nazrul Geeti & Bangla News",
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
    "description": "Chennai FM Rainbow & Tamil Cultural Programs",
    "url": "https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio028/hlspbaudio028_Auto.m3u8",
    "isFeatured": false
  },
  {
    "id": "bbc-news",
    "name": "BBC News HD",
    "type": "tv",
    "country": "UK",
    "countryName": "United Kingdom",
    "flag": "\ud83c\uddec\ud83c\udde7",
    "category": "News",
    "quality": "1080p FHD",
    "description": "24-Hour Global News & Current Affairs from London",
    "url": "https://vs-hls-push-ww-live.akamaized.net/x=4/i=urn:bbc:pips:service:bbc_news_channel_hd/t=3840/v=pv14/b=5070016/main.m3u8",
    "isFeatured": false
  },
  {
    "id": "sky-news",
    "name": "Sky News UK",
    "type": "tv",
    "country": "UK",
    "countryName": "United Kingdom",
    "flag": "\ud83c\uddec\ud83c\udde7",
    "category": "News",
    "quality": "1080p FHD",
    "description": "First for Breaking News, Business & World Politics",
    "url": "https://skynews.akamaized.net/hls/live/2034050/skynews/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "abc-news-us",
    "name": "ABC News Live",
    "type": "tv",
    "country": "US",
    "countryName": "United States",
    "flag": "\ud83c\uddfa\ud83c\uddf8",
    "category": "News",
    "quality": "1080p FHD",
    "description": "American 24/7 Live Breaking News & Context",
    "url": "https://content.uplynk.com/channel/3324f2467c414329b3b0cc5cd987b6be.m3u8",
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
    "description": "CBS Evening News, 60 Minutes & Special Reports",
    "url": "https://cbsn-us.cbsnstream.cbsnews.com/out/v1/55a8648e8f134e82a470f83d562de701/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "dw-news",
    "name": "DW News (English)",
    "type": "tv",
    "country": "DE",
    "countryName": "Germany",
    "flag": "\ud83c\udde9\ud83c\uddea",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Made for Minds \u2022 International Broadcast from Berlin",
    "url": "https://dwamdstream102.akamaized.net/hls/live/2015525/dl_live_102/master.m3u8",
    "isFeatured": false
  },
  {
    "id": "france24-en",
    "name": "France 24 (English)",
    "type": "tv",
    "country": "FR",
    "countryName": "France",
    "flag": "\ud83c\uddeb\ud83c\uddf7",
    "category": "News",
    "quality": "1080p FHD",
    "description": "Libert\u00e9, \u00c9galit\u00e9 \u2022 European & World News",
    "url": "https://static.france24.com/live/F24_EN_LO_HLS/live_tv.m3u8",
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
    const liveStreams = channelsData.filter(c => c.type === 'tv').slice(0, 8);
    liveStreams.forEach((ch, idx) => {
      const viewers = ['18.4K', '14.2K', '12.8K', '9.5K', '8.1K', '6.4K', '5.2K', '4.7K'][idx % 8];
      const card = document.createElement('div');
      card.className = 'live-now-card';
      
      const thumbUrl = ch.id === 'aajtak' 
        ? 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&auto=format&fit=crop&q=80'
        : (ch.id === 'abp-news' 
          ? 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=600&auto=format&fit=crop&q=80');

      card.innerHTML = `
        <div class="live-now-thumb">
          <img src="${thumbUrl}" alt="${ch.name}">
          <div class="live-viewer-chip">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="#ffb4ab"><path d="M12 4C7.58 4 4 7.58 4 12c0 2.21.89 4.21 2.34 5.66l1.41-1.41C6.62 15.12 6 13.62 6 12c0-3.31 2.69-6 6-6s6 2.69 6 6c0 1.62-.62 3.12-1.76 4.24l1.41 1.41C19.11 16.21 20 14.21 20 12c0-4.42-3.58-8-8-8zm0 4c-2.21 0-4 1.79-4 4 0 1.1.45 2.1 1.17 2.83l1.41-1.41C10.22 13.06 10 12.56 10 12c0-1.1.9-2 2-2s2 .9 2 2c0 .56-.22 1.06-.59 1.41l1.41 1.41C15.55 14.1 16 13.1 16 12c0-2.21-1.79-4-4-4zm0 3c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/></svg>
            <span>${viewers}</span>
          </div>
        </div>
        <h4 class="card-title-text">${ch.name}</h4>
        <p class="card-subtitle-text">${ch.category} • ${ch.quality}</p>
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
    const sampleFeatured = [
      {
        id: 'feat_doc_1',
        name: 'ISRO Chandrayaan & Space Odyssey HD',
        type: 'tv',
        countryName: 'India Special',
        flag: '🎬',
        category: 'Documentary',
        quality: '1080p FHD • 24:18',
        url: 'https://feeds.intoday.in/aajtak/api/aajtakhd/master.m3u8'
      },
      {
        id: 'feat_music_2',
        name: 'Bollywood Evergreen 90s Golden Hits',
        type: 'radio',
        countryName: 'Hindi Classics',
        flag: '🎵',
        category: 'Audio Album',
        quality: '320 kbps MP3 • 45:10',
        url: 'https://air.pc.cdn.bitgravity.com/air/live/pbaudio034/playlist.m3u8'
      },
      {
        id: 'feat_culture_3',
        name: 'Vedic Heritage: Ancient Temples of India',
        type: 'tv',
        countryName: 'Sanatan Culture',
        flag: '🎬',
        category: 'Special Feature',
        quality: '1080p FHD • 18:40',
        url: 'https://aasthatv.akamaized.net/hls/live/2034040/aastha/master.m3u8'
      },
      {
        id: 'feat_raga_4',
        name: 'Morning Sangeet Sarita Ragas Collection',
        type: 'radio',
        countryName: 'Classical India',
        flag: '🎵',
        category: 'Classical Sangeet',
        quality: 'AIR Radio • 32:15',
        url: 'https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudioragam/hlspbaudioragam_Auto.m3u8'
      }
    ];

    sampleFeatured.forEach(item => {
      featMediaList.appendChild(createChannelListItem(item));
    });
  }
}

// ==========================================================
// 2. LIVE TV PAGE RENDER
// ==========================================================
let currentLiveCategory = 'ALL';
let currentLiveSearch = '';

function renderLiveTVPage() {
  filterLiveChannels();
}

window.handleLiveSearch = function(val) {
  currentLiveSearch = val;
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

  if (currentLiveCategory === 'INDIA') list = list.filter(c => c.country === 'IN');
  if (currentLiveCategory === 'NEWS') list = list.filter(c => c.category.toLowerCase().includes('news') || c.category.toLowerCase().includes('business'));
  if (currentLiveCategory === 'DEVOTIONAL') list = list.filter(c => c.category.toLowerCase().includes('devotional') || c.category.toLowerCase().includes('spiritual'));
  if (currentLiveCategory === 'ENTERTAINMENT') list = list.filter(c => c.category.toLowerCase().includes('entertainment') || c.category.toLowerCase().includes('sports'));
  if (currentLiveCategory === 'MUSIC') list = list.filter(c => c.category.toLowerCase().includes('music'));
  if (currentLiveCategory === 'US') list = list.filter(c => c.country === 'US');
  if (currentLiveCategory === 'UK') list = list.filter(c => c.country === 'UK');
  if (currentLiveCategory === 'DE') list = list.filter(c => c.country === 'DE');
  if (currentLiveCategory === 'FR') list = list.filter(c => c.country === 'FR');

  if (currentLiveSearch.trim() !== '') {
    const q = currentLiveSearch.toLowerCase();
    list = list.filter(c => c.name.toLowerCase().includes(q) || c.category.toLowerCase().includes(q) || (c.description && c.description.toLowerCase().includes(q)));
  }

  const countTitle = document.getElementById('liveChannelsCountTitle');
  if (countTitle) countTitle.textContent = 'All Live Channels (' + list.length + ')';

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
